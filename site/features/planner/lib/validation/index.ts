export { detectFurnitureOverlaps, aabbsOverlap } from "./furnitureOverlap";
export {
  detectFurnitureOutsideRoom,
  floorRoomPolygons,
} from "./furnitureRoomBoundary";
export {
  detectFurnitureClearance,
  aabbEdgeGapMm,
  DEFAULT_AISLE_CLEARANCE_MM,
} from "./furnitureClearance";
export {
  detectFurnitureWallCollisions,
  wallAsPlacedFurniture,
} from "./furnitureWallCollision";
export {
  detectOpeningClearanceConflicts,
  openingClearanceAsPlaced,
  collectFloorOpenings,
  DEFAULT_OPENING_CLEARANCE_MM,
} from "./openingClearance";
export { runFloorValidation, countBySeverity } from "./runValidation";
export type { ValidationResult } from "./runValidation";
export type {
  ValidationIssue,
  ValidationRuleId,
  ValidationSeverity,
  PlacedFurniture,
} from "./types";
