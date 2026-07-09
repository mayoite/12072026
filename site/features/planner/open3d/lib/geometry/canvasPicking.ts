import type {
  Open3dDoor,
  Open3dFurnitureItem,
  Open3dPoint,
  Open3dWall,
  Open3dWindow,
} from "../../model/types";

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

export type OpeningPickResult = {
  type: "door" | "window";
  id: string;
};

/**
 * Pick door/window by proximity to its position on the parent wall.
 * Prefer nearest within tolerance (millimetres).
 */
export function pickOpeningAtPoint(
  point: Open3dPoint,
  doors: readonly Open3dDoor[],
  windows: readonly Open3dWindow[],
  walls: readonly Open3dWall[],
  toleranceMm: number,
): OpeningPickResult | null {
  const wallById = new Map(walls.map((wall) => [wall.id, wall]));
  let best: { pick: OpeningPickResult; distance: number } | null = null;

  const consider = (
    type: "door" | "window",
    id: string,
    wallId: string,
    position: number,
  ) => {
    const wall = wallById.get(wallId);
    if (!wall) return;
    const at = {
      x: wall.start.x + (wall.end.x - wall.start.x) * position,
      y: wall.start.y + (wall.end.y - wall.start.y) * position,
    };
    const distance = Math.hypot(point.x - at.x, point.y - at.y);
    if (distance > toleranceMm) return;
    if (!best || distance < best.distance) {
      best = { pick: { type, id }, distance };
    }
  };

  // Windows often drawn after doors — still pick nearest by distance.
  for (const door of doors) {
    consider("door", door.id, door.wallId, door.position);
  }
  for (const win of windows) {
    consider("window", win.id, win.wallId, win.position);
  }

  return best?.pick ?? null;
}

/**
 * Pick furniture whose axis-aligned footprint (after inverse rotation) contains the point.
 * Hits top-most item first (last in array = drawn last).
 */
export function pickFurnitureAtPoint(
  point: Open3dPoint,
  furniture: readonly Open3dFurnitureItem[],
  paddingMm = 0,
): string | null {
  for (let index = furniture.length - 1; index >= 0; index -= 1) {
    const item = furniture[index];
    const halfW = Math.max(1, (item.width ?? 600) / 2) + paddingMm;
    const halfD = Math.max(1, (item.depth ?? 600) / 2) + paddingMm;
    const dx = point.x - item.position.x;
    const dy = point.y - item.position.y;
    const rad = (-(item.rotation || 0) * Math.PI) / 180;
    const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
    const localY = dx * Math.sin(rad) + dy * Math.cos(rad);
    if (Math.abs(localX) <= halfW && Math.abs(localY) <= halfD) {
      return item.id;
    }
  }
  return null;
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
