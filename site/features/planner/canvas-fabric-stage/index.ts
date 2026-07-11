export {
  type CanvasDrawingState,
  type CanvasStatusSnapshot,
  type Open3dCanvasStageHandle,
} from "./canvasStageTypes";

export {
  Open3dFabricStage,
  type Open3dFabricStageProps,
} from "./Open3dFabricStage";

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
  isOpen3dFabricFurnitureEnabled,
  OPEN3D_FABRIC_FURNITURE_ENV,
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
