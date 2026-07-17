import type {
  PlannerEntityCollection,
  PlannerEntityMap,
} from "@/features/planner/model/actions/projectActions";
import type { PlannerFloor, PlannerProject } from "@/features/planner/model/types";
import type { SelectedEntity } from "./PropertiesPanel";
import type { CanvasSelection } from "./useWorkspaceCanvas";

const SELECTABLE_TYPES = new Set<CanvasSelection["type"]>([
  "wall",
  "door",
  "window",
  "furniture",
  "room",
]);

const COLLECTION_BY_SELECTION: Partial<Record<CanvasSelection["type"], PlannerEntityCollection>> = {
  wall: "walls",
  door: "doors",
  window: "windows",
  furniture: "furniture",
  room: "rooms",
};

export function resolveSelectedEntity(
  selection: CanvasSelection,
  floor: PlannerFloor,
): SelectedEntity | null {
  if (!SELECTABLE_TYPES.has(selection.type) || selection.ids.length === 0) {
    return null;
  }

  const collection = COLLECTION_BY_SELECTION[selection.type];
  if (!collection) {
    return null;
  }

  const entityId = selection.ids[0];
  const items = floor[collection] as Array<PlannerEntityMap[typeof collection] & { id: string }>;
  const entity = items.find((item) => item.id === entityId);
  if (!entity) {
    return null;
  }

  return { collection, id: entityId, entity };
}

function mapEntityCollection(
  floor: PlannerFloor,
  collection: PlannerEntityCollection,
  mapper: (items: Array<{ id: string }>) => Array<{ id: string }>,
): PlannerFloor {
  const items = floor[collection] as Array<{ id: string }>;
  return {
    ...floor,
    [collection]: mapper(items) as (typeof floor)[typeof collection],
  };
}

export function updateEntityInProject(
  project: PlannerProject,
  collection: PlannerEntityCollection,
  id: string,
  updates: Record<string, unknown>,
): PlannerProject {
  const floorIndex = project.floors.findIndex((floor) => floor.id === project.activeFloorId);
  if (floorIndex === -1) return project;

  const floor = project.floors[floorIndex];
  const target = (floor[collection] as Array<{ id: string; locked?: boolean }>).find((i) => i.id === id);
  if (target && target.locked) return project; // locked reject through helpers (task7; every surface: props, canvas, direct)
  const updatedFloor = mapEntityCollection(floor, collection, (items) =>
    items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
  );

  const floors = [...project.floors];
  floors[floorIndex] = updatedFloor;
  return { ...project, floors };
}

export function deleteEntityFromProject(
  project: PlannerProject,
  collection: PlannerEntityCollection,
  id: string,
): PlannerProject {
  const floorIndex = project.floors.findIndex((floor) => floor.id === project.activeFloorId);
  if (floorIndex === -1) return project;

  const floor = project.floors[floorIndex];
  const target = (floor[collection] as Array<{ id: string; locked?: boolean }>).find((i) => i.id === id);
  if (target && target.locked) return project; // locked reject
  let updatedFloor = mapEntityCollection(floor, collection, (items) =>
    items.filter((item) => item.id !== id),
  );
  if (collection === "walls") {
    updatedFloor = {
      ...updatedFloor,
      doors: updatedFloor.doors.filter((d) => d.wallId !== id),
      windows: updatedFloor.windows.filter((w) => w.wallId !== id),
    };
  }

  const floors = [...project.floors];
  floors[floorIndex] = updatedFloor;
  return { ...project, floors };
}

/**
 * Selection to apply after batch furniture place (e.g. Place N seats).
 *
 * **Contract (W3):** product path is single-furniture select. `applySelectionDelete`
 * removes **every** id in `selection.ids` in one revision — so multi-select after
 * batch place would Delete-wipe the whole batch. Keep only the last placed id.
 *
 * Empty / missing ids → `{ type: "none", ids: [] }`.
 */
export function selectionAfterBatchPlace(
  placedIds: readonly string[],
): CanvasSelection {
  if (placedIds.length === 0) {
    return { type: "none", ids: [] };
  }
  const lastId = placedIds[placedIds.length - 1];
  if (typeof lastId !== "string" || lastId.length === 0) {
    return { type: "none", ids: [] };
  }
  return { type: "furniture", ids: [lastId] };
}

/**
 * Remove all selected entities in **one** project revision (single history step).
 * Locked entities stay. Returns the same project reference when membership is unchanged.
 */
export function applySelectionDelete(
  project: PlannerProject,
  selection: CanvasSelection,
): PlannerProject {
  if (selection.type === "none" || selection.ids.length === 0) {
    return project;
  }
  const collection = COLLECTION_BY_SELECTION[selection.type];
  if (!collection) {
    return project;
  }

  const floorIndex = project.floors.findIndex((floor) => floor.id === project.activeFloorId);
  if (floorIndex === -1) {
    return project;
  }

  const floor = project.floors[floorIndex];
  const idSet = new Set(selection.ids);
  const items = floor[collection] as Array<{ id: string; locked?: boolean }>;
  const nextItems = items.filter((item) => {
    if (!idSet.has(item.id)) return true;
    if (item.locked) return true;
    return false;
  });

  if (nextItems.length === items.length) {
    return project;
  }

  // Walls removed: also drop doors/windows on those walls (same as pureActions.removeWall).
  const removedWallIds =
    collection === "walls"
      ? items
          .filter((item) => idSet.has(item.id) && !item.locked)
          .map((item) => item.id)
      : [];
  const removedWallSet = new Set(removedWallIds);

  const updatedFloor: PlannerFloor = {
    ...floor,
    [collection]: nextItems as (typeof floor)[typeof collection],
    ...(removedWallSet.size > 0
      ? {
          doors: floor.doors.filter((d) => !removedWallSet.has(d.wallId)),
          windows: floor.windows.filter((w) => !removedWallSet.has(w.wallId)),
        }
      : {}),
  };
  const floors = [...project.floors];
  floors[floorIndex] = updatedFloor;
  return { ...project, floors };
}
