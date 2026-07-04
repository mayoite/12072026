import type {
  Open3dDoor,
  Open3dFurnitureItem,
  Open3dFloor,
  Open3dProject,
  Open3dPoint,
  Open3dWall,
  Open3dWindow,
  Open3dStair,
  Open3dColumn,
  Open3dAnnotation,
  Open3dTextAnnotation,
  Open3dBackgroundImage,
} from "../types";
import type { Open3dIdFactory } from "../project";
import { themeColorRef } from "../../shared/readThemeColor";
import { PLANNER_COLOR_TOKENS } from "../../shared/themeColorTokens";

export interface PureAction {
  type: string;
  payload?: Record<string, unknown>;
  description?: string;
  timestamp: number;
}

export interface PureActionResult {
  project: Open3dProject;
  action: PureAction;
}

export interface ApplyPureActionOptions {
  idFactory?: Open3dIdFactory;
}

function uid(factory?: Open3dIdFactory): string {
  return factory?.() ?? globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

function cloneProject(p: Open3dProject): Open3dProject {
  return JSON.parse(JSON.stringify(p));
}

function getActiveFloor(project: Open3dProject): Open3dFloor {
  const floor = project.floors.find((f) => f.id === project.activeFloorId);
  if (!floor) throw new Error(`Active floor ${project.activeFloorId} not found`);
  return floor;
}

function withUpdatedFloor(project: Open3dProject, floor: Open3dFloor): Open3dProject {
  return {
    ...project,
    floors: project.floors.map((f) => (f.id === floor.id ? floor : f)),
    updatedAt: new Date().toISOString(),
  };
}

function makeAction(type: string, payload: Record<string, unknown>, description?: string): PureAction {
  return { type, payload, description, timestamp: Date.now() };
}

// ── Wall actions ──

export function addWall(
  project: Open3dProject,
  start: Open3dPoint,
  end: Open3dPoint,
  options?: ApplyPureActionOptions,
): PureActionResult {
  const id = uid(options?.idFactory);
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const wall: Open3dWall = {
    id,
    start: { ...start },
    end: { ...end },
    thickness: 150,
    height: 2800,
    color: themeColorRef(PLANNER_COLOR_TOKENS.importWall),
  };
  floor.walls.push(wall);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("ADD_WALL", { id, start, end }, "Added wall"),
  };
}

export function removeWall(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.walls = floor.walls.filter((w) => w.id !== id);
  floor.doors = floor.doors.filter((d) => d.wallId !== id);
  floor.windows = floor.windows.filter((w) => w.wallId !== id);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("REMOVE_WALL", { id }, "Deleted wall"),
  };
}

export function updateWall(project: Open3dProject, id: string, updates: Partial<Open3dWall>): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const wall = floor.walls.find((w) => w.id === id);
  if (!wall) throw new Error(`Wall ${id} not found`);
  Object.assign(wall, updates);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UPDATE_WALL", { id, updates }, "Updated wall"),
  };
}

export function moveWallEndpoint(
  project: Open3dProject,
  id: string,
  endpoint: "start" | "end",
  position: Open3dPoint,
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const wall = floor.walls.find((w) => w.id === id);
  if (!wall) throw new Error(`Wall ${id} not found`);
  wall[endpoint] = { ...position };
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("MOVE_WALL_ENDPOINT", { id, endpoint, position }, "Moved wall endpoint"),
  };
}

export function moveWallParallel(
  project: Open3dProject,
  id: string,
  dx: number,
  dy: number,
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const wall = floor.walls.find((w) => w.id === id);
  if (!wall) throw new Error(`Wall ${id} not found`);
  wall.start = { x: wall.start.x + dx, y: wall.start.y + dy };
  wall.end = { x: wall.end.x + dx, y: wall.end.y + dy };
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("MOVE_WALL_PARALLEL", { id, dx, dy }, "Moved wall"),
  };
}

