import { describe, expect, it } from "vitest";

import { layoutGridPositions } from "@/features/planner/lib/geometry/gridLayout";

describe("layoutGridPositions (P13 array spacing primitive)", () => {
  it("returns empty array for non-positive count", () => {
    expect(layoutGridPositions(0, 1200, 600)).toEqual([]);
    expect(layoutGridPositions(-3, 1200, 600)).toEqual([]);
  });

  it("lays out row-major cells with default pitch (width/depth + 200 mm gap)", () => {
    const cells = layoutGridPositions(3, 1500, 600, { columns: 3 });
    expect(cells).toHaveLength(3);
    expect(cells[0]).toEqual({ index: 0, xMm: 0, yMm: 0 });
    expect(cells[1]).toEqual({ index: 1, xMm: 1700, yMm: 0 });
    expect(cells[2]).toEqual({ index: 2, xMm: 3400, yMm: 0 });
  });

  it("wraps to next row when count exceeds columns", () => {
    const cells = layoutGridPositions(6, 1200, 600, { columns: 3 });
    expect(cells[3]).toEqual({ index: 3, xMm: 0, yMm: 800 });
    expect(cells[5]?.yMm).toBe(800);
    expect(cells[5]?.xMm).toBe(2800);
  });

  it("honours explicit pitch, gap, origin, and scales to thousands", () => {
    const cells = layoutGridPositions(5000, 1200, 600, {
      columns: 50,
      pitchXMm: 1400,
      pitchYMm: 900,
      originMm: { x: 100, y: 50 },
    });
    expect(cells).toHaveLength(5000);
    expect(cells[0]).toEqual({ index: 0, xMm: 100, yMm: 50 });
    expect(cells[49]).toEqual({ index: 49, xMm: 100 + 49 * 1400, yMm: 50 });
    expect(cells[50]).toEqual({ index: 50, xMm: 100, yMm: 50 + 900 });
    expect(cells[4999]?.index).toBe(4999);
    expect(cells[4999]?.xMm).toBeGreaterThan(100);
    expect(cells[4999]?.yMm).toBeGreaterThan(50);
  });
});