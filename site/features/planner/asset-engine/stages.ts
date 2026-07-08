/**
 * Asset engine stage registry — ordered skeletons for SVG making and mesh/GLB making.
 *
 * HONEST STATUS only. Do not mark implemented unless production code runs that stage.
 * Dual compilers and plan-only GLB are called out explicitly.
 */

export type StageStatus =
  | "implemented"
  | "partial"
  | "plan-only"
  | "stub"
  | "planned"
  | "policy-only";

export interface AssetStage {
  readonly id: string;
  readonly order: number;
  readonly name: string;
  readonly status: StageStatus;
  /** What the stage must produce when complete. */
  readonly produces: string;
  /** Primary code entry today (may be dual — listed honestly). */
  readonly entry: string;
  readonly note?: string;
}

/**
 * SVG making — intended single authority order (Option A).
 * Live publish still uses pipelineCore; V1 compiler is parallel/tests.
 */
export const SVG_STAGES: readonly AssetStage[] = [
  {
    id: "svg-s0-validate",
    order: 0,
    name: "Validate descriptor (Zod BlockDescriptor)",
    status: "partial",
    produces: "typed descriptor or 422",
    entry: "parseAdminPayload / svgTypes",
    note: "Admin payload Zod exists; CLI fixtures use a different legacy shape.",
  },
  {
    id: "svg-s1-normalize",
    order: 1,
    name: "Normalize geometry IR for compile",
    status: "implemented",
    produces: "PipelineDescriptor (height blocks + boolean variant)",
    entry: "asset-engine/svg/normalizeDescriptorForPipeline.ts",
    note: "Maps BlockDescriptor depth→height and fixed/configurable→union|difference.",
  },
  {
    id: "svg-s2-compile",
    order: 2,
    name: "Compile geometry → SVG string",
    status: "partial",
    produces: "SVG markup",
    entry: "scripts/generate-svg/pipelineCore.ts (LIVE) | svgCompiler.server.ts (V1/tests)",
    note: "DUAL COMPILER DEBT: publish uses pipelineCore only. V1 is not publish authority.",
  },
  {
    id: "svg-s3-sanitize-optimize",
    order: 3,
    name: "Sanitize + optimise SVG",
    status: "partial",
    produces: "safe SVG string",
    entry: "pipelineCore sanitiseSvg + empty-plugin SVGO | svgServerSanitizer DOMPurify path",
    note: "Two sanitizer stacks; production path is pipelineCore regex+SVGO.",
  },
  {
    id: "svg-s4-write-public",
    order: 4,
    name: "Write public/svg-catalog/{slug}.svg",
    status: "implemented",
    produces: "disk SVG path",
    entry: "scripts/generate-svg.mjs runPipeline",
  },
  {
    id: "svg-s5-artifacts-png",
    order: 5,
    name: "PNG thumb / resvg artifacts",
    status: "stub",
    produces: "PNG + thumb URLs",
    entry: "svgArtifactCompiler.server.ts (not on publish wire)",
    note: "Publish returns URL string only; no PNG compile on admin path.",
  },
  {
    id: "svg-s6-persist",
    order: 6,
    name: "Persist descriptor after compile ok",
    status: "implemented",
    produces: "versioned block-descriptors JSON",
    entry: "publishDescriptorWithPipeline → persistBlockDescriptor",
    note: "Disk only; Supabase is 2C planned.",
  },
  {
    id: "svg-s7-catalog-consume",
    order: 7,
    name: "Catalog + inventory consume SVG URL",
    status: "partial",
    produces: "previewImageUrl /svg-catalog/{slug}.svg",
    entry: "descriptorCatalogBridge + catalogClient",
  },
] as const;

/**
 * Mesh / GLB making — generate-first (no designer static GLB).
 */
export const MESH_GLB_STAGES: readonly AssetStage[] = [
  {
    id: "mesh-g0-policy",
    order: 0,
    name: "GLB URL policy gate",
    status: "policy-only",
    produces: "allow empty|blob:|catalog-assets/generated/*",
    entry: "lib/glbAssetPolicy.ts",
  },
  {
    id: "mesh-g1-options",
    order: 1,
    name: "Structured options (modular / parametric JSON)",
    status: "partial",
    produces: "ModularCabinetV0Options or BlockDescriptorParametric",
    entry: "modularCabinetV0 + place stamps geometryMode",
    note: "Only cabinet-v0 product path is wired end-to-end.",
  },
  {
    id: "mesh-g2-footprint-2d",
    order: 2,
    name: "2D footprint from same options",
    status: "implemented",
    produces: "SVG path string (plan mm)",
    entry: "resolveFurniture2DFootprint / generateCabinetV0Footprint",
  },
  {
    id: "mesh-g3-runtime-mesh",
    order: 3,
    name: "Runtime THREE mesh (no document THREE)",
    status: "partial",
    produces: "THREE.Group | Mesh for viewer rebuild",
    entry: "createSceneObjectFromNode → generateCabinetV0Mesh | BoxGeometry",
    note: "ParametricBuilder.generate3DMesh is real code with no production caller.",
  },
  {
    id: "mesh-g4-part-plan",
    order: 4,
    name: "Pure part plan for export",
    status: "implemented",
    produces: "ModularCabinetV0GlbPlan (JSON parts + path)",
    entry: "modularCabinetV0GlbExport.ts",
  },
  {
    id: "mesh-g5-binary-glb",
    order: 5,
    name: "Binary GLB bytes (system-generated only)",
    status: "implemented",
    produces: "ArrayBuffer + relativePath under catalog-assets/generated/",
    entry: "asset-engine/mesh/exportModularGlbBinary.ts",
    note: "Bytes in memory; upload to storage still separate (uploadAsset).",
  },
  {
    id: "mesh-g6-validate-glb",
    order: 6,
    name: "Validate GLB structure",
    status: "implemented",
    produces: "GlbValidationResult",
    entry: "lib/assetPipeline.validateGlbAsset (called after binary export)",
  },
  {
    id: "mesh-g7-extrude-svg",
    order: 7,
    name: "P1 SVG outline → extrude → GLB",
    status: "partial",
    produces: "blob GLB in admin preview",
    entry: "GlbExtruderPreview + optional uploadAsset",
    note: "Admin island only; not open3d place→viewer load path.",
  },
  {
    id: "mesh-g8-viewer-load-glb",
    order: 8,
    name: "Open3d 3D load generated GLB URL",
    status: "planned",
    produces: "viewer mesh from system GLB",
    entry: "(none — viewer is procedural only)",
    note: "ThreeViewerInner never loads meshUrl/glbUrl.",
  },
] as const;

export function listSvgStages(): readonly AssetStage[] {
  return SVG_STAGES;
}

export function listMeshGlbStages(): readonly AssetStage[] {
  return MESH_GLB_STAGES;
}

export function stageById(
  id: string,
): AssetStage | undefined {
  return (
    SVG_STAGES.find((s) => s.id === id) ?? MESH_GLB_STAGES.find((s) => s.id === id)
  );
}
