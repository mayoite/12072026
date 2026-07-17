import { describe, expect, it } from "vitest";
import {
  isValidRectangularRoom,
  orderedRoomCorners,
  rectangularRoomMetrics,
  rectangularRoomSegments,
} from "@/features/planner/lib/geometry/roomOutline";
import type { PlannerWall } from "@/features/planner/model/types";

describe("roomOutline", () => {
  it("computes exact width, depth, area, and four closed segments", () => {
    const metrics = rectangularRoomMetrics({ x: 0, y: 0 }, { x: 5000, y: 4000 });
    expect(metrics.widthMm).toBe(5000);
    expect(metrics.depthMm).toBe(4000);
    expect(metrics.areaMm2).toBe(20_000_000);
    expect(metrics.corners).toHaveLength(4);

    const segments = rectangularRoomSegments({ x: 0, y: 0 }, { x: 5000, y: 4000 });
    expect(segments).toHaveLength(4);
    expect(segments[0]).toEqual({
      start: { x: 0, y: 0 },
      end: { x: 5000, y: 0 },
    });
    expect(segments[3]?.end).toEqual({ x: 0, y: 0 });
    expect(isValidRectangularRoom({ x: 0, y: 0 }, { x: 5000, y: 4000 })).toBe(true);
    expect(isValidRectangularRoom({ x: 0, y: 0 }, { x: 0, y: 10 })).toBe(false);
  });

  it("orders room corners from wall ids for a closed rectangle", () => {
    const walls: PlannerWall[] = [
      {
        id: "w1",
        start: { x: 0, y: 0 },
        end: { x: 4000, y: 0 },
        thickness: 150,
        height: 2700,
        color: "#000",
      },
      {
        id: "w2",
        start: { x: 4000, y: 0 },
        end: { x: 4000, y: 3000 },
        thickness: 150,
        height: 2700,
        color: "#000",
      },
      {
        id: "w3",
        start: { x: 4000, y: 3000 },
        end: { x: 0, y: 3000 },
        thickness: 150,
        height: 2700,
        color: "#000",
      },
      {
        id: "w4",
        start: { x: 0, y: 3000 },
        end: { x: 0, y: 0 },
        thickness: 150,
        height: 2700,
        color: "#000",
      },
    ];
    const corners = orderedRoomCorners(walls, ["w1", "w2", "w3", "w4"]);
    expect(corners.length).toBeGreaterThanOrEqual(4);
    expect(corners[0]).toEqual({ x: 0, y: 0 });
  });

  it("chains scrambled wall order by shared endpoints", () => {
    const walls: PlannerWall[] = [
      {
        id: "w3",
        start: { x: 4000, y: 3000 },
        end: { x: 0, y: 3000 },
        thickness: 150,
        height: 2700,
        color: "#000",
      },
      {
        id: "w1",
        start: { x: 0, y: 0 },
        end: { x: 4000, y: 0 },
        thickness: 150,
        height: 2700,
        color: "#000",
      },
      {
        id: "w4",
        start: { x: 0, y: 3000 },
        end: { x: 0, y: 0 },
        thickness: 150,
        height: 2700,
        color: "#000",
      },
      {
        id: "w2",
        start: { x: 4000, y: 0 },
        end: { x: 4000, y: 3000 },
        thickness: 150,
        height: 2700,
        color: "#000",
      },
    ];
    // Id list is not sequential around the loop; chain by joins.
    const corners = orderedRoomCorners(walls, ["w1", "w3", "w2", "w4"]);
    expect(corners).toHaveLength(4);
    const keys = corners.map((c) => `${c.x},${c.y}`).sort();
    expect(keys).toEqual(["0,0", "0,3000", "4000,0", "4000,3000"]);
  });

  it("returns empty corners for empty or unknown wall ids", () => {
    expect(orderedRoomCorners([], [])).toEqual([]);
    expect(
      orderedRoomCorners(
        [
          {
            id: "w1",
            start: { x: 0, y: 0 },
            end: { x: 1000, y: 0 },
            thickness: 150,
            height: 2700,
            color: "#000",
          },
        ],
        ["missing"],
      ),
    ).toEqual([]);
  });

  it("accepts reverse corner drag order for rectangular metrics", () => {
    const metrics = rectangularRoomMetrics({ x: 5000, y: 4000 }, { x: 0, y: 0 });
    expect(metrics.widthMm).toBe(5000);
    expect(metrics.depthMm).toBe(4000);
    expect(metrics.corners[0]).toEqual({ x: 0, y: 0 });
    expect(metrics.corners[2]).toEqual({ x: 5000, y: 4000 });
  });
});
