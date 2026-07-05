import type {
  Open3dDisplayUnit,
  Open3dFloor,
  Open3dPlannerSceneEnvelope,
  Open3dProject,
} from "../model/types";

const DISPLAY_UNITS: readonly Open3dDisplayUnit[] = ["mm", "cm", "m", "in", "ft-in"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Open3D project field "${key}" is invalid.`);
  }
  return value;
}

function readFloor(value: unknown): Open3dFloor {
  if (!isRecord(value)) throw new Error("Open3D floor is invalid.");
  const level = typeof value.level === "number" && Number.isFinite(value.level) ? value.level : 0;
  return {
    id: readString(value, "id"),
    name: readString(value, "name"),
    level,
    walls: Array.isArray(value.walls) ? value.walls as Open3dFloor["walls"] : [],
    rooms: Array.isArray(value.rooms) ? value.rooms as Open3dFloor["rooms"] : [],
    doors: Array.isArray(value.doors) ? value.doors as Open3dFloor["doors"] : [],
    windows: Array.isArray(value.windows) ? value.windows as Open3dFloor["windows"] : [],
    furniture: Array.isArray(value.furniture) ? value.furniture as Open3dFloor["furniture"] : [],
    stairs: Array.isArray(value.stairs) ? value.stairs as Open3dFloor["stairs"] : [],
    columns: Array.isArray(value.columns) ? value.columns as Open3dFloor["columns"] : [],
    guides: Array.isArray(value.guides) ? value.guides as Open3dFloor["guides"] : [],
    measurements: Array.isArray(value.measurements) ? value.measurements as Open3dFloor["measurements"] : [],
    annotations: Array.isArray(value.annotations) ? value.annotations as Open3dFloor["annotations"] : [],
    textAnnotations: Array.isArray(value.textAnnotations)
      ? value.textAnnotations as Open3dFloor["textAnnotations"]
      : [],
    groups: Array.isArray(value.groups) ? value.groups as Open3dFloor["groups"] : [],
    ...(isRecord(value.backgroundImage)
      ? { backgroundImage: value.backgroundImage as unknown as Open3dFloor["backgroundImage"] }
      : {}),
  };
}

export function parseOpen3dProject(value: unknown): Open3dProject {
  if (!isRecord(value)) throw new Error("Open3D project must be an object.");
  const floors = Array.isArray(value.floors) ? value.floors.map(readFloor) : [];
  if (floors.length === 0) throw new Error("Open3D project must contain a floor.");
  const displayUnit = DISPLAY_UNITS.includes(value.displayUnit as Open3dDisplayUnit)
    ? value.displayUnit as Open3dDisplayUnit
    : "mm";
  const project: Open3dProject = {
    id: readString(value, "id"),
    name: readString(value, "name"),
    floors,
    activeFloorId: readString(value, "activeFloorId"),
    displayUnit,
    createdAt: readString(value, "createdAt"),
    updatedAt: readString(value, "updatedAt"),
    ...(typeof value.description === "string" ? { description: value.description } : {}),
  };
  if (!floors.some((floor) => floor.id === project.activeFloorId)) {
    throw new Error("Open3D active floor does not exist.");
  }
  return project;
}

export function parseOpen3dSceneEnvelope(value: unknown): Open3dPlannerSceneEnvelope {
  if (!isRecord(value) || value.type !== "open3d-floorplan-project") {
    throw new Error("Not an Open3D planner scene.");
  }
  if (value.version !== 1) {
    throw new Error(`Unsupported Open3D scene version: ${String(value.version)}.`);
  }
  if (value.units !== "mm") {
    throw new Error(`Unsupported Open3D canonical unit: ${String(value.units)}.`);
  }
  const project = parseOpen3dProject(value.project);
  return {
    type: "open3d-floorplan-project",
    version: 1,
    units: "mm",
    displayUnit: project.displayUnit,
    source: "native-open3d",
    project,
  };
}
