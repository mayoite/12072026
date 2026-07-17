import { describe, expect, it } from "vitest";
import {
  aabbEdgeGapMm,
  detectFurnitureClearance,
  DEFAULT_AISLE_CLEARANCE_MM,
} from "@/features/planner/lib/validation/furnitureClearance";
import type { PlacedFurniture } from "@/features/planner/lib/validation/types";

function desk(id: string, xMm: number, yMm: number): PlacedFurniture {
  return { id, xMm, yMm, widthMm: 1200, depthMm: 600, rotationDeg: 0 };
}

describe("furnitureClearance", () => {
  it("computes edge gap between separated AABBs", () => {
    // 1200-wide desks: centres 2000 apart → gap = 2000 - 600 - 600 = 800
    const gap = aabbEdgeGapMm(
      { minX: -600, minY: -300, maxX: 600, maxY: 300 },
      { minX: 1400, minY: -300, maxX: 2600, maxY: 300 },
    );
    expect(gap).toBe(800);
  });

  it("returns 0 for overlapping AABBs", () => {
    const gap = aabbEdgeGapMm(
      { minX: 0, minY: 0, maxX: 100, maxY: 100 },
      { minX: 50, minY: 50, maxX: 150, maxY: 150 },
    );
    expect(gap).toBe(0);
  });

  it("warns when gap is positive but under aisle clearance", () => {
    // centres 1600 apart, half-widths 600 → gap 400 < 900
    const issues = detectFurnitureClearance(
      [desk("a", 0, 0), desk("b", 1600, 0)],
      DEFAULT_AISLE_CLEARANCE_MM,
    );
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      ruleId: "aisle-clearance",
      severity: "warning",
      objectIds: ["a", "b"],
    });
    expect(issues[0]?.message).toMatch(/400/);
  });

  it("does not warn when gap meets clearance", () => {
    // centres 2400 apart → gap 1200 >= 900
    const issues = detectFurnitureClearance([
      desk("a", 0, 0),
      desk("b", 2400, 0),
    ]);
    expect(issues).toEqual([]);
  });

  it("does not emit clearance for overlapping pairs (overlap rule owns them)", () => {
    const issues = detectFurnitureClearance([
      desk("a", 0, 0),
      desk("b", 200, 0),
    ]);
    expect(issues).toEqual([]);
  });
});