export function splitWall(
  project: Open3dProject,
  id: string,
  t: number,
  options?: ApplyPureActionOptions,
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const wall = floor.walls.find((w) => w.id === id);
  if (!wall) throw new Error(`Wall ${id} not found`);
  if (t <= 0.001 || t >= 0.999) throw new Error("Split parameter t must be between 0.001 and 0.999");
  const newId = uid(options?.idFactory);
  const midPt: Open3dPoint = {
    x: wall.start.x + (wall.end.x - wall.start.x) * t,
    y: wall.start.y + (wall.end.y - wall.start.y) * t,
  };
  floor.walls.push({ ...wall, id: newId, start: { ...midPt }, end: { ...wall.end } });
  wall.end = { ...midPt };
  // Reassign openings
  for (const d of floor.doors) {
    if (d.wallId === id) {
      if (d.position > t) {
        d.wallId = newId;
        d.position = (d.position - t) / (1 - t);
      } else {
        d.position = d.position / t;
      }
    }
  }
  for (const w of floor.windows) {
    if (w.wallId === id) {
      if (w.position > t) {
        w.wallId = newId;
        w.position = (w.position - t) / (1 - t);
      } else {
        w.position = w.position / t;
      }
    }
  }
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("SPLIT_WALL", { id, newId, t }, "Split wall"),
  };
}

export function duplicateWall(project: Open3dProject, id: string, options?: ApplyPureActionOptions): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const wall = floor.walls.find((w) => w.id === id);
  if (!wall) throw new Error(`Wall ${id} not found`);
  const newId = uid(options?.idFactory);
  floor.walls.push({
    ...wall,
    id: newId,
    start: { x: wall.start.x + 300, y: wall.start.y + 300 },
    end: { x: wall.end.x + 300, y: wall.end.y + 300 },
  });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("DUPLICATE_WALL", { id, newId }, "Duplicated wall"),
  };
}

// ── Door actions ──

const doorDefaults: Record<Open3dDoor["type"], { width: number; height: number }> = {
  single: { width: 900, height: 2100 },
  double: { width: 1500, height: 2100 },
  sliding: { width: 1800, height: 2100 },
  french: { width: 1500, height: 2100 },
  pocket: { width: 900, height: 2100 },
  bifold: { width: 1800, height: 2100 },
};

export function addDoor(
  project: Open3dProject,
  wallId: string,
  position: number,
  doorType: Open3dDoor["type"] = "single",
  options?: ApplyPureActionOptions,
): PureActionResult {
  const id = uid(options?.idFactory);
  const { width, height } = doorDefaults[doorType];
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.doors.push({
    id,
    wallId,
    position,
    width,
    height,
    type: doorType,
    swingDirection: "left",
    flipSide: false,
  });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("ADD_DOOR", { id, wallId, position, type: doorType }, `Added ${doorType} door`),
  };
}

export function removeDoor(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.doors = floor.doors.filter((d) => d.id !== id);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("REMOVE_DOOR", { id }, "Deleted door"),
  };
}

export function updateDoor(project: Open3dProject, id: string, updates: Partial<Open3dDoor>): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const door = floor.doors.find((d) => d.id === id);
  if (!door) throw new Error(`Door ${id} not found`);
  Object.assign(door, updates);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UPDATE_DOOR", { id, updates }, "Updated door"),
  };
}

export function duplicateDoor(project: Open3dProject, id: string, options?: ApplyPureActionOptions): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const d = floor.doors.find((d) => d.id === id);
  if (!d) throw new Error(`Door ${id} not found`);
  const newId = uid(options?.idFactory);
  const newPos = Math.min(1, d.position + 0.1);
  floor.doors.push({ ...d, id: newId, position: newPos });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("DUPLICATE_DOOR", { id, newId }, "Duplicated door"),
  };
}

// ── Window actions ──

const windowDefaults: Record<Open3dWindow["type"], { width: number; height: number }> = {
  standard: { width: 1200, height: 1200 },
  fixed: { width: 1000, height: 1000 },
  casement: { width: 800, height: 1300 },
  sliding: { width: 1800, height: 1200 },
  bay: { width: 2000, height: 1500 },
};

export function addWindow(
  project: Open3dProject,
  wallId: string,
  position: number,
  windowType: Open3dWindow["type"] = "standard",
  options?: ApplyPureActionOptions,
): PureActionResult {
  const id = uid(options?.idFactory);
  const { width, height } = windowDefaults[windowType];
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.windows.push({
    id,
    wallId,
    position,
    width,
    height,
    sillHeight: 900,
    type: windowType,
  });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("ADD_WINDOW", { id, wallId, position, type: windowType }, `Added ${windowType} window`),
  };
}

export function removeWindow(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.windows = floor.windows.filter((w) => w.id !== id);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("REMOVE_WINDOW", { id }, "Deleted window"),
  };
}

