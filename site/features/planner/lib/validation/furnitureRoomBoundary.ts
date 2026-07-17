/**
 * Outside-room rule — furniture centre (and footprint corners) vs enclosed wall cycles.
 */
import type { PlannerFloor, PlannerPoint } from "@/features/planner/model/types";
import { pointInPolygon } from "@/features/planner/lib/geometry/canvasPicking";
import {
  buildWallGraph,
  findEnclosedRooms,
} from "@/features/planner/lib/geometry/wallGraph";
import type { PlacedFurniture, ValidationIssue } from "./types";

type Point = { x: number; y: number };

function furnitureCorners(item: PlacedFurniture): readonly Point[] {
  const radians = ((item.rotationDeg ?? 0) * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const halfWidth = item.widthMm / 2;
  const halfDepth = item.depthMm / 2;
  const locals: readonly Point[] = [
    { x: -halfWidth, y: -halfDepth },
    { x: halfWidth, y: -halfDepth },
    { x: halfWidth, y: halfDepth },
    { x: -halfWidth, y: halfDepth },
  ];
  return locals.map((local) => ({
    x: item.xMm + local.x * cos - local.y * sin,
    y: item.yMm + local.x * sin + local.y * cos,
  }));
}

function pointInsideAnyRoom(
  point: PlannerPoint,
  rooms: readonly PlannerPoint[][],
): boolean {
  for (const polygon of rooms) {
    if (polygon.length >= 3 && pointInPolygon(point, polygon)) {
      return true;
    }
  }
  return false;
}

/**
 * Build closed centreline polygons for every enclosed wall cycle on the floor.
 * Returns [] when no closed room exists (open wall chains skip this rule).
 */
export function floorRoomPolygons(floor: PlannerFloor): PlannerPoint[][] {
  if (floor.walls.length < 3) return [];
  const graph = buildWallGraph(
    floor.walls.map((wall) => ({
      id: wall.id,
      start: wall.start,
      end: wall.end,
    })),
  );
  const cycles = findEnclosedRooms(graph);
  return cycles
    .filter((cycle) => cycle.vertices.length >= 3 && cycle.areaMm2 > 0)
    .map((cycle) => cycle.vertices.map((v) => ({ x: v.x, y: v.y })));
}

/**
 * Returns validation issues for furniture outside (or partially outside) rooms.
 * - Centre outside any room → error
 * - Centre inside but a corner outside → warning (partial overhang)
 * Skips entirely when the floor has no enclosed room.
 */
export function detectFurnitureOutsideRoom(
  furniture: readonly PlacedFurniture[],
  roomPolygons: readonly PlannerPoint[][],
): ValidationIssue[] {
  if (roomPolygons.length === 0 || furniture.length === 0) return [];

  const issues: ValidationIssue[] = [];
  const ordered = [...furniture].sort((a, b) =>
    a.id === b.id ? 0 : a.id < b.id ? -1 : 1,
  );

  for (const item of ordered) {
    const centre: PlannerPoint = { x: item.xMm, y: item.yMm };
    const centreInside = pointInsideAnyRoom(centre, roomPolygons);

    if (!centreInside) {
      issues.push({
        id: `room-boundary:${item.id}`,
        ruleId: "room-boundary",
        severity: "error",
        objectIds: [item.id],
        message: `Furniture "${item.id}" is outside the room.`,
        remedy: `Move "${item.id}" inside the enclosed room walls.`,
        focusMm: { x: item.xMm, y: item.yMm },
      });
      continue;
    }

    const corners = furnitureCorners(item);
    const overhang = corners.some(
      (corner) => !pointInsideAnyRoom(corner, roomPolygons),
    );
    if (overhang) {
      issues.push({
        id: `room-boundary-overhang:${item.id}`,
        ruleId: "room-boundary",
        severity: "warning",
        objectIds: [item.id],
        message: `Furniture "${item.id}" overhangs the room boundary.`,
        remedy: `Shift "${item.id}" fully inside the room walls.`,
        focusMm: { x: item.xMm, y: item.yMm },
      });
    }
  }

  return issues;
}
