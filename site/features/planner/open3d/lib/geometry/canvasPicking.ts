import type { Open3dPoint, Open3dWall } from "../../model/types";

function distancePointToSegment(point: Open3dPoint, start: Open3dPoint, end: Open3dPoint): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }
  let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));
  const projected = { x: start.x + t * dx, y: start.y + t * dy };
  return Math.hypot(point.x - projected.x, point.y - projected.y);
}

function parameterOnSegment(point: Open3dPoint, start: Open3dPoint, end: Open3dPoint): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return 0;
  const t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;
  return Math.max(0, Math.min(1, t));
}

export interface WallPickResult {
  wallId: string;
  /** Normalized position along the wall segment (0–1). */
  t: number;
}

/** Pick the nearest wall within tolerance (millimetres). */
export function pickWallAtPoint(
  point: Open3dPoint,
  walls: Open3dWall[],
  toleranceMm: number,
): string | null {
  return pickWallWithPosition(point, walls, toleranceMm)?.wallId ?? null;
}

/** Pick wall and normalized click position for door/window placement. */
export function pickWallWithPosition(
  point: Open3dPoint,
  walls: Open3dWall[],
  toleranceMm: number,
): WallPickResult | null {
  let best: { wallId: string; distance: number; t: number } | null = null;
  for (const wall of walls) {
    const distance = distancePointToSegment(point, wall.start, wall.end);
    if (distance <= toleranceMm) {
      const t = parameterOnSegment(point, wall.start, wall.end);
      if (!best || distance < best.distance) {
        best = { wallId: wall.id, distance, t };
      }
    }
  }
  return best ? { wallId: best.wallId, t: best.t } : null;
}

/**
 * Build a room polygon from ordered wall starts. Returns [] when fewer than 3
 * vertices resolve (degenerate / incomplete rooms).
 */
export function getRoomPolygon(
  roomWallIds: string[],
  wallById: Map<string, { start: Open3dPoint; end: Open3dPoint }>,
): Open3dPoint[] {
  const polygon = roomWallIds
    .map((wallId) => wallById.get(wallId)?.start)
    .filter((point): point is Open3dPoint => point !== undefined);
  return polygon.length >= 3 ? polygon : [];
}

/** Ray-cast point-in-polygon test (even-odd). Polygons with fewer than 3 verts are outside. */
export function pointInPolygon(point: Open3dPoint, polygon: Open3dPoint[]): boolean {
  if (polygon.length < 3) return false;
  let inside = false;
  for (
    let index = 0, previousIndex = polygon.length - 1;
    index < polygon.length;
    previousIndex = index++
  ) {
    const currentPoint = polygon[index];
    const previousPoint = polygon[previousIndex];
    const intersects =
      (currentPoint.y > point.y) !== (previousPoint.y > point.y)
      && point.x
        < ((previousPoint.x - currentPoint.x) * (point.y - currentPoint.y))
          / (previousPoint.y - currentPoint.y)
          + currentPoint.x;
    if (intersects) inside = !inside;
  }
  return inside;
}