export function updateWindow(project: Open3dProject, id: string, updates: Partial<Open3dWindow>): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const win = floor.windows.find((w) => w.id === id);
  if (!win) throw new Error(`Window ${id} not found`);
  Object.assign(win, updates);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UPDATE_WINDOW", { id, updates }, "Updated window"),
  };
}

export function duplicateWindow(project: Open3dProject, id: string, options?: ApplyPureActionOptions): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const w = floor.windows.find((w) => w.id === id);
  if (!w) throw new Error(`Window ${id} not found`);
  const newId = uid(options?.idFactory);
  const newPos = Math.min(1, w.position + 0.1);
  floor.windows.push({ ...w, id: newId, position: newPos });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("DUPLICATE_WINDOW", { id, newId }, "Duplicated window"),
  };
}

// ── Furniture actions ──

export function addFurniture(
  project: Open3dProject,
  catalogId: string,
  position: Open3dPoint,
  options?: ApplyPureActionOptions,
): PureActionResult {
  const id = uid(options?.idFactory);
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.furniture.push({
    id,
    catalogId,
    position: { ...position },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
  });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("ADD_FURNITURE", { id, catalogId, position }, `Added ${catalogId}`),
  };
}

export function removeFurniture(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.furniture = floor.furniture.filter((fi) => fi.id !== id);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("REMOVE_FURNITURE", { id }, "Deleted furniture"),
  };
}

export function updateFurniture(
  project: Open3dProject,
  id: string,
  updates: Partial<Open3dFurnitureItem>,
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const fi = floor.furniture.find((f) => f.id === id);
  if (!fi) throw new Error(`Furniture ${id} not found`);
  Object.assign(fi, updates);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UPDATE_FURNITURE", { id, updates }, "Updated furniture"),
  };
}

export function moveFurniture(
  project: Open3dProject,
  id: string,
  position: Open3dPoint,
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const fi = floor.furniture.find((f) => f.id === id);
  if (!fi) throw new Error(`Furniture ${id} not found`);
  fi.position = { ...position };
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("MOVE_FURNITURE", { id, position }, "Moved furniture"),
  };
}

export function rotateFurniture(project: Open3dProject, id: string, angle: number): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const fi = floor.furniture.find((f) => f.id === id);
  if (!fi) throw new Error(`Furniture ${id} not found`);
  fi.rotation = (fi.rotation + angle) % 360;
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("ROTATE_FURNITURE", { id, angle }, "Rotated furniture"),
  };
}

export function setFurnitureRotation(project: Open3dProject, id: string, angle: number): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const fi = floor.furniture.find((f) => f.id === id);
  if (!fi) throw new Error(`Furniture ${id} not found`);
  fi.rotation = ((angle % 360) + 360) % 360;
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("SET_FURNITURE_ROTATION", { id, angle }, "Set furniture rotation"),
  };
}

export function scaleFurniture(
  project: Open3dProject,
  id: string,
  scale: { x: number; y: number },
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const fi = floor.furniture.find((f) => f.id === id);
  if (!fi) throw new Error(`Furniture ${id} not found`);
  fi.scale = {
    x: Math.max(0.2, scale.x),
    y: Math.max(0.2, scale.y),
    z: fi.scale.z,
  };
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("SCALE_FURNITURE", { id, scale }, "Scaled furniture"),
  };
}

export function duplicateFurniture(project: Open3dProject, id: string, options?: ApplyPureActionOptions): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const fi = floor.furniture.find((f) => f.id === id);
  if (!fi) throw new Error(`Furniture ${id} not found`);
  const newId = uid(options?.idFactory);
  floor.furniture.push({
    ...fi,
    id: newId,
    position: { x: fi.position.x + 300, y: fi.position.y + 300 },
  });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("DUPLICATE_FURNITURE", { id, newId }, "Duplicated furniture"),
  };
}

export function toggleFurnitureLock(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const fi = floor.furniture.find((f) => f.id === id);
  if (!fi) throw new Error(`Furniture ${id} not found`);
  fi.locked = !fi.locked;
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("TOGGLE_FURNITURE_LOCK", { id, locked: fi.locked }, "Toggled furniture lock"),
  };
}

export function setFurnitureLocked(project: Open3dProject, id: string, locked: boolean): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const fi = floor.furniture.find((f) => f.id === id);
  if (!fi) throw new Error(`Furniture ${id} not found`);
  fi.locked = locked;
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("SET_FURNITURE_LOCK", { id, locked }, "Set furniture lock"),
  };
}

// ── Stair actions ──

