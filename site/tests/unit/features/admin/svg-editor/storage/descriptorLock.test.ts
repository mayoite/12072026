import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  DESCRIPTOR_LOCK_TIMEOUT_MS,
  DESCRIPTOR_STALE_LOCK_MS,
  acquireDescriptorLock,
  sweepStaleDescriptorLocks,
} from "@/features/admin/svg-editor/storage/descriptorLock";

describe("descriptorLock", () => {
  let dir = "";
  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  it("acquires and releases a lock", () => {
    dir = mkdtempSync(path.join(os.tmpdir(), "desc-lock-"));
    expect(DESCRIPTOR_LOCK_TIMEOUT_MS).toBe(30_000);
    expect(DESCRIPTOR_STALE_LOCK_MS).toBe(60_000);
    const result = acquireDescriptorLock("desk", dir, {
      timeoutMs: 100,
      pollMs: 5,
      staleLockMs: 1000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      result.handle.release();
    }
    sweepStaleDescriptorLocks(dir, { staleLockMs: 0, now: () => Date.now() + 1 });
  });
});
