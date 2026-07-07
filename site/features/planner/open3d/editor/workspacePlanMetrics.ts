import type { Open3dFloor } from "../model/types";

export type WorkspacePlanMetrics = {
  objects: number;
  walls: number;
  furniture: number;
  floorLabel: string;
};

export function summarizeFloorMetrics(
  floor: Open3dFloor | undefined,
): WorkspacePlanMetrics {
  if (!floor) {
    return { objects: 0, walls: 0, furniture: 0, floorLabel: "Floor 1" };
  }

  const walls = floor.walls.length;
  const furniture = floor.furniture.length;
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
    floorLabel: floor.name,
  };
}