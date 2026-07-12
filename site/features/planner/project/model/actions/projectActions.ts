import type {
  PlannerAnnotation,
  PlannerColumn,
  PlannerDoor,
  PlannerElementGroup,
  PlannerFurnitureItem,
  PlannerGuide,
  PlannerMeasurement,
  PlannerProject,
  PlannerRoom,
  PlannerStair,
  PlannerTextAnnotation,
  PlannerWall,
  PlannerWindow,
} from "../types";

export interface PlannerEntityMap {
  walls: PlannerWall;
  rooms: PlannerRoom;
  doors: PlannerDoor;
  windows: PlannerWindow;
  furniture: PlannerFurnitureItem;
  stairs: PlannerStair;
  columns: PlannerColumn;
  guides: PlannerGuide;
  measurements: PlannerMeasurement;
  annotations: PlannerAnnotation;
  textAnnotations: PlannerTextAnnotation;
  groups: PlannerElementGroup;
}

export type PlannerEntityCollection = keyof PlannerEntityMap;

export type PlannerProjectAction = {
  [Collection in PlannerEntityCollection]:
    | {
        type: "add";
        collection: Collection;
        entity: PlannerEntityMap[Collection];
      }
    | {
        type: "update";
        collection: Collection;
        id: string;
        updates: Partial<PlannerEntityMap[Collection]>;
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
}[PlannerEntityCollection];

export function activeFloorOrThrow(project: PlannerProject) {
  const floor = project.floors.find((candidate) => candidate.id === project.activeFloorId);
  if (!floor) throw new Error("Active floor not found");
  return floor;
}

export function applyPlannerProjectAction(
  project: PlannerProject,
  action: PlannerProjectAction,
  now = new Date().toISOString(),
): PlannerProject {
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

export function applyPlannerProjectTransaction(
  project: PlannerProject,
  actions: readonly PlannerProjectAction[],
  now = new Date().toISOString(),
): PlannerProject {
  return actions.reduce(
    (current, action) => applyPlannerProjectAction(current, action, now),
    project,
  );
}

export function movePlannerEntity(
  project: PlannerProject,
  collection: "furniture" | "stairs" | "columns",
  id: string,
  position: { x: number; y: number },
  now?: string,
): PlannerProject {
  return applyPlannerProjectAction(
    project,
    { type: "update", collection, id, updates: { position } },
    now,
  );
}
