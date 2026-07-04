import { describe, it, expect } from "vitest";
import { plannerGridScreenSpacing, PLANNER_GRID_MINOR_UNITS, PLANNER_GRID_MAJOR_UNITS } from "@/features/planner/editor/plannerGrid";

describe("plannerGridScreenSpacing", () => {
  it("computes spacing with default zoom", () => {
    const spacing = plannerGridScreenSpacing(1);
    expect(spacing).toEqual({
      minorPx: 10,
      majorPx: 100,
    });
  });

  it("caps zoom at minimum 0.05", () => {
    const spacing = plannerGridScreenSpacing(0.01);
    const expectedMinor = Math.max(4, PLANNER_GRID_MINOR_UNITS * 0.05); // 10 * 0.05 = 0.5, capped at 4
    const expectedMajor = Math.max(20, PLANNER_GRID_MAJOR_UNITS * 0.05); // 100 * 0.05 = 5, capped at 20
    expect(spacing).toEqual({
      minorPx: expectedMinor,
      majorPx: expectedMajor,
    });
  });

  it("handles high zoom levels", () => {
    const spacing = plannerGridScreenSpacing(5);
    expect(spacing).toEqual({
      minorPx: 50,
      majorPx: 500,
    });
  });
});
