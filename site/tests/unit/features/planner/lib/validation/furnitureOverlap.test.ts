import { describe, expect, it } from "vitest";

import {
  aabbsOverlap,
  detectFurnitureOverlaps,
} from "@/features/planner/lib/validation/furnitureOverlap";
import type { PlacedFurniture } from "@/features/planner/lib/validation/types";

function desk(id: string, xMm: number, yMm: number): PlacedFurniture {
  return { id, xMm, yMm, widthMm: 1200, depthMm: 600 };
}

describe("furnitureOverlap (P14 TDD)", () => {
  it("detects overlapping axis-aligned footprints", () => {
    expect(aabbsOverlap(desk("a", 0, 0), desk("b", 500, 0))).toBe(true);
    expect(aabbsOverlap(desk("a", 0, 0), desk("b", 2000, 0))).toBe(false);
  });

  it("returns a blocking issue with focus point and remedy for overlapping pair", () => {
    const issues = detectFurnitureOverlaps([
      desk("desk-1", 0, 0),
      desk("desk-2", 500, 100),
    ]);

    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      ruleId: "furniture-overlap",
      severity: "error",
      objectIds: ["desk-1", "desk-2"],
      remedy: expect.stringContaining("Move"),
      focusMm: { x: 250, y: 50 },
    });
  });

  it("returns no issues when furniture is separated", () => {
    expect(
      detectFurnitureOverlaps([desk("desk-1", 0, 0), desk("desk-2", 3000, 0)]),
    ).toEqual([]);
  });
});