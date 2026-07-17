/**
 * Phase 04 + 08 — persistBlockDescriptor (versioned JSON-on-disk writer)
 *
 * §04-ADMIN-06 / §08-PERS-02..12:
 *   - `{slug}.{n}.json` rotation with `{slug}.latest.json` pointer
 *   - `O_EXCL` advisory lock (`409.lock_busy`)
 *   - Atomic rename + fsync; legacy `{slug}.json` mirror for transition
 *   - Rolling `_archive/` retention and post-write dual-read verification
 */

import {
  closeSync,
  copyFileSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeSync,
} from "node:fs";
import path from "node:path";

import { randomBytes } from "node:crypto";

import {
  BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  BLOCK_DESCRIPTOR_SLUG_REGEX,
  freezeFreshDescriptor,
  parseBlockDescriptor,
  toPlannerDescriptorErrorHttp,
  type BlockDescriptor,
  type PlannerDescriptorError,
  type PlannerResult,
} from "@/features/planner/catalog/svg/svgTypes";
import {
  BLOCK_DESCRIPTORS_DIR_DEFAULT,
  clearLoaderCache,
  loadAll as loaderLoadAll,
} from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";

import { retainDescriptorArchive } from "./descriptorArchive";
import {
  acquireDescriptorLock,
  type AcquireDescriptorLockOptions,
} from "./descriptorLock";
import {
  buildPointer,
  legacyDescriptorPath,
  readLatestPointer,
  resolveCurrentVersion,
  versionedDescriptorPath,
  writeLatestPointer,
} from "@/features/planner/catalog/svg/descriptorPointer";
import { verifyDualRead, writeDualReadEvidence } from "./dualReadHarness";

/** Reasons surfaced to the per-route `withAuth` envelope. */
export type PersistErrorReason =
  | "invalid"
  | "versionMismatch"
  | "hashMismatch"
  | "lockBusy"
  | "ioError"
  | "pathEscape"
  | "existsAfterAtomicRename"
  | "dualReadMismatch";

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
  /** Absolute path of the versioned file written this run. */
  readonly path: string;
  /** Pointer path updated this run. */
  readonly historyPath: string;
  /** True iff a prior version existed. */
  readonly replaced: boolean;
  /** Monotonic version number committed this run. */
  readonly version: number;
  /** Dual-read evidence path when captureDualReadEvidence is enabled. */
  readonly dualReadEvidencePath?: string;
  readonly rollback?: () => void;
  readonly cleanup?: () => void;
}

export interface PersistFailure {
  readonly ok: false;
  readonly error: PersistError;
  readonly rollback?: () => void;
  readonly cleanup?: () => void;
}

export type PersistResult = PersistSuccess | PersistFailure;

export interface PersistOptions {
  /** Override the loader-relative directory. Defaults to {@link BLOCK_DESCRIPTORS_DIR_DEFAULT}. */
  dir?: string;
  /** Stamp a deterministic `generatedAt` (useful for tests). */
  clock?: () => number;
  /** Retain rolling archive copies (default true). */
  writeArchive?: boolean;
  /** @deprecated Use writeArchive. */
  writeHistory?: boolean;
  /** Capture dual-read evidence under results/site/phase-08/dual-read/. */
  captureDualReadEvidence?: boolean;
  /** Optional results root override for dual-read evidence. */
  dualReadResultsRoot?: string;
  lock?: AcquireDescriptorLockOptions;
  /** Narrow filesystem seam for deterministic recovery fault tests. */
  recoveryFs?: { readdir: (dir: string) => string[] };
}

