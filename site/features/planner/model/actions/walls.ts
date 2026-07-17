import type {
  PlannerFloor,
  PlannerPoint,
  PlannerProject,
  PlannerRoom,
  PlannerWall,
} from "../types";
import type { PlannerIdFactory } from "../project";
import { themeColorRef } from "../../shared/readThemeColor";
import { PLANNER_COLOR_TOKENS, ROOM_FILL_TOKENS } from "../../shared/themeColorTokens";
import { activeFloorOrThrow } from "./projectActions";
import {
  DEFAULT_WALL_HEIGHT_MM,
  DEFAULT_WALL_THICKNESS_MM,
  joinWallSegmentToFloor,
  pointsEqualWithin,
  WALL_JOIN_EPSILON_MM,
} from "../wallContract";
import {
  buildWallGraph,
  findEnclosedRooms,
} from "@/features/planner/lib/geometry/wallGraph";

export interface AddPlannerWallInput {
  start: PlannerPoint;
  end: PlannerPoint;
  height?: number;
  thickness?: number;
  color?: string;
}

const MIN_WALL_LENGTH_MM = 0.01;
const POINT_EPSILON_MM = WALL_JOIN_EPSILON_MM;

function samePoint(left: PlannerPoint, right: PlannerPoint): boolean {
  return (
    Math.abs(left.x - right.x) <= POINT_EPSILON_MM &&
    Math.abs(left.y - right.y) <= POINT_EPSILON_MM
  );
}

function sameSegment(
  wall: PlannerWall,
  start: PlannerPoint,
  end: PlannerPoint,
): boolean {
  return (
    (samePoint(wall.start, start) && samePoint(wall.end, end)) ||
    (samePoint(wall.start, end) && samePoint(wall.end, start))
  );
}

function sameWallIdSet(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) return false;
  const rightSet = new Set(right);
  return left.every((id) => rightSet.has(id));
}

function isAutoNamedRoom(room: PlannerRoom): boolean {
  return /^Room \d+$/i.test(room.name.trim());
}

/**
 * Rebuild auto-named enclosed rooms from centreline cycles.
 * Preserves manually named rooms whose wall ids still exist.
 */
export function syncEnclosedRoomsFromWalls(
  floor: PlannerFloor,
  idFactory: PlannerIdFactory,
): PlannerFloor {
  const cycles = findEnclosedRooms(buildWallGraph(floor.walls));
  const wallIdPresent = new Set(floor.walls.map((wall) => wall.id));

  const preserved = floor.rooms.filter((room) => {
    if (isAutoNamedRoom(room)) return false;
    return room.walls.every((wallId) => wallIdPresent.has(wallId));
  });

  const nextRooms: PlannerRoom[] = [...preserved];
  let autoIndex = preserved.length + 1;
  const seenCycleKeys = new Set<string>();

  for (const cycle of cycles) {
    if (cycle.wallIds.length < 3) continue;
    const cycleKey = [...cycle.wallIds].sort().join("|");
    if (seenCycleKeys.has(cycleKey)) continue;
    seenCycleKeys.add(cycleKey);

    const existing =
      preserved.find((room) => sameWallIdSet(room.walls, cycle.wallIds)) ??
      floor.rooms.find(
        (room) => isAutoNamedRoom(room) && sameWallIdSet(room.walls, cycle.wallIds),
      );

    const area = Number((cycle.areaMm2 / 1_000_000).toFixed(2));
    const labelOffset = centroidOf(cycle.vertices);

    if (existing && !isAutoNamedRoom(existing)) {
      const idx = nextRooms.findIndex((room) => room.id === existing.id);
      if (idx >= 0) {
        nextRooms[idx] = {
          ...existing,
          walls: [...cycle.wallIds],
          area,
          labelOffset,
        };
      }
      continue;
    }

    if (existing && isAutoNamedRoom(existing)) {
      nextRooms.push({
        ...existing,
        walls: [...cycle.wallIds],
        area,
        labelOffset,
      });
      continue;
    }

    nextRooms.push({
      id: idFactory(),
      name: `Room ${autoIndex}`,
      walls: [...cycle.wallIds],
      floorTexture: "plain",
      area,
      roomType: "indoor",
      labelOffset,
      color: themeColorRef(ROOM_FILL_TOKENS[nextRooms.length % ROOM_FILL_TOKENS.length]),
    });
    autoIndex += 1;
  }

  return { ...floor, rooms: nextRooms };
}

