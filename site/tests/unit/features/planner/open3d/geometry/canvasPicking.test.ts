import { describe, expect, it } from "vitest";

import {
  getRoomPolygon,
  pickFurnitureAtPoint,
  pickOpeningAtPoint,
  pickWallAtPoint,
  pickWallWithPosition,
  pointInPolygon,
} from "@/features/planner/open3d/lib/geometry/canvasPicking";
import type {
  Open3dFurnitureItem,
  Open3dPoint,
  Open3dWall,
} from "@/features/planner/open3d/model/types";

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
  const diagonal = wall("d", { x: 0, y: 0 }, { x: 1000, y: 1000 });
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

  it("hits exactly at tolerance boundary and misses just beyond", () => {
    // distance to horizontal at (500,50) is 50mm — on boundary
    expect(pickWallAtPoint({ x: 500, y: 50 }, [horizontal], toleranceMm)).toBe("h");
    expect(pickWallAtPoint({ x: 500, y: 50.1 }, [horizontal], toleranceMm)).toBeNull();
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

  it("picks a diagonal wall and reports t ≈ 0.25 at quarter span", () => {
    const quarter = { x: 250, y: 250 };
    const hit = pickWallWithPosition(quarter, [diagonal], toleranceMm);
    expect(hit).not.toBeNull();
    expect(hit!.wallId).toBe("d");
    expect(hit!.t).toBeCloseTo(0.25, 5);
  });

  it("clamps t to [0,1] for projections beyond the segment", () => {
    // Point past end of horizontal wall, still within lateral tolerance
    const pastEnd = pickWallWithPosition({ x: 1100, y: 0 }, [horizontal], 150);
    expect(pastEnd).toMatchObject({ wallId: "h" });
    expect(pastEnd!.t).toBe(1);

    const beforeStart = pickWallWithPosition({ x: -50, y: 0 }, [horizontal], 150);
    expect(beforeStart).toMatchObject({ wallId: "h" });
    expect(beforeStart!.t).toBe(0);
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

  it("prefers the strictly closer wall when both are within tolerance", () => {
    const parallelA = wall("a", { x: 0, y: 0 }, { x: 1000, y: 0 });
    const parallelB = wall("b", { x: 0, y: 40 }, { x: 1000, y: 40 });
    // Point at y=10 → dist 10 to a, 30 to b
    expect(pickWallAtPoint({ x: 500, y: 10 }, [parallelA, parallelB], toleranceMm)).toBe("a");
    expect(pickWallAtPoint({ x: 500, y: 30 }, [parallelA, parallelB], toleranceMm)).toBe("b");
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

  it("handles a non-convex L-shaped polygon", () => {
    // L footprint: horizontal bar + vertical stem
    const lShape: Open3dPoint[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 40 },
      { x: 40, y: 40 },
      { x: 40, y: 100 },
      { x: 0, y: 100 },
    ];
    expect(pointInPolygon({ x: 20, y: 20 }, lShape)).toBe(true); // in foot
    expect(pointInPolygon({ x: 20, y: 70 }, lShape)).toBe(true); // in stem
    expect(pointInPolygon({ x: 70, y: 70 }, lShape)).toBe(false); // notch outside
    expect(pointInPolygon({ x: 150, y: 20 }, lShape)).toBe(false);
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

  it("skips missing wall ids but keeps order of resolved starts", () => {
    const wallById = new Map([
      ["a", { start: { x: 0, y: 0 }, end: { x: 10, y: 0 } }],
      ["c", { start: { x: 10, y: 10 }, end: { x: 0, y: 10 } }],
      ["d", { start: { x: 0, y: 10 }, end: { x: 0, y: 0 } }],
      ["e", { start: { x: 5, y: 5 }, end: { x: 6, y: 6 } }],
    ]);
    // a, missing, c, d → 3 points (still valid)
    expect(getRoomPolygon(["a", "missing", "c", "d"], wallById)).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ]);
  });
});

describe("pickFurnitureAtPoint", () => {
  function furniture(
    id: string,
    position: Open3dPoint,
    width = 600,
    depth = 600,
    rotation = 0,
  ): Open3dFurnitureItem {
    return {
      id,
      catalogId: "cabinet-v0",
      position,
      rotation,
      scale: { x: 1, y: 1, z: 1 },
      width,
      depth,
      height: 720,
    };
  }

  it("picks furniture when point is inside footprint", () => {
    const item = furniture("f1", { x: 1000, y: 1000 });
    expect(pickFurnitureAtPoint({ x: 1000, y: 1000 }, [item])).toBe("f1");
    expect(pickFurnitureAtPoint({ x: 1290, y: 1000 }, [item])).toBe("f1");
  });

  it("misses when point is outside footprint", () => {
    const item = furniture("f1", { x: 1000, y: 1000 });
    expect(pickFurnitureAtPoint({ x: 2000, y: 2000 }, [item])).toBeNull();
  });

  it("prefers top-most (last array) when footprints overlap", () => {
    const bottom = furniture("bottom", { x: 0, y: 0 });
    const top = furniture("top", { x: 0, y: 0 });
    expect(pickFurnitureAtPoint({ x: 0, y: 0 }, [bottom, top])).toBe("top");
  });
});

describe("pickOpeningAtPoint", () => {
  const wall: Open3dWall = {
    id: "w1",
    start: { x: 0, y: 0 },
    end: { x: 4000, y: 0 },
    thickness: 100,
    height: 2700,
  };

  it("picks a door near its position on the wall", () => {
    const doors = [
      {
        id: "d1",
        wallId: "w1",
        position: 0.5,
        width: 900,
        height: 2100,
      },
    ];
    // midpoint of wall = (2000, 0)
    expect(
      pickOpeningAtPoint({ x: 2000, y: 20 }, doors, [], [wall], 80),
    ).toEqual({ type: "door", id: "d1" });
  });

  it("picks nearest opening when door and window compete", () => {
    const doors = [
      { id: "d1", wallId: "w1", position: 0.25, width: 900, height: 2100 },
    ];
    const windows = [
      { id: "win1", wallId: "w1", position: 0.75, width: 1200, height: 1200 },
    ];
    // near 0.75 → (3000, 0)
    expect(
      pickOpeningAtPoint({ x: 3000, y: 10 }, doors, windows, [wall], 100),
    ).toEqual({ type: "window", id: "win1" });
  });

  it("returns null when far from all openings", () => {
    const doors = [
      { id: "d1", wallId: "w1", position: 0.5, width: 900, height: 2100 },
    ];
    expect(
      pickOpeningAtPoint({ x: 0, y: 2000 }, doors, [], [wall], 50),
    ).toBeNull();
  });
});
