/**
 * Fail-closed publish: asset-engine compile (S1–S3) → disk pipeline (S4) → persist (S6).
 *
 * Mirrors POST /api/admin/svg-editor ordering so Puck onPublish cannot report
 * success when compilation fails. Pure of Next server-action surface — injectable
 * deps for unit tests.
 *
 * GS: BP-03, anti-copy. No `any`.
 */

import type { BlockDescriptor } from "@/features/planner/open3d/catalog/svg/svgTypes";
import type { Open3dDescriptorError, Open3dResult } from "@/features/planner/open3d/catalog/svg/svgTypes";
import {
  parseAdminPayload,
  persistBlockDescriptor,
  type PersistResult,
} from "@/features/planner/admin/svg-editor/persistBlockDescriptor";
import {
  runSvgPipeline,
  type PipelineResult,
} from "@/features/planner/admin/svg-editor/svgPipelineRunner";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import type { SvgCompileStagesResult } from "@/features/planner/asset-engine/svg/runSvgCompileStages";

export type PublishDescriptorSuccess = {
  readonly success: true;
  readonly descriptor: BlockDescriptor;
};

export type PublishDescriptorFailure = {
  readonly success: false;
  readonly error: string;
};

export type PublishDescriptorResult =
  | PublishDescriptorSuccess
  | PublishDescriptorFailure;

export type PublishDescriptorWithPipelineDeps = {
  readonly parsePayload?: (
    input: unknown,
  ) => Open3dResult<BlockDescriptor, Open3dDescriptorError>;
  /**
   * Asset-engine authority (S1 normalize → S2 compile → S3 sanitize).
   * Fail-closed before S4 disk write.
   */
  readonly compileSvg?: (
    descriptor: BlockDescriptor,
  ) => Promise<SvgCompileStagesResult>;
  /** S4 write public/svg-catalog via generate-svg.mjs (S1 also on that path). */
  readonly runPipeline?: (descriptor: BlockDescriptor) => Promise<PipelineResult>;
  readonly persist?: (input: unknown) => PersistResult;
};

const DEFAULT_DEPS: Required<PublishDescriptorWithPipelineDeps> = {
  parsePayload: parseAdminPayload,
  compileSvg: compileSvgForPublish,
  runPipeline: runSvgPipeline,
  persist: persistBlockDescriptor,
};

/**
 * Validate → compileSvgForPublish (S1–S3) → runSvgPipeline (S4) → persist (S6).
 * Compile or pipeline failure aborts before descriptor persist.
 *
 * If S4 succeeds and persist fails, SVG artifacts may already exist on
 * disk (or under fixtures) even though the descriptor JSON was not committed.
 */
export async function publishDescriptorWithPipeline(
  descriptorInput: unknown,
  deps: PublishDescriptorWithPipelineDeps = {},
): Promise<PublishDescriptorResult> {
  const parsePayload = deps.parsePayload ?? DEFAULT_DEPS.parsePayload;
  const compileSvg = deps.compileSvg ?? DEFAULT_DEPS.compileSvg;
  const runPipeline = deps.runPipeline ?? DEFAULT_DEPS.runPipeline;
  const persist = deps.persist ?? DEFAULT_DEPS.persist;

  const parsed = parsePayload(descriptorInput);
  if (!parsed.ok) {
    return {
      success: false,
      error: `${parsed.error.code}: ${parsed.error.message}`,
    };
  }

  const descriptor = parsed.value;

  // S1–S3: asset-engine authority (normalize + pipelineCore + sanitize)
  let compile: SvgCompileStagesResult;
  try {
    compile = await compileSvg(descriptor);
  } catch (err) {
    const details = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `compiler_exception: A fatal error occurred during SVG compilation. ${details}`,
    };
  }

  if (!compile.ok) {
    return {
      success: false,
      error: `compiler_failed: Backend SVG compilation failed. ${compile.error} (failedAt=${compile.failedAt})`,
    };
  }

  // S4: disk write still via runSvgPipeline / generate-svg.mjs (S1 normalize already on that path)
  let pipeline: PipelineResult;
  try {
    pipeline = await runPipeline(descriptor);
  } catch (err) {
    const details = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `compiler_exception: A fatal error occurred during SVG compilation. ${details}`,
    };
  }

  if (!pipeline.ok) {
    return {
      success: false,
      error: `compiler_failed: Backend SVG compilation failed. ${pipeline.error}`,
    };
  }

  // Persist only after successful compilation + disk write. If this fails, SVG
  // may already be on disk from the pipeline step — surface the write error;
  // do not claim publish success.
  const persistResult = persist(descriptor);
  if (!persistResult.ok) {
    return {
      success: false,
      error: `${persistResult.error.code}: ${persistResult.error.message}`,
    };
  }

  return { success: true, descriptor: persistResult.descriptor };
}
