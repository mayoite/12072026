/**
 * Wall–furniture intersection — furniture OBB vs wall thickness slab (OBB).
 * Solid wall body only (centreline ± thickness/2). Opening free space is
 * handled by opening-obstruction clearance, not this rule.
 */
import type { PlannerWall } from "@/features/planner/model/types";
import { aabbsOverlap } from "./furnitureOverlap";
import type { PlacedFurniture, ValidationIssue } from "./types";

/** Represent a wall centreline segment as an OBB for SAT against furniture. */
export function wallAsPlacedFurniture(wall: PlannerWall): PlacedFurniture | null {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const length = Math.hypot(dx, dy);
  if (length < 1e-6 || wall.thickness <= 0) return null;
  return {
    id: wall.id,
    xMm: (wall.start.x + wall.end.x) / 2,
    yMm: (wall.start.y + wall.end.y) / 2,
    widthMm: length,
    depthMm: wall.thickness,
    rotationDeg: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
}

/**
 * Returns wall-collision errors when furniture footprints intersect wall mass.
 */
export function detectFurnitureWallCollisions(
  furniture: readonly PlacedFurniture[],
  walls: readonly PlannerWall[],
): ValidationIssue[] {
  if (furniture.length === 0 || walls.length === 0) return [];

  const orderedFurniture = [...furniture].sort((a, b) =>
    a.id === b.id ? 0 : a.id < b.id ? -1 : 1,
  );
  const orderedWalls = [...walls].sort((a, b) =>
    a.id === b.id ? 0 : a.id < b.id ? -1 : 1,
  );

  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const item of orderedFurniture) {
    for (const wall of orderedWalls) {
      const wallObb = wallAsPlacedFurniture(wall);
      if (!wallObb) continue;
      if (!aabbsOverlap(item, wallObb)) continue;

      const key = `${item.id}\u0000${wall.id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      issues.push({
        id: `wall-collision:${item.id}:${wall.id}`,
        ruleId: "wall-collision",
        severity: "error",
        objectIds: [item.id, wall.id],
        message: `Furniture "${item.id}" intersects wall "${wall.id}".`,
        remedy: `Move "${item.id}" clear of wall "${wall.id}".`,
        focusMm: { x: item.xMm, y: item.yMm },
      });
    }
  }

  return issues;
}
