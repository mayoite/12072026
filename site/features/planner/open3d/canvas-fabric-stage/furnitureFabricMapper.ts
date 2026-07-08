/**
 * Pure document ↔ Fabric pose mapping for open3d furniture stage (Fabric 2B slice).
 *
 * Coordinates: project space is millimetres; Fabric left/top use the same screen
 * space as FeasibilityCanvas (projectToScreen / screenToProject).
 * entityId on Fabric objects MUST equal Open3dFurnitureItem.id — never invent ids.
 * Fabric JSON is never persisted; document furniture is the source of truth.
 */

import type { Open3dFurnitureItem, Open3dPoint } from "../model/types";
import { normalizeDegrees } from "../model/units";
import {
  projectToScreen,
  screenToProject,
  type CanvasTransform,
} from "../lib/geometry/snapping";

/** Matches FeasibilityCanvas furniture default when width/depth omitted. */
export const DEFAULT_FURNITURE_FOOTPRINT_MM = 600;

/**
 * Matches FeasibilityCanvas INITIAL_TRANSFORM so flag-on overlay starts aligned.
 * Live pan/zoom is pushed via CanvasStatusSnapshot.transform when the flag is on.
 */
export const DEFAULT_FABRIC_STAGE_TRANSFORM: CanvasTransform = {
  origin: { x: -4000, y: -2500 },
  scale: 0.1,
};

/** Custom property key stored on Fabric objects (not serialized to project JSON). */
export const FURNITURE_ENTITY_ID_PROP = "entityId" as const;

export type FurnitureFabricPose = {
  entityId: string;
  /** Screen / Fabric X (origin center). */
  left: number;
  /** Screen / Fabric Y (origin center). */
  top: number;
  /** Footprint width in screen units (widthMm * scale). */
  width: number;
  /** Footprint depth in screen units (depthMm * scale). */
  height: number;
  /** Degrees, same convention as Open3dFurnitureItem.rotation. */
  angle: number;
  widthMm: number;
  depthMm: number;
  locked: boolean;
};

export type FurnitureDocumentPoseUpdate = {
  entityId: string;
  position: Open3dPoint;
  rotation: number;
};

export type FurnitureFabricPoseInput = {
  entityId: string;
  left: number;
  top: number;
  angle: number;
};

export function furnitureFootprintMm(item: Pick<Open3dFurnitureItem, "width" | "depth">): {
  widthMm: number;
  depthMm: number;
} {
  return {
    widthMm: item.width ?? DEFAULT_FURNITURE_FOOTPRINT_MM,
    depthMm: item.depth ?? DEFAULT_FURNITURE_FOOTPRINT_MM,
  };
}

/**
 * Map a document furniture item to Fabric Rect pose (center origin).
 * entityId is furniture.id — required for write-back without Fabric JSON.
 */
export function furnitureToFabricPose(
  item: Open3dFurnitureItem,
  transform: CanvasTransform = DEFAULT_FABRIC_STAGE_TRANSFORM,
): FurnitureFabricPose {
  const { widthMm, depthMm } = furnitureFootprintMm(item);
  const center = projectToScreen(item.position, transform);
  return {
    entityId: item.id,
    left: center.x,
    top: center.y,
    width: widthMm * transform.scale,
    height: depthMm * transform.scale,
    angle: normalizeDegrees(item.rotation),
    widthMm,
    depthMm,
    locked: item.locked === true,
  };
}

/**
 * Map a Fabric object pose (center origin) back to project mm + rotation degrees.
 */
export function fabricPoseToDocumentUpdate(
  pose: FurnitureFabricPoseInput,
  transform: CanvasTransform = DEFAULT_FABRIC_STAGE_TRANSFORM,
): FurnitureDocumentPoseUpdate {
  return {
    entityId: pose.entityId,
    position: screenToProject({ x: pose.left, y: pose.top }, transform),
    rotation: normalizeDegrees(pose.angle),
  };
}

type EntityIdCarrier = {
  get?: (key: string) => unknown;
  entityId?: unknown;
};

/** Read entityId from a Fabric object (custom prop or direct field). */
export function readFurnitureEntityId(target: EntityIdCarrier | null | undefined): string | null {
  if (!target) return null;
  if (typeof target.get === "function") {
    const viaGet = target.get(FURNITURE_ENTITY_ID_PROP);
    if (typeof viaGet === "string" && viaGet.length > 0) return viaGet;
  }
  if (typeof target.entityId === "string" && target.entityId.length > 0) {
    return target.entityId;
  }
  return null;
}

/** Write entityId onto a Fabric-like object with `.set`. */
export function writeFurnitureEntityId(
  target: { set: (key: string, value: string) => unknown },
  entityId: string,
): void {
  target.set(FURNITURE_ENTITY_ID_PROP, entityId);
}

/**
 * Rebuild helper: map a full furniture list to poses (stable order preserved).
 */
export function furnitureListToFabricPoses(
  furniture: readonly Open3dFurnitureItem[],
  transform: CanvasTransform = DEFAULT_FABRIC_STAGE_TRANSFORM,
): FurnitureFabricPose[] {
  return furniture.map((item) => furnitureToFabricPose(item, transform));
}
