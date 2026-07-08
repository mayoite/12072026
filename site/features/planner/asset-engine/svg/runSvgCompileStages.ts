/**
 * Ordered SVG compile stages (S1 → S2 → S3). No disk I/O.
 * S4 write is generate-svg.mjs; S6 persist is publishDescriptorWithPipeline.
 */

import {
  runPipelineCore,
  type PipelineDescriptor,
} from "../../../../scripts/generate-svg/pipelineCore";
import {
  normalizeDescriptorForPipeline,
  type PipelineCompileDescriptor,
} from "./normalizeDescriptorForPipeline";

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
    })),
    themeTokens: normalized.themeTokens,
  };
}

/**
 * S1 normalize → S2/S3 pipelineCore (compile + sanitize + optimise).
 * Single entry for tests and future publish wiring.
 */
export async function runSvgCompileStages(
  rawDescriptor: unknown,
): Promise<SvgCompileStagesResult> {
  const stages: string[] = [];

  try {
    stages.push("svg-s1-normalize");
    const normalized = normalizeDescriptorForPipeline(rawDescriptor);

    stages.push("svg-s2-compile");
    stages.push("svg-s3-sanitize-optimize");
    const svg = await runPipelineCore(toPipelineDescriptor(normalized));

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
