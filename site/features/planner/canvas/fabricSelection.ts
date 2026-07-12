/**
 * Pure Fabric active-object → workspace selection mapping (W3 select path).
 * Stage events call this; OOPlannerWorkspace maps { type, id } → setSelection.
 */

import {
  readFurnitureEntityId,
  type EntityIdCarrier,
} from "./furnitureFabricMapper";

export const CANVAS_ENTITY_TYPE_PROP = "plannerEntityType" as const;

export type FabricCanvasEntityType = "wall" | "furniture";

export type FabricEntitySelection = {
  type: FabricCanvasEntityType;
  id: string;
};

type EntityTypeCarrier = {
  get?: (key: string) => unknown;
  set?: (key: string, value: string) => unknown;
};

export function writeCanvasEntityType(
  target: EntityTypeCarrier,
  type: FabricCanvasEntityType,
): void {
  target.set?.(CANVAS_ENTITY_TYPE_PROP, type);
}

export function readCanvasEntityType(
  target: EntityTypeCarrier | null | undefined,
): FabricCanvasEntityType | null {
  const value = target?.get?.(CANVAS_ENTITY_TYPE_PROP);
  return value === "wall" || value === "furniture" ? value : null;
}

/**
 * Map a Fabric active object to a document selection payload.
 * Returns null for empty canvas, missing metadata, or non-furniture/wall types.
 */
export function selectionFromFabricTarget(
  target: (EntityIdCarrier & EntityTypeCarrier) | null | undefined,
): FabricEntitySelection | null {
  const type = readCanvasEntityType(target);
  const id = readFurnitureEntityId(target);
  if (!type || !id) return null;
  return { type, id };
}
