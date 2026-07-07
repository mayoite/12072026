/**
 * Phase 08 — advisory descriptor lock (`O_EXCL` on `{slug}.lock`).
 *
 * §08-PERS-04: 30 s timeout → `409.lock_busy`.
 */

import {
  closeSync,
  existsSync,
  openSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeSync,
} from "node:fs";
import path from "node:path";

export const DESCRIPTOR_LOCK_TIMEOUT_MS = 30_000;
export const DESCRIPTOR_STALE_LOCK_MS = 60_000;
export const DESCRIPTOR_LOCK_POLL_MS = 10;

export interface DescriptorLockHandle {
  readonly release: () => void;
}

export interface DescriptorLockBusyError {
  readonly reason: "lockBusy";
  readonly code: "409.lock_busy";
  readonly fieldPath: string;
  readonly message: string;
}

export type DescriptorLockResult =
  | { ok: true; handle: DescriptorLockHandle }
  | { ok: false; error: DescriptorLockBusyError };

export interface AcquireDescriptorLockOptions {
  timeoutMs?: number;
  pollMs?: number;
  staleLockMs?: number;
  /** Test hook: delay before releasing the lock after the write completes. */
  holdForMs?: number;
  now?: () => number;
  sleep?: (ms: number) => void;
}

function defaultSleep(ms: number): void {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    // Busy-wait keeps the lock path synchronous for persistBlockDescriptor.
  }
}

function lockPathFor(slug: string, dir: string): string {
  return path.resolve(dir, `${slug}.lock`);
}

function removeStaleLockIfNeeded(
  lockPath: string,
  staleLockMs: number,
  now: () => number,
): void {
  if (!existsSync(lockPath)) return;
  try {
    const stats = statSync(lockPath);
    if (now() - stats.mtimeMs >= staleLockMs) {
      unlinkSync(lockPath);
    }
  } catch {
    // Best-effort stale cleanup.
  }
}

function tryAcquireExclusive(lockPath: string): boolean {
  try {
    const fd = openSync(lockPath, "wx");
    try {
      writeSync(fd, `${process.pid}\n`);
    } finally {
      closeSync(fd);
    }
    return true;
  } catch (cause) {
    const code =
      cause && typeof cause === "object" && "code" in cause
        ? String((cause as { code: unknown }).code)
        : "";
    if (code === "EEXIST") return false;
    throw cause;
  }
}

export function acquireDescriptorLock(
  slug: string,
  dir: string,
  options: AcquireDescriptorLockOptions = {},
): DescriptorLockResult {
  const timeoutMs = options.timeoutMs ?? DESCRIPTOR_LOCK_TIMEOUT_MS;
  const pollMs = options.pollMs ?? DESCRIPTOR_LOCK_POLL_MS;
  const staleLockMs = options.staleLockMs ?? DESCRIPTOR_STALE_LOCK_MS;
  const now = options.now ?? (() => Date.now());
  const sleep = options.sleep ?? defaultSleep;
  const lockPath = lockPathFor(slug, dir);
  const started = now();

  while (now() - started < timeoutMs) {
    removeStaleLockIfNeeded(lockPath, staleLockMs, now);
    if (tryAcquireExclusive(lockPath)) {
      const holdForMs = options.holdForMs ?? 0;
      return {
        ok: true,
        handle: {
          release: () => {
            if (holdForMs > 0) sleep(holdForMs);
            try {
              if (existsSync(lockPath)) unlinkSync(lockPath);
            } catch {
              // Best-effort release.
            }
          },
        },
      };
    }
    sleep(pollMs);
  }

  return {
    ok: false,
    error: {
      reason: "lockBusy",
      code: "409.lock_busy",
      fieldPath: `slug:${slug}`,
      message: `Descriptor lock for "${slug}" timed out after ${timeoutMs}ms`,
    },
  };
}

export function sweepStaleDescriptorLocks(
  dir: string,
  staleLockMs: number = DESCRIPTOR_STALE_LOCK_MS,
  now: () => number = () => Date.now(),
): number {
  // Boot-time sweep for orphan locks (spec rollback criteria).
  let removed = 0;
  if (!existsSync(dir)) return removed;
  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith(".lock")) continue;
    const full = path.resolve(dir, entry);
    try {
      const stats = statSync(full);
      if (now() - stats.mtimeMs >= staleLockMs) {
        unlinkSync(full);
        removed += 1;
      }
    } catch {
      // ignore
    }
  }
  return removed;
}
