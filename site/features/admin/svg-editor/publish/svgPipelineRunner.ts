/**
 * Phase 04 — svgPipelineRunner (unified in-process wrapper; 1B)
 *
 * Publish authority: pipelineCore + normalize (asset-engine), via thin
 * generate-svg.mjs `runPipeline` (dynamic import). NOT svgCompiler.server (V1
 * is reference-only). No child_process; spawnError reason is legacy only in type.
 * GS: BP-03, anti-copy. Contract preserved for callers. No explicit any.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import {
  assertCatalogWriteAllowed,
  CatalogIsolationError,
} from "@/features/admin/svg-editor/storage/catalogWriteIsolation";
import { isSvgCatalogDiskWriteEnabled } from "@/features/admin/svg-editor/publish/svgReleaseAuthority";

/** Default timeout per Phase 04 §04-SUB-02 (10s). */
export const DEFAULT_TIMEOUT_MS = 10_000;
/** Default max stderr buffer size per Phase 04 §04-SUB-02 (1 MB). */
export const DEFAULT_MAX_STDERR_BYTES = 1_000_000;

export type PipelineFailureReason =
  | "spawnError" /* legacy (kept for type compat with prior tests/docs/callers; not emitted in in-process path) */
  | "timeoutError"
  | "nonZeroExit"
  | "scriptUnavailable"
  | "writeFixtureError";

export interface PipelineResultOk {
  readonly ok: true;
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
  readonly fixturePath: string;
  readonly svgPath: string;
  readonly durationMs: number;
  readonly rollback?: () => void;
  readonly commit?: () => void;
  readonly cleanup?: () => void;
}

export interface PipelineResultErr {
  readonly ok: false;
  readonly reason: PipelineFailureReason;
  readonly stderr: string;
  readonly stdout: string;
  readonly exitCode: number | null;
  readonly error: string;
  readonly fixturePath: string | null;
}

export type PipelineResult = PipelineResultOk | PipelineResultErr;

export interface PipelineOptions {
  /** Override the project root (for tests). */
  projectRoot?: string;
  /** Override timeout in ms (default {@link DEFAULT_TIMEOUT_MS}). */
  timeoutMs?: number;
  /** Override stderr/max-buffer in bytes. */
  maxStderrBytes?: number;
  /**
   * When true, skip S1–S3 recompile and only perform S4 disk write.
   * Requires a non-empty {@link precompiledSvg} already validated by
   * `compileSvgForPublish` (or equivalent). Default false — full pipeline.
   */
  skipCompile?: boolean;
  /**
   * Validated SVG string from compileSvgForPublish. Required when
   * `skipCompile` is true; ignored otherwise.
   */
  precompiledSvg?: string;
  /** Narrow filesystem seam for deterministic recovery fault tests. */
  recoveryFs?: { rename: (source: string, target: string) => void };
}

/**
 * True when generate-svg.mjs AND pipelineCore exist under root/site/scripts
 * (incomplete standalone copies often ship the .mjs without pipelineCore.ts).
 */
function isCompleteSvgScriptTree(root: string): boolean {
  const scripts = path.join(root, "site", "scripts");
  return (
    existsSync(path.join(scripts, "generate-svg.mjs")) &&
    existsSync(path.join(scripts, "generate-svg", "pipelineCore.ts"))
  );
}

/**
 * Locate the monorepo / standalone root that contains `site/scripts/generate-svg*`.
 * Prefer a **complete** source tree over a partial `.next/standalone` copy
 * (dev servers under `site/` were resolving standalone first and failing
 * with missing pipelineCore.ts → 422 compiler_failed on admin publish).
 */
function findProjectRoot(override?: string): string {
  if (override) return path.resolve(override);
  const cwd = process.cwd();

  // cwd = site/ → monorepo root is parent
  const monorepoFromSite = path.resolve(cwd, "..");
  if (isCompleteSvgScriptTree(monorepoFromSite)) {
    return monorepoFromSite;
  }

  // cwd = monorepo root
  if (isCompleteSvgScriptTree(cwd)) {
    return cwd;
  }

  // Standalone only when complete (mjs + pipelineCore)
  const stand = path.resolve(cwd, ".next", "standalone");
  if (isCompleteSvgScriptTree(stand)) {
    return stand;
  }

  // site/.next/standalone when cwd is site/
  const standFromSite = path.resolve(cwd, ".next", "standalone");
  if (isCompleteSvgScriptTree(standFromSite)) {
    return standFromSite;
  }

  // Legacy fallback (same as historical site-cwd assumption)
  return monorepoFromSite;
}

function defaultSvgPath(slug: string, projectRoot: string): string {
  return path.resolve(
    projectRoot,
    "site",
    "public",
    "svg-catalog",
    `${slug}.svg`,
  );
}

