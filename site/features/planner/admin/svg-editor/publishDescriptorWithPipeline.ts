/**
 * Fail-closed publish: run SVG pipeline before persisting the block descriptor.
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
  readonly runPipeline?: (descriptor: BlockDescriptor) => Promise<PipelineResult>;
  readonly persist?: (input: unknown) => PersistResult;
};

const DEFAULT_DEPS: Required<PublishDescriptorWithPipelineDeps> = {
  parsePayload: parseAdminPayload,
  runPipeline: runSvgPipeline,
  persist: persistBlockDescriptor,
};

/**
 * Validate → compile SVG → persist. Pipeline failure aborts before write.
 *
 * If pipeline succeeds and persist fails, SVG artifacts may already exist on
 * disk (or under fixtures) even though the descriptor JSON was not committed.
 */
export async function publishDescriptorWithPipeline(
  descriptorInput: unknown,
  deps: PublishDescriptorWithPipelineDeps = {},
): Promise<PublishDescriptorResult> {
  const parsePayload = deps.parsePayload ?? DEFAULT_DEPS.parsePayload;
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

  // Persist only after successful compilation. If this fails, SVG may already
  // be on disk from the pipeline step above — surface the write error; do not
  // claim publish success.
  const persistResult = persist(descriptor);
  if (!persistResult.ok) {
    return {
      success: false,
      error: `${persistResult.error.code}: ${persistResult.error.message}`,
    };
  }

  return { success: true, descriptor: persistResult.descriptor };
}