function centroidOf(vertices: readonly PlannerPoint[]): PlannerPoint {
  if (vertices.length === 0) return { x: 0, y: 0 };
  let x = 0;
  let y = 0;
  for (const vertex of vertices) {
    x += vertex.x;
    y += vertex.y;
  }
  return { x: x / vertices.length, y: y / vertices.length };
}

/**
 * Append a centreline wall segment. Near endpoints coalesce within
 * `WALL_JOIN_EPSILON_MM`, and enclosed cycles sync auto rooms.
 */
export function addPlannerWall(
  project: PlannerProject,
  input: AddPlannerWallInput,
  idFactory: PlannerIdFactory,
  now = new Date().toISOString(),
): PlannerProject {
  const activeFloor = activeFloorOrThrow(project);
  const floorIndex = project.floors.findIndex(
    (floor) => floor.id === activeFloor.id,
  );

  const finite = [input.start.x, input.start.y, input.end.x, input.end.y].every(
    Number.isFinite,
  );
  if (!finite) {
    return project;
  }

  const joined = joinWallSegmentToFloor(
    activeFloor.walls,
    input.start,
    input.end,
  );
  const length = Math.hypot(
    joined.end.x - joined.start.x,
    joined.end.y - joined.start.y,
  );
  if (
    length < MIN_WALL_LENGTH_MM ||
    joined.walls.some((wall) => sameSegment(wall, joined.start, joined.end))
  ) {
    return project;
  }

  const wall: PlannerWall = {
    id: idFactory(),
    start: { ...joined.start },
    end: { ...joined.end },
    height: input.height ?? DEFAULT_WALL_HEIGHT_MM,
    thickness: input.thickness ?? DEFAULT_WALL_THICKNESS_MM,
    color: input.color ?? themeColorRef(PLANNER_COLOR_TOKENS.wallDefault),
  };

  const floorWithWall: PlannerFloor = {
    ...activeFloor,
    walls: [...joined.walls, wall],
  };
  const floorWithRooms = syncEnclosedRoomsFromWalls(floorWithWall, idFactory);

  const floors = project.floors.map((floor, index) =>
    index === floorIndex ? floorWithRooms : floor,
  );

  return { ...project, floors, updatedAt: now };
}

/**
 * Move a wall endpoint and drag every centreline endpoint that shares the
 * same join (within `WALL_JOIN_EPSILON_MM`). Re-syncs auto rooms.
 */
export function movePlannerWallEndpointConnected(
  project: PlannerProject,
  wallId: string,
  endpoint: "start" | "end",
  position: PlannerPoint,
  idFactory: PlannerIdFactory,
  now = new Date().toISOString(),
): PlannerProject {
  const activeFloor = activeFloorOrThrow(project);
  const floorIndex = project.floors.findIndex(
    (floor) => floor.id === activeFloor.id,
  );
  const wall = activeFloor.walls.find((item) => item.id === wallId);
  if (!wall) return project;
  if (![position.x, position.y].every(Number.isFinite)) return project;

  const oldPos = wall[endpoint];
  const nextPos = { x: position.x, y: position.y };

  const nextWalls = activeFloor.walls.map((item) => {
    let start = item.start;
    let end = item.end;
    if (item.id === wallId) {
      if (endpoint === "start") start = nextPos;
      else end = nextPos;
    } else {
      if (pointsEqualWithin(item.start, oldPos)) start = nextPos;
      if (pointsEqualWithin(item.end, oldPos)) end = nextPos;
    }
    if (samePoint(start, end)) return item;
    return { ...item, start: { ...start }, end: { ...end } };
  });

  const floorWithWalls: PlannerFloor = { ...activeFloor, walls: nextWalls };
  const floorWithRooms = syncEnclosedRoomsFromWalls(floorWithWalls, idFactory);
  const floors = project.floors.map((floor, index) =>
    index === floorIndex ? floorWithRooms : floor,
  );
  return { ...project, floors, updatedAt: now };
}