export function addStair(
  project: Open3dProject,
  position: Open3dPoint,
  options?: ApplyPureActionOptions,
): PureActionResult {
  const id = uid(options?.idFactory);
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.stairs.push({
    id,
    position: { ...position },
    rotation: 0,
    width: 1000,
    depth: 3000,
    riserCount: 14,
    direction: "up",
    stairType: "straight",
  });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("ADD_STAIR", { id, position }, "Added stair"),
  };
}

export function removeStair(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.stairs = floor.stairs.filter((s) => s.id !== id);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("REMOVE_STAIR", { id }, "Deleted stair"),
  };
}

export function updateStair(project: Open3dProject, id: string, updates: Partial<Open3dStair>): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const s = floor.stairs.find((s) => s.id === id);
  if (!s) throw new Error(`Stair ${id} not found`);
  Object.assign(s, updates);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UPDATE_STAIR", { id, updates }, "Updated stair"),
  };
}

export function moveStair(project: Open3dProject, id: string, position: Open3dPoint): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const s = floor.stairs.find((s) => s.id === id);
  if (!s) throw new Error(`Stair ${id} not found`);
  s.position = { ...position };
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("MOVE_STAIR", { id, position }, "Moved stair"),
  };
}

// ── Column actions ──

export function addColumn(
  project: Open3dProject,
  position: Open3dPoint,
  shape: "round" | "square" = "round",
  options?: ApplyPureActionOptions,
): PureActionResult {
  const id = uid(options?.idFactory);
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.columns.push({
    id,
    position: { ...position },
    rotation: 0,
    shape,
    diameter: 300,
    height: 2800,
    color: themeColorRef(PLANNER_COLOR_TOKENS.columnDefault),
  });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("ADD_COLUMN", { id, position, shape }, `Added ${shape} column`),
  };
}

export function removeColumn(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.columns = floor.columns.filter((c) => c.id !== id);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("REMOVE_COLUMN", { id }, "Deleted column"),
  };
}

export function updateColumn(project: Open3dProject, id: string, updates: Partial<Open3dColumn>): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const c = floor.columns.find((c) => c.id === id);
  if (!c) throw new Error(`Column ${id} not found`);
  Object.assign(c, updates);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UPDATE_COLUMN", { id, updates }, "Updated column"),
  };
}

export function moveColumn(project: Open3dProject, id: string, position: Open3dPoint): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const c = floor.columns.find((c) => c.id === id);
  if (!c) throw new Error(`Column ${id} not found`);
  c.position = { ...position };
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("MOVE_COLUMN", { id, position }, "Moved column"),
  };
}

// ── Generic element removal ──

export function removeElement(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const isWall = floor.walls.some((w) => w.id === id);
  floor.walls = floor.walls.filter((w) => w.id !== id);
  if (isWall) {
    floor.doors = floor.doors.filter((d) => d.wallId !== id);
    floor.windows = floor.windows.filter((w) => w.wallId !== id);
  }
  floor.doors = floor.doors.filter((d) => d.id !== id);
  floor.windows = floor.windows.filter((w) => w.id !== id);
  floor.furniture = floor.furniture.filter((fi) => fi.id !== id);
  floor.stairs = floor.stairs.filter((s) => s.id !== id);
  floor.columns = floor.columns.filter((c) => c.id !== id);
  floor.textAnnotations = floor.textAnnotations.filter((t) => t.id !== id);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("REMOVE_ELEMENT", { id }, "Deleted element"),
  };
}

// ── Floor actions ──

