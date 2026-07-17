/**
 * Pure Fabric active-object → workspace selection mapping (W3 select path).
 * Stage events call this; OOPlannerWorkspace maps { type, id } → setSelection.
 */

import {
  readFurnitureEntityId,
  type EntityIdCarrier,
} from "./furnitureFabricMapper";

export const CANVAS_ENTITY_TYPE_PROP = "plannerEntityType" as const;

export type FabricCanvasEntityType = "wall" | "door" | "window" | "furniture";

export type FabricEntitySelection = {
  type: FabricCanvasEntityType;
  id: string;
};

type EntityTypeCarrier = {
  get?: (key: string) => unknown;
  set?: (key: string, value: string) => unknown;
};

/** Fabric Group / active child may nest under `.group` or `.parent`. */
type ParentableCarrier = EntityIdCarrier &
  EntityTypeCarrier & {
    group?: ParentableCarrier | null;
    parent?: ParentableCarrier | null;
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
  return value === "wall" ||
    value === "door" ||
    value === "window" ||
    value === "furniture"
    ? value
    : null;
}

/**
 * Map a Fabric active object to a document selection payload.
 * Walks parent Group when a sub-prim is hit (Block2D groups store id on the root).
 * Returns null for empty canvas, missing metadata, or unsupported types.
 */
export function selectionFromFabricTarget(
  target: ParentableCarrier | null | undefined,
): FabricEntitySelection | null {
  let current: ParentableCarrier | null | undefined = target;
  let depth = 0;
  while (current && depth < 8) {
    const type = readCanvasEntityType(current);
    const id = readFurnitureEntityId(current);
    if (type && id) return { type, id };
    current = current.group ?? current.parent ?? null;
    depth += 1;
  }
  return null;
}
