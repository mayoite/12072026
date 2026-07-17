import type { PlannerPoint, PlannerWall } from "./types";

/**
 * Product join epsilon for wall centreline endpoints (mm).
 * Endpoints within this distance share a join in the document graph.
 * Must stay aligned with `buildWallGraph` merge tolerance.
 */
export const WALL_JOIN_EPSILON_MM = 1;

/** Default full wall width perpendicular to the centreline (mm). */
export const DEFAULT_WALL_THICKNESS_MM = 150;

/** Default wall height (mm). */
export const DEFAULT_WALL_HEIGHT_MM = 2700;

export function distanceMm(a: PlannerPoint, b: PlannerPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function pointsEqualWithin(
  a: PlannerPoint,
  b: PlannerPoint,
  epsilonMm = WALL_JOIN_EPSILON_MM,
): boolean {
  return distanceMm(a, b) <= epsilonMm;
}

/**
 * Snap `point` to the nearest existing wall centreline endpoint when within epsilon.
 * Returns a copy of the existing endpoint so joins share exact coordinates.
 */
export function snapToNearestWallEndpoint(
  point: PlannerPoint,
  walls: readonly PlannerWall[],
  epsilonMm = WALL_JOIN_EPSILON_MM,
): PlannerPoint {
  let best: PlannerPoint | null = null;
  let bestDistance = epsilonMm;
  for (const wall of walls) {
    for (const endpoint of [wall.start, wall.end]) {
      const distance = distanceMm(point, endpoint);
      if (distance <= bestDistance) {
        bestDistance = distance;
        best = endpoint;
      }
    }
  }
  return best ? { x: best.x, y: best.y } : { x: point.x, y: point.y };
}

/**
 * Coalesce new segment endpoints onto existing wall endpoints and rewrite
 * nearby existing endpoints to the shared join coordinates.
 */
export function joinWallSegmentToFloor(
  walls: readonly PlannerWall[],
  start: PlannerPoint,
  end: PlannerPoint,
  epsilonMm = WALL_JOIN_EPSILON_MM,
): { start: PlannerPoint; end: PlannerPoint; walls: PlannerWall[] } {
  const joinedStart = snapToNearestWallEndpoint(start, walls, epsilonMm);
  const joinedEnd = snapToNearestWallEndpoint(end, walls, epsilonMm);
  const anchors = [joinedStart, joinedEnd];

  const nextWalls = walls.map((wall) => ({
    ...wall,
    start: snapPointToAnchors(wall.start, anchors, epsilonMm),
    end: snapPointToAnchors(wall.end, anchors, epsilonMm),
  }));

  return { start: joinedStart, end: joinedEnd, walls: nextWalls };
}

function snapPointToAnchors(
  point: PlannerPoint,
  anchors: readonly PlannerPoint[],
  epsilonMm: number,
): PlannerPoint {
  let best = point;
  let bestDistance = epsilonMm;
  for (const anchor of anchors) {
    const distance = distanceMm(point, anchor);
    if (distance <= bestDistance) {
      bestDistance = distance;
      best = { x: anchor.x, y: anchor.y };
    }
  }
  return best === point ? { x: point.x, y: point.y } : best;
}
