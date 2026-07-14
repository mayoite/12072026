import { describe, expect, it } from "vitest";
import { layoutGridPositions } from "@/features/planner/lib/geometry/gridLayout";

describe("gridLayout", () => {
  it("returns empty for non-positive count", () => {
    expect(layoutGridPositions(0, 1200, 600)).toEqual([]);
    expect(layoutGridPositions(-1, 1200, 600)).toEqual([]);
  });

  it("lays out row-major with default gap pitch", () => {
    const cells = layoutGridPositions(3, 1500, 600, { columns: 3 });
    expect(cells[0]).toEqual({ index: 0, xMm: 0, yMm: 0 });
    expect(cells[1]).toEqual({ index: 1, xMm: 1700, yMm: 0 });
  });

  it("wraps rows and honours origin", () => {
    const cells = layoutGridPositions(4, 1000, 500, {
      columns: 2,
      gapMm: 100,
      originMm: { x: 50, y: 25 },
    });
    expect(cells[2]).toEqual({ index: 2, xMm: 50, yMm: 25 + 600 });
  });
});
