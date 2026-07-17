import type {
  PlannerFloor,
  PlannerSceneEnvelope,
  PlannerProject,
  PlannerRoom,
  PlannerWall,
} from "./types";
import { themeColorRef } from "../shared/readThemeColor";
import { PLANNER_COLOR_TOKENS, ROOM_FILL_TOKENS } from "../shared/themeColorTokens";
import { newEntityId } from "@/features/planner/lib/newEntityId";
import {
  rectangularRoomMetrics,
  rectangularRoomSegments,
} from "@/features/planner/lib/geometry/roomOutline";

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
  const height = options.wallHeightMm ?? 2700;
  const thickness = options.wallThicknessMm ?? 150;
  const metrics = rectangularRoomMetrics(
    { x: 0, y: 0 },
    { x: options.widthMm, y: options.depthMm },
  );
  const segments = rectangularRoomSegments(
    { x: 0, y: 0 },
    { x: options.widthMm, y: options.depthMm },
  );
  const wallIds = segments.map(() => idFactory());
  const walls: PlannerWall[] = segments.map((segment, index) => {
    const wallId = wallIds[index];
    if (!wallId) {
      throw new Error("Room wall id generation failed.");
    }
    return {
      id: wallId,
      start: { ...segment.start },
      end: { ...segment.end },
      height,
      thickness,
      color: themeColorRef(PLANNER_COLOR_TOKENS.wallDefault),
    };
  });
  const room: PlannerRoom = {
    id: idFactory(),
    name: "Room 1",
    walls: wallIds,
    floorTexture: "plain",
    area: Number((metrics.areaMm2 / 1_000_000).toFixed(2)),
    roomType: "indoor",
    labelOffset: {
      x: metrics.minX + metrics.widthMm / 2,
      y: metrics.minY + metrics.depthMm / 2,
    },
    color: themeColorRef(ROOM_FILL_TOKENS[0]),
  };

  return {
    ...project,
    floors: (() => {
      const baseFloor = project.floors[0];
      if (!baseFloor) {
        throw new Error("Project is missing a floor.");
      }
      return [{ ...baseFloor, walls, rooms: [room] }];
    })(),
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
