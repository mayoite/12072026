/**
 * Phase 08 — persistence and migration gate tests
 *
 * Check IDs: 08-PERS-04, 08-PERS-10, 08-TEST-01..06
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import os from "node:os";

import {
  acquireDescriptorLock,
  DESCRIPTOR_LOCK_TIMEOUT_MS,
  sweepStaleDescriptorLocks,
} from "@/features/admin/svg-editor/storage/descriptorLock";
import {
  archiveDirFor,
  listArchiveVersions,
} from "@/features/admin/svg-editor/storage/descriptorArchive";
import {
  persistBlockDescriptor,
  readPersistedRaw,
} from "@/features/admin/svg-editor/storage/persistBlockDescriptor";
import { verifyDualRead } from "@/features/admin/svg-editor/storage/dualReadHarness";
import * as descriptorPointer from "@/features/planner/project/catalog/svg/descriptorPointer";
import {
  BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  computeBlockDescriptorChecksum,
} from "@/features/planner/project/catalog/svg/svgTypes";
import { clearLoaderCache, tryLoad } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";

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
    rovingFocus: [{ key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" }],
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

beforeEach(() => {
  workDir = mkdtempSync(path.join(os.tmpdir(), "phase08-persist-"));
  clearLoaderCache();
});

afterEach(() => {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
  clearLoaderCache();
});

describe("Phase 08 — 08-PERS-04 advisory lock", () => {
  it("returns 409.lock_busy when a second writer cannot acquire the lock in time", () => {
    const first = acquireDescriptorLock("chaise", workDir, { holdForMs: 50 });
    expect(first.ok).toBe(true);
    if (!first.ok) throw new Error("expected first.ok");

    const second = acquireDescriptorLock("chaise", workDir, {
      timeoutMs: 5,
      pollMs: 1,
      sleep: () => undefined,
    });
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.error.code).toBe("409.lock_busy");
    expect(second.error.reason).toBe("lockBusy");

    first.handle.release();
  });

  it("maps lock contention through persistBlockDescriptor", () => {
    const hold = acquireDescriptorLock("chaise", workDir, { holdForMs: 50 });
    expect(hold.ok).toBe(true);
    if (!hold.ok) throw new Error("expected hold.ok");

    const blocked = persistBlockDescriptor(stampChecksum(fixedDescriptorFixture()), {
      dir: workDir,
      clock: () => 1700000000,
      lock: { timeoutMs: 5, pollMs: 1, sleep: () => undefined },
    });
    expect(blocked.ok).toBe(false);
    if (blocked.ok) return;
    expect(blocked.error.code).toBe("409.lock_busy");

    hold.handle.release();
  });

  it("sweeps stale lock files older than 60 s", () => {
    writeFileSync(path.join(workDir, "chaise.lock"), "stale\n");
    const removed = sweepStaleDescriptorLocks(workDir, 60_000, () => Date.now() + 120_000);
    expect(removed).toBe(1);
    expect(existsSync(path.join(workDir, "chaise.lock"))).toBe(false);
  });
});

describe("Phase 08 — 08-PERS-10 version mismatch", () => {
  it("refuses unsupported schemaVersion with 422.version_mismatch", () => {
    const result = persistBlockDescriptor(
      { ...fixedDescriptorFixture(), schemaVersion: "2030-01-01.v99" },
      { dir: workDir, clock: () => 1700000000 },
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("422.version_mismatch");
    expect(result.error.reason).toBe("versionMismatch");
  });
});

describe("Phase 08 — versioned layout + dual-read", () => {
  it("writes versioned files, pointer, and legacy mirror on first save", () => {
    const result = persistBlockDescriptor(stampChecksum(fixedDescriptorFixture()), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");

    expect(result.version).toBe(1);
    expect(existsSync(path.join(workDir, "chaise.1.json"))).toBe(true);
    expect(existsSync(path.join(workDir, "chaise.latest.json"))).toBe(true);
    expect(existsSync(path.join(workDir, "chaise.json"))).toBe(true);

    const pointer = descriptorPointer.readLatestPointer("chaise", workDir);
    expect(pointer?.n).toBe(1);
    expect(pointer?.checksum).toBe(result.descriptor.checksum);
  });

  it("08-TEST-02: loader reads the committed snapshot via latest pointer", () => {
    const first = persistBlockDescriptor(stampChecksum(fixedDescriptorFixture()), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(first.ok).toBe(true);
    if (!first.ok) throw new Error("expected first.ok");

    const loaded = tryLoad("chaise", { dir: workDir });
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) throw new Error("expected loaded.ok");
    expect(loaded.value.checksum).toBe(first.descriptor.checksum);
    expect(readPersistedRaw("chaise", workDir)).toContain('"slug":"chaise"');
  });

  it("08-PERS-09 dual-read verifies disk reload checksum", () => {
    const saved = persistBlockDescriptor(stampChecksum(fixedDescriptorFixture()), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(saved.ok).toBe(true);
    if (!saved.ok) throw new Error("expected saved.ok");

    const evidence = verifyDualRead({
      slug: "chaise",
      dir: workDir,
      expected: saved.descriptor,
      mirror: null,
    });
    expect(evidence.pass).toBe(true);
    expect(evidence.mirror.enabled).toBe(false);
  });

  it("refuses generatedAt mutation with 409.hash_mismatch", () => {
    const first = persistBlockDescriptor(stampChecksum(fixedDescriptorFixture()), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(first.ok).toBe(true);

    const second = persistBlockDescriptor(
      stampChecksum({ ...fixedDescriptorFixture(), generatedAt: 1700000099 }),
      { dir: workDir, clock: () => 1700000001 },
    );
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.error.code).toBe("409.hash_mismatch");
  });
});

describe("Phase 08 — 08-TEST-06 archive retention", () => {
  it("keeps exactly five archive copies after seven saves", () => {
    for (let index = 0; index < 7; index += 1) {
      const result = persistBlockDescriptor(
        stampChecksum({ ...fixedDescriptorFixture(), sku: `OFL-CHS-00${index}` }),
        { dir: workDir, clock: () => 1700000000 + index },
      );
      expect(result.ok).toBe(true);
    }

    const archiveVersions = listArchiveVersions("chaise", workDir);
    expect(archiveVersions).toEqual([2, 3, 4, 5, 6]);
    expect(existsSync(path.join(archiveDirFor(workDir), "chaise.1.json"))).toBe(false);
    expect(existsSync(descriptorPointer.versionedDescriptorPath("chaise", 7, workDir))).toBe(true);
    expect(descriptorPointer.readLatestPointer("chaise", workDir)?.n).toBe(7);
  });
});

describe("Phase 08 — 08-TEST-05 recovery", () => {
  it("rolls back to the last good snapshot when pointer update fails", () => {
    const saved = persistBlockDescriptor(stampChecksum(fixedDescriptorFixture()), {
      dir: workDir,
      clock: () => 1700000000,
    });
    expect(saved.ok).toBe(true);
    if (!saved.ok) throw new Error("expected saved.ok");

    const pointerSpy = vi
      .spyOn(descriptorPointer, "writeLatestPointer")
      .mockImplementation(() => {
        throw new Error("simulated pointer failure");
      });

    const failed = persistBlockDescriptor(
      stampChecksum({ ...fixedDescriptorFixture(), sku: "OFL-CHS-002" }),
      { dir: workDir, clock: () => 1700000001 },
    );
    expect(failed.ok).toBe(false);

    const reloaded = tryLoad("chaise", { dir: workDir });
    expect(reloaded.ok).toBe(true);
    if (!reloaded.ok) throw new Error("expected reloaded.ok");
    expect(reloaded.value.sku).toBe("OFL-CHS-001");
    expect(readdirSync(workDir).some((entry) => entry.includes(".tmp-"))).toBe(false);

    pointerSpy.mockRestore();
  });
});

describe("Phase 08 — lock timeout default", () => {
  it("uses a 30 second default contention window", () => {
    expect(DESCRIPTOR_LOCK_TIMEOUT_MS).toBe(30_000);
  });
});
