import type {
  PlannerFloor,
  PlannerSceneEnvelope,
  PlannerProject,
  PlannerWall,
} from "./types";
import { themeColorRef } from "../shared/readThemeColor";
import { PLANNER_COLOR_TOKENS } from "../shared/themeColorTokens";
import { newEntityId } from "@/features/planner/lib/newEntityId";

export type PlannerIdFactory = () => string;

function defaultIdFactory(): string {
  return newEntityId();
}

export interface CreatePlannerProjectOptions {
  idFactory?: PlannerIdFactory;
  name?: string;
  now?: string;
}

export function createPlannerProject(
  options: CreatePlannerProjectOptions = {},
): PlannerProject {
  const idFactory = options.idFactory ?? defaultIdFactory;
  const now = options.now ?? new Date().toISOString();
  const floor: PlannerFloor = {
    id: idFactory(),
    name: "Ground Floor",
    level: 0,
    walls: [],
    rooms: [],
    doors: [],
    windows: [],
    furniture: [],
    stairs: [],
    columns: [],
    guides: [],
    measurements: [],
    annotations: [],
    textAnnotations: [],
    groups: [],
  };

  return {
    id: idFactory(),
    name: options.name ?? "Untitled Project",
    floors: [floor],
    activeFloorId: floor.id,
    displayUnit: "mm",
    createdAt: now,
    updatedAt: now,
  };
}

export interface CreateRectangularRoomOptions extends CreatePlannerProjectOptions {
  widthMm: number;
  depthMm: number;
  wallHeightMm?: number;
  wallThicknessMm?: number;
}

export function createRectangularRoomProject(
  options: CreateRectangularRoomOptions,
): PlannerProject {
  const idFactory = options.idFactory ?? defaultIdFactory;
  const project = createPlannerProject({ ...options, idFactory });
  const width = options.widthMm;
  const depth = options.depthMm;
  const height = options.wallHeightMm ?? 2700;
  const thickness = options.wallThicknessMm ?? 150;
  const points = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: depth },
    { x: 0, y: depth },
  ];
  const walls: PlannerWall[] = points.map((start, index) => ({
    id: idFactory(),
    start,
    end: points[(index + 1) % points.length],
    height,
    thickness,
    color: themeColorRef(PLANNER_COLOR_TOKENS.wallDefault),
  }));

  return {
    ...project,
    floors: [{ ...project.floors[0], walls }],
  };
}

export function createPlannerSceneEnvelope(
  project: PlannerProject,
): PlannerSceneEnvelope {
  return {
    type: "open3d-floorplan-project",
    version: 1,
    units: "mm",
    displayUnit: project.displayUnit,
    source: "native-open3d",
    project,
  };
}
