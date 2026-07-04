import type {
  Open3dFloor,
  Open3dPlannerSceneEnvelope,
  Open3dProject,
  Open3dWall,
} from "./types";

export type Open3dIdFactory = () => string;

function defaultIdFactory(): string {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

export interface CreateOpen3dProjectOptions {
  idFactory?: Open3dIdFactory;
  name?: string;
  now?: string;
}

export function createOpen3dProject(
  options: CreateOpen3dProjectOptions = {},
): Open3dProject {
  const idFactory = options.idFactory ?? defaultIdFactory;
  const now = options.now ?? new Date().toISOString();
  const floor: Open3dFloor = {
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

export interface CreateRectangularRoomOptions extends CreateOpen3dProjectOptions {
  widthMm: number;
  depthMm: number;
  wallHeightMm?: number;
  wallThicknessMm?: number;
}

export function createRectangularRoomProject(
  options: CreateRectangularRoomOptions,
): Open3dProject {
  const idFactory = options.idFactory ?? defaultIdFactory;
  const project = createOpen3dProject({ ...options, idFactory });
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
  const walls: Open3dWall[] = points.map((start, index) => ({
    id: idFactory(),
    start,
    end: points[(index + 1) % points.length],
    height,
    thickness,
    color: "#e2e8f0",
  }));

  return {
    ...project,
    floors: [{ ...project.floors[0], walls }],
  };
}

export function createOpen3dSceneEnvelope(
  project: Open3dProject,
): Open3dPlannerSceneEnvelope {
  return {
    type: "open3d-floorplan-project",
    version: 1,
    units: "mm",
    displayUnit: project.displayUnit,
    source: "native-open3d",
    project,
  };
}
