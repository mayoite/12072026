import { describe, expect, it } from "vitest";

import {
  getRoomPolygon,
  pickFurnitureAtPoint,
  pickOpeningAtPoint,
  pickWallAtPoint,
  pickWallWithPosition,
  pointInPolygon,
} from "@/features/planner/project/lib/geometry/canvasPicking";
import type {
  Open3dFurnitureItem,
  Open3dPoint,
  Open3dWall,
} from "@/features/planner/project/model/types";

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

  it("hits furniture rotated 90° via inverse-rotation local footprint", () => {
    // 800×400 unrotated: halfW=400 (local X), halfD=200 (local Y).
    // Production inverse-rotates the point by -rotation before AABB test.
    // For rotation=90°: rad=-π/2 → localX=dy, localY=-dx.
    const item = furniture("rot90", { x: 0, y: 0 }, 800, 400, 90);

    // World +X 150 → local (0, -150): |localY| <= halfD → hit
    expect(pickFurnitureAtPoint({ x: 150, y: 0 }, [item])).toBe("rot90");
    // World +Y 350 → local (350, 0): |localX| <= halfW → hit (width after 90°)
    expect(pickFurnitureAtPoint({ x: 0, y: 350 }, [item])).toBe("rot90");
    // World +X 250 → local (0, -250): |localY| > halfD → miss (depth axis after 90°)
    expect(pickFurnitureAtPoint({ x: 250, y: 0 }, [item])).toBeNull();
  });

  it("respects paddingMm by expanding the hit footprint", () => {
    const item = furniture("pad", { x: 0, y: 0 }, 200, 200, 0);
    // halfW/halfD = 100; point at 120 is outside without padding, inside with 30mm pad
    expect(pickFurnitureAtPoint({ x: 120, y: 0 }, [item])).toBeNull();
    expect(pickFurnitureAtPoint({ x: 120, y: 0 }, [item], 30)).toBe("pad");
  });

  it("returns null for empty furniture array", () => {
    expect(pickFurnitureAtPoint({ x: 0, y: 0 }, [])).toBeNull();
  });

  it("defaults missing width/depth to 600mm footprint", () => {
    // Half of 600mm = 300; hit at 290 along axes, miss at 310.
    const item: Open3dFurnitureItem = {
      id: "def600",
      catalogId: "cabinet-v0",
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      // width/depth intentionally omitted
    };
    expect(pickFurnitureAtPoint({ x: 0, y: 290 }, [item])).toBe("def600");
    expect(pickFurnitureAtPoint({ x: 290, y: 0 }, [item])).toBe("def600");
    expect(pickFurnitureAtPoint({ x: 0, y: 310 }, [item])).toBeNull();
    expect(pickFurnitureAtPoint({ x: 310, y: 0 }, [item])).toBeNull();
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

  it("picks door when it is closer than a competing window", () => {
    const doors = [
      { id: "d1", wallId: "w1", position: 0.25, width: 900, height: 2100 },
    ];
    const windows = [
      { id: "win1", wallId: "w1", position: 0.75, width: 1200, height: 1200 },
    ];
    // near door at 0.25 → (1000, 0); window is at (3000, 0)
    expect(
      pickOpeningAtPoint({ x: 1000, y: 10 }, doors, windows, [wall], 100),
    ).toEqual({ type: "door", id: "d1" });
  });

  it("skips openings whose wallId is missing without throwing", () => {
    const doors = [
      { id: "orphan", wallId: "gone", position: 0.5, width: 900, height: 2100 },
      { id: "d1", wallId: "w1", position: 0.5, width: 900, height: 2100 },
    ];
    const windows = [
      { id: "win-orphan", wallId: "also-gone", position: 0.5, width: 1200, height: 1200 },
    ];

    expect(() =>
      pickOpeningAtPoint({ x: 2000, y: 10 }, doors, windows, [wall], 80),
    ).not.toThrow();
    expect(
      pickOpeningAtPoint({ x: 2000, y: 10 }, doors, windows, [wall], 80),
    ).toEqual({ type: "door", id: "d1" });

    // Only orphaned openings → null, still no throw
    expect(() =>
      pickOpeningAtPoint({ x: 2000, y: 10 }, [doors[0]], windows, [wall], 80),
    ).not.toThrow();
    expect(
      pickOpeningAtPoint({ x: 2000, y: 10 }, [doors[0]], windows, [wall], 80),
    ).toBeNull();
  });

  it("when distances are equal, prefers first registered candidate deterministically", () => {
    // Same wall + same position → identical distance for door and window.
    // Implementation updates only when distance < bestDistance, so the first
    // registered candidate wins (doors are registered before windows).
    const doors = [
      { id: "d-first", wallId: "w1", position: 0.5, width: 900, height: 2100 },
    ];
    const windows = [
      { id: "win-same", wallId: "w1", position: 0.5, width: 1200, height: 1200 },
    ];
    expect(
      pickOpeningAtPoint({ x: 2000, y: 0 }, doors, windows, [wall], 100),
    ).toEqual({ type: "door", id: "d-first" });

    // Two doors at the same position: earlier array entry stays best.
    const twoDoors = [
      { id: "d-a", wallId: "w1", position: 0.5, width: 900, height: 2100 },
      { id: "d-b", wallId: "w1", position: 0.5, width: 900, height: 2100 },
    ];
    expect(
      pickOpeningAtPoint({ x: 2000, y: 0 }, twoDoors, [], [wall], 100),
    ).toEqual({ type: "door", id: "d-a" });

    // Windows-only equal distance: first window registered wins.
    const twoWindows = [
      { id: "win-a", wallId: "w1", position: 0.5, width: 1200, height: 1200 },
      { id: "win-b", wallId: "w1", position: 0.5, width: 1200, height: 1200 },
    ];
    expect(
      pickOpeningAtPoint({ x: 2000, y: 0 }, [], twoWindows, [wall], 100),
    ).toEqual({ type: "window", id: "win-a" });
  });

  it("returns null when far from all openings", () => {
    const doors = [
      { id: "d1", wallId: "w1", position: 0.5, width: 900, height: 2100 },
    ];
    expect(
      pickOpeningAtPoint({ x: 0, y: 2000 }, doors, [], [wall], 50),
    ).toBeNull();
  });

  it("picks openings at wall endpoints (position 0 and position 1)", () => {
    // position 0 → wall.start (0, 0); position 1 → wall.end (4000, 0)
    const doors = [
      { id: "d-start", wallId: "w1", position: 0, width: 900, height: 2100 },
      { id: "d-end", wallId: "w1", position: 1, width: 900, height: 2100 },
    ];
    expect(
      pickOpeningAtPoint({ x: 0, y: 15 }, doors, [], [wall], 80),
    ).toEqual({ type: "door", id: "d-start" });
    expect(
      pickOpeningAtPoint({ x: 4000, y: 15 }, doors, [], [wall], 80),
    ).toEqual({ type: "door", id: "d-end" });

    // Window at end endpoint still maps via position × wall segment
    const windows = [
      { id: "win-end", wallId: "w1", position: 1, width: 1200, height: 1200 },
    ];
    expect(
      pickOpeningAtPoint({ x: 4000, y: 0 }, [], windows, [wall], 50),
    ).toEqual({ type: "window", id: "win-end" });
  });

  it("picks an opening on a diagonal wall via interpolated segment position", () => {
    // Local fixture is named `wall` above — build diagonal inline to avoid shadowing the helper.
    const diagonal: Open3dWall = {
      id: "diag",
      start: { x: 0, y: 0 },
      end: { x: 4000, y: 4000 },
      thickness: 100,
      height: 2700,
    };
    // position 0.25 → (1000, 1000) on the diagonal
    const doors = [
      { id: "d-diag", wallId: "diag", position: 0.25, width: 900, height: 2100 },
    ];
    expect(
      pickOpeningAtPoint({ x: 1000, y: 1000 }, doors, [], [diagonal], 80),
    ).toEqual({ type: "door", id: "d-diag" });
    // Offset perpendicular to the diagonal still within tolerance
    // diagonal direction (1,1); perpendicular offset ≈ (10√2/2, -10√2/2) ≈ (7, -7)
    expect(
      pickOpeningAtPoint({ x: 1007, y: 993 }, doors, [], [diagonal], 80),
    ).toEqual({ type: "door", id: "d-diag" });
    // Far along the diagonal (near end) must miss this mid-span opening
    expect(
      pickOpeningAtPoint({ x: 3900, y: 3900 }, doors, [], [diagonal], 80),
    ).toBeNull();
  });

  it("includes hits exactly at tolerance and misses just beyond", () => {
    const doors = [
      { id: "d1", wallId: "w1", position: 0.5, width: 900, height: 2100 },
    ];
    // Opening at (2000, 0); point at y=50 with tolerance 50 → distance === 50 → hit
    expect(
      pickOpeningAtPoint({ x: 2000, y: 50 }, doors, [], [wall], 50),
    ).toEqual({ type: "door", id: "d1" });
    // Just beyond inclusive boundary → miss
    expect(
      pickOpeningAtPoint({ x: 2000, y: 50.1 }, doors, [], [wall], 50),
    ).toBeNull();
  });
});
