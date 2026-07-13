import { describe, expect, it } from "vitest";
import {
  runFloorValidation,
  countBySeverity,
} from "@/features/planner/lib/validation/runValidation";
import type { PlannerFloor, PlannerFurnitureItem } from "@/features/planner/project/model/types";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";

function floorWithFurniture(items: PlannerFurnitureItem[]): PlannerFloor {
  const project = createRectangularRoomProject({ name: "test", widthMm: 5000, depthMm: 4000 });
  return {
    ...project.floors[0],
    furniture: items,
  };
}

function makeItem(
  id: string,
  xMm: number,
  yMm: number,
  width?: number,
  depth?: number,
  catalogId?: string,
): PlannerFurnitureItem {
  return {
    id,
    catalogId: catalogId ?? "cat-1",
    position: { x: xMm, y: yMm },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    width,
    depth,
  };
}

describe("runFloorValidation", () => {
  it("returns empty result when floor has no furniture", () => {
    const floor = floorWithFurniture([]);
    const result = runFloorValidation(floor);
    expect(result.issues).toEqual([]);
    expect(result.errors).toBe(0);
    expect(result.warnings).toBe(0);
    expect(result.advisories).toBe(0);
  });

  it("returns no issues for separated furniture", () => {
    const floor = floorWithFurniture([
      makeItem("a", 0, 0, 600, 600),
      makeItem("b", 3000, 0, 600, 600),
    ]);
    const result = runFloorValidation(floor);
    expect(result.issues).toEqual([]);
  });

  it("detects overlapping furniture as errors", () => {
    const floor = floorWithFurniture([
      makeItem("a", 0, 0, 1200, 600),
      makeItem("b", 500, 100, 1200, 600),
    ]);
    const result = runFloorValidation(floor);
    expect(result.errors).toBe(1);
    expect(result.issues[0]).toMatchObject({
      ruleId: "furniture-overlap",
      severity: "error",
    });
  });

  it("skips items with unknown catalogId", () => {
    const floor = floorWithFurniture([
      makeItem("a", 0, 0, 600, 600, "unknown"),
      makeItem("b", 100, 100, 600, 600, ""),
    ]);
    const result = runFloorValidation(floor);
    expect(result.issues).toEqual([]);
  });

  it("counts errors, warnings, and advisories separately", () => {
    const counts = countBySeverity([
      { id: "1", ruleId: "furniture-overlap", severity: "error", objectIds: [], message: "", remedy: "" },
      { id: "2", ruleId: "furniture-overlap", severity: "error", objectIds: [], message: "", remedy: "" },
      { id: "3", ruleId: "wall-collision", severity: "warning", objectIds: [], message: "", remedy: "" },
      { id: "4", ruleId: "aisle-clearance", severity: "advisory", objectIds: [], message: "", remedy: "" },
    ]);
    expect(counts.errors).toBe(2);
    expect(counts.warnings).toBe(1);
    expect(counts.advisories).toBe(1);
  });
});
