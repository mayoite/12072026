/**
 * Admin P06 — rollbackDescriptorToVersion.
 * Temp descriptor dir + mocked publish pipeline (no public/ mutation).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const { publishDescriptorWithPipeline } = vi.hoisted(() => ({
  publishDescriptorWithPipeline: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/publish/publishDescriptorWithPipeline", () => ({
  publishDescriptorWithPipeline,
}));

import { rollbackDescriptorToVersion } from "@/features/admin/svg-editor/lifecycle/rollbackDescriptorVersion";
import { persistBlockDescriptor } from "@/features/admin/svg-editor/storage/persistBlockDescriptor";
import { listDescriptorRevisions } from "@/features/admin/svg-editor/lifecycle/descriptorRevisionIndex";
import { readDescriptorAuditForSlug } from "@/features/admin/svg-editor/storage/descriptorAuditLog";
import {
  BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  computeBlockDescriptorChecksum,
} from "@/features/planner/project/catalog/svg/svgTypes";

const VALID_UUID = "11111111-1114-4111-8111-111111111111";

function fixedDescriptorFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
    id: VALID_UUID,
    slug: "chaise",
    sku: "OFL-CHS-001",
    sourceProvenance: "native" as const,
    geometry: { widthMm: 1800, depthMm: 600, heightMm: 480 },
    viewBox: { x: 0, y: 0, width: 1800, height: 600 },
    mounting: ["floor"],
    themeTokens: {
      currentColor: "currentColor",
      "--color-fill": "var(--color-surface-raised)",
      "--color-stroke": "var(--color-text)",
    },
    rovingFocus: [{ key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" }],
    liveAnnouncementCategories: ["status"],
    generatedAt: 1700000000,
    idempotent: true,
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    checksum: "0".repeat(64),
    ...overrides,
  };
}

function stampChecksum(record: Record<string, unknown>): Record<string, unknown> {
  return {
    ...record,
    checksum: computeBlockDescriptorChecksum(record),
  };
}

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(path.join(os.tmpdir(), "rollback-"));
  publishDescriptorWithPipeline.mockReset();
  publishDescriptorWithPipeline.mockResolvedValue({
    success: true,
    descriptor: { slug: "chaise" },
  });
});

afterEach(() => {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
});

describe("rollbackDescriptorToVersion", () => {
  it("returns error when revision is missing", async () => {
    const result = await rollbackDescriptorToVersion("chaise", 3, "admin-1", workDir);
    expect(result).toEqual({
      ok: false,
      error: 'Revision 3 not found for "chaise"',
    });
    expect(publishDescriptorWithPipeline).not.toHaveBeenCalled();
  });

  it("persists a forward revision from the snapshot and audits rollback", async () => {
    const v1 = persistBlockDescriptor(stampChecksum(fixedDescriptorFixture()), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(v1.ok).toBe(true);
    const v2 = persistBlockDescriptor(
      stampChecksum({ ...fixedDescriptorFixture(), sku: "OFL-CHS-002" }),
      { dir: workDir, clock: () => 1700000001 },
    );
    expect(v2.ok).toBe(true);

    const result = await rollbackDescriptorToVersion("chaise", 1, "admin-1", workDir);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    expect(result.fromVersion).toBe(1);
    expect(result.newVersion).toBe(3);
    expect(result.slug).toBe("chaise");

    expect(publishDescriptorWithPipeline).toHaveBeenCalledTimes(1);
    const snapshot = publishDescriptorWithPipeline.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >;
    expect(snapshot.sku).toBe("OFL-CHS-001");

    const revisions = listDescriptorRevisions("chaise", workDir);
    expect(revisions[0]?.version).toBe(3);
    expect(revisions[0]?.isCurrent).toBe(true);

    const audit = readDescriptorAuditForSlug("chaise", workDir);
    expect(audit[0]?.action).toBe("rollback");
    expect(audit[0]?.detail).toMatchObject({ fromVersion: 1, newVersion: 3 });
    expect(audit[0]?.actorId).toBe("admin-1");
  });

  it("returns pipeline error without claiming success", async () => {
    const v1 = persistBlockDescriptor(stampChecksum(fixedDescriptorFixture()), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(v1.ok).toBe(true);

    publishDescriptorWithPipeline.mockResolvedValue({
      success: false,
      error: "compile failed",
    });

    const result = await rollbackDescriptorToVersion("chaise", 1, "admin-1", workDir);
    expect(result).toEqual({ ok: false, error: "compile failed" });

    // Persist still advanced (forward revision written before publish) —
    // document current behavior: pipeline failure does not undo persist.
    const revisions = listDescriptorRevisions("chaise", workDir);
    expect(revisions.some((r) => r.version === 2)).toBe(true);
  });

  it("returns persist error for an invalid snapshot payload", async () => {
    const { writeFileSync, mkdirSync } = await import("node:fs");
    mkdirSync(workDir, { recursive: true });
    writeFileSync(
      path.join(workDir, "chaise.1.json"),
      JSON.stringify({ slug: "chaise", schemaVersion: "not-a-real-version" }),
      "utf8",
    );

    const result = await rollbackDescriptorToVersion("chaise", 1, "admin-1", workDir);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.length).toBeGreaterThan(0);
    expect(publishDescriptorWithPipeline).not.toHaveBeenCalled();
  });
});
