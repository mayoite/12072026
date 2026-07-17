import { describe, expect, it } from "vitest";
import { extractProjectPlacements } from "@/features/planner/ai/extractProjectPlacements";
import type { PlannerFloor } from "@/features/planner/model/types";

function floor(
  furniture: PlannerFloor["furniture"],
): PlannerFloor {
  return {
    id: "f1",
    name: "G",
    level: 0,
    walls: [],
    rooms: [],
    doors: [],
    windows: [],
    furniture,
    stairs: [],
    columns: [],
    guides: [],
    measurements: [],
    annotations: [],
    textAnnotations: [],
    groups: [],
  };
}

describe("extractProjectPlacements", () => {
  it("returns empty for null/undefined floor", () => {
    expect(extractProjectPlacements(null)).toEqual([]);
    expect(extractProjectPlacements(undefined)).toEqual([]);
  });

  it("infers chair / storage / workstation kinds", () => {
    const result = extractProjectPlacements(
      floor([
        {
          id: "c1",
          catalogId: "task-chair",
          position: { x: 0, y: 0 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
          width: 500,
          depth: 500,
        },
        {
          id: "s1",
          catalogId: "storage-cabinet",
          position: { x: 1, y: 0 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
          width: 800,
          depth: 400,
        },
        {
          id: "d1",
          catalogId: "desk-linear",
          position: { x: 2, y: 0 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
        },
      ]),
    );
    expect(result).toHaveLength(3);
    expect(result.find((p) => p.shapeId === "c1")?.kind).toBe("chair");
    expect(result.find((p) => p.shapeId === "s1")?.kind).toBe("storage");
    expect(result.find((p) => p.shapeId === "d1")?.kind).toBe("workstation");
    expect(result.find((p) => p.shapeId === "d1")?.widthMm).toBe(1200);
  });
});
