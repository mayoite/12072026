import { describe, expect, it } from "vitest";
import {
  detectFurnitureWallCollisions,
  wallAsPlacedFurniture,
} from "@/features/planner/lib/validation/furnitureWallCollision";
import type { PlacedFurniture } from "@/features/planner/lib/validation/types";
import type { PlannerWall } from "@/features/planner/model/types";

function wall(
  id: string,
  start: { x: number; y: number },
  end: { x: number; y: number },
  thickness = 150,
): PlannerWall {
  return {
    id,
    start,
    end,
    thickness,
    height: 2700,
    color: "#ccc",
  };
}

function desk(id: string, xMm: number, yMm: number, widthMm = 1200, depthMm = 600): PlacedFurniture {
  return { id, xMm, yMm, widthMm, depthMm, rotationDeg: 0 };
}

describe("furnitureWallCollision", () => {
  it("maps wall centreline to an OBB mid-point and thickness depth", () => {
    const placed = wallAsPlacedFurniture(wall("w1", { x: 0, y: 0 }, { x: 4000, y: 0 }, 200));
    expect(placed).toMatchObject({
      id: "w1",
      xMm: 2000,
      yMm: 0,
      widthMm: 4000,
      depthMm: 200,
      rotationDeg: 0,
    });
  });

  it("returns null for zero-length or zero-thickness walls", () => {
    expect(
      wallAsPlacedFurniture(wall("z", { x: 0, y: 0 }, { x: 0, y: 0 })),
    ).toBeNull();
    expect(
      wallAsPlacedFurniture(wall("t", { x: 0, y: 0 }, { x: 1000, y: 0 }, 0)),
    ).toBeNull();
  });

  it("flags furniture that intersects the wall thickness slab", () => {
    // Horizontal wall on y=0, thickness 150 → occupies y ±75
    // Desk centre at y=50, depth 600 → extends y −250..350 → intersects
    const issues = detectFurnitureWallCollisions(
      [desk("desk-1", 2000, 50)],
      [wall("south", { x: 0, y: 0 }, { x: 5000, y: 0 })],
    );
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      ruleId: "wall-collision",
      severity: "error",
      objectIds: ["desk-1", "south"],
    });
  });

  it("does not flag furniture clear of the wall body", () => {
    // Wall y=0 thickness 150 (±75). Desk at y=1500 depth 600 → y 1200..1800
    const issues = detectFurnitureWallCollisions(
      [desk("desk-1", 2000, 1500)],
      [wall("south", { x: 0, y: 0 }, { x: 5000, y: 0 })],
    );
    expect(issues).toEqual([]);
  });

  it("handles rotated walls via OBB", () => {
    // Vertical wall x=0, thickness 150. Desk centre x=40 depth 600 → intersects
    const issues = detectFurnitureWallCollisions(
      [desk("desk-1", 40, 2000, 600, 600)],
      [wall("west", { x: 0, y: 0 }, { x: 0, y: 4000 })],
    );
    expect(issues.some((i) => i.ruleId === "wall-collision")).toBe(true);
  });
});
