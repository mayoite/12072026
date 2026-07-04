import type { Open3dDoor, Open3dProject, Open3dWindow } from "../types";
import type { Open3dIdFactory } from "../project";
import { applyOpen3dProjectAction } from "./projectActions";

function assertOpening(project: Open3dProject, wallId: string, position: number, width: number): void {
  const floor = project.floors.find((item) => item.id === project.activeFloorId);
  const wall = floor?.walls.find((item) => item.id === wallId);
  if (!wall) throw new Error(`Opening wall "${wallId}" does not exist.`);
  if (position < 0 || position > 1) throw new Error("Opening position must be between 0 and 1.");
  if (!Number.isFinite(width) || width <= 0) throw new Error("Opening width must be positive.");
  const wallLength = Math.hypot(wall.end.x - wall.start.x, wall.end.y - wall.start.y);
  if (width >= wallLength) throw new Error("Opening width must be shorter than its wall.");
}

export function addOpen3dDoor(
  project: Open3dProject,
  door: Omit<Open3dDoor, "id">,
  idFactory: Open3dIdFactory,
  now?: string,
): Open3dProject {
  assertOpening(project, door.wallId, door.position, door.width);
  return applyOpen3dProjectAction(
    project,
    { type: "add", collection: "doors", entity: { ...door, id: idFactory() } },
    now,
  );
}

export function addOpen3dWindow(
  project: Open3dProject,
  window: Omit<Open3dWindow, "id">,
  idFactory: Open3dIdFactory,
  now?: string,
): Open3dProject {
  assertOpening(project, window.wallId, window.position, window.width);
  return applyOpen3dProjectAction(
    project,
    { type: "add", collection: "windows", entity: { ...window, id: idFactory() } },
    now,
  );
}
