/**
 * Pure rectangular room outline geometry (plan millimetres).
 * Used by exact-room creation and canvas room fill.
 */

import type { PlannerPoint, PlannerWall } from "@/features/planner/model/types";
import { pointsEqualWithin, WALL_JOIN_EPSILON_MM } from "@/features/planner/model/wallContract";

export interface RectangularRoomMetrics {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  widthMm: number;
  depthMm: number;
  areaMm2: number;
  /** CCW corners: SW, SE, NE, NW when Y grows down on plan. */
  corners: [PlannerPoint, PlannerPoint, PlannerPoint, PlannerPoint];
}

export interface RectangularRoomSegment {
  start: PlannerPoint;
  end: PlannerPoint;
}

const MIN_ROOM_SIDE_MM = 1;

/** Axis-aligned rectangle metrics from two opposite corners. */
export function rectangularRoomMetrics(
  start: PlannerPoint,
  end: PlannerPoint,
): RectangularRoomMetrics {
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);
  const widthMm = maxX - minX;
  const depthMm = maxY - minY;
  return {
    minX,
    minY,
    maxX,
    maxY,
    widthMm,
    depthMm,
    areaMm2: widthMm * depthMm,
    corners: [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
    ],
  };
}

/** Four closed centreline segments for a rectangle (CCW). */
export function rectangularRoomSegments(
  start: PlannerPoint,
  end: PlannerPoint,
): RectangularRoomSegment[] {
  const { corners } = rectangularRoomMetrics(start, end);
  return corners.map((point, index) => {
    const next = corners[(index + 1) % corners.length];
    return {
      start: point,
      end: next ?? point,
    };
  });
}

export function isValidRectangularRoom(
  start: PlannerPoint,
  end: PlannerPoint,
  minSideMm = MIN_ROOM_SIDE_MM,
): boolean {
  const { widthMm, depthMm } = rectangularRoomMetrics(start, end);
  return widthMm >= minSideMm && depthMm >= minSideMm;
}

/**
 * Ordered unique vertices for a room by walking its wall ids in document order,
 * then chaining by shared endpoints when order is scrambled.
 */
export function orderedRoomCorners(
  walls: readonly PlannerWall[],
  roomWallIds: readonly string[],
  epsilonMm = WALL_JOIN_EPSILON_MM,
): PlannerPoint[] {
  if (roomWallIds.length === 0) return [];

  const byId = new Map(walls.map((wall) => [wall.id, wall] as const));
  const segments: PlannerWall[] = [];
  for (const id of roomWallIds) {
    const wall = byId.get(id);
    if (wall) segments.push(wall);
  }
  if (segments.length === 0) return [];

  // Prefer sequential order when consecutive walls share an endpoint.
  const sequential = trySequentialCorners(segments, epsilonMm);
  if (sequential.length >= 3) return sequential;

  return chainCornersByJoin(segments, epsilonMm);
}

function trySequentialCorners(
  segments: readonly PlannerWall[],
  epsilonMm: number,
): PlannerPoint[] {
  const firstSeg = segments[0];
  if (!firstSeg) return [];
  const corners: PlannerPoint[] = [{ ...firstSeg.start }];
  let cursor = firstSeg.start;
  for (const segment of segments) {
    const startMatch = pointsEqualWithin(segment.start, cursor, epsilonMm);
    const endMatch = pointsEqualWithin(segment.end, cursor, epsilonMm);
    if (startMatch) {
      corners.push({ ...segment.end });
      cursor = segment.end;
    } else if (endMatch) {
      corners.push({ ...segment.start });
      cursor = segment.start;
    } else {
      return [];
    }
  }
  // Drop closing duplicate of first point when present.
  const last = corners[corners.length - 1];
  if (
    last &&
    corners[0] !== undefined &&
    pointsEqualWithin(last, corners[0], epsilonMm) &&
    corners.length > 1
  ) {
    corners.pop();
  }
  return corners;
}

function chainCornersByJoin(
  segments: readonly PlannerWall[],
  epsilonMm: number,
): PlannerPoint[] {
  if (segments.length === 0) return [];
  const remaining = [...segments];
  const first = remaining.shift();
  if (!first) return [];
  const corners: PlannerPoint[] = [{ ...first.start }, { ...first.end }];
  let cursor = first.end;

  while (remaining.length > 0) {
    const idx = remaining.findIndex(
      (wall) =>
        pointsEqualWithin(wall.start, cursor, epsilonMm) ||
        pointsEqualWithin(wall.end, cursor, epsilonMm),
    );
    if (idx < 0) break;
    const [wall] = remaining.splice(idx, 1);
    if (!wall) break;
    if (pointsEqualWithin(wall.start, cursor, epsilonMm)) {
      corners.push({ ...wall.end });
      cursor = wall.end;
    } else {
      corners.push({ ...wall.start });
      cursor = wall.start;
    }
  }

  const last = corners[corners.length - 1];
  if (
    last &&
    corners[0] !== undefined &&
    pointsEqualWithin(last, corners[0], epsilonMm) &&
    corners.length > 1
  ) {
    corners.pop();
  }
  return corners;
}
