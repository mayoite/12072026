/**
 * Phase 04 — svgPipelineRunner (Phase 03 SVG pipeline spawn wrapper)
 *
 * §04-ADMIN-07 / §04-SUB-02: the API shells out to
 * `site/scripts/generate-svg.mjs` via `node:child_process.exec` (string command to avoid bundler module resolution on the script path).
 *
 * Contract:
 *   - 10s timeout (default; overridable for integration tests).
 *   - 1 MB max-buffer on stderr (configurable via options; no hang).
 *   - Non-zero exit → runner resolves to `{ ok: false, ... }` with the
 *     captured stderr; it never throws. Callers map to HTTP 500.
 *   - Descriptor JSON is written to a single-shot fixture name under
 *     `site/scripts/generate-svg/_fixtures/` and the script invoked with
 *     `-- --fixture {name}`. The script outputs to
 *     `site/public/svg-catalog/{slug}.svg` and uploads PNG to R2
 *     (`site-block-thumbs/` per IMPLEMENTATION-DECISIONS.md §110).
 *
 * Authority: Phase 03 script owns the pipeline. Phase 04 calls it but never
 * edits it (AGENTS.md §Scope: don't auto-create or modify Phase 03 territory).
 * Detect-and-degrade: if the script or its dependencies are missing (no
 * polygon-clipping / svgo / @resvg), the runner reports `scriptUnavailable`
 * and the response still completes successfully (the descriptor writes
 * succeed; the SVG/PNG artefact is a cache for portal render).
 */

import { exec, type ExecException } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import type { BlockDescriptor } from "@/features/planner/open3d/catalog/svg/svgTypes";

/** Default timeout per Phase 04 §04-SUB-02 (10s). */
export const DEFAULT_TIMEOUT_MS = 10_000;
/** Default max stderr buffer size per Phase 04 §04-SUB-02 (1 MB). */
export const DEFAULT_MAX_STDERR_BYTES = 1_000_000;

export type PipelineFailureReason =
  | "spawnError"
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
 * Locate the project root (one level above `site/`) for execFile paths.
 */
function findProjectRoot(override?: string): string {
  if (override) return path.resolve(override);
  // jsconfig-style resolution: assume cwd is `site/`. Tests can override.
  return path.resolve(process.cwd(), "..");
}

function defaultSvgPath(slug: string, projectRoot: string): string {
  return path.resolve(projectRoot, "site", "public", "svg-catalog", `${slug}.svg`);
}

/**
 * Run the Phase 03 SVG pipeline against the just-saved descriptor.
 *
 * Idempotent: writes a fixture JSON named `admin-{slug}-{rand}.json` so
 * successive admin saves never collide with the bundled `chaise` /
 * `side-table` / `sectional` / `missing-geometry` fixtures. The fixture
 * file lives under `site/scripts/generate-svg/_fixtures/` and is left in
 * place for auditing (the file tree is ignored at the repo level by
 * `site/scripts/generate-svg/.gitignore`).
 *
 * No `any`, no `@ts-ignore`. Errors are returned as data so callers can
 * render them through the standard `{ success, error }` envelope.
 */
export function runSvgPipeline(
  descriptor: BlockDescriptor,
  options: PipelineOptions = {},
): Promise<PipelineResult> {
  const projectRoot = findProjectRoot(options.projectRoot);
  const scriptPath = path.resolve(projectRoot, "site", "scripts", "generate-svg.mjs");
  const fixturesDir = path.resolve(projectRoot, "site", "scripts", "generate-svg", "_fixtures");
  const svgPath = defaultSvgPath(descriptor.slug, projectRoot);
  const fixtureSuffix = `${descriptor.slug}.${Math.random().toString(36).slice(2, 10)}`;
  const fixturePath = path.resolve(fixturesDir, `admin-${fixtureSuffix}.json`);
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxStderrBytes = options.maxStderrBytes ?? DEFAULT_MAX_STDERR_BYTES;

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
    const message = writeError instanceof Error ? writeError.message : String(writeError);
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

  return new Promise<PipelineResult>((resolve) => {
    const cmd = `node "${scriptPath}" -- --fixture admin-${fixtureSuffix}`;
    exec(
      cmd,
      {
        cwd: projectRoot,
        timeout: timeoutMs,
        maxBuffer: maxStderrBytes,
        windowsHide: true,
        encoding: "utf8",
      },
      (error: ExecException | null, stdout: string, stderr: string) => {
        const durationMs = Date.now() - startedAt;
        if (error) {
          if (error.killed && error.signal === "SIGTERM") {
            return resolve({
              ok: false,
              reason: "timeoutError" as const,
              stderr,
              stdout,
              exitCode: null,
              error: `Pipeline killed after ${timeoutMs}ms (signal SIGTERM); captured ${stderr.length} bytes of stderr.`,
              fixturePath,
            });
          }
          if (stderr.length >= maxStderrBytes) {
            return resolve({
              ok: false,
              reason: "nonZeroExit" as const,
              stderr: `${stderr.slice(0, maxStderrBytes - 64)}... [truncated]`,
              stdout,
              exitCode: null,
              error: `Pipeline wrote stderr larger than maxBuffer=${maxStderrBytes}; aborted.`,
              fixturePath,
            });
          }
          return resolve({
            ok: false,
            reason: "nonZeroExit" as const,
            stderr,
            stdout,
            exitCode: error.code === null ? null : typeof error.code === "number" ? error.code : null,
            error: `Pipeline exited with error: ${error.message}`,
            fixturePath,
          });
        }
        return resolve({
          ok: true,
          exitCode: 0,
          stdout,
          stderr,
          fixturePath,
          svgPath,
          durationMs,
        });
      },
    );
  });
}
