import { describe, expect, it } from "vitest";
import {
  applyOrthogonalLock,
  isOrthogonalDrawingActive,
  maybeOrthogonalPoint,
} from "@/features/planner/lib/geometry/orthogonal";

describe("orthogonal lock", () => {
  it("snaps free points onto the nearer axis-aligned ray", () => {
    expect(applyOrthogonalLock({ x: 0, y: 0 }, { x: 900, y: 200 })).toEqual({
      x: 900,
      y: 0,
    });
    expect(applyOrthogonalLock({ x: 0, y: 0 }, { x: 200, y: 900 })).toEqual({
      x: 0,
      y: 900,
    });
  });

  it("treats sticky lock OR Shift as active", () => {
    expect(isOrthogonalDrawingActive(true, false)).toBe(true);
    expect(isOrthogonalDrawingActive(false, true)).toBe(true);
    expect(isOrthogonalDrawingActive(false, false)).toBe(false);
  });

  it("only applies lock when active and start exists", () => {
    expect(
      maybeOrthogonalPoint({ x: 10, y: 20 }, { x: 100, y: 80 }, false),
    ).toEqual({ x: 100, y: 80 });
    expect(
      maybeOrthogonalPoint({ x: 10, y: 20 }, { x: 100, y: 80 }, true),
    ).toEqual({ x: 100, y: 20 });
    expect(maybeOrthogonalPoint(null, { x: 100, y: 80 }, true)).toEqual({
      x: 100,
      y: 80,
    });
  });
});
