export {
  type CanvasDrawingState,
  type CanvasStatusSnapshot,
  type PlannerCanvasStageHandle,
} from "./canvasStageTypes";

export {
  PlannerFabricStage,
  type PlannerFabricStageProps,
  /** Live workspace name — same component as PlannerFabricStage. */
  PlannerFabricStage as PlannerCanvasStage,
  type PlannerFabricStageProps as PlannerCanvasStageProps,
} from "./PlannerFabricStage";

export {
  DEFAULT_FABRIC_STAGE_TRANSFORM,
  DEFAULT_FURNITURE_FOOTPRINT_MM,
  FURNITURE_ENTITY_ID_PROP,
  fabricPoseToDocumentUpdate,
  furnitureFootprintMm,
  furnitureListToFabricPoses,
  furnitureToFabricPose,
  readFurnitureEntityId,
  writeFurnitureEntityId,
  type FurnitureDocumentPoseUpdate,
  type FurnitureFabricPose,
  type FurnitureFabricPoseInput,
} from "./furnitureFabricMapper";

export {
  isPlannerFabricFurnitureEnabled,
  PLANNER_FABRIC_FURNITURE_ENV,
} from "./fabricFurnitureFlag";

export {
  CANVAS_ENTITY_TYPE_PROP,
  readCanvasEntityType,
  selectionFromFabricTarget,
  writeCanvasEntityType,
  type FabricCanvasEntityType,
  type FabricEntitySelection,
} from "./fabricSelection";

export {
  FurnitureFabricLayer,
  type FurnitureFabricLayerProps,
} from "./FurnitureFabricLayer";

export {
  MIN_WALL_SEGMENT_MM,
  shouldCommitWallSegment,
  wallSegmentLengthMm,
} from "./wallDrawGeometry";
