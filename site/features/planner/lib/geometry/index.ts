export type { Point2D, Segment, Polygon, BoundingBox } from './types';
export { segmentIntersection, segmentsIntersect, polygonContainsPoint } from './intersections';
export { polygonArea, polygonPerimeter, polygonCentroid, boundingBox } from './polygon';
export { snapToGrid, snapToNearestEndpoint, snapToSegment } from './snap';
export { layoutGridPositions, type GridLayoutCell, type GridLayoutOptions } from './gridLayout';
export type { WallNode, WallEdge, WallGraph } from './wallGraph';
export { buildWallGraph, findEnclosedRooms, findJunctions } from './wallGraph';
