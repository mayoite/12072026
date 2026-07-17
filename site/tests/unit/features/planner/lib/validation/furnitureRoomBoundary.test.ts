import { describe, expect, it } from "vitest";
import {
  detectFurnitureOutsideRoom,
  floorRoomPolygons,
} from "@/features/planner/lib/validation/furnitureRoomBoundary";
import type { PlacedFurniture } from "@/features/planner/lib/validation/types";
import { createRectangularRoomProject } from "@/features/planner/model/project";

function item(
  id: string,
  xMm: number,
  yMm: number,
  widthMm = 600,
  depthMm = 600,
): PlacedFurniture {
  return { id, xMm, yMm, widthMm, depthMm, rotationDeg: 0 };
}

describe("furnitureRoomBoundary", () => {
  it("builds a closed polygon for a rectangular room", () => {
    const project = createRectangularRoomProject({
      name: "room",
      widthMm: 5000,
      depthMm: 4000,
    });
    const polygons = floorRoomPolygons(project.floors[0]!);
    expect(polygons.length).toBeGreaterThanOrEqual(1);
    expect(polygons[0]!.length).toBeGreaterThanOrEqual(3);
  });

  it("flags furniture centre outside the room as an error", () => {
    const project = createRectangularRoomProject({
      name: "room",
      widthMm: 5000,
      depthMm: 4000,
    });
    const polygons = floorRoomPolygons(project.floors[0]!);
    const issues = detectFurnitureOutsideRoom(
      [item("desk-out", 8000, 8000)],
      polygons,
    );
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      ruleId: "room-boundary",
      severity: "error",
      objectIds: ["desk-out"],
    });
  });

  it("returns no issues for furniture fully inside", () => {
    const project = createRectangularRoomProject({
      name: "room",
      widthMm: 5000,
      depthMm: 4000,
    });
    const polygons = floorRoomPolygons(project.floors[0]!);
    const issues = detectFurnitureOutsideRoom(
      [item("desk-in", 2500, 2000, 600, 600)],
      polygons,
    );
    expect(issues).toEqual([]);
  });

  it("warns when furniture overhangs the wall while centre is inside", () => {
    const project = createRectangularRoomProject({
      name: "room",
      widthMm: 5000,
      depthMm: 4000,
    });
    const polygons = floorRoomPolygons(project.floors[0]!);
    // Centre near edge; 1200×600 footprint will cross x=0 or x=5000.
    const issues = detectFurnitureOutsideRoom(
      [item("desk-edge", 100, 2000, 1200, 600)],
      polygons,
    );
    expect(issues.some((i) => i.severity === "warning")).toBe(true);
    expect(issues[0]?.ruleId).toBe("room-boundary");
  });

  it("skips when no enclosed room exists", () => {
    expect(detectFurnitureOutsideRoom([item("a", 0, 0)], [])).toEqual([]);
  });
});
