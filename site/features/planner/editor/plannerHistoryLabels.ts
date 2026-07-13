import type { PlannerHistoryState } from "@/features/planner/project/store/history";
import type { PlannerFloor, PlannerProject } from "@/features/planner/project/model/types";

const ENTITY_LABELS: Record<string, string> = {
  furniture: "furniture",
  walls: "wall",
  doors: "door",
  windows: "window",
  rooms: "room",
};

function activeFloor(project: PlannerProject): PlannerFloor | undefined {
  return (
    project.floors.find((floor) => floor.id === project.activeFloorId) ??
    project.floors[0]
  );
}

function furnitureWidthLabel(widthMm: number): string {
  return `Change furniture width to ${widthMm} mm`;
}

function describeFloorDelta(before: PlannerFloor, after: PlannerFloor): string | undefined {
  if (after.furniture.length > before.furniture.length) {
    return "Place furniture";
  }
  if (after.furniture.length < before.furniture.length) {
    return "Delete furniture";
  }
  if (after.walls.length > before.walls.length) {
    return "Add wall";
  }
  if (after.walls.length < before.walls.length) {
    return "Delete wall";
  }
  if (after.doors.length > before.doors.length) {
    return "Add door";
  }
  if (after.doors.length < before.doors.length) {
    return "Delete door";
  }
  if (after.windows.length > before.windows.length) {
    return "Add window";
  }
  if (after.windows.length < before.windows.length) {
    return "Delete window";
  }

  for (const next of after.furniture) {
    const prev = before.furniture.find((item) => item.id === next.id);
    if (!prev) continue;
    if (prev.width !== next.width && typeof next.width === "number") {
      return furnitureWidthLabel(next.width);
    }
    if (prev.depth !== next.depth && typeof next.depth === "number") {
      return `Change furniture depth to ${next.depth} mm`;
    }
    if (prev.rotation !== next.rotation) {
      return `Rotate furniture to ${next.rotation}°`;
    }
    if (
      prev.position.x !== next.position.x ||
      prev.position.y !== next.position.y
    ) {
      return "Move furniture";
    }
    if (prev.locked !== next.locked) {
      return next.locked ? "Lock furniture" : "Unlock furniture";
    }
  }

  for (const next of after.walls) {
    const prev = before.walls.find((item) => item.id === next.id);
    if (!prev) continue;
    if (prev.thickness !== next.thickness) {
      return `Change wall thickness to ${next.thickness} mm`;
    }
    if (
      prev.start.x !== next.start.x ||
      prev.start.y !== next.start.y ||
      prev.end.x !== next.end.x ||
      prev.end.y !== next.end.y
    ) {
      return "Edit wall";
    }
  }

  for (const next of after.doors) {
    const prev = before.doors.find((item) => item.id === next.id);
    if (!prev) continue;
    if (prev.width !== next.width) {
      return `Change door width to ${next.width} mm`;
    }
  }

  for (const next of after.windows) {
    const prev = before.windows.find((item) => item.id === next.id);
    if (!prev) continue;
    if (prev.width !== next.width) {
      return `Change window width to ${next.width} mm`;
    }
  }

  return undefined;
}

/**
 * Human-readable label for the document change that undo would revert.
 * Compares the latest history snapshot to the current document.
 */
export function describePlannerUndoLabel(
  history: PlannerHistoryState,
): string | undefined {
  const previous = history.past.at(-1);
  if (!previous) return undefined;

  const floorBefore = activeFloor(previous);
  const floorAfter = activeFloor(history.present);
  if (!floorBefore || !floorAfter) return "Edit plan";

  return describeFloorDelta(floorBefore, floorAfter) ?? "Edit selection";
}

/** Label for the change redo would re-apply (present → future[0]). */
export function describePlannerRedoLabel(
  history: PlannerHistoryState,
): string | undefined {
  const next = history.future[0];
  if (!next) return undefined;

  const floorBefore = activeFloor(history.present);
  const floorAfter = activeFloor(next);
  if (!floorBefore || !floorAfter) return "Edit plan";

  return describeFloorDelta(floorBefore, floorAfter) ?? "Edit selection";
}

export function entityCollectionLabel(collection: string, count: number): string {
  const base = ENTITY_LABELS[collection] ?? collection;
  if (count === 1) return base;
  if (collection === "furniture") return "furniture";
  if (collection === "walls") return "walls";
  return `${base}s`;
}