import { describe, expect, it } from "vitest";
import {
  layoutGridPositions,
  layoutRowPositions,
  pitchFromClearGap,
} from "@/features/planner/lib/geometry/gridLayout";

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

  it("uses independent row gap when gapYMm set", () => {
    const cells = layoutGridPositions(4, 1000, 500, {
      columns: 2,
      gapMm: 100,
      gapYMm: 300,
    });
    expect(cells[2]!.yMm).toBe(500 + 300);
    expect(cells[1]!.xMm).toBe(1000 + 100);
  });

  it("pitchFromClearGap is size + gap", () => {
    expect(pitchFromClearGap(1200, 200)).toBe(1400);
    expect(pitchFromClearGap(0, 50)).toBe(51); // size falls back to 1
  });

  it("layoutRowPositions places all on one row", () => {
    const cells = layoutRowPositions(3, 600, 100, { x: 10, y: 20 });
    expect(cells).toHaveLength(3);
    expect(cells[0]).toEqual({ index: 0, xMm: 10, yMm: 20 });
    expect(cells[1]).toEqual({ index: 1, xMm: 710, yMm: 20 });
    expect(cells[2]).toEqual({ index: 2, xMm: 1410, yMm: 20 });
  });
});