function sanitizeSlug(slug: string): PlannerResult<string, PersistError> {
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

function coercePlannerError(error: PlannerDescriptorError): PersistError {
  const http = toPlannerDescriptorErrorHttp(error);
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

function buildTempPath(slug: string, dir: string, nextVersion: number): string {
  const suffix = randomBytes(8).toString("hex");
  return path.resolve(dir, `.${slug}.${nextVersion}.tmp-${suffix}`);
}

function ensureDir(dir?: string): PlannerResult<string, PersistError> {
  if (typeof dir === "string" && dir.length > 0) {
    return { ok: true, value: path.resolve(dir) };
  }
  return { ok: true, value: path.resolve(BLOCK_DESCRIPTORS_DIR_DEFAULT) };
}

function readCurrentRaw(slug: string, dir: string): string | null {
  const pointer = readLatestPointer(slug, dir);
  if (pointer) {
    const versioned = versionedDescriptorPath(slug, pointer.n, dir);
    if (existsSync(versioned)) return readFileSync(versioned, "utf8");
  }
  const legacy = legacyDescriptorPath(slug, dir);
  if (!existsSync(legacy)) return null;
  return readFileSync(legacy, "utf8");
}

function writeAtomicUtf8(targetPath: string, body: string): void {
  const fd = openSync(targetPath, "wx");
  try {
    writeSync(fd, body);
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

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

  const lockResult = acquireDescriptorLock(slug, dir, options.lock);
  if (!lockResult.ok) {
    return { ok: false, error: lockResult.error };
  }
  const releaseLock = lockResult.handle.release;

  const currentVersion = resolveCurrentVersion(slug, dir);
  const replaced = currentVersion > 0;
  const previousRaw = readCurrentRaw(slug, dir);
  let shapeForFreeze: Record<string, unknown> = shape;
  if (previousRaw) {
    try {
      const previousParsed = parseBlockDescriptor(JSON.parse(previousRaw) as unknown);
      if (previousParsed.ok) {
        const previousGeneratedAt = previousParsed.value.generatedAt;
        if (
          typeof shape.generatedAt === "number" &&
          shape.generatedAt !== previousGeneratedAt
        ) {
          releaseLock();
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
    releaseLock();
    return { ok: false, error: coercePlannerError(frozen.error) };
  }
  const descriptor = frozen.value;

  const reparse = parseBlockDescriptor(descriptor);
  if (!reparse.ok) {
    releaseLock();
    return { ok: false, error: coercePlannerError(reparse.error) };
  }

  const nextVersion = currentVersion + 1;
  const versionedPath = versionedDescriptorPath(slug, nextVersion, dir);
  const legacyPath = legacyDescriptorPath(slug, dir);
  const pointerPath = path.resolve(dir, `${slug}.latest.json`);
  const archiveDir = path.resolve(dir, "_archive");
  const tempPath = buildTempPath(slug, dir, nextVersion);
  const body = `${canonicalJsonStringify(descriptor)}\n`;
  const versionedBefore = existsSync(versionedPath) ? readFileSync(versionedPath, "utf8") : null;
  const legacyBefore = existsSync(legacyPath) ? readFileSync(legacyPath, "utf8") : null;
  const pointerBefore = existsSync(pointerPath) ? readFileSync(pointerPath, "utf8") : null;
  const archiveBefore = new Map<string, string>();
  if (existsSync(archiveDir)) {
    for (const entry of readdirSync(archiveDir)) {
      if (entry.startsWith(`${slug}.`) && entry.endsWith(".json")) {
        archiveBefore.set(entry, readFileSync(path.resolve(archiveDir, entry), "utf8"));
      }
    }
  }
  const restoreFile = (targetPath: string, prior: string | null): void => {
    if (prior === null) {
      rmSync(targetPath, { force: true });
      return;
    }
    const restoreTemp = `${targetPath}.restore-${randomBytes(8).toString("hex")}`;
    writeAtomicUtf8(restoreTemp, prior);
    renameSync(restoreTemp, targetPath);
  };
  const rollback = (): void => {
    const errors: unknown[] = [];
    const attempt = (operation: () => void): void => {
      try { operation(); } catch (error) { errors.push(error); }
    };
    attempt(() => restoreFile(versionedPath, versionedBefore));
    attempt(() => restoreFile(legacyPath, legacyBefore));
    attempt(() => restoreFile(pointerPath, pointerBefore));
    attempt(() => mkdirSync(archiveDir, { recursive: true }));
    let archiveEntries: string[] = [];
    const recoveryReaddir = options.recoveryFs?.readdir ?? readdirSync;
    attempt(() => { archiveEntries = existsSync(archiveDir) ? recoveryReaddir(archiveDir) : []; });
    for (const entry of archiveEntries) {
        if (entry.startsWith(`${slug}.`) && entry.endsWith(".json") && !archiveBefore.has(entry)) {
          attempt(() => rmSync(path.resolve(archiveDir, entry), { force: true }));
        }
    }
    for (const [entry, bodyBefore] of archiveBefore) {
      attempt(() => restoreFile(path.resolve(archiveDir, entry), bodyBefore));
    }
    clearLoaderCache();
    if (errors.length > 0) {
      const details = errors.map((error) => error instanceof Error ? error.message : String(error)).join("; ");
      throw new AggregateError(errors, `Descriptor rollback incomplete for "${slug}": ${details}`);
    }
  };

  try {
    writeAtomicUtf8(tempPath, body);
    renameSync(tempPath, versionedPath);
    copyFileSync(versionedPath, legacyPath);
    writeLatestPointer(
      buildPointer(slug, nextVersion, descriptor.checksum),
      dir,
    );
    if (options.writeArchive !== false && options.writeHistory !== false) {
      retainDescriptorArchive(slug, dir, nextVersion);
    }
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    try {
      if (existsSync(tempPath)) rmSync(tempPath, { force: true });
    } catch {
      /* ignore */
    }
    let rollbackDetail = "";
    try { rollback(); } catch (rollbackError) {
      rollbackDetail = rollbackError instanceof Error ? rollbackError.message : String(rollbackError);
    }
    releaseLock();
    return {
      ok: false,
      error: {
        reason: "ioError",
        code: "500.io",
        fieldPath: `slug:${slug}`,
        message: `Atomic rename failed for "${slug}": ${detail}${rollbackDetail ? ` (rollback incomplete: ${rollbackDetail})` : ""}`,
      },
      rollback,
    };
  }

  clearLoaderCache();
  const dualRead = verifyDualRead({ slug, dir, expected: descriptor });
  if (!dualRead.pass) {
    let rollbackDetail = "";
    try { rollback(); } catch (rollbackError) {
      rollbackDetail = rollbackError instanceof Error ? rollbackError.message : String(rollbackError);
    }
    releaseLock();
    return {
      ok: false,
      error: {
        reason: "dualReadMismatch",
        code: "500.dual_read",
        fieldPath: `slug:${slug}`,
        message: `Dual-read verification failed for "${slug}" after persist${rollbackDetail ? ` (rollback incomplete: ${rollbackDetail})` : ""}`,
      },
      rollback,
    };
  }

  let dualReadEvidencePath: string | undefined;
  if (options.captureDualReadEvidence) {
    dualReadEvidencePath = writeDualReadEvidence(
      dualRead,
      options.dualReadResultsRoot,
    );
  }

  releaseLock();

  return {
    ok: true,
    descriptor,
    path: versionedPath,
    historyPath: path.resolve(dir, `${slug}.latest.json`),
    replaced,
    version: nextVersion,
    dualReadEvidencePath,
    rollback,
  };
}

export function parseAdminPayload(input: unknown): PlannerResult<
  BlockDescriptor,
  PlannerDescriptorError
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

export function listBlockDescriptors(
  options?: string | { dir?: string; forceReload?: boolean },
): BlockDescriptor[] {
  if (typeof options === "string") {
    return loaderLoadAll({ dir: options });
  }
  return loaderLoadAll(options);
}

export function readPersistedRaw(slug: string, dir?: string): string | null {
  return readCurrentRaw(slug, dir ?? BLOCK_DESCRIPTORS_DIR_DEFAULT);
}

export function unlinkBlockDescriptor(slug: string, dir?: string): void {
  const targetDir = dir ?? BLOCK_DESCRIPTORS_DIR_DEFAULT;
  const legacy = legacyDescriptorPath(slug, targetDir);
  if (existsSync(legacy)) unlinkSync(legacy);
  const pointer = readLatestPointer(slug, targetDir);
  if (pointer) {
    const versioned = versionedDescriptorPath(slug, pointer.n, targetDir);
    if (existsSync(versioned)) unlinkSync(versioned);
    unlinkSync(path.resolve(targetDir, `${slug}.latest.json`));
  }
}

export { resolveCurrentVersion, readLatestPointer, versionedDescriptorPath };