export function addFloor(
  project: Open3dProject,
  name?: string,
  options?: ApplyPureActionOptions & { copyCurrentLayout?: boolean },
): PureActionResult {
  const p = cloneProject(project);
  const level = p.floors.length;
  const newFloor: Open3dFloor = {
    id: uid(options?.idFactory),
    name: name ?? `Floor ${level}`,
    level,
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
  if (options?.copyCurrentLayout) {
    const cur = p.floors.find((f) => f.id === p.activeFloorId);
    if (cur) {
      newFloor.walls = cur.walls.map((w) => ({ ...w, id: uid(options?.idFactory) }));
    }
  }
  p.floors.push(newFloor);
  p.activeFloorId = newFloor.id;
  return {
    project: { ...p, updatedAt: new Date().toISOString() },
    action: makeAction("ADD_FLOOR", { id: newFloor.id, name: newFloor.name }, "Added floor"),
  };
}

export function removeFloor(project: Open3dProject, id: string): PureActionResult {
  if (project.floors.length <= 1) throw new Error("Cannot remove the only floor");
  const p = cloneProject(project);
  p.floors = p.floors.filter((f) => f.id !== id);
  if (p.activeFloorId === id) {
    p.activeFloorId = p.floors[0].id;
  }
  return {
    project: { ...p, updatedAt: new Date().toISOString() },
    action: makeAction("REMOVE_FLOOR", { id }, "Removed floor"),
  };
}

export function setActiveFloor(project: Open3dProject, floorId: string): PureActionResult {
  if (!project.floors.some((f) => f.id === floorId)) {
    throw new Error(`Floor ${floorId} not found`);
  }
  return {
    project: { ...cloneProject(project), activeFloorId: floorId, updatedAt: new Date().toISOString() },
    action: makeAction("SET_ACTIVE_FLOOR", { floorId }, "Changed active floor"),
  };
}

export function updateProjectName(project: Open3dProject, name: string): PureActionResult {
  return {
    project: { ...cloneProject(project), name, updatedAt: new Date().toISOString() },
    action: makeAction("UPDATE_PROJECT_NAME", { name }, "Updated project name"),
  };
}

export function updateDisplayUnit(project: Open3dProject, displayUnit: Open3dProject["displayUnit"]): PureActionResult {
  return {
    project: { ...cloneProject(project), displayUnit, updatedAt: new Date().toISOString() },
    action: makeAction("UPDATE_DISPLAY_UNIT", { displayUnit }, "Changed display unit"),
  };
}

// ── Guide actions ──

export function addGuide(
  project: Open3dProject,
  orientation: "horizontal" | "vertical",
  position: number,
  options?: ApplyPureActionOptions,
): PureActionResult {
  const id = uid(options?.idFactory);
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.guides.push({ id, orientation, position });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("ADD_GUIDE", { id, orientation, position }, "Added guide"),
  };
}

export function removeGuide(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.guides = floor.guides.filter((g) => g.id !== id);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("REMOVE_GUIDE", { id }, "Removed guide"),
  };
}

export function moveGuide(project: Open3dProject, id: string, position: number): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const g = floor.guides.find((g) => g.id === id);
  if (!g) throw new Error(`Guide ${id} not found`);
  g.position = position;
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("MOVE_GUIDE", { id, position }, "Moved guide"),
  };
}

// ── Measurement actions ──

export function addMeasurement(
  project: Open3dProject,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options?: ApplyPureActionOptions,
): PureActionResult {
  const id = uid(options?.idFactory);
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.measurements.push({ id, x1, y1, x2, y2 });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("ADD_MEASUREMENT", { id, x1, y1, x2, y2 }, "Added measurement"),
  };
}

export function removeMeasurement(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.measurements = floor.measurements.filter((m) => m.id !== id);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("REMOVE_MEASUREMENT", { id }, "Removed measurement"),
  };
}

// ── Annotation actions ──

export function addAnnotation(
  project: Open3dProject,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  offset = 400,
  label?: string,
  options?: ApplyPureActionOptions,
): PureActionResult {
  const id = uid(options?.idFactory);
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.annotations.push({ id, x1, y1, x2, y2, offset, label });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("ADD_ANNOTATION", { id, x1, y1, x2, y2, offset, label }, "Added annotation"),
  };
}

export function removeAnnotation(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.annotations = floor.annotations.filter((a) => a.id !== id);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("REMOVE_ANNOTATION", { id }, "Removed annotation"),
  };
}

export function updateAnnotation(
  project: Open3dProject,
  id: string,
  updates: Partial<Open3dAnnotation>,
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const a = floor.annotations.find((a) => a.id === id);
  if (!a) throw new Error(`Annotation ${id} not found`);
  Object.assign(a, updates);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UPDATE_ANNOTATION", { id, updates }, "Updated annotation"),
  };
}

// ── Text annotation actions ──

export function addTextAnnotation(
  project: Open3dProject,
  x: number,
  y: number,
  text: string,
  fontSize = 160,
  color = themeColorRef(PLANNER_COLOR_TOKENS.textAnnotation),
  rotation = 0,
  options?: ApplyPureActionOptions,
): PureActionResult {
  const id = uid(options?.idFactory);
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.textAnnotations.push({ id, x, y, text, fontSize, color, rotation });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("ADD_TEXT_ANNOTATION", { id, x, y, text, fontSize, color, rotation }, "Added text annotation"),
  };
}

