import type {
  PlannerDisplayUnit, PlannerFloor, PlannerSceneEnvelope, PlannerProject,
} from "../../model/types";
import { assertPlannerProject } from "../../model/invariants";
import { assertNoDesignerStaticGlb } from "@/features/planner/lib/glbAssetPolicy";

const DISPLAY_UNITS: readonly string[] = ["mm", "cm", "m", "in", "ft-in"];

function record(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${path} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function stringValue(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${path} must be a non-empty string.`);
  }
  return value;
}

function numberValue(value: unknown, path: string, minimum?: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || (minimum !== undefined && value < minimum)) {
    throw new Error(`${path} must be a finite number${minimum === undefined ? "" : ` >= ${minimum}`}.`);
  }
  return value;
}

function booleanValue(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") throw new Error(`${path} must be a boolean.`);
  return value;
}

function oneOf<T extends string>(value: unknown, values: readonly T[], path: string): T {
  if (typeof value !== "string" || !values.some((candidate) => candidate === value)) {
    throw new Error(`${path} has an unsupported value.`);
  }
  return value as T;
}

function arrayValue<T>(value: unknown, path: string, parser: (item: unknown, path: string) => T): T[] {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array.`);
  return value.map((item, index) => parser(item, `${path}[${index}]`));
}

function point(value: unknown, path: string) {
  const item = record(value, path);
  return { x: numberValue(item.x, `${path}.x`), y: numberValue(item.y, `${path}.y`) };
}

function id(item: Record<string, unknown>, path: string): string {
  return stringValue(item.id, `${path}.id`);
}

function optionalString(item: Record<string, unknown>, key: string): string | undefined {
  const value = item[key];
  if (value === undefined) return undefined;
  return stringValue(value, key);
}

