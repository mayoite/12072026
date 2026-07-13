/**
 * Fail-closed publish: asset-engine compile (S1–S3) → disk pipeline (S4) → persist (S6).
 *
 * Mirrors POST /api/admin/svg-editor ordering so no authoring surface can report
 * success when compilation fails. Pure of Next server-action surface — injectable
 * deps for unit tests.
 *
 * GS: BP-03, anti-copy. No `any`.
 */

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import type { PlannerDescriptorError, PlannerResult } from "@/features/planner/project/catalog/svg/svgTypes";
import {
  parseAdminPayload,
  persistBlockDescriptor,
  type PersistResult,
} from "@/features/planner/admin/svg-editor/persistBlockDescriptor";
import {
  runSvgPipeline,
  type PipelineOptions,
  type PipelineResult,
} from "@/features/planner/admin/svg-editor/svgPipelineRunner";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import type { SvgCompileStagesResult } from "@/features/planner/asset-engine/svg/runSvgCompileStages";
import {
  assertDescriptorPublishable,
  buildReleasedProductFromPublish,
} from "@/features/planner/admin/svg-editor/releasedCatalogPublishGate";

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
  ) => PlannerResult<BlockDescriptor, PlannerDescriptorError>;
  /**
   * Asset-engine authority (S1 normalize → S2 compile → S3 sanitize).
   * Fail-closed before S4 disk write.
   */
  readonly compileSvg?: (
    descriptor: BlockDescriptor,
  ) => Promise<SvgCompileStagesResult>;
  /**
   * S4 write public/svg-catalog. Publish passes `skipCompile` + `precompiledSvg`
   * from the prior compileSvg step so S1–S3 are not re-run.
   */
  readonly runPipeline?: (
    descriptor: BlockDescriptor,
    options?: PipelineOptions,
  ) => Promise<PipelineResult>;
  readonly persist?: (input: unknown) => PersistResult;
};

const DEFAULT_DEPS: Required<PublishDescriptorWithPipelineDeps> = {
  parsePayload: parseAdminPayload,
  compileSvg: compileSvgForPublish,
  runPipeline: runSvgPipeline,
  persist: persistBlockDescriptor,
};

function runAllBestEffort(...operations: ReadonlyArray<(() => void) | undefined>): string[] {
  const errors: string[] = [];
  for (const operation of operations) {
    try { operation?.(); } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return errors;
}

function withRecoveryErrors(error: string, recoveryErrors: readonly string[]): string {
  return recoveryErrors.length === 0
    ? error
    : `${error} (rollback incomplete: ${recoveryErrors.join("; ")})`;
}

/**
 * Validate → compileSvgForPublish (S1–S3) → runSvgPipeline S4-only → persist (S6).
 * Compile or pipeline failure aborts before descriptor persist.
 *
 * S4 is invoked with `skipCompile` + `precompiledSvg` from the compile step so
 * publish does not double-run S1–S3 (compileSvgForPublish already validated).
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

  // Phase 2: incomplete / contradictory products cannot publish.
  const contractGate = assertDescriptorPublishable(descriptor);
  if (!contractGate.ok) {
    return { success: false, error: contractGate.error };
  }

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

  const released = buildReleasedProductFromPublish({
    descriptor,
    svgMarkup: compile.svg,
    revisionId: `${descriptor.slug}-r1`,
    publishedAt: new Date().toISOString(),
    availability: "available",
  });
  if (!released.ok) {
    return { success: false, error: released.error };
  }

  // S4: disk write only — reuse validated SVG from compileSvgForPublish (no S1–S3 recompile)
  let pipeline: PipelineResult;
  try {
    pipeline = await runPipeline(descriptor, {
      skipCompile: true,
      precompiledSvg: compile.svg,
    });
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
  let persistResult: PersistResult;
  try {
    persistResult = persist(descriptor);
  } catch (err) {
    const details = err instanceof Error ? err.message : String(err);
    const recoveryErrors = runAllBestEffort(pipeline.rollback, pipeline.cleanup);
    return { success: false, error: withRecoveryErrors(`500.io: Descriptor persistence threw. ${details}`, recoveryErrors) };
  }
  if (!persistResult.ok) {
    const recoveryErrors = runAllBestEffort(
      persistResult.rollback,
      pipeline.rollback,
      persistResult.cleanup,
      pipeline.cleanup,
    );
    return {
      success: false,
      error: withRecoveryErrors(`${persistResult.error.code}: ${persistResult.error.message}`, recoveryErrors),
    };
  }

  try {
    pipeline.commit?.();
  } catch (err) {
    const details = err instanceof Error ? err.message : String(err);
    const recoveryErrors = runAllBestEffort(
      persistResult.rollback,
      pipeline.rollback,
      persistResult.cleanup,
      pipeline.cleanup,
    );
    return { success: false, error: withRecoveryErrors(`500.io: Publication commit failed. ${details}`, recoveryErrors) };
  }

  const cleanupErrors = runAllBestEffort(persistResult.cleanup, pipeline.cleanup);
  if (cleanupErrors.length > 0) {
    return {
      success: false,
      error: `500.io: Publication committed but cleanup incomplete: ${cleanupErrors.join("; ")}`,
    };
  }

  return { success: true, descriptor: persistResult.descriptor };
}
