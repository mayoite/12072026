import { describe, expect, it } from "vitest";
import {
  alignEntities,
  centerFromMinEdge,
  distributeEntities,
  minEdgeFromCenter,
  spaceEntitiesWithExactGap,
  type PositionedEntity,
} from "@/features/planner/lib/geometry/alignDistribute";

const entities: PositionedEntity[] = [
  { id: "a", xMm: 0, yMm: 0, widthMm: 100, depthMm: 50 },
  { id: "b", xMm: 300, yMm: 20, widthMm: 100, depthMm: 50 },
  { id: "c", xMm: 800, yMm: 40, widthMm: 100, depthMm: 50 },
];

describe("alignDistribute", () => {
  it("returns empty when fewer than 2 entities for align", () => {
    expect(alignEntities(entities.slice(0, 1), "x", "min")).toEqual([]);
  });

  it("aligns left (min) on x", () => {
    const updates = alignEntities(entities, "x", "min");
    expect(updates.every((u) => u.xMm === 0)).toBe(true);
  });

  it("aligns center on y", () => {
    const updates = alignEntities(entities, "y", "center");
    expect(updates).toHaveLength(3);
    const centers = updates.map((u, i) => u.yMm + entities[i]!.depthMm / 2);
    // Map order matches input entity order, not y-sort.
    const byId = new Map(updates.map((u) => [u.id, u]));
    const centerOf = (id: string, depth: number) =>
      (byId.get(id)!.yMm as number) + depth / 2;
    expect(centerOf("a", 50)).toBeCloseTo(centerOf("b", 50), 5);
    expect(centerOf("b", 50)).toBeCloseTo(centerOf("c", 50), 5);
  });

  it("distributes only when 3+ entities", () => {
    expect(distributeEntities(entities.slice(0, 2), "x")).toEqual([]);
    const updates = distributeEntities(entities, "x");
    expect(updates).toHaveLength(3);
    expect(updates[0]!.id).toBe("a");
    expect(updates[2]!.id).toBe("c");
    // Equal edge gaps: first and last fixed.
    const byId = Object.fromEntries(updates.map((u) => [u.id, u]));
    const gapAb = byId.b!.xMm - (byId.a!.xMm + 100);
    const gapBc = byId.c!.xMm - (byId.b!.xMm + 100);
    expect(gapAb).toBeCloseTo(gapBc, 5);
  });

  it("spaces with exact edge gap and keeps first fixed", () => {
    expect(spaceEntitiesWithExactGap(entities.slice(0, 1), "x", 50)).toEqual([]);
    const updates = spaceEntitiesWithExactGap(entities, "x", 200);
    expect(updates[0]).toEqual({ id: "a", xMm: 0, yMm: 0 });
    expect(updates[1]).toEqual({ id: "b", xMm: 300, yMm: 20 });
    expect(updates[2]).toEqual({ id: "c", xMm: 600, yMm: 40 });
    // 100 width + 200 gap → next at +300 from previous leading.
  });

  it("spaces on y with zero gap (butt joints)", () => {
    const stack: PositionedEntity[] = [
      { id: "a", xMm: 10, yMm: 0, widthMm: 40, depthMm: 50 },
      { id: "b", xMm: 10, yMm: 200, widthMm: 40, depthMm: 50 },
    ];
    const updates = spaceEntitiesWithExactGap(stack, "y", 0);
    expect(updates[0]!.yMm).toBe(0);
    expect(updates[1]!.yMm).toBe(50);
  });

  it("converts center ↔ min-edge", () => {
    const min = minEdgeFromCenter(500, 400, 200, 100);
    expect(min).toEqual({ xMm: 400, yMm: 350 });
    expect(centerFromMinEdge(min.xMm, min.yMm, 200, 100)).toEqual({
      cxMm: 500,
      cyMm: 400,
    });
  });
});