function floor(value: unknown, path: string): PlannerFloor {
  const item = record(value, path);
  const parseWall = (raw: unknown, itemPath: string) => {
    const wall = record(raw, itemPath);
    return { id: id(wall, itemPath), start: point(wall.start, `${itemPath}.start`), end: point(wall.end, `${itemPath}.end`),
      thickness: numberValue(wall.thickness, `${itemPath}.thickness`, 0.001), height: numberValue(wall.height, `${itemPath}.height`, 0.001),
      color: stringValue(wall.color, `${itemPath}.color`) };
  };
  const parseRoom = (raw: unknown, itemPath: string) => {
    const room = record(raw, itemPath);
    return { id: id(room, itemPath), name: stringValue(room.name, `${itemPath}.name`),
      walls: arrayValue(room.walls, `${itemPath}.walls`, stringValue), floorTexture: stringValue(room.floorTexture, `${itemPath}.floorTexture`),
      area: numberValue(room.area, `${itemPath}.area`, 0), ...(optionalString(room, "color") ? { color: optionalString(room, "color") } : {}),
      ...(room.roomType === undefined ? {} : { roomType: oneOf(room.roomType, ["indoor", "outdoor", "garage", "utility"] as const, `${itemPath}.roomType`) }),
      ...(room.labelOffset === undefined ? {} : { labelOffset: point(room.labelOffset, `${itemPath}.labelOffset`) }) };
  };
  const parseDoor = (raw: unknown, itemPath: string) => {
    const door = record(raw, itemPath);
    return { id: id(door, itemPath), wallId: stringValue(door.wallId, `${itemPath}.wallId`), position: numberValue(door.position, `${itemPath}.position`, 0),
      width: numberValue(door.width, `${itemPath}.width`, 0.001), height: numberValue(door.height, `${itemPath}.height`, 0.001),
      type: oneOf(door.type, ["single", "double", "sliding", "french", "pocket", "bifold"] as const, `${itemPath}.type`),
      swingDirection: oneOf(door.swingDirection, ["left", "right"] as const, `${itemPath}.swingDirection`),
      flipSide: booleanValue(door.flipSide, `${itemPath}.flipSide`) };
  };
  const parseWindow = (raw: unknown, itemPath: string) => {
    const window = record(raw, itemPath);
    return { id: id(window, itemPath), wallId: stringValue(window.wallId, `${itemPath}.wallId`), position: numberValue(window.position, `${itemPath}.position`, 0),
      width: numberValue(window.width, `${itemPath}.width`, 0.001), height: numberValue(window.height, `${itemPath}.height`, 0.001),
      sillHeight: numberValue(window.sillHeight, `${itemPath}.sillHeight`, 0),
      type: oneOf(window.type, ["standard", "fixed", "casement", "sliding", "bay"] as const, `${itemPath}.type`) };
  };
  const parseModularOptions = (raw: unknown, itemPath: string) => {
    const opts = record(raw, itemPath);
    return {
      widthMm: numberValue(opts.widthMm, `${itemPath}.widthMm`, 0.001),
      depthMm: numberValue(opts.depthMm, `${itemPath}.depthMm`, 0.001),
      heightMm: numberValue(opts.heightMm, `${itemPath}.heightMm`, 0.001),
      doorStyle: oneOf(opts.doorStyle, ["none", "slab", "pair"] as const, `${itemPath}.doorStyle`),
      material: oneOf(opts.material, ["oak", "white"] as const, `${itemPath}.material`),
    };
  };
  const WORKSTATION_MODULE_KINDS = [
    "desk",
    "return",
    "pedestal",
    "panel",
    "overhead",
  ] as const;
  const parseWorkstationOptions = (raw: unknown, itemPath: string) => {
    const opts = record(raw, itemPath);
    return {
      shape: oneOf(opts.shape, ["linear", "l-shape"] as const, `${itemPath}.shape`),
      lengthMm: numberValue(opts.lengthMm, `${itemPath}.lengthMm`, 0.001),
      depthMm: numberValue(opts.depthMm, `${itemPath}.depthMm`, 0.001),
      heightMm: numberValue(opts.heightMm, `${itemPath}.heightMm`, 0.001),
      modules: arrayValue(opts.modules, `${itemPath}.modules`, (mod, modPath) =>
        oneOf(mod, WORKSTATION_MODULE_KINDS, modPath),
      ),
    };
  };
  const parseFurniture = (raw: unknown, itemPath: string) => {
    const furniture = record(raw, itemPath);
    const scale = record(furniture.scale, `${itemPath}.scale`);
    return { id: id(furniture, itemPath), catalogId: stringValue(furniture.catalogId, `${itemPath}.catalogId`),
      position: point(furniture.position, `${itemPath}.position`), rotation: numberValue(furniture.rotation, `${itemPath}.rotation`),
      scale: { x: numberValue(scale.x, `${itemPath}.scale.x`, 0.001), y: numberValue(scale.y, `${itemPath}.scale.y`, 0.001), z: numberValue(scale.z, `${itemPath}.scale.z`, 0.001) },
      ...Object.fromEntries(["color", "material", "sourceCatalogId", "sourceSlug", "sourceSku"].flatMap((key) =>
        furniture[key] === undefined ? [] : [[key, stringValue(furniture[key], `${itemPath}.${key}`)]])),
      ...(furniture.locked === undefined ? {} : { locked: booleanValue(furniture.locked, `${itemPath}.locked`) }),
      ...Object.fromEntries(["width", "depth", "height"].flatMap((key) =>
        furniture[key] === undefined ? [] : [[key, numberValue(furniture[key], `${itemPath}.${key}`, 0)]])),
      ...(furniture.geometryMode === undefined
        ? {}
        : {
            geometryMode: oneOf(
              furniture.geometryMode,
              ["box", "modular-cabinet-v0", "workstation-v0"] as const,
              `${itemPath}.geometryMode`,
            ),
          }),
      ...(furniture.modularOptions === undefined
        ? {}
        : { modularOptions: parseModularOptions(furniture.modularOptions, `${itemPath}.modularOptions`) }),
      ...(furniture.workstationOptions === undefined
        ? {}
        : {
            workstationOptions: parseWorkstationOptions(
              furniture.workstationOptions,
              `${itemPath}.workstationOptions`,
            ),
          }),
      ...(furniture.generatedGlbUrl === undefined
        ? {}
        : (() => {
            const generatedGlbUrl = stringValue(
              furniture.generatedGlbUrl,
              `${itemPath}.generatedGlbUrl`,
            );
            assertNoDesignerStaticGlb(
              generatedGlbUrl,
              `${itemPath}.generatedGlbUrl`,
            );
            return { generatedGlbUrl };
          })()),
    };
  };
  const emptyOrRecords = <T>(key: string, parser: (raw: unknown, itemPath: string) => T): T[] =>
    arrayValue(item[key] ?? [], `${path}.${key}`, parser);
  return {
    id: id(item, path), name: stringValue(item.name, `${path}.name`), level: numberValue(item.level, `${path}.level`),
    walls: emptyOrRecords("walls", parseWall), rooms: emptyOrRecords("rooms", parseRoom),
    doors: emptyOrRecords("doors", parseDoor), windows: emptyOrRecords("windows", parseWindow),
    furniture: emptyOrRecords("furniture", parseFurniture),
    stairs: emptyOrRecords("stairs", (raw, itemPath) => {
      const stair = record(raw, itemPath);
      return { id: id(stair, itemPath), position: point(stair.position, `${itemPath}.position`), rotation: numberValue(stair.rotation, `${itemPath}.rotation`),
        width: numberValue(stair.width, `${itemPath}.width`, 0.001), depth: numberValue(stair.depth, `${itemPath}.depth`, 0.001),
        riserCount: numberValue(stair.riserCount, `${itemPath}.riserCount`, 1), direction: oneOf(stair.direction, ["up", "down"] as const, `${itemPath}.direction`),
        stairType: oneOf(stair.stairType, ["straight", "l-shaped", "u-shaped", "spiral"] as const, `${itemPath}.stairType`) };
    }),
    columns: emptyOrRecords("columns", (raw, itemPath) => {
      const column = record(raw, itemPath);
      return { id: id(column, itemPath), position: point(column.position, `${itemPath}.position`), rotation: numberValue(column.rotation, `${itemPath}.rotation`),
        shape: oneOf(column.shape, ["round", "square"] as const, `${itemPath}.shape`), diameter: numberValue(column.diameter, `${itemPath}.diameter`, 0.001),
        height: numberValue(column.height, `${itemPath}.height`, 0.001), color: stringValue(column.color, `${itemPath}.color`) };
    }),
    guides: emptyOrRecords("guides", (raw, itemPath) => { const guide = record(raw, itemPath); return { id: id(guide, itemPath), orientation: oneOf(guide.orientation, ["horizontal", "vertical"] as const, `${itemPath}.orientation`), position: numberValue(guide.position, `${itemPath}.position`) }; }),
    measurements: emptyOrRecords("measurements", parseMeasurement),
    annotations: emptyOrRecords("annotations", (raw, itemPath) => { const annotation = record(raw, itemPath); return { ...parseMeasurement(raw, itemPath), offset: numberValue(annotation.offset, `${itemPath}.offset`), ...(annotation.label === undefined ? {} : { label: stringValue(annotation.label, `${itemPath}.label`) }) }; }),
    textAnnotations: emptyOrRecords("textAnnotations", (raw, itemPath) => { const text = record(raw, itemPath); return { id: id(text, itemPath), x: numberValue(text.x, `${itemPath}.x`), y: numberValue(text.y, `${itemPath}.y`), text: stringValue(text.text, `${itemPath}.text`), fontSize: numberValue(text.fontSize, `${itemPath}.fontSize`, 0.001), color: stringValue(text.color, `${itemPath}.color`), rotation: numberValue(text.rotation, `${itemPath}.rotation`) }; }),
    groups: emptyOrRecords("groups", (raw, itemPath) => { const group = record(raw, itemPath); return { id: id(group, itemPath), elementIds: arrayValue(group.elementIds, `${itemPath}.elementIds`, stringValue) }; }),
  };
}

