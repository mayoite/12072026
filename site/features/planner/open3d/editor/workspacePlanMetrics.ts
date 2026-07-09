import type { Open3dFloor } from "../model/types";
import { parseWorkstationConfigKey } from "../catalog/workstationSystemV0";

export type WorkspacePlanMetrics = {
  objects: number;
  walls: number;
  furniture: number;
  /** Systems v0 seats (1 per ws-v0 furniture instance on this floor). */
  workstationSeats: number;
  floorLabel: string;
};

function countWorkstationSeats(floor: Open3dFloor): number {
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
  floor: Open3dFloor | undefined,
): WorkspacePlanMetrics {
  if (!floor) {
    return {
      objects: 0,
      walls: 0,
      furniture: 0,
      workstationSeats: 0,
      floorLabel: "Floor 1",
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

  return {
    objects,
    walls,
    furniture,
    workstationSeats,
    floorLabel: floor.name,
  };
}