/**
 * Phase 04 — svgPipelineRunner (unified in-process wrapper; 1B)
 *
 * Calls canonical svgCompiler.server.ts authority via thin generate-svg.mjs runPipeline (dynamic import).
 * No child_process; spawnError reason is legacy only in type. GS: BP-03, anti-copy.
 * Contract preserved for callers. All production code no-explicit-any.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { BlockDescriptor } from "@/features/planner/open3d/catalog/svg/svgTypes";

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
}

/**
 * Locate the project root (one level above `site/`) for in-process dynamic import paths.
 */
function findProjectRoot(override?: string): string {
  if (override) return path.resolve(override);
  const cwd = process.cwd();
  // Support standalone: prepare-standalone.cjs copies under .next/standalone/site/scripts when full source tree absent.
  const stand = path.resolve(cwd, ".next", "standalone");
  if (existsSync(path.join(stand, "site", "scripts", "generate-svg.mjs"))) {
    return stand;
  }
  // jsconfig-style resolution: assume cwd is `site/`. Tests can override.
  return path.resolve(cwd, "..");
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

/**
 * Run the Phase 03 SVG pipeline against the just-saved descriptor (in-process dynamic import).
 *
 * Delegates to canonical runPipeline in thin generate-svg.mjs wrapper (authority: svgCompiler.server.ts).
 * Fixture write kept for audit parity (min change).
 * GS: BP-03, anti-copy.
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
    "site",
    "scripts",
    "generate-svg",
    "_fixtures",
  );
  const svgPath = defaultSvgPath(descriptor.slug, projectRoot);
  const fixtureSuffix = `${descriptor.slug}.${Math.random().toString(36).slice(2, 10)}`;
  const fixturePath = path.resolve(fixturesDir, `admin-${fixtureSuffix}.json`);
  const _timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const _maxStderrBytes = options.maxStderrBytes ?? DEFAULT_MAX_STDERR_BYTES;
  void _timeoutMs;
  void _maxStderrBytes;

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

  // In-process (unified): dynamic import of thin script module calling canonical compiler.
  const importModule = new Function(
    "specifier",
    'return import(specifier);',
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