function parseMeasurement(raw: unknown, path: string) {
  const item = record(raw, path);
  return { id: id(item, path), x1: numberValue(item.x1, `${path}.x1`), y1: numberValue(item.y1, `${path}.y1`), x2: numberValue(item.x2, `${path}.x2`), y2: numberValue(item.y2, `${path}.y2`) };
}

export function parsePlannerProject(value: unknown): PlannerProject {
  const item = record(value, "project");
  const floors = arrayValue(item.floors, "project.floors", floor);
  if (floors.length === 0) throw new Error("project.floors must contain at least one floor.");
  const project: PlannerProject = {
    id: stringValue(item.id, "project.id"), name: stringValue(item.name, "project.name"), floors,
    activeFloorId: stringValue(item.activeFloorId, "project.activeFloorId"),
    displayUnit: oneOf(item.displayUnit ?? "mm", DISPLAY_UNITS, "project.displayUnit") as PlannerDisplayUnit,
    createdAt: stringValue(item.createdAt, "project.createdAt"), updatedAt: stringValue(item.updatedAt, "project.updatedAt"),
    ...(item.description === undefined ? {} : { description: stringValue(item.description, "project.description") }),
  };
  assertPlannerProject(project);
  return project;
}

export function parsePlannerSceneEnvelope(value: unknown): PlannerSceneEnvelope {
  const item = record(value, "scene");
  if (item.type !== "open3d-floorplan-project" || item.version !== 1 || item.units !== "mm") {
    throw new Error("Unsupported Open3D planner scene envelope.");
  }
  const project = parsePlannerProject(item.project);
  return { type: "open3d-floorplan-project", version: 1, units: "mm", displayUnit: project.displayUnit, source: "native-open3d", project };
}
