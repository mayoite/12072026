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
  FurnitureFabricLayer,
  type FurnitureFabricLayerProps,
} from "./FurnitureFabricLayer";
