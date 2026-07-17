/**
 * SVG compile authority markers — honest dual-path documentation.
 *
 * Publish path (LIVE): S1 normalize + pipelineCore (S2/S3).
 * V1 path: retained for tests/reference only; NOT used by publish.
 *
 * Do not claim V1 is publish authority. Do not delete V1 in this slice.
 */

/** Live admin/CLI publish compile authority (normalize + pipelineCore). */
export const PUBLISH_COMPILE_AUTHORITY = "pipelineCore+normalize" as const;

/**
 * V1 SvgBlockDefinition compiler — reference/tests only.
 * Kept for golden/unit coverage of SvgBlockDefinitionV1; not on publish wire.
 */
export const V1_COMPILE_AUTHORITY = "v1-reference-only" as const;

export type PublishCompileAuthority = typeof PUBLISH_COMPILE_AUTHORITY;
export type V1CompileAuthority = typeof V1_COMPILE_AUTHORITY;

/**
 * Stage ids documented for the publish path (S1–S3; no disk I/O).
 * S4 write and S6 persist sit outside compileSvgForPublish.
 */
export const PUBLISH_SVG_COMPILE_STAGES = [
  "svg-s1-normalize",
  "svg-s2-compile",
  "svg-s3-sanitize-optimize",
] as const;

export type PublishSvgCompileStageId =
  (typeof PUBLISH_SVG_COMPILE_STAGES)[number];

/** Single map for tooling/tests: which compiler owns which role. */
export const COMPILE_AUTHORITY = {
  /** THE publish entry uses this. */
  publish: PUBLISH_COMPILE_AUTHORITY,
  /** svgCompiler.server.ts role. */
  v1: V1_COMPILE_AUTHORITY,
  /** Code entries for publish. */
  publishEntries: {
    normalize: "asset-engine/svg/normalizeDescriptorForPipeline.ts",
    compile: "scripts/generate-svg/pipelineCore.ts",
    orderedApi: "asset-engine/svg/runSvgCompileStages.ts → compileSvgForPublish",
    cliWrite: "scripts/generate-svg.mjs runPipeline (S1–S4 + disk)",
    adminWire: "svgPipelineRunner → generate-svg.mjs runPipeline",
  },
  v1Entry: "catalog/svg/svgCompiler.server.ts",
} as const;
