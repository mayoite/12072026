import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";

import { bulkImportBlockDescriptors, parseBulkImportCsv } from "@/features/planner/admin/svg-editor/bulkImportBlockDescriptors";
import { readLifecycleManifest } from "@/features/planner/admin/svg-editor/catalogLifecycle";
import { tryLoad } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(path.join(os.tmpdir(), "bulk-import-"));
});

afterEach(() => {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
});

describe("bulkImportBlockDescriptors", () => {
  it("rejects a batch when any row is invalid", () => {
    const csv = `slug,sku,variant,width_mm,depth_mm,height_mm
bad slug!,OFL-1,fixed,600,600,750`;
    const parsed = parseBulkImportCsv(csv);
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.errors[0]?.message).toContain("Invalid slug");
  });

  it("imports atomically and sets lifecycle manifest entries", () => {
    const csv = `slug,sku,variant,width_mm,depth_mm,height_mm,lifecycle
bulk-alpha-001,OFL-A-001,fixed,600,600,750,draft
bulk-beta-001,OFL-B-001,fixed,1200,600,750,live`;
    const result = bulkImportBlockDescriptors(csv, workDir);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.imported).toEqual(["bulk-alpha-001", "bulk-beta-001"]);
    expect(tryLoad("bulk-alpha-001", { dir: workDir }).ok).toBe(true);
    expect(tryLoad("bulk-beta-001", { dir: workDir }).ok).toBe(true);
    const manifest = readLifecycleManifest(workDir);
    expect(manifest["bulk-alpha-001"]?.state).toBe("draft");
    expect(manifest["bulk-beta-001"]?.state).toBe("live");
  });

  it("rolls back partial writes when a later row fails", () => {
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
    expect(readdirSync(workDir).some((name) => name.startsWith("bulk-delta-001"))).toBe(false);
  });
});