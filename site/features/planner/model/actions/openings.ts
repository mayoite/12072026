import {
  OPENING_END_MARGIN_MM,
  OPENING_GAP_MM,
  openingPlacementRejectMessage,
  openingSpanFromNormalized,
  openingSpansOverlap,
  resolveOpeningRepositionOnHostWall,
} from "@/features/planner/lib/geometry/openingPlacement";
import type {
  PlannerDoor,
  PlannerPoint,
  PlannerProject,
  PlannerWindow,
} from "../types";
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
  const span = openingSpanFromNormalized(wallLength, position, width);
  if (span.start < OPENING_END_MARGIN_MM || span.end > wallLength - OPENING_END_MARGIN_MM) {
    throw new Error("Opening must fit fully within its host wall.");
  }
  const existing = [
    ...floor.doors
      .filter((item) => item.wallId === wallId)
      .map((item) => openingSpanFromNormalized(wallLength, item.position, item.width)),
    ...floor.windows
      .filter((item) => item.wallId === wallId)
      .map((item) => openingSpanFromNormalized(wallLength, item.position, item.width)),
  ];
  const overlaps = existing.some((item) => openingSpansOverlap(span, item, OPENING_GAP_MM));
  if (overlaps) throw new Error("Opening overlaps another opening on this wall.");
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

export function updatePlannerOpening(
  project: PlannerProject,
  collection: "doors" | "windows",
  id: string,
  updates: Record<string, unknown>,
  now?: string,
): PlannerProject {
  const floor = activeFloorOrThrow(project);
  if (collection === "doors") {
    const current = floor.doors.find((item) => item.id === id);
    if (!current) throw new Error(`Door "${id}" does not exist.`);
    const candidate: PlannerDoor = { ...current, ...(updates as Partial<PlannerDoor>) };
    const withoutCurrent: PlannerProject = {
      ...project,
      floors: project.floors.map((item) =>
        item.id === floor.id
          ? { ...item, doors: item.doors.filter((door) => door.id !== id) }
          : item,
      ),
    };
    assertOpening(withoutCurrent, candidate.wallId, candidate.position, candidate.width);
  } else {
    const current = floor.windows.find((item) => item.id === id);
    if (!current) throw new Error(`Window "${id}" does not exist.`);
    const candidate: PlannerWindow = { ...current, ...(updates as Partial<PlannerWindow>) };
    const withoutCurrent: PlannerProject = {
      ...project,
      floors: project.floors.map((item) =>
        item.id === floor.id
          ? { ...item, windows: item.windows.filter((window) => window.id !== id) }
          : item,
      ),
    };
    assertOpening(withoutCurrent, candidate.wallId, candidate.position, candidate.width);
  }
  return applyPlannerProjectAction(
    project,
    { type: "update", collection, id, updates },
    now,
  );
}

/**
 * Drag/reposition an opening along its current host wall from a world-space point.
 * Applies end-margin and same-wall overlap guards (self excluded).
 */
export function repositionPlannerOpening(
  project: PlannerProject,
  collection: "doors" | "windows",
  id: string,
  point: PlannerPoint,
  now?: string,
): PlannerProject {
  const floor = activeFloorOrThrow(project);
  const current =
    collection === "doors"
      ? floor.doors.find((item) => item.id === id)
      : floor.windows.find((item) => item.id === id);
  if (!current) {
    throw new Error(
      collection === "doors"
        ? `Door "${id}" does not exist.`
        : `Window "${id}" does not exist.`,
    );
  }
  const wall = floor.walls.find((item) => item.id === current.wallId);
  if (!wall) {
    throw new Error(`Opening wall "${current.wallId}" does not exist.`);
  }

  const resolved = resolveOpeningRepositionOnHostWall(
    point,
    wall,
    current.width,
    floor.doors,
    floor.windows,
    { excludeId: id },
  );
  if ("rejected" in resolved) {
    throw new Error(openingPlacementRejectMessage(resolved.reason));
  }

  return updatePlannerOpening(
    project,
    collection,
    id,
    { position: resolved.position },
    now,
  );
}
