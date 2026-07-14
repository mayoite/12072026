import { describe, expect, it } from "vitest";
import {
  applyFurnitureBatchUpdates,
  toggleSelectedIdInList,
} from "@/features/planner/cloud-store/plannerMutationUtils";
import type { FurnitureItem } from "@/features/planner/cloud-store/plannerTypes";

function furniture(id: string, name: string): FurnitureItem {
  return {
    id,
    catalogId: `cat-${id}`,
    name,
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    rotation: 0,
    color: "#fff",
    shape: "rect",
    zIndex: 0,
  };
}

describe("plannerMutationUtils", () => {
  it("adds id when not selected", () => {
    expect(toggleSelectedIdInList(["a"], "b")).toEqual(["a", "b"]);
  });

  it("removes id when already selected", () => {
    expect(toggleSelectedIdInList(["a", "b"], "a")).toEqual(["b"]);
  });

  it("applies batch updates by id only", () => {
    const items = [furniture("1", "A"), furniture("2", "B")];
    const next = applyFurnitureBatchUpdates(items, [
      { id: "2", changes: { name: "B2", x: 40 } },
      { id: "missing", changes: { name: "nope" } },
    ]);
    expect(next[0]?.name).toBe("A");
    expect(next[1]?.name).toBe("B2");
    expect(next[1]?.x).toBe(40);
    expect(next).toHaveLength(2);
  });
});
