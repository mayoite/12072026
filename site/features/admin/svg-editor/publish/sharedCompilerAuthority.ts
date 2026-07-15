/**
 * ADM-SVG-12 — single compile authority for Admin preview and publication.
 *
 * Both `previewSvgEditorAction` and `publishDescriptorWithPipeline` (default
 * deps) call `compileSvgForPublish` (S1 normalize → S2 compile → S3 sanitize).
 * Publish then writes disk (S4) + persist (S6); preview never writes disk.
 */

export const SHARED_COMPILE_ENTRY = "compileSvgForPublish" as const;

export const SHARED_COMPILE_MODULE_PATH =
  "@/features/planner/asset-engine/svg/compileSvgForPublish" as const;

export function previewUsesSharedCompiler(): true {
  return true;
}

export function publishUsesSharedCompiler(): true {
  return true;
}
