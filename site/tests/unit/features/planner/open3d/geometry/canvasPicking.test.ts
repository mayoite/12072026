import { describe, expect, it } from "vitest";

import {
  getRoomPolygon,
  pickWallAtPoint,
  pickWallWithPosition,
  pointInPolygon,
} from "@/features/planner/open3d/lib/geometry/canvasPicking";
import type { Open3dPoint, Open3dWall } from "@/features/planner/open3d/model/types";

const WALL_DEFAULTS = {
  thickness: 100,
  height: 2400,
  color: "#000000",
} as const;

function wall(
  id: string,
  start: Open3dPoint,
  end: Open3dPoint,
): Open3dWall {
  return { id, start, end, ...WALL_DEFAULTS };
}

describe("pickWallAtPoint / pickWallWithPosition", () => {
  const horizontal = wall("h", { x: 0, y: 0 }, { x: 1000, y: 0 });
  const vertical = wall("v", { x: 0, y: 0 }, { x: 0, y: 1000 });
  const toleranceMm = 50;

  it("picks a mid-segment point and reports t ≈ 0.5", () => {
    const mid = { x: 500, y: 10 };
    expect(pickWallAtPoint(mid, [horizontal], toleranceMm)).toBe("h");
    const withPos = pickWallWithPosition(mid, [horizontal], toleranceMm);
    expect(withPos).not.toBeNull();
    expect(withPos!.wallId).toBe("h");
    expect(withPos!.t).toBeCloseTo(0.5, 5);
  });

  it("misses when the point is outside tolerance", () => {
    const far = { x: 500, y: 200 };
    expect(pickWallAtPoint(far, [horizontal], toleranceMm)).toBeNull();
    expect(pickWallWithPosition(far, [horizontal], toleranceMm)).toBeNull();
  });

  it("selects the nearest of two walls within tolerance", () => {
    // Closer to vertical (distance 5) than horizontal (distance 20).
    const nearVertical = { x: 5, y: 20 };
    expect(pickWallAtPoint(nearVertical, [horizontal, vertical], toleranceMm)).toBe("v");
    expect(pickWallWithPosition(nearVertical, [horizontal, vertical], toleranceMm)).toMatchObject({
      wallId: "v",
    });
  });

  it("reports t ≈ 0 and t ≈ 1 at wall endpoints", () => {
    const atStart = pickWallWithPosition({ x: 0, y: 5 }, [horizontal], toleranceMm);
    expect(atStart).toMatchObject({ wallId: "h" });
    expect(atStart!.t).toBeCloseTo(0, 5);

    const atEnd = pickWallWithPosition({ x: 1000, y: 5 }, [horizontal], toleranceMm);
    expect(atEnd).toMatchObject({ wallId: "h" });
    expect(atEnd!.t).toBeCloseTo(1, 5);
  });

  it("returns null for empty walls", () => {
    expect(pickWallAtPoint({ x: 0, y: 0 }, [], toleranceMm)).toBeNull();
    expect(pickWallWithPosition({ x: 0, y: 0 }, [], toleranceMm)).toBeNull();
  });

  it("handles a degenerate zero-length wall (start === end)", () => {
    const point = wall("point", { x: 100, y: 100 }, { x: 100, y: 100 });
    const hit = pickWallWithPosition({ x: 100, y: 100 }, [point], toleranceMm);
    expect(hit).toEqual({ wallId: "point", t: 0 });
    expect(pickWallAtPoint({ x: 200, y: 200 }, [point], toleranceMm)).toBeNull();
  });
});

describe("pointInPolygon", () => {
  const square: Open3dPoint[] = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ];

  it("returns true for a point strictly inside", () => {
    expect(pointInPolygon({ x: 50, y: 50 }, square)).toBe(true);
  });

  it("returns false for a point outside", () => {
    expect(pointInPolygon({ x: 150, y: 50 }, square)).toBe(false);
    expect(pointInPolygon({ x: -10, y: -10 }, square)).toBe(false);
  });

  it("returns false for polygons with fewer than 3 vertices", () => {
    expect(pointInPolygon({ x: 0, y: 0 }, [])).toBe(false);
    expect(pointInPolygon({ x: 0, y: 0 }, [{ x: 0, y: 0 }])).toBe(false);
    expect(pointInPolygon({ x: 0, y: 0 }, [{ x: 0, y: 0 }, { x: 1, y: 0 }])).toBe(false);
  });
});

describe("getRoomPolygon", () => {
  it("returns ordered wall starts when at least 3 walls resolve", () => {
    const wallById = new Map([
      ["a", { start: { x: 0, y: 0 }, end: { x: 10, y: 0 } }],
      ["b", { start: { x: 10, y: 0 }, end: { x: 10, y: 10 } }],
      ["c", { start: { x: 10, y: 10 }, end: { x: 0, y: 10 } }],
    ]);
    expect(getRoomPolygon(["a", "b", "c"], wallById)).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ]);
  });

  it("returns [] when fewer than 3 vertices resolve", () => {
    const wallById = new Map([
      ["a", { start: { x: 0, y: 0 }, end: { x: 10, y: 0 } }],
    ]);
    expect(getRoomPolygon(["a", "missing"], wallById)).toEqual([]);
    expect(getRoomPolygon([], wallById)).toEqual([]);
  });
});
