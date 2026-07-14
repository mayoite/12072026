import { describe, expect, it } from "vitest";
import {
  alignEntities,
  distributeEntities,
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
    expect(centers[0]).toBeCloseTo(centers[1]!, 5);
  });

  it("distributes only when 3+ entities", () => {
    expect(distributeEntities(entities.slice(0, 2), "x")).toEqual([]);
    const updates = distributeEntities(entities, "x");
    expect(updates).toHaveLength(3);
    expect(updates[0]!.id).toBe("a");
    expect(updates[2]!.id).toBe("c");
  });
});
