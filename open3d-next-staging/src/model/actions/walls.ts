import type { Open3dPoint, Open3dProject, Open3dWall } from "../types";
import type { Open3dIdFactory } from "../project";

export interface AddOpen3dWallInput {
  start: Open3dPoint;
  end: Open3dPoint;
  height?: number;
  thickness?: number;
  color?: string;
}

export function addOpen3dWall(
  project: Open3dProject,
  input: AddOpen3dWallInput,
  idFactory: Open3dIdFactory,
  now = new Date().toISOString(),
): Open3dProject {
  const floorIndex = project.floors.findIndex(
    (floor) => floor.id === project.activeFloorId,
  );
  if (floorIndex < 0) {
    throw new Error("Open3D project has no active floor.");
  }

  const wall: Open3dWall = {
    id: idFactory(),
    start: { ...input.start },
    end: { ...input.end },
    height: input.height ?? 2700,
    thickness: input.thickness ?? 150,
    color: input.color ?? "#e2e8f0",
  };
  const floors = project.floors.map((floor, index) =>
    index === floorIndex ? { ...floor, walls: [...floor.walls, wall] } : floor,
  );

  return { ...project, floors, updatedAt: now };
}
