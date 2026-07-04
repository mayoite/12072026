import type {
  Open3dAnnotation,
  Open3dColumn,
  Open3dDoor,
  Open3dElementGroup,
  Open3dFurnitureItem,
  Open3dGuide,
  Open3dMeasurement,
  Open3dProject,
  Open3dRoom,
  Open3dStair,
  Open3dTextAnnotation,
  Open3dWall,
  Open3dWindow,
} from "../types";

export interface Open3dEntityMap {
  walls: Open3dWall;
  rooms: Open3dRoom;
  doors: Open3dDoor;
  windows: Open3dWindow;
  furniture: Open3dFurnitureItem;
  stairs: Open3dStair;
  columns: Open3dColumn;
  guides: Open3dGuide;
  measurements: Open3dMeasurement;
  annotations: Open3dAnnotation;
  textAnnotations: Open3dTextAnnotation;
  groups: Open3dElementGroup;
}

export type Open3dEntityCollection = keyof Open3dEntityMap;

export type Open3dProjectAction = {
  [Collection in Open3dEntityCollection]:
    | {
        type: "add";
        collection: Collection;
        entity: Open3dEntityMap[Collection];
      }
    | {
        type: "update";
        collection: Collection;
        id: string;
        updates: Partial<Open3dEntityMap[Collection]>;
      }
    | {
        type: "delete";
        collection: Collection;
        id: string;
      }
    | {
        type: "duplicate";
        collection: Collection;
        id: string;
        newId: string;
      };
}[Open3dEntityCollection];

export function activeFloorOrThrow(project: Open3dProject) {
  const floor = project.floors.find((candidate) => candidate.id === project.activeFloorId);
  if (!floor) throw new Error("No active floor in project");
  return floor;
}

export function applyOpen3dProjectAction(
  project: Open3dProject,
  action: Open3dProjectAction,
  now = new Date().toISOString(),
): Open3dProject {
  const activeFloor = activeFloorOrThrow(project);
  const collection = activeFloor[action.collection] as Array<{ id: string }>;
  let nextCollection: Array<{ id: string }>;

  if (action.type === "add") {
    if (collection.some((entity) => entity.id === action.entity.id)) {
      throw new Error(`Entity id "${action.entity.id}" already exists in ${action.collection}.`);
    }
    nextCollection = [...collection, action.entity];
  } else if (action.type === "delete") {
    nextCollection = collection.filter((entity) => entity.id !== action.id);
  } else if (action.type === "update") {
    nextCollection = collection.map((entity) =>
      entity.id === action.id ? { ...entity, ...action.updates } : entity,
    );
  } else {
    if (collection.some((entity) => entity.id === action.newId)) {
      throw new Error(`Entity id "${action.newId}" already exists in ${action.collection}.`);
    }
    const source = collection.find((entity) => entity.id === action.id);
    if (!source) return project;
    nextCollection = [...collection, { ...source, id: action.newId }];
  }

  const updatedFloor = {
    ...activeFloor,
    [action.collection]: nextCollection,
    ...(action.type === "delete" && action.collection === "walls"
      ? {
          doors: activeFloor.doors.filter((door) => door.wallId !== action.id),
          windows: activeFloor.windows.filter((window) => window.wallId !== action.id),
        }
      : {}),
  };
  return {
    ...project,
    updatedAt: now,
    floors: project.floors.map((floor) =>
      floor.id === activeFloor.id ? updatedFloor : floor,
    ),
  };
}

export function applyOpen3dProjectTransaction(
  project: Open3dProject,
  actions: readonly Open3dProjectAction[],
  now = new Date().toISOString(),
): Open3dProject {
  return actions.reduce(
    (current, action) => applyOpen3dProjectAction(current, action, now),
    project,
  );
}

export function moveOpen3dEntity(
  project: Open3dProject,
  collection: "furniture" | "stairs" | "columns",
  id: string,
  position: { x: number; y: number },
  now?: string,
): Open3dProject {
  return applyOpen3dProjectAction(
    project,
    { type: "update", collection, id, updates: { position } },
    now,
  );
}
