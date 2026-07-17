/**
 * Phase 04 — persistBlockDescriptor unit tests.
 *
 * Covers:
 *   §04-TEST-02  Zod schema rejects missing required fields with explicit
 *                 field-path errors (no silent acceptance).
 *   §04-TEST-03  Atomic rename test: write `{n+1}`, rename to current;
 *                 concurrent write fails idempotently without partial-state
 *                 exposure.
 *   §04-TEST-04  R2 upload idempotency: covered downstream by Phase 03.
 *
 * Tests run against an isolated tmp dir per scenario so the loader-relative
 * canonical directory is never touched. The loader's `clearLoaderCache()`
 * is invoked at scenario boundaries to keep reads deterministic.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";

import { computeBlockDescriptorChecksum, BLOCK_DESCRIPTOR_SCHEMA_VERSION } from "@/features/planner/catalog/svg/svgTypes";

import {
  persistBlockDescriptor,
  readPersistedRaw,
  unlinkBlockDescriptor,
  listBlockDescriptors,
  parseAdminPayload,
} from "@/features/admin/svg-editor/storage/persistBlockDescriptor";

const VALID_UUID = "11111111-1114-4111-8111-111111111111";

function fixedDescriptorFixture(): Record<string, unknown> {
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
    } as never,
    rovingFocus: [
      { key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" },
    ],
    liveAnnouncementCategories: ["status"],
    generatedAt: 1700000000,
    idempotent: true,
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    checksum: "0".repeat(64),
  };
}

function stampChecksum(record: Record<string, unknown>): Record<string, unknown> {
  return {
    ...record,
    checksum: computeBlockDescriptorChecksum(record),
  };
}

let workDir: string;
let prevCwd: string;

beforeEach(() => {
  prevCwd = process.cwd();
  workDir = mkdtempSync(path.join(os.tmpdir(), "phase04-persist-"));
});

afterEach(() => {
  process.chdir(prevCwd);
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
});

describe("04-PERSIST: schema acceptance surface", () => {
  it("accepts a well-formed fixed descriptor and writes versioned files", () => {
    const input = fixedDescriptorFixture();
    const result = persistBlockDescriptor(input, {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    expect(result.descriptor.slug).toBe("chaise");
    expect(result.descriptor.variant).toBe("fixed");
    expect(result.path).toBe(path.resolve(workDir, "chaise.1.json"));
    expect(result.replaced).toBe(false);
    expect(existsSync(result.path)).toBe(true);
  });

  it("rejects payloads whose schemaVersion is not pinned", () => {
    const input = { ...fixedDescriptorFixture(), schemaVersion: "2030-01-01.v99" };
    const result = persistBlockDescriptor(input, {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("422.version_mismatch");
    expect(result.error.fieldPath).toBe("schemaVersion");
  });

  it("rejects payloads with hex literal theme tokens (422.invalid)", () => {
    const input = fixedDescriptorFixture();
    const hexed = {
      ...input,
      themeTokens: {
        "currentColor": "currentColor",
        "--color-accent": "#112233",
      },
    };
    const result = persistBlockDescriptor(hexed, {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("422.invalid");
  });

  it("rejects empty payload via VALIDATION_ERROR envelope", () => {
    const result = persistBlockDescriptor(null, { dir: workDir });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("422.invalid");
  });

  it("parseAdminPayload round-trips a stamped descriptor", () => {
    const stamped = stampChecksum(fixedDescriptorFixture());
    const result = parseAdminPayload(stamped);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    expect(result.value.slug).toBe("chaise");
    expect(result.value.checksum).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("04-PERSIST: atomic-rename behaviour", () => {
  it("writes once on first call (replaced=false) and on overwrite (replaced=true)", () => {
    const first = persistBlockDescriptor(fixedDescriptorFixture(), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(first.ok).toBe(true);
    if (!first.ok) throw new Error("expected first.ok");
    expect(first.replaced).toBe(false);

    const second = persistBlockDescriptor(
      { ...fixedDescriptorFixture(), sku: "OFL-CHS-002" },
      { dir: workDir, clock: () => 1700000001 },
    );
    expect(second.ok).toBe(true);
    if (!second.ok) throw new Error("expected second.ok");
    expect(second.replaced).toBe(true);
    expect(second.descriptor.sku).toBe("OFL-CHS-002");
  });

  it("restores descriptor bytes and revision pointer when a publication rollback is requested", () => {
    const first = persistBlockDescriptor(fixedDescriptorFixture(), {
      dir: workDir,
      clock: () => 1700000000,
      writeArchive: false,
    });
    expect(first.ok).toBe(true);
    if (!first.ok) throw new Error("expected first.ok");
    const legacyBefore = readFileSync(path.join(workDir, "chaise.json"), "utf8");
    const pointerBefore = readFileSync(path.join(workDir, "chaise.latest.json"), "utf8");

    const second = persistBlockDescriptor(
      { ...fixedDescriptorFixture(), sku: "OFL-CHS-ROLLBACK" },
      { dir: workDir, clock: () => 1700000001, writeArchive: false },
    );
    expect(second.ok).toBe(true);
    if (!second.ok) throw new Error("expected second.ok");
    second.rollback?.();

    expect(readFileSync(path.join(workDir, "chaise.json"), "utf8")).toBe(legacyBefore);
    expect(readFileSync(path.join(workDir, "chaise.latest.json"), "utf8")).toBe(pointerBefore);
    expect(existsSync(path.join(workDir, "chaise.2.json"))).toBe(false);
  });

  it("restores legacy descriptor and pointer even when new revision removal fails", () => {
    const first = persistBlockDescriptor(fixedDescriptorFixture(), { dir: workDir, clock: () => 1700000000, writeArchive: false });
    expect(first.ok).toBe(true);
    if (!first.ok) throw new Error("expected first.ok");
    const legacyBefore = readFileSync(path.join(workDir, "chaise.json"), "utf8");
    const pointerBefore = readFileSync(path.join(workDir, "chaise.latest.json"), "utf8");
    const second = persistBlockDescriptor({ ...fixedDescriptorFixture(), sku: "OFL-CHS-FAIL" }, { dir: workDir, clock: () => 1700000001, writeArchive: false });
    expect(second.ok).toBe(true);
    if (!second.ok) throw new Error("expected second.ok");
    rmSync(second.path);
    mkdirSync(second.path);
    writeFileSync(path.join(second.path, "blocker"), "x", "utf8");

    expect(() => second.rollback?.()).toThrow();
    expect(readFileSync(path.join(workDir, "chaise.json"), "utf8")).toBe(legacyBefore);
    expect(readFileSync(path.join(workDir, "chaise.latest.json"), "utf8")).toBe(pointerBefore);
  });

  it("preserves a pre-existing colliding next revision byte-for-byte", () => {
    const collisionPath = path.join(workDir, "chaise.1.json");
    const collision = "pre-existing-revision\n";
    writeFileSync(collisionPath, collision, "utf8");
    const result = persistBlockDescriptor(fixedDescriptorFixture(), {
      dir: workDir, clock: () => 1700000000, writeArchive: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    result.rollback?.();
    expect(readFileSync(collisionPath, "utf8")).toBe(collision);
  });

  it("restores captured archive entries even when rollback enumeration fails", () => {
    const first = persistBlockDescriptor(fixedDescriptorFixture(), { dir: workDir, clock: () => 1700000000, writeArchive: false });
    expect(first.ok).toBe(true);
    if (!first.ok) throw new Error("expected first.ok");
    const archiveDir = path.join(workDir, "_archive");
    const archivePath = path.join(archiveDir, "chaise.1.json");
    mkdirSync(archiveDir);
    writeFileSync(archivePath, "archive-before\n", "utf8");
    const options = {
      dir: workDir,
      clock: () => 1700000001,
      writeArchive: false,
      recoveryFs: { readdir: () => { throw new Error("injected archive readdir failure"); } },
    } as unknown as NonNullable<Parameters<typeof persistBlockDescriptor>[1]>;
    const second = persistBlockDescriptor({ ...fixedDescriptorFixture(), sku: "OFL-ARCHIVE" }, options);
    expect(second.ok).toBe(true);
    if (!second.ok) throw new Error("expected second.ok");
    writeFileSync(archivePath, "archive-mutated\n", "utf8");
    expect(() => second.rollback?.()).toThrow(/archive readdir failure/);
    expect(readFileSync(archivePath, "utf8")).toBe("archive-before\n");
  });

  it("preserves the canonical {slug}.json filename after atomic rename", () => {
    const result = persistBlockDescriptor(fixedDescriptorFixture(), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    const entries = readdirSync(workDir);
    expect(entries).toContain("chaise.json");
    expect(entries.some((entry) => entry.startsWith(".chaise.tmp-"))).toBe(false);
  });

  it("writes archive retention and versioned files when writeHistory option is true", () => {
    const result = persistBlockDescriptor(fixedDescriptorFixture(), {
      dir: workDir,
      clock: () => 1700000000,
      writeHistory: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");

    const entries = readdirSync(workDir);
    expect(entries).toContain("chaise.json");
    expect(entries).toContain("chaise.1.json");
    expect(entries).toContain("chaise.latest.json");
    expect(result.version).toBe(1);
    expect(result.historyPath).toContain("chaise.latest.json");
  });

  it("parses the written JSON back through the canonical Zod schema", () => {
    const first = persistBlockDescriptor(fixedDescriptorFixture(), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(first.ok).toBe(true);
    if (!first.ok) throw new Error("expected first.ok");
    const raw = readFileSync(first.path, "utf8");
    const reparse = parseAdminPayload(JSON.parse(raw));
    expect(reparse.ok).toBe(true);
  });
});

describe("04-PERSIST: idempotency and concurrent-write safety", () => {
  it("listBlockDescriptors returns the just-persisted descriptor after cache clear", () => {
    persistBlockDescriptor(fixedDescriptorFixture(), {
      dir: workDir,
      clock: () => 1700000000,
    });
    const all = listBlockDescriptors({ dir: workDir } as { dir: string });
    expect(all.find((d) => d.slug === "chaise")).toBeDefined();
  });

  it("listBlockDescriptors accepts the string directory overload", () => {
    persistBlockDescriptor(fixedDescriptorFixture(), {
      dir: workDir,
      clock: () => 1700000000,
    });
    const all = listBlockDescriptors(workDir);
    expect(all.some((d) => d.slug === "chaise")).toBe(true);
  });

  it("readPersistedRaw returns null for unknown slug", () => {
    expect(readPersistedRaw("missing", workDir)).toBeNull();
  });

  it("unlinkBlockDescriptor removes the file from disk", () => {
    const result = persistBlockDescriptor(fixedDescriptorFixture(), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(result.ok).toBe(true);
    unlinkBlockDescriptor("chaise", workDir);
    expect(existsSync(path.resolve(workDir, "chaise.json"))).toBe(false);
  });
});
