import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/planner/lib/newEntityId", () => {
  let n = 0;
  return {
    newEntityId: () => `id-${++n}`,
  };
});

import { usePlannerFurnitureStore } from "@/features/planner/cloud-store/plannerFurnitureStore";
import type { FurnitureItem } from "@/features/planner/cloud-store/plannerTypes";

function draft(name: string): Omit<FurnitureItem, "id" | "zIndex"> {
  return {
    catalogId: `cat-${name}`,
    name,
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    rotation: 0,
    color: "#abc",
    shape: "rect",
  };
}

describe("plannerFurnitureStore", () => {
  beforeEach(() => {
    usePlannerFurnitureStore.setState({
      furniture: [],
      instancedFurniture: [],
      activeCatalogId: null,
      selectedId: null,
      selectedIds: [],
    });
  });

  it("adds furniture with id and zIndex and mirrors instanced list", () => {
    usePlannerFurnitureStore.getState().addFurniture(draft("Desk"));
    const state = usePlannerFurnitureStore.getState();
    expect(state.furniture).toHaveLength(1);
    expect(state.furniture[0]?.id).toMatch(/^id-/);
    expect(state.furniture[0]?.zIndex).toBe(0);
    expect(state.instancedFurniture).toHaveLength(1);
    expect(state.instancedFurniture[0]?.catalogId).toBe("cat-Desk");
    expect(state.instancedFurniture[0]?.position).toEqual([10, 0, 20]);
    expect(state.instancedFurniture[0]?.dimensions).toEqual([100, 0, 50]);
  });

  it("updates, selects, and deletes furniture", () => {
    usePlannerFurnitureStore.getState().addFurniture(draft("A"));
    usePlannerFurnitureStore.getState().addFurniture(draft("B"));
    const idA = usePlannerFurnitureStore.getState().furniture[0]!.id;
    const idB = usePlannerFurnitureStore.getState().furniture[1]!.id;

    usePlannerFurnitureStore.getState().updateFurniture(idA, { x: 99 });
    expect(usePlannerFurnitureStore.getState().furniture.find((f) => f.id === idA)?.x).toBe(99);

    usePlannerFurnitureStore.getState().setSelectedId(idA);
    usePlannerFurnitureStore.getState().toggleSelectedId(idB);
    expect(usePlannerFurnitureStore.getState().selectedIds).toContain(idB);

    usePlannerFurnitureStore.getState().deleteFurniture(idA);
    expect(usePlannerFurnitureStore.getState().furniture.map((f) => f.id)).toEqual([idB]);
    expect(usePlannerFurnitureStore.getState().selectedId).toBeNull();
  });

  it("batch update and clear selection", () => {
    usePlannerFurnitureStore.getState().addFurnitureBatch([draft("X"), draft("Y")]);
    const ids = usePlannerFurnitureStore.getState().furniture.map((f) => f.id);
    expect(ids).toHaveLength(2);

    usePlannerFurnitureStore.getState().updateFurnitureBatch([
      { id: ids[0]!, updates: { name: "X2" } },
      { id: ids[1]!, updates: { name: "Y2" } },
    ]);
    expect(usePlannerFurnitureStore.getState().furniture.map((f) => f.name)).toEqual([
      "X2",
      "Y2",
    ]);

    usePlannerFurnitureStore.getState().setSelectedIds(ids);
    usePlannerFurnitureStore.getState().clearSelection();
    expect(usePlannerFurnitureStore.getState().selectedIds).toEqual([]);
    expect(usePlannerFurnitureStore.getState().selectedId).toBeNull();
  });

  it("bringToFront and sendToBack adjust zIndex extremes", () => {
    usePlannerFurnitureStore.getState().addFurnitureBatch([
      draft("A"),
      draft("B"),
      draft("C"),
    ]);
    const items = usePlannerFurnitureStore.getState().furniture;
    const a = items[0]!.id;
    const c = items[2]!.id;

    usePlannerFurnitureStore.getState().bringToFront(a);
    const afterFront = usePlannerFurnitureStore.getState().furniture;
    const frontItem = afterFront.find((f) => f.id === a)!;
    const maxZ = Math.max(...afterFront.map((f) => f.zIndex));
    expect(frontItem.zIndex).toBe(maxZ);

    usePlannerFurnitureStore.getState().sendToBack(c);
    const afterBack = usePlannerFurnitureStore.getState().furniture;
    const backItem = afterBack.find((f) => f.id === c)!;
    const minZ = Math.min(...afterBack.map((f) => f.zIndex));
    expect(backItem.zIndex).toBe(minZ);
  });

  it("setActiveCatalogId stores catalog selection", () => {
    usePlannerFurnitureStore.getState().setActiveCatalogId("desk-1");
    expect(usePlannerFurnitureStore.getState().activeCatalogId).toBe("desk-1");
  });
});
