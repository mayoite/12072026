import { describe, expect, it } from "vitest";
import {
  snapToGrid,
  snapToNearestEndpoint,
  snapToSegment,
} from "@/features/planner/lib/geometry/snap";

describe("snap", () => {
  it("snaps to grid intersections", () => {
    expect(snapToGrid({ x: 47, y: 52 }, 50)).toEqual({ x: 50, y: 50 });
  });

  it("snaps to nearest endpoint within threshold", () => {
    const hit = snapToNearestEndpoint(
      { x: 8, y: 2 },
      [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ],
      20,
    );
    expect(hit).toEqual({ x: 0, y: 0 });
    expect(
      snapToNearestEndpoint({ x: 50, y: 50 }, [{ x: 0, y: 0 }], 10),
    ).toBeNull();
  });

  it("snaps to nearest segment projection", () => {
    const result = snapToSegment(
      { x: 50, y: 10 },
      [{ start: { x: 0, y: 0 }, end: { x: 100, y: 0 } }],
      20,
    );
    expect(result).not.toBeNull();
    expect(result!.point.x).toBeCloseTo(50, 5);
    expect(result!.point.y).toBeCloseTo(0, 5);
  });
});
