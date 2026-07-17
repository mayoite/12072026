import { describe, expect, it } from "vitest";
import {
  detectOpeningClearanceConflicts,
  openingClearanceAsPlaced,
  DEFAULT_OPENING_CLEARANCE_MM,
} from "@/features/planner/lib/validation/openingClearance";
import type { PlacedFurniture } from "@/features/planner/lib/validation/types";
import type {
  PlannerDoor,
  PlannerWall,
  PlannerWindow,
} from "@/features/planner/model/types";

function wall(
  id: string,
  start: { x: number; y: number },
  end: { x: number; y: number },
  thickness = 150,
): PlannerWall {
  return { id, start, end, thickness, height: 2700, color: "#ccc" };
}

function door(
  id: string,
  wallId: string,
  position: number,
  width = 900,
): PlannerDoor {
  return {
    id,
    wallId,
    position,
    width,
    height: 2100,
    type: "single",
    swingDirection: "left",
    flipSide: false,
  };
}

function windowItem(
  id: string,
  wallId: string,
  position: number,
  width = 1200,
): PlannerWindow {
  return {
    id,
    wallId,
    position,
    width,
    height: 1200,
    sillHeight: 900,
    type: "standard",
  };
}

function desk(id: string, xMm: number, yMm: number): PlacedFurniture {
  return { id, xMm, yMm, widthMm: 1200, depthMm: 600, rotationDeg: 0 };
}

describe("openingClearance", () => {
  it("builds a clearance OBB centred on the opening", () => {
    const host = wall("w1", { x: 0, y: 0 }, { x: 4000, y: 0 }, 150);
    const zone = openingClearanceAsPlaced(
      { id: "d1", wallId: "w1", position: 0.5, width: 900, kind: "door" },
      host,
      900,
    );
    expect(zone).toMatchObject({
      id: "d1",
      xMm: 2000,
      yMm: 0,
      widthMm: 900,
      depthMm: 150 + 2 * 900,
      rotationDeg: 0,
    });
  });

  it("warns when furniture sits in the door clearance zone", () => {
    // South wall y=0; door at mid. Furniture at (2000, 400) is within 900 mm
    // free depth of the door face.
    const walls = [wall("south", { x: 0, y: 0 }, { x: 4000, y: 0 })];
    const doors = [door("door-1", "south", 0.5, 900)];
    const issues = detectOpeningClearanceConflicts(
      [desk("desk-1", 2000, 400)],
      walls,
      doors,
      [],
      DEFAULT_OPENING_CLEARANCE_MM,
    );
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      ruleId: "opening-obstruction",
      severity: "warning",
      objectIds: ["desk-1", "door-1"],
    });
    expect(issues[0]?.message).toMatch(/door/);
  });

  it("does not warn when furniture is clear of the opening zone", () => {
    // Far from door along wall and depth
    const walls = [wall("south", { x: 0, y: 0 }, { x: 5000, y: 0 })];
    const doors = [door("door-1", "south", 0.2, 900)];
    const issues = detectOpeningClearanceConflicts(
      [desk("desk-1", 4500, 2500)],
      walls,
      doors,
      [],
    );
    expect(issues).toEqual([]);
  });

  it("handles window openings", () => {
    const walls = [wall("north", { x: 0, y: 4000 }, { x: 5000, y: 4000 })];
    const windows = [windowItem("win-1", "north", 0.5, 1200)];
    // Furniture near north wall centre
    const issues = detectOpeningClearanceConflicts(
      [desk("desk-1", 2500, 3600)],
      walls,
      [],
      windows,
    );
    expect(issues.some((i) => i.ruleId === "opening-obstruction")).toBe(true);
    expect(issues[0]?.message).toMatch(/window/);
  });

  it("skips openings whose host wall is missing", () => {
    const issues = detectOpeningClearanceConflicts(
      [desk("desk-1", 0, 0)],
      [],
      [door("door-1", "missing", 0.5)],
      [],
    );
    expect(issues).toEqual([]);
  });
});
