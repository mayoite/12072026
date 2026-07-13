/**
 * Admin P06 — listDescriptorRevisions / readDescriptorAtVersion.
 * Uses injectable temp dir; never touches canonical block-descriptors.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  listDescriptorRevisions,
  readDescriptorAtVersion,
} from "@/features/planner/admin/svg-editor/descriptorRevisionIndex";
import { persistBlockDescriptor } from "@/features/planner/admin/svg-editor/persistBlockDescriptor";
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
  workDir = mkdtempSync(path.join(os.tmpdir(), "rev-index-"));
});

afterEach(() => {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
});

describe("listDescriptorRevisions", () => {
  it("returns empty list when dir has no versions", () => {
    expect(listDescriptorRevisions("chaise", workDir)).toEqual([]);
  });

  it("lists descending versions and marks current from pointer", () => {
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
    if (!v1.ok || !v2.ok) return;

    const entries = listDescriptorRevisions("chaise", workDir);
    expect(entries.map((e) => e.version)).toEqual([2, 1]);
    expect(entries[0]?.isCurrent).toBe(true);
    expect(entries[1]?.isCurrent).toBe(false);
    expect(entries[0]?.checksum).toBe(v2.descriptor.checksum);
    expect(entries[1]?.checksum).toBe(v1.descriptor.checksum);
    expect(entries[0]?.generatedAt).toBe(1700000000);
  });

  it("skips unreadable and schema-invalid revision files", () => {
    mkdirSync(workDir, { recursive: true });
    writeFileSync(path.join(workDir, "chaise.1.json"), "{not-json", "utf8");
    writeFileSync(
      path.join(workDir, "chaise.2.json"),
      JSON.stringify({ slug: "chaise", schemaVersion: "bad" }),
      "utf8",
    );
    writeFileSync(path.join(workDir, "chaise.latest.json"), '{"n":2}', "utf8");

    expect(listDescriptorRevisions("chaise", workDir)).toEqual([]);
  });

  it("ignores non-version files for other slugs", () => {
    const saved = persistBlockDescriptor(stampChecksum(fixedDescriptorFixture()), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(saved.ok).toBe(true);
    writeFileSync(path.join(workDir, "other.1.json"), "{}", "utf8");
    writeFileSync(path.join(workDir, "chaise.notanumber.json"), "{}", "utf8");

    const entries = listDescriptorRevisions("chaise", workDir);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.version).toBe(1);
  });
});

describe("readDescriptorAtVersion", () => {
  it("returns null for missing version", () => {
    expect(readDescriptorAtVersion("chaise", 9, workDir)).toBeNull();
  });

  it("returns parsed object for a valid version file", () => {
    const saved = persistBlockDescriptor(stampChecksum(fixedDescriptorFixture()), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(saved.ok).toBe(true);

    const raw = readDescriptorAtVersion("chaise", 1, workDir);
    expect(raw).not.toBeNull();
    expect(raw?.slug).toBe("chaise");
    expect(raw?.sku).toBe("OFL-CHS-001");
  });

  it("returns null for corrupt JSON or non-object", () => {
    mkdirSync(workDir, { recursive: true });
    writeFileSync(path.join(workDir, "chaise.1.json"), "not-json", "utf8");
    expect(readDescriptorAtVersion("chaise", 1, workDir)).toBeNull();

    writeFileSync(path.join(workDir, "chaise.2.json"), "null", "utf8");
    expect(readDescriptorAtVersion("chaise", 2, workDir)).toBeNull();

    writeFileSync(path.join(workDir, "chaise.3.json"), '"string"', "utf8");
    expect(readDescriptorAtVersion("chaise", 3, workDir)).toBeNull();
  });
});
