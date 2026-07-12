/**
 * Ordered SVG compile stages (S1 → S2 → S3). No disk I/O.
 * S4 write is generate-svg.mjs; S6 persist is publishDescriptorWithPipeline.
 *
 * Publish authority: normalizeDescriptorForPipeline + pipelineCore.
 * See compileAuthority.ts. V1 (svgCompiler.server) is reference-only.
 */

import {
  runPipelineCore,
  runPipelineCoreFromMakerPaths,
  type PipelineDescriptor,
} from "../../../../scripts/generate-svg/pipelineCore";
import {
  normalizeDescriptorForPipeline,
  type PipelineCompileDescriptor,
} from "./normalizeDescriptorForPipeline";
import { compileMakerRecipeToPaths } from "./makerJsToPath";

export interface SvgCompileStageResult {
  readonly ok: true;
  readonly stages: readonly string[];
  readonly normalized: PipelineCompileDescriptor;
  readonly svg: string;
}

export interface SvgCompileStageError {
  readonly ok: false;
  readonly stages: readonly string[];
  readonly error: string;
  readonly failedAt: string;
}

export type SvgCompileStagesResult = SvgCompileStageResult | SvgCompileStageError;

function toPipelineDescriptor(
  normalized: PipelineCompileDescriptor,
): PipelineDescriptor {
  return {
    slug: normalized.slug,
    name: normalized.name,
    description: normalized.description,
    variant: normalized.variant,
    viewBox: normalized.viewBox,
    blocks: normalized.blocks.map((b) => ({
      x: b.x,
      y: b.y,
      width: b.width,
      height: b.height,
      id: b.id,
    })),
    themeTokens: normalized.themeTokens,
  };
}

/**
 * S1 normalize → S2/S3 pipelineCore (compile + sanitize + optimise).
 * Shared implementation; publish callers use {@link compileSvgForPublish}.
 */
export async function runSvgCompileStages(
  rawDescriptor: unknown,
): Promise<SvgCompileStagesResult> {
  const stages: string[] = [];

  try {
    stages.push("svg-s1-normalize");
    const normalized = normalizeDescriptorForPipeline(rawDescriptor);

    let svg: string;
    if (normalized.makerRecipe) {
      stages.push("svg-s2-maker-compile");
      stages.push("svg-s3-sanitize-optimize");
      const { parts, viewBox } = compileMakerRecipeToPaths(normalized.makerRecipe);
      svg = await runPipelineCoreFromMakerPaths(
        toPipelineDescriptor({ ...normalized, viewBox }),
        viewBox,
        parts,
      );
    } else {
      stages.push("svg-s2-compile");
      stages.push("svg-s3-sanitize-optimize");
      svg = await runPipelineCore(toPipelineDescriptor(normalized));
    }

    if (typeof svg !== "string" || svg.length === 0) {
      return {
        ok: false,
        stages,
        failedAt: "svg-s2-compile",
        error: "pipelineCore returned empty SVG",
      };
    }

    return { ok: true, stages, normalized, svg };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const failedAt = stages[stages.length - 1] ?? "svg-s0-validate";
    return { ok: false, stages, failedAt, error: message };
  }
}
