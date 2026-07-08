/**
 * THE publish entry for in-process SVG compile (no disk I/O).
 *
 * Authority: `pipelineCore+normalize` (see `compileAuthority.ts`) —
 * S1 `normalizeDescriptorForPipeline` + S2/S3 `pipelineCore`.
 *
 * Callers:
 * - `publishDescriptorWithPipeline` gates S1–S3 here before S4 disk write
 * - Tests that assert publish compile without I/O
 *
 * Disk write (S4) remains `generate-svg.mjs` / `runSvgPipeline` (also S1-normalized).
 * V1 (`svgCompiler.server.ts`) is `v1-reference-only` — not used here.
 */

import {
  runSvgCompileStages,
  type SvgCompileStagesResult,
} from "./runSvgCompileStages";
import { PUBLISH_COMPILE_AUTHORITY } from "./compileAuthority";

/** Re-export authority tag so callers can assert the single publish owner. */
export { PUBLISH_COMPILE_AUTHORITY };

/**
 * Compile a descriptor for publish: normalize → pipelineCore → sanitize/optimise.
 * Wraps {@link runSvgCompileStages}; same result shape.
 */
export async function compileSvgForPublish(
  raw: unknown,
): Promise<SvgCompileStagesResult> {
  return runSvgCompileStages(raw);
}
