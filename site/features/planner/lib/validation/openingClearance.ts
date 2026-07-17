/**
 * Opening clearance — furniture must not block door/window free space.
 * Zone: OBB centred on the opening, width = opening width along the wall,
 * depth = clearance on both sides of the wall centreline (perpendicular).
 */
import type {
  PlannerDoor,
  PlannerWall,
  PlannerWindow,
} from "@/features/planner/model/types";
import { aabbsOverlap } from "./furnitureOverlap";
import type { PlacedFurniture, ValidationIssue } from "./types";

/** Default free depth in front of each wall face at an opening (mm). */
export const DEFAULT_OPENING_CLEARANCE_MM = 900;

export type OpeningLike = {
  id: string;
  wallId: string;
  /** Normalized centre along host wall (0–1). */
  position: number;
  width: number;
  kind: "door" | "window";
};

function wallLengthMm(wall: Pick<PlannerWall, "start" | "end">): number {
  return Math.hypot(wall.end.x - wall.start.x, wall.end.y - wall.start.y);
}

/**
 * Build the clearance OBB for one opening on its host wall.
 * Depth = wall thickness + 2×clearance so each face has full free depth.
 */
export function openingClearanceAsPlaced(
  opening: OpeningLike,
  wall: PlannerWall,
  clearanceMm: number = DEFAULT_OPENING_CLEARANCE_MM,
): PlacedFurniture | null {
  if (clearanceMm <= 0 || opening.width <= 0) return null;
  const length = wallLengthMm(wall);
  if (length < 1e-6) return null;
  if (opening.position < 0 || opening.position > 1) return null;

  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const cx = wall.start.x + dx * opening.position;
  const cy = wall.start.y + dy * opening.position;

  return {
    id: opening.id,
    xMm: cx,
    yMm: cy,
    widthMm: opening.width,
    depthMm: wall.thickness + 2 * clearanceMm,
    rotationDeg: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
}

export function collectFloorOpenings(
  doors: readonly PlannerDoor[],
  windows: readonly PlannerWindow[],
): OpeningLike[] {
  const list: OpeningLike[] = [
    ...doors.map((door) => ({
      id: door.id,
      wallId: door.wallId,
      position: door.position,
      width: door.width,
      kind: "door" as const,
    })),
    ...windows.map((window) => ({
      id: window.id,
      wallId: window.wallId,
      position: window.position,
      width: window.width,
      kind: "window" as const,
    })),
  ];
  return list.sort((a, b) => (a.id === b.id ? 0 : a.id < b.id ? -1 : 1));
}

/**
 * Returns opening-obstruction warnings when furniture intersects an opening
 * clearance zone.
 */
export function detectOpeningClearanceConflicts(
  furniture: readonly PlacedFurniture[],
  walls: readonly PlannerWall[],
  doors: readonly PlannerDoor[],
  windows: readonly PlannerWindow[],
  clearanceMm: number = DEFAULT_OPENING_CLEARANCE_MM,
): ValidationIssue[] {
  if (furniture.length === 0) return [];
  const openings = collectFloorOpenings(doors, windows);
  if (openings.length === 0) return [];

  const wallById = new Map(walls.map((wall) => [wall.id, wall]));
  const orderedFurniture = [...furniture].sort((a, b) =>
    a.id === b.id ? 0 : a.id < b.id ? -1 : 1,
  );

  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const opening of openings) {
    const wall = wallById.get(opening.wallId);
    if (!wall) continue;
    const zone = openingClearanceAsPlaced(opening, wall, clearanceMm);
    if (!zone) continue;

    for (const item of orderedFurniture) {
      if (!aabbsOverlap(item, zone)) continue;

      const key = `${item.id}\u0000${opening.id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const kindLabel = opening.kind;
      issues.push({
        id: `opening-obstruction:${item.id}:${opening.id}`,
        ruleId: "opening-obstruction",
        severity: "warning",
        objectIds: [item.id, opening.id],
        message: `Furniture "${item.id}" blocks ${kindLabel} "${opening.id}" clearance.`,
        remedy: `Move "${item.id}" clear of ${kindLabel} "${opening.id}" (min ${clearanceMm} mm free depth).`,
        focusMm: { x: zone.xMm, y: zone.yMm },
      });
    }
  }

  return issues;
}
