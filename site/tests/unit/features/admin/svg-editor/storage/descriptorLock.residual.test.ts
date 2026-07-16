/**
 * Residual descriptorLock coverage beyond phase08 contention cases.
 * Injectable temp dir only.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdtempSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import os from "node:os";

import {
  acquireDescriptorLock,
  sweepStaleDescriptorLocks,
} from "@/features/admin/svg-editor/storage/descriptorLock";

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(path.join(os.tmpdir(), "lock-residual-"));
});

afterEach(() => {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
});

describe("descriptorLock residual", () => {
  it("acquires and releases a free lock", () => {
    const result = acquireDescriptorLock("chaise", workDir, {
      timeoutMs: 100,
      pollMs: 1,
      sleep: () => undefined,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    expect(existsSync(path.join(workDir, "chaise.lock"))).toBe(true);
    result.handle.release();
    expect(existsSync(path.join(workDir, "chaise.lock"))).toBe(false);
  });

  it("removes a stale lock during acquire and succeeds", () => {
    const lockPath = path.join(workDir, "chaise.lock");
    writeFileSync(lockPath, "old\n", "utf8");
    const old = new Date(Date.now() - 120_000);
    utimesSync(lockPath, old, old);

    let clock = Date.now();
    const result = acquireDescriptorLock("chaise", workDir, {
      timeoutMs: 50,
      pollMs: 1,
      staleLockMs: 60_000,
      now: () => clock,
      sleep: (ms) => {
        clock += ms;
      },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    result.handle.release();
  });

  it("sweepStaleDescriptorLocks returns 0 for missing dir", () => {
    const missing = path.join(workDir, "nope");
    expect(sweepStaleDescriptorLocks(missing)).toBe(0);
  });

  it("sweep leaves fresh locks in place", () => {
    writeFileSync(path.join(workDir, "chaise.lock"), "fresh\n", "utf8");
    const removed = sweepStaleDescriptorLocks(workDir, 60_000, () => Date.now());
    expect(removed).toBe(0);
    expect(existsSync(path.join(workDir, "chaise.lock"))).toBe(true);
  });

  it("returns 409.lock_busy when the lock is held through the timeout", () => {
    const held = acquireDescriptorLock("busy", workDir, {
      timeoutMs: 50,
      pollMs: 1,
      sleep: () => undefined,
    });
    expect(held.ok).toBe(true);

    let clock = 1_000;
    const result = acquireDescriptorLock("busy", workDir, {
      timeoutMs: 20,
      pollMs: 5,
      staleLockMs: 60_000,
      now: () => clock,
      sleep: (ms) => {
        clock += ms;
      },
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected lock busy");
    expect(result.error.code).toBe("409.lock_busy");
    expect(result.error.reason).toBe("lockBusy");
    expect(result.error.message).toMatch(/timed out/);

    if (held.ok) held.handle.release();
  });

  it("sweepStaleDescriptorLocks removes only aged .lock files", () => {
    writeFileSync(path.join(workDir, "old.lock"), "pid\n", "utf8");
    writeFileSync(path.join(workDir, "keep.lock"), "pid\n", "utf8");
    writeFileSync(path.join(workDir, "not-a-lock.txt"), "x\n", "utf8");
    const old = new Date(Date.now() - 120_000);
    utimesSync(path.join(workDir, "old.lock"), old, old);

    const removed = sweepStaleDescriptorLocks(workDir, 60_000, () => Date.now());
    expect(removed).toBe(1);
    expect(existsSync(path.join(workDir, "old.lock"))).toBe(false);
    expect(existsSync(path.join(workDir, "keep.lock"))).toBe(true);
    expect(existsSync(path.join(workDir, "not-a-lock.txt"))).toBe(true);
  });

  it("release is best-effort when the lock file is already gone", () => {
    const result = acquireDescriptorLock("gone", workDir, {
      timeoutMs: 50,
      pollMs: 1,
      sleep: () => undefined,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    rmSync(path.join(workDir, "gone.lock"), { force: true });
    expect(() => result.handle.release()).not.toThrow();
  });
});
