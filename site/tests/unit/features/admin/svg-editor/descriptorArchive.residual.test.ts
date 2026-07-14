/**
 * Residual coverage for descriptorArchive helpers not exercised by phase08.
 * Injectable temp dir only.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  archiveDirFor,
  clearDescriptorArchive,
  clearDescriptorWorkspace,
  listArchiveVersions,
  retainDescriptorArchive,
} from "@/features/admin/svg-editor/descriptorArchive";
import { persistBlockDescriptor } from "@/features/admin/svg-editor/persistBlockDescriptor";
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
  workDir = mkdtempSync(path.join(os.tmpdir(), "archive-residual-"));
});

afterEach(() => {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
});

describe("descriptorArchive residual", () => {
  it("archiveDirFor resolves under the workspace dir", () => {
    expect(archiveDirFor(workDir)).toBe(path.resolve(workDir, "_archive"));
  });

  it("retainDescriptorArchive no-ops when liveN <= 1", () => {
    retainDescriptorArchive("chaise", workDir, 1);
    expect(existsSync(archiveDirFor(workDir))).toBe(false);
  });

  it("listArchiveVersions returns [] when archive is missing", () => {
    expect(listArchiveVersions("chaise", workDir)).toEqual([]);
  });

  it("clearDescriptorArchive removes only the slug prefix", () => {
    const archive = archiveDirFor(workDir);
    mkdirSync(archive, { recursive: true });
    writeFileSync(path.join(archive, "chaise.1.json"), "{}", "utf8");
    writeFileSync(path.join(archive, "other.1.json"), "{}", "utf8");

    clearDescriptorArchive("chaise", workDir);
    expect(existsSync(path.join(archive, "chaise.1.json"))).toBe(false);
    expect(existsSync(path.join(archive, "other.1.json"))).toBe(true);
  });

  it("clearDescriptorWorkspace removes versioned files, lock, pointer, and empty archive", () => {
    const first = persistBlockDescriptor(stampChecksum(fixedDescriptorFixture()), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(first.ok).toBe(true);
    const second = persistBlockDescriptor(
      stampChecksum({ ...fixedDescriptorFixture(), sku: "OFL-CHS-002" }),
      { dir: workDir, clock: () => 1700000001 },
    );
    expect(second.ok).toBe(true);
    writeFileSync(path.join(workDir, "chaise.lock"), "pid\n", "utf8");
    writeFileSync(path.join(workDir, "keep-other.1.json"), "{}", "utf8");

    clearDescriptorWorkspace("chaise", workDir);

    const remaining = readdirSync(workDir);
    expect(remaining).toContain("keep-other.1.json");
    expect(remaining.some((e) => e.startsWith("chaise"))).toBe(false);
    expect(existsSync(archiveDirFor(workDir))).toBe(false);
  });

  it("clearDescriptorArchive is a no-op when archive dir is absent", () => {
    expect(() => clearDescriptorArchive("chaise", workDir)).not.toThrow();
  });
});