export function resolvePublishedSvgPath(
  slug: string,
  projectRoot?: string,
): string {
  return defaultSvgPath(slug, findProjectRoot(projectRoot));
}

/**
 * Run the Phase 03 SVG pipeline against the just-saved descriptor (in-process dynamic import).
 *
 * Default: delegates to generate-svg.mjs `runPipeline`, which normalizes (S1) then
 * pipelineCore (S2/S3) and writes public SVG (S4). Publish compile authority
 * is pipelineCore+normalize — same path as asset-engine `compileSvgForPublish`
 * for S1–S3 (CLI also writes disk). V1 svgCompiler.server is not on this wire.
 *
 * When `options.skipCompile` is true with a non-empty `precompiledSvg` (from a
 * prior successful `compileSvgForPublish`), only S4 disk write + fixture audit
 * run — avoids double S1–S3 on the publish path. GS: BP-03, anti-copy.
 */
export function runSvgPipeline(
  descriptor: BlockDescriptor,
  options: PipelineOptions = {},
): Promise<PipelineResult> {
  const projectRoot = findProjectRoot(options.projectRoot);
  const scriptPath = path.resolve(
    projectRoot,
    "site",
    "scripts",
    "generate-svg.mjs",
  );
  const fixturesDir = path.resolve(
    projectRoot,
    "results",
    "admin",
    "svg-pipeline-fixtures",
  );
  const svgPath = defaultSvgPath(descriptor.slug, projectRoot);
  const fixturePath = path.resolve(fixturesDir, `${descriptor.slug}.json`);
  const _timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const _maxStderrBytes = options.maxStderrBytes ?? DEFAULT_MAX_STDERR_BYTES;
  void _timeoutMs;
  void _maxStderrBytes;

  if (!isSvgCatalogDiskWriteEnabled()) {
    const noop = (): void => undefined;
    return Promise.resolve({
      ok: true as const,
      exitCode: 0,
      stdout: "[SVG_DISK_WRITE disabled — S4 svg-catalog write skipped]",
      stderr: "",
      fixturePath,
      svgPath,
      durationMs: 0,
      rollback: noop,
      commit: noop,
      cleanup: noop,
    });
  }

  try {
    assertCatalogWriteAllowed(svgPath);
  } catch (cause) {
    const message =
      cause instanceof CatalogIsolationError
        ? cause.message
        : cause instanceof Error
          ? cause.message
          : String(cause);
    return Promise.resolve({
      ok: false,
      reason: "writeFixtureError" as const,
      stderr: "",
      stdout: "",
      exitCode: null,
      error: message,
      fixturePath: null,
    });
  }

  const skipCompile = options.skipCompile === true;
  const precompiledSvg =
    typeof options.precompiledSvg === "string"
      ? options.precompiledSvg.trim()
      : "";

  if (skipCompile) {
    if (!precompiledSvg) {
      return Promise.resolve({
        ok: false,
        reason: "nonZeroExit" as const,
        stderr: "",
        stdout: "",
        exitCode: 1,
        error:
          "skipCompile requires a non-empty precompiledSvg (from compileSvgForPublish).",
        fixturePath: null,
      });
    }

    const startedAt = Date.now();
    const recoveryRename = options.recoveryFs?.rename ?? renameSync;
    const suffix = randomBytes(8).toString("hex");
    const stagedSvgPath = `${svgPath}.stage-${suffix}`;
    const stagedFixturePath = `${fixturePath}.stage-${suffix}`;
    const backupSvgPath = `${svgPath}.backup-${suffix}`;
    const backupFixturePath = `${fixturePath}.backup-${suffix}`;
    type RecoveryFile = {
      readonly livePath: string;
      readonly stagedPath: string;
      readonly backupPath: string;
      hadLive: boolean;
      backupReady: boolean;
      swapped: boolean;
      restoreFailed: boolean;
    };
    const files: RecoveryFile[] = [
      { livePath: svgPath, stagedPath: stagedSvgPath, backupPath: backupSvgPath, hadLive: false, backupReady: false, swapped: false, restoreFailed: false },
      { livePath: fixturePath, stagedPath: stagedFixturePath, backupPath: backupFixturePath, hadLive: false, backupReady: false, swapped: false, restoreFailed: false },
    ];
    const cleanup = (): void => {
      const errors: unknown[] = [];
      for (const file of files) {
        try { rmSync(file.stagedPath, { force: true }); } catch (error) { errors.push(error); }
        if (!file.restoreFailed) {
          try { rmSync(file.backupPath, { force: true }); } catch (error) { errors.push(error); }
        }
      }
      if (errors.length > 0) throw new AggregateError(errors, "Publication cleanup incomplete");
    };
    const rollback = (): void => {
      const errors: unknown[] = [];
      for (const file of files) {
        try {
          if (file.swapped) rmSync(file.livePath, { force: true });
          if (file.backupReady && existsSync(file.backupPath)) {
            recoveryRename(file.backupPath, file.livePath);
            file.backupReady = false;
          }
          file.swapped = false;
          file.restoreFailed = false;
        } catch (error) {
          file.restoreFailed = true;
          errors.push(error);
        }
      }
      if (errors.length > 0) throw new AggregateError(errors, "Publication rollback incomplete");
    };
    const commit = (): void => {
      const errors: unknown[] = [];
      try {
        for (const file of files) {
          file.hadLive = existsSync(file.livePath);
          if (file.hadLive) {
            recoveryRename(file.livePath, file.backupPath);
            file.backupReady = true;
          }
          recoveryRename(file.stagedPath, file.livePath);
          file.swapped = true;
        }
      } catch (cause) {
        errors.push(cause);
        try { rollback(); } catch (rollbackError) { errors.push(rollbackError); }
        throw new AggregateError(errors, "Publication commit failed and rollback was attempted");
      }
    };
    try {
      mkdirSync(fixturesDir, { recursive: true });
      writeFileSync(stagedFixturePath, `${JSON.stringify(descriptor, null, 2)}\n`, {
        encoding: "utf8",
      });
      mkdirSync(path.dirname(svgPath), { recursive: true });
      writeFileSync(stagedSvgPath, `${precompiledSvg}\n`, { encoding: "utf8" });
      if (readFileSync(stagedSvgPath, "utf8") !== `${precompiledSvg}\n`) {
        throw new Error("staged SVG validation mismatch");
      }
      return Promise.resolve({
        ok: true as const,
        exitCode: 0,
        stdout: `[skipCompile] svg len=${precompiledSvg.length}`,
        stderr: "",
        fixturePath,
        svgPath,
        durationMs: Date.now() - startedAt,
        rollback,
        commit,
        cleanup,
      });
    } catch (writeError) {
      cleanup();
      const message =
        writeError instanceof Error ? writeError.message : String(writeError);
      return Promise.resolve({
        ok: false,
        reason: "writeFixtureError" as const,
        stderr: "",
        stdout: "",
        exitCode: null,
        error: `Failed to write precompiled SVG / fixture (skipCompile): ${message}`,
        fixturePath: null,
      });
    }
  }

  if (!existsSync(scriptPath)) {
    return Promise.resolve({
      ok: false,
      reason: "scriptUnavailable" as const,
      stderr: "",
      stdout: "",
      exitCode: null,
      error: `Phase 03 pipeline script missing at ${scriptPath}; skip PNG thumb generation.`,
      fixturePath: null,
    });
  }

  try {
    mkdirSync(fixturesDir, { recursive: true });
    writeFileSync(fixturePath, `${JSON.stringify(descriptor, null, 2)}\n`, {
      encoding: "utf8",
    });
  } catch (writeError) {
    const message =
      writeError instanceof Error ? writeError.message : String(writeError);
    return Promise.resolve({
      ok: false,
      reason: "writeFixtureError" as const,
      stderr: "",
      stdout: "",
      exitCode: null,
      error: `Failed to write fixture file at ${fixturePath}: ${message}`,
      fixturePath: null,
    });
  }

  const startedAt = Date.now();

  // In-process: dynamic import of thin generate-svg.mjs → normalize + pipelineCore.
  const importModule = new Function(
    "specifier",
    "return import(specifier);",
  ) as (specifier: string) => Promise<{
    runPipeline?: (descriptor: BlockDescriptor) => Promise<unknown>;
    default?: {
      runPipeline?: (descriptor: BlockDescriptor) => Promise<unknown>;
    };
  }>;

  return importModule(pathToFileURL(scriptPath).href)
    .then((mod) => {
      const runP = mod.runPipeline || mod.default?.runPipeline;
      if (typeof runP !== "function")
        throw new Error("runPipeline export missing");
      return runP(descriptor);
    })
    .then((result: unknown) => {
      const r = (result ?? {}) as { svg?: string };
      const durationMs = Date.now() - startedAt;
      return {
        ok: true as const,
        exitCode: 0,
        stdout: `[in-process] svg len=${r.svg ? r.svg.length : 0}`,
        stderr: "",
        fixturePath,
        svgPath,
        durationMs,
      };
    })
    .catch((err: unknown) => {
      const _durationMs = Date.now() - startedAt;
      void _durationMs;
      const msg = err instanceof Error ? err.message : String(err);
      return {
        ok: false as const,
        reason: "nonZeroExit" as const,
        stderr: msg,
        stdout: "",
        exitCode: 1,
        error: `Pipeline error: ${msg}`,
        fixturePath,
      };
    });
}
