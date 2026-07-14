import type { PlannerFloor } from "@/features/planner/project/model/types";
import { parseWorkstationConfigKey } from "@/features/planner/project/catalog/workstationSystemV0";

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

  return {
    objects,
    walls,
    furniture,
    workstationSeats,
    floorLabel: floor.name,
    boqReady,
    validationErrors,
  };
}