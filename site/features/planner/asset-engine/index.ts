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

export {
  exportModularCabinetV0GlbBinary,
  type ModularGlbBinaryResult,
} from "./mesh/exportModularGlbBinary";

export {
  runModularMeshStages,
  type MeshStagesResult,
} from "./mesh/runMeshStages";
