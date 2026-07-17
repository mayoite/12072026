import type { PlannerFloor } from "@/features/planner/model/types";
import { parseWorkstationConfigKey } from "@/features/planner/catalog/workstationSystemV0";
import {
  buildWallGraph,
  findEnclosedRooms,
} from "@/features/planner/lib/geometry/wallGraph";

export type WorkspacePlanMetrics = {
  objects: number;
  walls: number;
  furniture: number;
  /** Systems v0 seats (1 per ws-v0 furniture instance on this floor). */
  workstationSeats: number;
  floorLabel: string;
  /** True when at least one catalog-backed item is placed — BOQ can be generated. */
  boqReady: boolean;
  /** Number of hard validation errors blocking BOQ readiness. */
  validationErrors: number;
  /** True only when wall centreline geometry contains a closed polygon. */
  closedRoom: boolean;
  /** Bounding dimensions of wall endpoints on the active floor. */
  planWidthMm?: number;
  planDepthMm?: number;
};

function countWorkstationSeats(floor: PlannerFloor): number {
  let seats = 0;
  for (const item of floor.furniture) {
    if (
      parseWorkstationConfigKey(item.catalogId) ||
      parseWorkstationConfigKey(item.sourceCatalogId ?? "")
    ) {
      seats += 1;
    }
  }
  return seats;
}

export function summarizeFloorMetrics(
  floor: PlannerFloor | undefined,
  validationErrors = 0,
): WorkspacePlanMetrics {
  if (!floor) {
    return {
      objects: 0,
      walls: 0,
      furniture: 0,
      workstationSeats: 0,
      floorLabel: "Floor 1",
      boqReady: false,
      validationErrors: 0,
      closedRoom: false,
    };
  }

  const walls = floor.walls.length;
  const furniture = floor.furniture.length;
  const workstationSeats = countWorkstationSeats(floor);
  const objects =
    walls +
    floor.rooms.length +
    floor.doors.length +
    floor.windows.length +
    furniture +
    floor.stairs.length +
    floor.columns.length;

  const boqReady = furniture > 0 && validationErrors === 0;
  const closedRoom = findEnclosedRooms(buildWallGraph(floor.walls)).length > 0;
  const wallPoints = floor.walls.flatMap((wall) => [wall.start, wall.end]);
  const planWidthMm = wallPoints.length
    ? Math.max(...wallPoints.map((point) => point.x)) -
      Math.min(...wallPoints.map((point) => point.x))
    : undefined;
  const planDepthMm = wallPoints.length
    ? Math.max(...wallPoints.map((point) => point.y)) -
      Math.min(...wallPoints.map((point) => point.y))
    : undefined;

  return {
    objects,
    walls,
    furniture,
    workstationSeats,
    floorLabel: floor.name,
    boqReady,
    validationErrors,
    closedRoom,
    ...(planWidthMm !== undefined ? { planWidthMm } : {}),
    ...(planDepthMm !== undefined ? { planDepthMm } : {}),
  };
}
