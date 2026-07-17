/**
 * Pure helpers for wall endpoint grips on the Fabric stage.
 * Grips are transient UI; document authority stays on PlannerWall endpoints.
 */

import type { PlannerPoint, PlannerWall } from "@/features/planner/model/types";
import {
  projectToScreen,
  screenToProject,
  type CanvasTransform,
} from "@/features/planner/lib/geometry/snapping";

export const WALL_GRIP_KIND_PROP = "plannerWallGrip" as const;
export const WALL_GRIP_ENDPOINT_PROP = "plannerWallEndpoint" as const;
export const WALL_GRIP_RADIUS_PX = 7;

export type WallGripEndpoint = "start" | "end";

export type WallGripMeta = {
  wallId: string;
  endpoint: WallGripEndpoint;
};

export type WallGripScreenPair = {
  start: PlannerPoint;
  end: PlannerPoint;
};

type MetaCarrier = {
  get?: (key: string) => unknown;
  set?: (key: string, value: string) => unknown;
};

/** Screen-space centres for start/end grips of a wall centreline. */
export function wallEndpointGripScreens(
  wall: Pick<PlannerWall, "start" | "end">,
  transform: CanvasTransform,
): WallGripScreenPair {
  return {
    start: projectToScreen(wall.start, transform),
    end: projectToScreen(wall.end, transform),
  };
}

/** Map a grip's Fabric left/top (center origin) back to project millimetres. */
export function projectPointFromGripScreen(
  screen: PlannerPoint,
  transform: CanvasTransform,
): PlannerPoint {
  return screenToProject(screen, transform);
}

/**
 * Resolve the single selected wall that should show endpoint grips.
 * Multi-select and non-wall selections yield null.
 */
export function resolveWallForEndpointGrips(
  walls: ReadonlyArray<PlannerWall>,
  selection: { type: string; ids: readonly string[] } | null | undefined,
): PlannerWall | null {
  if (!selection || selection.type !== "wall") return null;
  if (selection.ids.length !== 1) return null;
  const id = selection.ids[0];
  if (!id) return null;
  return walls.find((item) => item.id === id) ?? null;
}

export function writeWallGripMeta(target: MetaCarrier, meta: WallGripMeta): void {
  target.set?.(WALL_GRIP_KIND_PROP, "1");
  target.set?.(WALL_GRIP_ENDPOINT_PROP, meta.endpoint);
  target.set?.("entityId", meta.wallId);
}

export function readWallGripMeta(
  target: MetaCarrier | null | undefined,
): WallGripMeta | null {
  if (!target?.get) return null;
  const kind = target.get(WALL_GRIP_KIND_PROP);
  if (kind !== "1" && kind !== true) return null;
  const endpoint = target.get(WALL_GRIP_ENDPOINT_PROP);
  if (endpoint !== "start" && endpoint !== "end") return null;
  const wallId = target.get("entityId");
  if (typeof wallId !== "string" || wallId.length === 0) return null;
  return { wallId, endpoint };
}

/** Fabric Circle constructor options for a draggable endpoint grip. */
export function wallGripFabricOptions(input: {
  screen: PlannerPoint;
  stroke: string;
  fill: string;
}): {
  left: number;
  top: number;
  originX: "center";
  originY: "center";
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  selectable: boolean;
  evented: boolean;
  hasControls: boolean;
  hasBorders: boolean;
  lockRotation: boolean;
  lockScalingX: boolean;
  lockScalingY: boolean;
  lockSkewingX: boolean;
  lockSkewingY: boolean;
  objectCaching: boolean;
  hoverCursor: string;
  moveCursor: string;
} {
  return {
    left: input.screen.x,
    top: input.screen.y,
    originX: "center",
    originY: "center",
    radius: WALL_GRIP_RADIUS_PX,
    fill: input.fill,
    stroke: input.stroke,
    strokeWidth: 2,
    selectable: true,
    evented: true,
    hasControls: false,
    hasBorders: false,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true,
    lockSkewingX: true,
    lockSkewingY: true,
    objectCaching: false,
    hoverCursor: "grab",
    moveCursor: "grabbing",
  };
}
