/**
 * W3 / Fabric select path — pure mapping from Fabric active object → workspace selection.
 * RED→GREEN: selectionFromFabricTarget must exist and map entity type + id only.
 */
import { describe, expect, it } from "vitest";

import {
  CANVAS_ENTITY_TYPE_PROP,
  selectionFromFabricTarget,
} from "@/features/planner/canvas/fabricSelection";
import {
  FURNITURE_ENTITY_ID_PROP,
  writeFurnitureEntityId,
} from "@/features/planner/canvas/furnitureFabricMapper";

type PropBag = Map<string, unknown>;

function makeCarrier(props: Record<string, unknown> = {}) {
  const bag: PropBag = new Map(Object.entries(props));
  return {
    get(key: string) {
      return bag.get(key);
    },
    set(key: string, value: unknown) {
      bag.set(key, value);
      return this;
    },
  };
}

describe("selectionFromFabricTarget (Fabric → setSelection)", () => {
  it("returns furniture selection when type + entityId are present", () => {
    const target = makeCarrier({
      [CANVAS_ENTITY_TYPE_PROP]: "furniture",
      [FURNITURE_ENTITY_ID_PROP]: "furn-1",
    });
    expect(selectionFromFabricTarget(target)).toEqual({
      type: "furniture",
      id: "furn-1",
    });
  });

  it("returns wall selection when type + entityId are present", () => {
    const target = makeCarrier({
      [CANVAS_ENTITY_TYPE_PROP]: "wall",
      [FURNITURE_ENTITY_ID_PROP]: "wall-9",
    });
    expect(selectionFromFabricTarget(target)).toEqual({
      type: "wall",
      id: "wall-9",
    });
  });

  it("reads entityId written via writeFurnitureEntityId", () => {
    const target = makeCarrier({ [CANVAS_ENTITY_TYPE_PROP]: "furniture" });
    writeFurnitureEntityId(target, "pose-keep");
    expect(selectionFromFabricTarget(target)).toEqual({
      type: "furniture",
      id: "pose-keep",
    });
  });

  it("returns null when target is null/undefined", () => {
    expect(selectionFromFabricTarget(null)).toBeNull();
    expect(selectionFromFabricTarget(undefined)).toBeNull();
  });

  it("returns null when type is missing or unknown", () => {
    const noType = makeCarrier({ [FURNITURE_ENTITY_ID_PROP]: "x" });
    expect(selectionFromFabricTarget(noType)).toBeNull();

    const badType = makeCarrier({
      [CANVAS_ENTITY_TYPE_PROP]: "door",
      [FURNITURE_ENTITY_ID_PROP]: "x",
    });
    expect(selectionFromFabricTarget(badType)).toBeNull();
  });

  it("returns null when entityId is missing or empty", () => {
    const missing = makeCarrier({ [CANVAS_ENTITY_TYPE_PROP]: "furniture" });
    expect(selectionFromFabricTarget(missing)).toBeNull();

    const empty = makeCarrier({
      [CANVAS_ENTITY_TYPE_PROP]: "furniture",
      [FURNITURE_ENTITY_ID_PROP]: "",
    });
    expect(selectionFromFabricTarget(empty)).toBeNull();
  });
});
