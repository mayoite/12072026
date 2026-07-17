export type { Point2D, Segment, Polygon, BoundingBox } from './types';
export { segmentIntersection, segmentsIntersect, polygonContainsPoint } from './intersections';
export { polygonArea, polygonPerimeter, polygonCentroid, boundingBox } from './polygon';
export { snapToGrid, snapToNearestEndpoint, snapToSegment } from './snap';
export {
  layoutGridPositions,
  layoutRowPositions,
  pitchFromClearGap,
  type GridLayoutCell,
  type GridLayoutOptions,
} from './gridLayout';
export {
  alignEntities,
  distributeEntities,
  spaceEntitiesWithExactGap,
  minEdgeFromCenter,
  centerFromMinEdge,
  type AlignAxis,
  type AlignAnchor,
  type DistributeAxis,
  type PositionedEntity,
  type EntityPositionUpdate,
} from './alignDistribute';
export {
  aabbFromCenteredFurniture,
  closestPointOnSegment,
  clampPointToAabb,
  wallDistanceGuide,
  furnitureEdgeGapGuide,
  computeDistanceGuides,
  DEFAULT_DISTANCE_GUIDE_MAX_MM,
  DEFAULT_DISTANCE_GUIDE_MAX_COUNT,
  type DistanceGuide,
  type DistanceGuideKind,
  type DistanceGuideAxis,
  type CenteredFurnitureRect,
  type WallGuideInput,
  type DistanceGuideOptions,
} from './distanceGuides';
export type { WallNode, WallEdge, WallGraph, EnclosedRoomCycle } from './wallGraph';
export { buildWallGraph, findEnclosedRooms, findJunctions } from './wallGraph';
export {
  rectangularRoomMetrics,
  rectangularRoomSegments,
  isValidRectangularRoom,
  orderedRoomCorners,
  type RectangularRoomMetrics,
  type RectangularRoomSegment,
} from './roomOutline';
export {
  DEFAULT_DIMENSION_OFFSET_MM,
  DEFAULT_OVERALL_DIMENSION_OFFSET_MM,
  MIN_DIMENSION_LENGTH_MM,
  linearLengthMm,
  dimensionLabelForLength,
  offsetDimensionGeometry,
  annotationDraftFromSegment,
  paintGeometryFromAnnotation,
  wallDimensionDrafts,
  overallRoomDimensionDrafts,
  annotationMatchesSegment,
  type DimensionDraft,
  type DimensionPaintGeometry,
} from './dimensions';
export {
  applyOrthogonalLock,
  isOrthogonalDrawingActive,
  maybeOrthogonalPoint,
} from './orthogonal';
