import { describe, expect, it } from "vitest";
import {
  runFloorValidation,
  countBySeverity,
} from "@/features/planner/lib/validation/runValidation";
import type {
  PlannerFloor,
  PlannerFurnitureItem,
} from "@/features/planner/model/types";
import { createRectangularRoomProject } from "@/features/planner/model/project";

function floorWithFurniture(items: PlannerFurnitureItem[]): PlannerFloor {
  const project = createRectangularRoomProject({
    name: "test",
    widthMm: 5000,
    depthMm: 4000,
  });
  return {
    ...project.floors[0]!,
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

  it("returns no issues for separated furniture inside the room", () => {
    const floor = floorWithFurniture([
      makeItem("a", 1500, 1500, 600, 600),
      makeItem("b", 3500, 1500, 600, 600),
    ]);
    const result = runFloorValidation(floor);
    expect(result.issues).toEqual([]);
  });

  it("detects overlapping furniture as errors", () => {
    const floor = floorWithFurniture([
      makeItem("a", 2000, 2000, 1200, 600),
      makeItem("b", 2500, 2100, 1200, 600),
    ]);
    const result = runFloorValidation(floor);
    expect(result.errors).toBeGreaterThanOrEqual(1);
    expect(result.issues.some((i) => i.ruleId === "furniture-overlap")).toBe(
      true,
    );
  });

  it("detects furniture outside the room as room-boundary errors", () => {
    const floor = floorWithFurniture([
      makeItem("out", 9000, 9000, 600, 600),
    ]);
    const result = runFloorValidation(floor);
    expect(result.errors).toBeGreaterThanOrEqual(1);
    expect(
      result.issues.some(
        (i) => i.ruleId === "room-boundary" && i.severity === "error",
      ),
    ).toBe(true);
  });

  it("detects tight aisle clearance as warnings", () => {
    // 1200-wide desks, centres 1600 apart → gap 400 mm < 900
    const floor = floorWithFurniture([
      makeItem("a", 1500, 2000, 1200, 600),
      makeItem("b", 3100, 2000, 1200, 600),
    ]);
    const result = runFloorValidation(floor);
    expect(
      result.issues.some(
        (i) => i.ruleId === "aisle-clearance" && i.severity === "warning",
      ),
    ).toBe(true);
    expect(result.warnings).toBeGreaterThanOrEqual(1);
  });

  it("detects furniture intersecting a wall as wall-collision errors", () => {
    // South wall is y=0, thickness 150. Desk at y=50 intersects wall mass.
    const floor = floorWithFurniture([makeItem("into-wall", 2500, 50, 600, 600)]);
    const result = runFloorValidation(floor);
    expect(
      result.issues.some(
        (i) => i.ruleId === "wall-collision" && i.severity === "error",
      ),
    ).toBe(true);
    expect(result.errors).toBeGreaterThanOrEqual(1);
  });

  it("detects furniture blocking a door as opening-obstruction warnings", () => {
    const base = floorWithFurniture([makeItem("block-door", 2500, 400, 600, 600)]);
    const southWall = base.walls.find(
      (w) =>
        Math.abs(w.start.y) < 1e-6 &&
        Math.abs(w.end.y) < 1e-6,
    );
    expect(southWall).toBeDefined();
    const floor: PlannerFloor = {
      ...base,
      doors: [
        {
          id: "door-mid",
          wallId: southWall!.id,
          position: 0.5,
          width: 900,
          height: 2100,
          type: "single",
          swingDirection: "left",
          flipSide: false,
        },
      ],
    };
    const result = runFloorValidation(floor);
    expect(
      result.issues.some(
        (i) => i.ruleId === "opening-obstruction" && i.severity === "warning",
      ),
    ).toBe(true);
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
      {
        id: "1",
        ruleId: "furniture-overlap",
        severity: "error",
        objectIds: [],
        message: "",
        remedy: "",
      },
      {
        id: "2",
        ruleId: "furniture-overlap",
        severity: "error",
        objectIds: [],
        message: "",
        remedy: "",
      },
      {
        id: "3",
        ruleId: "wall-collision",
        severity: "warning",
        objectIds: [],
        message: "",
        remedy: "",
      },
      {
        id: "4",
        ruleId: "aisle-clearance",
        severity: "advisory",
        objectIds: [],
        message: "",
        remedy: "",
      },
    ]);
    expect(counts.errors).toBe(2);
    expect(counts.warnings).toBe(1);
    expect(counts.advisories).toBe(1);
  });
});
