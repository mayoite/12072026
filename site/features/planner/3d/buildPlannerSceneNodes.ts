/**
 * Pure adapter: PlannerProject → scene nodes for 3D rebuild.
 * Document remains source of truth; nodes carry entity ids for continuity.
 */

import {
  resolveFurnitureGlbUrl,
  shouldLoadGlb,
} from "@/features/planner/lib/glbAssetPolicy";
import type {
  PlannerFloor,
  PlannerFurnitureGeometryMode,
  PlannerModularCabinetV0Options,
  PlannerProject,
  PlannerWorkstationV0Options,
} from "@/features/planner/project/model/types";
import { degreesToRadians } from "@/features/planner/project/model/units";

export type PlannerSceneNodeKind = "wall" | "furniture";

export interface PlannerSceneNode {
  readonly id: string;
  readonly kind: PlannerSceneNodeKind;
  /** Plan mm: center x */
  readonly xMm: number;
  /** Plan mm: center y (maps to world Z) */
  readonly yMm: number;
  /** Plan mm */
  readonly widthMm: number;
  /** Plan mm */
  readonly depthMm: number;
  /** Plan mm */
  readonly heightMm: number;
  /** Radians about vertical axis */
  readonly rotation: number;
  readonly color?: string;
  readonly catalogId?: string;
  /** Pass-through for modular multi-part mesh (no THREE on document). */
  readonly geometryMode?: PlannerFurnitureGeometryMode;
  readonly modularOptions?: PlannerModularCabinetV0Options;
  readonly workstationOptions?: PlannerWorkstationV0Options;
  /**
   * Resolved system-generated GLB candidate (generatedGlbUrl | glbUrl | meshUrl).
   * Viewer loads only when shouldLoadGlb(url) is true.
   */
  readonly generatedGlbUrl?: string;
}

const DEFAULT_FURNITURE_W = 800;
const DEFAULT_FURNITURE_D = 800;
const DEFAULT_FURNITURE_H = 750;
const DEFAULT_WALL_HEIGHT = 2700;

function activeFloor(project: PlannerProject): PlannerFloor | undefined {
  return (
    project.floors.find((f) => f.id === project.activeFloorId) ??
    project.floors[0]
  );
}

function wallNode(
  wall: PlannerFloor["walls"][number],
): PlannerSceneNode {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const length = Math.hypot(dx, dy) || 1;
  const cx = (wall.start.x + wall.end.x) / 2;
  const cy = (wall.start.y + wall.end.y) / 2;
  const rotation = Math.atan2(dy, dx);
  return {
    id: wall.id,
    kind: "wall",
    xMm: cx,
    yMm: cy,
    widthMm: length,
    depthMm: Math.max(wall.thickness, 50),
    heightMm: wall.height > 0 ? wall.height : DEFAULT_WALL_HEIGHT,
    rotation,
    color: wall.color,
  };
}

/**
 * Build ordered scene nodes from the active floor (walls + furniture).
 * Units: millimetres in plan space (same as document).
 */
export function buildPlannerSceneNodes(
  project: Pick<PlannerProject, "floors" | "activeFloorId">,
): PlannerSceneNode[] {
  const floor = activeFloor(project as PlannerProject);
  if (!floor) return [];

  const nodes: PlannerSceneNode[] = [];

  for (const wall of floor.walls) {
    nodes.push(wallNode(wall));
  }

  for (const item of floor.furniture) {
    const widthMm =
      (item.width ?? DEFAULT_FURNITURE_W) * (item.scale?.x ?? 1);
    const depthMm =
      (item.depth ?? DEFAULT_FURNITURE_D) * (item.scale?.y ?? 1);
    const heightMm =
      (item.height ?? DEFAULT_FURNITURE_H) * (item.scale?.z ?? 1);
    const resolvedGlb = resolveFurnitureGlbUrl(item);
    // Only attach URLs that policy allows; designer static never reaches the loader.
    const loadableGlb =
      resolvedGlb !== null && shouldLoadGlb(resolvedGlb) ? resolvedGlb : null;
    nodes.push({
      id: item.id,
      kind: "furniture",
      xMm: item.position.x,
      yMm: item.position.y,
      widthMm,
      depthMm,
      heightMm,
      // Document rotation is degrees (2D canvas, properties); scene nodes are radians.
      rotation: degreesToRadians(item.rotation),
      color: item.color,
      catalogId: item.catalogId,
      ...(item.geometryMode !== undefined
        ? { geometryMode: item.geometryMode }
        : {}),
      ...(item.modularOptions !== undefined
        ? { modularOptions: { ...item.modularOptions } }
        : {}),
      ...(item.workstationOptions !== undefined
        ? {
            workstationOptions: {
              ...item.workstationOptions,
              modules: [...item.workstationOptions.modules],
            },
          }
        : {}),
      ...(loadableGlb !== null ? { generatedGlbUrl: loadableGlb } : {}),
    });
  }

  return nodes;
}

/** Convert plan mm → Three world metres (Y-up, plan Y → world Z). */
export function mmToMeters(mm: number): number {
  return mm * 0.001;
}
