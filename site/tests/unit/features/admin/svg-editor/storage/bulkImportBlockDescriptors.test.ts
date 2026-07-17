/**
 * ADM-SVG-18 + catalog import rules — preview, atomic apply, row/field errors, provenance.
 * Isolated temp dirs only.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";

import {
  bulkImportBlockDescriptors,
  parseBulkImportCsv,
  previewBulkImport,
} from "@/features/admin/svg-editor/storage/bulkImportBlockDescriptors";
import { readLifecycleManifest } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { tryLoad } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(path.join(os.tmpdir(), "bulk-import-"));
});

afterEach(() => {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
});

describe("ADM-SVG-18 bulk import preview", () => {
  it("previews all additions without writing disk", () => {
    const csv = `slug,sku,variant,width_mm,depth_mm,height_mm,lifecycle
bulk-preview-a,OFL-A,fixed,600,600,750,draft
bulk-preview-b,OFL-B,fixed,800,600,750,live`;
    const preview = previewBulkImport(csv, () => false);
    expect(preview.canApply).toBe(true);
    expect(preview.additions.map((r) => r.slug)).toEqual([
      "bulk-preview-a",
      "bulk-preview-b",
    ]);
    expect(preview.rejects).toEqual([]);
    expect(preview.conflicts).toEqual([]);
    expect(preview.summary).toMatch(/will add 2/i);
    expect(readdirSync(workDir)).toEqual([]);
  });

  it("preview lists conflicts and blocks apply when slug exists", () => {
    const seed = bulkImportBlockDescriptors(
      `slug,sku,variant,width_mm,depth_mm,height_mm
bulk-exist-001,OFL-E,fixed,600,600,750`,
      workDir,
    );
    expect(seed.ok).toBe(true);

    const preview = bulkImportBlockDescriptors(
      `slug,sku,variant,width_mm,depth_mm,height_mm
bulk-exist-001,OFL-E2,fixed,600,600,750
bulk-new-001,OFL-N,fixed,600,600,750`,
      { dir: workDir, dryRun: true },
    );
    expect("dryRun" in preview && preview.dryRun).toBe(true);
    if (!("dryRun" in preview)) return;
    expect(preview.canApply).toBe(false);
    expect(preview.conflicts[0]?.field).toBe("slug");
    expect(preview.conflicts[0]?.message).toMatch(/already exists/);
    expect(preview.additions.map((r) => r.slug)).toEqual(["bulk-new-001"]);
  });
});

describe("ADM-SVG-18 exact row/field errors; invalid blocks full batch", () => {
  it("rejects a batch with exact row and field on invalid slug", () => {
    const csv = `slug,sku,variant,width_mm,depth_mm,height_mm
bad slug!,OFL-1,fixed,600,600,750`;
    const parsed = parseBulkImportCsv(csv);
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.errors[0]).toMatchObject({
      row: 2,
      field: "slug",
    });
    expect(parsed.errors[0]?.message).toContain("Invalid slug");
  });

  it("invalid geometry field blocks entire parse (no partial rows)", () => {
    const csv = `slug,sku,variant,width_mm,depth_mm,height_mm
ok-row-001,OFL-1,fixed,600,600,750
bad-row-002,OFL-2,fixed,0,600,750`;
    const parsed = parseBulkImportCsv(csv);
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.errors.some((e) => e.field === "width_mm" && e.row === 3)).toBe(
      true,
    );
  });
});

describe("ADM-SVG-18 atomic apply + provenance", () => {
  it("imports atomically, sets lifecycle, records provenance", () => {
    const fixed = new Date("2026-07-13T15:00:00.000Z");
    const csv = `slug,sku,variant,width_mm,depth_mm,height_mm,lifecycle
bulk-alpha-001,OFL-A-001,fixed,600,600,750,draft
bulk-beta-001,OFL-B-001,fixed,1200,600,750,live`;
    const result = bulkImportBlockDescriptors(csv, {
      dir: workDir,
      clock: () => fixed,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    expect(result.imported).toEqual(["bulk-alpha-001", "bulk-beta-001"]);
    expect(result.provenance.source).toBe("bulk-csv-import");
    expect(result.provenance.sourceProvenance).toBe("migrated");
    expect(result.provenance.importedAt).toBe("2026-07-13T15:00:00.000Z");
    expect(result.provenance.createdBy).toContain("bulk-csv-import@");

    const loaded = tryLoad("bulk-alpha-001", { dir: workDir });
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) throw new Error("expected loaded.ok");
    expect(loaded.value.sourceProvenance).toBe("migrated");
    expect(loaded.value.createdBy).toBe(
      "bulk-csv-import@2026-07-13T15:00:00.000Z",
    );

    const manifest = readLifecycleManifest(workDir);
    expect(manifest["bulk-alpha-001"]?.state).toBe("draft");
    expect(manifest["bulk-beta-001"]?.state).toBe("live");
  });

  it("rolls back partial writes when a later row fails (atomic)", () => {
    const first = bulkImportBlockDescriptors(
      `slug,sku,variant,width_mm,depth_mm,height_mm
bulk-gamma-001,OFL-G-001,fixed,600,600,750`,
      workDir,
    );
    expect(first.ok).toBe(true);

    const second = bulkImportBlockDescriptors(
      `slug,sku,variant,width_mm,depth_mm,height_mm
bulk-gamma-001,OFL-G-002,fixed,600,600,750
bulk-delta-001,OFL-D-001,fixed,600,600,750`,
      workDir,
    );
    expect(second.ok).toBe(false);
    expect(tryLoad("bulk-delta-001", { dir: workDir }).ok).toBe(false);
    expect(
      readdirSync(workDir).some((name) => name.startsWith("bulk-delta-001")),
    ).toBe(false);
  });
});
