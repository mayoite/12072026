/**
 * Asset engine skeletons — SVG making + mesh/GLB making, ordered stages.
 * @see stages.ts for honest status of each stage.
 */

export {
  SVG_STAGES,
  MESH_GLB_STAGES,
  listSvgStages,
  listMeshGlbStages,
  stageById,
  type AssetStage,
  type StageStatus,
} from "./stages";

export {
  normalizeDescriptorForPipeline,
  resolveBooleanVariant,
  type PipelineCompileDescriptor,
  type PipelineBlockRect,
  type PipelineBooleanVariant,
} from "./svg/normalizeDescriptorForPipeline";

export {
  runSvgCompileStages,
  type SvgCompileStagesResult,
} from "./svg/runSvgCompileStages";

export { compileSvgForPublish } from "./svg/compileSvgForPublish";

export {
  COMPILE_AUTHORITY,
  PUBLISH_COMPILE_AUTHORITY,
  V1_COMPILE_AUTHORITY,
  PUBLISH_SVG_COMPILE_STAGES,
  type PublishCompileAuthority,
  type V1CompileAuthority,
  type PublishSvgCompileStageId,
} from "./svg/compileAuthority";

export {
  exportModularCabinetV0GlbBinary,
  type ModularGlbBinaryResult,
} from "./mesh/exportModularGlbBinary";

export {
  writeGeneratedGlbToPublic,
  assertWritableGeneratedGlbRelativePath,
  type WriteGeneratedGlbToPublicOptions,
  type WriteGeneratedGlbToPublicResult,
} from "./mesh/writeGeneratedGlbToPublic";

export {
  exportModularAndWrite,
  type ExportModularAndWriteResult,
  type ExportModularAndWriteOk,
  type ExportModularAndWriteErr,
} from "./mesh/exportModularAndWrite";

export {
  stampFurnitureGeneratedGlb,
  attachGeneratedGlbToFurniture,
  stampFurnitureFromModularOptions,
} from "./mesh/stampFurnitureGeneratedGlb";

export {
  placeModularWithGeneratedGlbPlan,
  type PlaceModularWithGeneratedGlbPlanOptions,
  type PlaceModularWithGeneratedGlbPlanResult,
} from "./mesh/placeModularWithGeneratedGlbPlan";

export {
  placeModularWithGeneratedGlbCore,
  type PlaceModularGlbWriter,
  type PlaceModularWithGeneratedGlbCoreOptions,
  type PlaceModularWithGeneratedGlbCoreResult,
} from "./mesh/placeModularWithGeneratedGlbCore";

export {
  placeModularWithGeneratedGlbBrowser,
  writeGeneratedGlbViaApi,
  GENERATED_GLB_WRITE_API_PATH,
  type PlaceModularWithGeneratedGlbBrowserOptions,
  type PlaceModularWithGeneratedGlbBrowserResult,
} from "./mesh/placeModularWithGeneratedGlbBrowser";

export {
  shouldPlaceModularWithGeneratedGlb,
  type ModularGlbPlaceCatalogRef,
} from "./mesh/shouldPlaceModularWithGeneratedGlb";

export {
  runModularMeshStages,
  type MeshStagesResult,
} from "./mesh/runMeshStages";

/** P1 pure SVG extrude plan (path/rect → catalog-assets/generated/ metadata). */
export {
  buildExtrudeSvgPlan,
  buildExtrudeSvgPlanFromPath,
  buildExtrudeSvgPlanFromRect,
  exportExtrudeSvgToGeneratedAssetPath,
  extrudeSvgGeneratedRelativePath,
  extrudeSvgGeneratedSlug,
  simpleRectPathD,
  type ExtrudeSvgGlbPlan,
  type ExtrudeSvgPlanInput,
  type ExtrudeSvgPartPlan,
  type ExtrudeSvgProfile,
} from "./mesh/extrudeSvgPlan";

/** Plan+A parametric templates (fields → multipath SVG). */
export {
  LinearDeskFieldsSchema,
  LinearDeskDisplayUnitSchema,
  parseLinearDeskFields,
  drawLinearDeskFromTemplate,
  linearDeskPartsToSvg,
  renderLinearDeskSvg,
  type LinearDeskFields,
  type LinearDeskDisplayUnit,
  type LinearDeskDrawResult,
  type LinearDeskPart,
  type LinearDeskPartRole,
} from "./svg/parametric";
