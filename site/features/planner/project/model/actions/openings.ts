import type { PlannerDoor, PlannerProject, PlannerWindow } from "../types";
import type { PlannerIdFactory } from "../project";
import { applyPlannerProjectAction, activeFloorOrThrow } from "./projectActions";

function assertOpening(project: PlannerProject, wallId: string, position: number, width: number): void {
  const floor = activeFloorOrThrow(project);
  const wall = floor.walls.find((item) => item.id === wallId);
  if (!wall) throw new Error(`Opening wall "${wallId}" does not exist.`);
  if (position < 0 || position > 1) throw new Error("Opening position must be between 0 and 1.");
  if (!Number.isFinite(width) || width <= 0) throw new Error("Opening width must be positive.");
  const wallLength = Math.hypot(wall.end.x - wall.start.x, wall.end.y - wall.start.y);
  if (width >= wallLength) throw new Error("Opening width must be shorter than its wall.");
}

export function addPlannerDoor(
  project: PlannerProject,
  door: Omit<PlannerDoor, "id">,
  idFactory: PlannerIdFactory,
  now?: string,
): PlannerProject {
  assertOpening(project, door.wallId, door.position, door.width);
  return applyPlannerProjectAction(
    project,
    { type: "add", collection: "doors", entity: { ...door, id: idFactory() } },
    now,
  );
}

export function addPlannerWindow(
  project: PlannerProject,
  window: Omit<PlannerWindow, "id">,
  idFactory: PlannerIdFactory,
  now?: string,
): PlannerProject {
  assertOpening(project, window.wallId, window.position, window.width);
  return applyPlannerProjectAction(
    project,
    { type: "add", collection: "windows", entity: { ...window, id: idFactory() } },
    now,
  );
}
