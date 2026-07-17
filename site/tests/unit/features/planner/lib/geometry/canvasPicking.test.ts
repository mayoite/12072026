import { describe, expect, it } from "vitest";
import {
  pickWallAtPoint,
  pickFurnitureAtPoint,
  pointInPolygon,
  getRoomPolygon,
} from "@/features/planner/lib/geometry/canvasPicking";
import type { PlannerWall, PlannerFurnitureItem } from "@/features/planner/model/types";

describe("canvasPicking", () => {
  const wall: PlannerWall = {
    id: "w1",
    start: { x: 0, y: 0 },
    end: { x: 1000, y: 0 },
    height: 2700,
    thickness: 100,
  };

  it("picks walls near the segment", () => {
    expect(pickWallAtPoint({ x: 500, y: 5 }, [wall], 20)).toBe("w1");
    expect(pickWallAtPoint({ x: 500, y: 200 }, [wall], 20)).toBeNull();
  });

  it("picks furniture by footprint and tests polygon containment", () => {
    const furniture: PlannerFurnitureItem = {
      id: "f1",
      catalogId: "desk",
      position: { x: 100, y: 100 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      width: 200,
      depth: 100,
      height: 750,
    };
    expect(pickFurnitureAtPoint({ x: 150, y: 120 }, [furniture])).toBe("f1");
    expect(pickFurnitureAtPoint({ x: 900, y: 900 }, [furniture])).toBeNull();
    const poly = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ];
    expect(pointInPolygon({ x: 5, y: 5 }, poly)).toBe(true);
    expect(pointInPolygon({ x: 15, y: 5 }, poly)).toBe(false);
    const map = new Map([["w1", { start: wall.start, end: wall.end }]]);
    expect(getRoomPolygon(["w1"], map)).toEqual([]);
  });
});
