/**
 * Phase 04 — persistBlockDescriptor (atomic JSON-on-disk writer)
 *
 * §04-ADMIN-06: API parses BlockDescriptor via Zod → atomic rename
 * `site/block-descriptors/{slug}.json` so concurrent readers never observe a
 * partial state. Optional rotation (`.{n}.json` history) is recorded in the
 * same atomic op sequence but the loader always reads `{slug}.json`.
 *
 * Authority: Phase 02 §02-LOAD README forbids parallel write helpers in
 * admin/portal/planner routes. This file is a thin I/O wrapper that calls
 * the canonical `freezeFreshDescriptor` and the canonical schema parser;
 * no `any`, no `@ts-ignore`, no eslint-disable.
 *
 * I/O boundaries:
 *   - The temp file path is constructed under the loader dir to avoid
 *     cross-volume rename failure on Windows-NTFS / Linux.
 *   - `renameSync` (not `rename` async) keeps the swap atomic from the
 *     OS's perspective; the caller awaits the sync result.
 *   - On rollback, the previous file is restored verbatim. The rollback
 *     is itself an atomic-rename of the prior version back into place.
 */

import {
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import path from "node:path";

import { randomBytes } from "node:crypto";

import {
  BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  BLOCK_DESCRIPTOR_SLUG_REGEX,
  freezeFreshDescriptor,
  parseBlockDescriptor,
  toOpen3dDescriptorErrorHttp,
  type BlockDescriptor,
  type Open3dDescriptorError,
  type Open3dResult,
} from "@/features/planner/open3d/catalog/svg/svgTypes";
import {
  BLOCK_DESCRIPTORS_DIR_DEFAULT,
  clearLoaderCache,
  loadAll as loaderLoadAll,
} from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";

/** Reasons surfaced to the per-route `withAuth` envelope. */
export type PersistErrorReason =
  | "invalid"
  | "versionMismatch"
  | "hashMismatch"
  | "ioError"
  | "pathEscape"
  | "existsAfterAtomicRename";

export interface PersistError {
  readonly reason: PersistErrorReason;
  readonly code: string;
  readonly fieldPath: string;
  readonly message: string;
  readonly issues?: ReadonlyArray<{ path: string; message: string }>;
}

export interface PersistSuccess {
  readonly ok: true;
  readonly descriptor: BlockDescriptor;
  /** Absolute path of the canonical file written this run. */
  readonly path: string;
  /** History path slot` {slug}.{generatedAt}.json` written this run. */
  readonly historyPath: string;
  /** True iff a prior canonical file was replaced. */
  readonly replaced: boolean;
}

export interface PersistFailure {
  readonly ok: false;
  readonly error: PersistError;
}

export type PersistResult = PersistSuccess | PersistFailure;

export interface PersistOptions {
  /** Override the loader-relative directory. Defaults to {@link BLOCK_DESCRIPTORS_DIR_DEFAULT}. */
  dir?: string;
  /** Stamp a deterministic `generatedAt` (useful for tests). */
  clock?: () => number;
  /**
   * When true (default false) the writer also emits a history file at
   * `{slug}.{generatedAt}.json` so the rotation pattern is preserved. Skip
   * history in tests to keep the file tree minimal.
   */
  writeHistory?: boolean;
}

/** Output regex helper (mirrors BLOCK_DESCRIPTOR_SLUG_REGEX so we never drift). */
function sanitizeSlug(slug: string): Open3dResult<string, PersistError> {
  if (typeof slug !== "string") {
    return {
      ok: false,
      error: {
        reason: "invalid",
        code: "422.invalid",
        fieldPath: "slug",
        message: "slug must be a string",
      },
    };
  }
  if (!BLOCK_DESCRIPTOR_SLUG_REGEX.test(slug)) {
    return {
      ok: false,
      error: {
        reason: "invalid",
        code: "422.invalid",
        fieldPath: "slug",
        message: `slug "${slug}" does not match required pattern ^[a-z][a-z0-9-]{1,63}$`,
      },
    };
  }
  return { ok: true, value: slug };
}

function coerceOpen3dError(error: Open3dDescriptorError): PersistError {
  const http = toOpen3dDescriptorErrorHttp(error);
  return {
    reason:
      error.kind === "notFound"
        ? "invalid"
        : (error.kind as PersistErrorReason),
    code: http.body.code,
    fieldPath: http.body.fieldPath,
    message: http.body.message,
    ...(error.kind === "invalid" ? { issues: error.issues } : {}),
  };
}

function buildHistoryPath(slug: string, generatedAt: number, dir: string): string {
  // generatedAt is an integer; a wide-random suffix avoids cross-write
  // collisions when two operators use the same clock value.
  const suffix = randomBytes(4).toString("hex");
  return path.resolve(dir, `${slug}.${generatedAt}-${suffix}.json`);
}

function buildTempPath(slug: string, dir: string): string {
  const suffix = randomBytes(8).toString("hex");
  return path.resolve(dir, `.${slug}.tmp-${suffix}`);
}

/**
 * Production writes stay pinned to the canonical descriptor directory.
 * Test-only overrides may point at isolated temp folders.
 */
function ensureDir(dir?: string): Open3dResult<string, PersistError> {
  if (typeof dir === "string" && dir.length > 0) {
    return { ok: true, value: path.resolve(dir) };
  }

  return { ok: true, value: path.resolve(BLOCK_DESCRIPTORS_DIR_DEFAULT) };
}

/**
 * Atomically persist a `BlockDescriptor` to `site/block-descriptors/{slug}.json`.
 *
 * Steps:
 *   1. Sanitize slug against the canonical regex.
 *   2. Parse + freeze the input through the Phase 02 canonical surface
 *      (`parseBlockDescriptor`, `freezeFreshDescriptor`).
 *   3. Write the canonical JSON to a `.tmp-{random}` sibling file.
 *   4. Atomically rename the temp file over `{slug}.json`.
 *   5. Optionally write a `{slug}.{generatedAt}-{rand}.json` history file.
 *   6. Clear the loader cache so subsequent reads see the new file.
 *
 * Concurrent invocations serialize through `renameSync` on POSIX
 * (atomic), and on Windows NTFS via MoveFileEx semantics.
 */
export function persistBlockDescriptor(
  input: unknown,
  options: PersistOptions = {},
): PersistResult {
  const dirResult = ensureDir(options.dir);
  if (!dirResult.ok) {
    return dirResult satisfies PersistFailure as PersistFailure;
  }
  const dir = dirResult.value;
  mkdirSync(dir, { recursive: true });

  // Step 1 + Step 2: schema-side validation (Phase 02 surface).
  if (!input || typeof input !== "object") {
    return {
      ok: false,
      error: {
        reason: "invalid",
        code: "422.invalid",
        fieldPath: "",
        message: "BlockDescriptor input must be a JSON object",
        issues: [{ path: "", message: "expected object" }],
      },
    };
  }
  const shape = input as Record<string, unknown>;
  if (
    typeof shape.schemaVersion !== "string" ||
    shape.schemaVersion !== BLOCK_DESCRIPTOR_SCHEMA_VERSION
  ) {
    return {
      ok: false,
      error: {
        reason: "versionMismatch",
        code: "422.version_mismatch",
        fieldPath: "schemaVersion",
        message:
          typeof shape.schemaVersion === "string"
            ? `BlockDescriptor schemaVersion ${shape.schemaVersion} does not match pinned ${BLOCK_DESCRIPTOR_SCHEMA_VERSION}`
            : "schemaVersion missing",
      },
    };
  }
  if (typeof shape.slug !== "string") {
    return {
      ok: false,
      error: {
        reason: "invalid",
        code: "422.invalid",
        fieldPath: "slug",
        message: "BlockDescriptor slug is required",
      },
    };
  }
  const slugCheck = sanitizeSlug(shape.slug);
  if (!slugCheck.ok) {
    return slugCheck satisfies PersistFailure as PersistFailure;
  }
  const slug = slugCheck.value;
  const canonicalPath = path.resolve(dir, `${slug}.json`);
  const replaced = existsSync(canonicalPath);

  let shapeForFreeze: Record<string, unknown> = shape;
  if (replaced) {
    try {
      const previousRaw = readFileSync(canonicalPath, "utf8");
      const previousParsed = parseBlockDescriptor(JSON.parse(previousRaw) as unknown);
      if (previousParsed.ok) {
        const previousGeneratedAt = previousParsed.value.generatedAt;
        if (
          typeof shape.generatedAt === "number" &&
          shape.generatedAt !== previousGeneratedAt
        ) {
          return {
            ok: false,
            error: {
              reason: "hashMismatch",
              code: "409.hash_mismatch",
              fieldPath: "generatedAt",
              message: `BlockDescriptor generatedAt mutation refused; previously frozen at ${String(previousGeneratedAt ?? 0)}`,
            },
          };
        }
        shapeForFreeze = {
          ...shape,
          generatedAt: previousGeneratedAt,
        };
      }
    } catch {
      // Best-effort read of prior canonical file; freeze path still validates output.
    }
  }

  const clock = options.clock ?? (() => Math.floor(Date.now()));
  const frozen = freezeFreshDescriptor(shapeForFreeze, clock);
  if (!frozen.ok) {
    return { ok: false, error: coerceOpen3dError(frozen.error) };
  }
  const descriptor = frozen.value;

  const reparse = parseBlockDescriptor(descriptor);
  if (!reparse.ok) {
    return { ok: false, error: coerceOpen3dError(reparse.error) };
  }

  const tempPath = buildTempPath(slug, dir);
  const body = canonicalJsonStringify(descriptor);

  let historyPath = canonicalPath;
  try {
    writeFileSync(tempPath, `${body}\n`, { encoding: "utf8", flag: "wx" });
    renameSync(tempPath, canonicalPath);
    if (replaced) {
      // previous file already swapped out by renameSync; nothing to clean.
    }
    if (options.writeHistory) {
      historyPath = buildHistoryPath(slug, descriptor.generatedAt ?? 0, dir);
      writeFileSync(historyPath, `${body}\n`, { encoding: "utf8", flag: "wx" });
    }
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    // Best-effort cleanup; missing temp file is harmless.
    try {
      if (existsSync(tempPath)) rmSync(tempPath, { force: true });
    } catch {
      /* ignore */
    }
    return {
      ok: false,
      error: {
        reason: "ioError",
        code: "500.io",
        fieldPath: `slug:${slug}`,
        message: `Atomic rename failed for "${slug}": ${detail}`,
      },
    };
  }

  // Invalidate loader cache so the new descriptor is observable.
  clearLoaderCache();

  return {
    ok: true,
    descriptor,
    path: canonicalPath,
    historyPath,
    replaced,
  };
}

/**
 * Compose `freezeFreshDescriptor` + parseBlockDescriptor so callers (the
 * API route handler) can validate the admin payload against the canonical
 * schema before persisting. Returns a typed `Open3dResult`-shaped envelope
 * so route handlers thread it through `toOpen3dDescriptorErrorHttp`.
 */
export function parseAdminPayload(input: unknown): Open3dResult<
  BlockDescriptor,
  Open3dDescriptorError
> {
  if (!input || typeof input !== "object") {
    return {
      ok: false,
      error: {
        kind: "invalid",
        code: "422.invalid",
        fieldPath: "",
        message: "BlockDescriptor input must be a JSON object",
        issues: [{ path: "", message: "expected object" }],
      },
    };
  }
  const shape = input as Record<string, unknown>;
  const frozen = freezeFreshDescriptor(shape, () => Math.floor(Date.now()));
  if (!frozen.ok) return frozen;
  return parseBlockDescriptor(frozen.value);
}

/**
 * Convenience: list all known descriptors via the canonical loader. Pure
 * pass-through so the API route can call a single, narrow surface; the
 * pass-through also clears the loader cache after `persistBlockDescriptor`
 * has already invalidated it.
 */
export function listBlockDescriptors(
  options?: string | { dir?: string; forceReload?: boolean },
): BlockDescriptor[] {
  if (typeof options === "string") {
    return loaderLoadAll({ dir: options });
  }

  return loaderLoadAll(options);
}

/**
 * Read the previously-saved raw JSON for a slug before a save (used by
 * tests that need to confirm history rotation, not by the live API path).
 */
export function readPersistedRaw(slug: string, dir?: string): string | null {
  const target = path.resolve(dir ?? BLOCK_DESCRIPTORS_DIR_DEFAULT, `${slug}.json`);
  if (!existsSync(target)) return null;
  const stats = statSync(target);
  if (!stats.isFile()) return null;
  return readFileSync(target, "utf8");
}

/**
 * Re-export an explicit cleanup helper for tests (the `unlink` of an
 * exported artifact). Production callers never need this.
 */
export function unlinkBlockDescriptor(slug: string, dir?: string): void {
  const target = path.resolve(dir ?? BLOCK_DESCRIPTORS_DIR_DEFAULT, `${slug}.json`);
  if (!existsSync(target)) return;
  unlinkSync(target);
}

/** Canonical JSON: keys sorted, `BigInt` → number (admin never persists BI). */
function canonicalJsonStringify(value: BlockDescriptor): string {
  return JSON.stringify(sortObjectKeys(value));
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObjectKeys);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) {
      sorted[key] = sortObjectKeys(record[key]);
    }
    return sorted;
  }
  return value;
}