export function removeTextAnnotation(project: Open3dProject, id: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.textAnnotations = floor.textAnnotations.filter((t) => t.id !== id);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("REMOVE_TEXT_ANNOTATION", { id }, "Removed text annotation"),
  };
}

export function updateTextAnnotation(
  project: Open3dProject,
  id: string,
  updates: Partial<Open3dTextAnnotation>,
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const t = floor.textAnnotations.find((t) => t.id === id);
  if (!t) throw new Error(`Text annotation ${id} not found`);
  Object.assign(t, updates);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UPDATE_TEXT_ANNOTATION", { id, updates }, "Updated text annotation"),
  };
}

export function moveTextAnnotation(
  project: Open3dProject,
  id: string,
  position: { x: number; y: number },
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const t = floor.textAnnotations.find((t) => t.id === id);
  if (!t) throw new Error(`Text annotation ${id} not found`);
  t.x = position.x;
  t.y = position.y;
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("MOVE_TEXT_ANNOTATION", { id, position }, "Moved text annotation"),
  };
}

// ── Background image actions ──

export function setBackgroundImage(
  project: Open3dProject,
  bg: Open3dBackgroundImage | undefined,
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.backgroundImage = bg ? { ...bg } : undefined;
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("SET_BACKGROUND_IMAGE", { bg }, "Set background image"),
  };
}

export function updateBackgroundImage(
  project: Open3dProject,
  updates: Partial<Open3dBackgroundImage>,
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  if (!floor.backgroundImage) throw new Error("No background image to update");
  Object.assign(floor.backgroundImage, updates);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UPDATE_BACKGROUND_IMAGE", { updates }, "Updated background image"),
  };
}

// ── Group actions ──

export function createGroup(
  project: Open3dProject,
  elementIds: string[],
  options?: ApplyPureActionOptions,
): PureActionResult {
  if (elementIds.length < 2) throw new Error("Group must contain at least 2 elements");
  const id = uid(options?.idFactory);
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  // Remove existing group memberships for these elements
  floor.groups = floor.groups
    .map((g) => ({
      ...g,
      elementIds: g.elementIds.filter((eid) => !elementIds.includes(eid)),
    }))
    .filter((g) => g.elementIds.length >= 2);
  floor.groups.push({ id, elementIds: [...elementIds] });
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("CREATE_GROUP", { id, elementIds }, "Created group"),
  };
}

export function ungroup(project: Open3dProject, groupId: string): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.groups = floor.groups.filter((g) => g.id !== groupId);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UNGROUP", { groupId }, "Ungrouped"),
  };
}

export function ungroupElements(project: Open3dProject, elementIds: string[]): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  floor.groups = floor.groups.filter(
    (g) => !g.elementIds.some((eid) => elementIds.includes(eid)),
  );
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UNGROUP_ELEMENTS", { elementIds }, "Ungrouped elements"),
  };
}

// ── Room actions ──

export function updateRoom(
  project: Open3dProject,
  id: string,
  updates: Partial<Open3dFloor["rooms"][number]>,
): PureActionResult {
  const p = cloneProject(project);
  const floor = getActiveFloor(p);
  const room = floor.rooms.find((r) => r.id === id);
  if (!room) throw new Error(`Room ${id} not found`);
  Object.assign(room, updates);
  return {
    project: withUpdatedFloor(p, floor),
    action: makeAction("UPDATE_ROOM", { id, updates }, "Updated room"),
  };
}

// ── Import floor ──

export function importFloorIntoCurrentProject(
  project: Open3dProject,
  floor: Open3dFloor,
): PureActionResult {
  const p = cloneProject(project);
  const activeFloor = p.floors.find((f) => f.id === p.activeFloorId);
  if (!activeFloor) throw new Error("Active floor not found");
  activeFloor.walls = [...activeFloor.walls, ...floor.walls];
  activeFloor.doors = [...activeFloor.doors, ...floor.doors];
  activeFloor.windows = [...activeFloor.windows, ...floor.windows];
  activeFloor.furniture = [...activeFloor.furniture, ...floor.furniture];
  if (floor.stairs) activeFloor.stairs = [...(activeFloor.stairs || []), ...floor.stairs];
  if (floor.columns) activeFloor.columns = [...(activeFloor.columns || []), ...floor.columns];
  return {
    project: withUpdatedFloor(p, activeFloor),
    action: makeAction("IMPORT_FLOOR", { floorId: floor.id }, "Imported floor"),
  };
}
