import { describe, expect, it } from "vitest";
import { addPlannerWall } from "@/features/planner/model/actions/walls";
import {
  addPlannerDoor,
  addPlannerWindow,
  repositionPlannerOpening,
  updatePlannerOpening,
} from "@/features/planner/model/actions/openings";
import { createPlannerProject } from "@/features/planner/model/project";

function ids(...values: string[]) {
  let i = 0;
  return () => values[i++] ?? `gen-${i}`;
}

describe("openings actions", () => {
  it("adds door and window on an existing wall", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 0 }, end: { x: 3000, y: 0 }, height: 2700, thickness: 150 },
      ids("wall-1"),
    );
    const wallId = p.floors[0]!.walls[0]!.id;
    p = addPlannerDoor(
      p,
      {
        wallId,
        position: 0.3,
        width: 900,
        height: 2100,
        type: "single",
        swingDirection: "left",
        flipSide: false,
      },
      ids("door-1"),
    );
    p = addPlannerWindow(
      p,
      {
        wallId,
        position: 0.72,
        width: 1200,
        height: 1200,
        sillHeight: 900,
        type: "fixed",
      },
      ids("window-1"),
    );
    expect(p.floors[0]!.doors).toHaveLength(1);
    expect(p.floors[0]!.windows).toHaveLength(1);
    expect(p.floors[0]!.doors[0]!.wallId).toBe(wallId);
    expect(() =>
      updatePlannerOpening(p, "doors", "door-1", { position: 0.65 }),
    ).toThrow(/overlaps/i);
  });

  it("rejects wall overhang and overlapping openings", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } },
      ids("wall-1"),
    );
    const wallId = p.floors[0]!.walls[0]!.id;
    p = addPlannerDoor(
      p,
      {
        wallId,
        position: 0.5,
        width: 900,
        height: 2100,
        type: "single",
        swingDirection: "left",
        flipSide: false,
      },
      ids("door-1"),
    );
    expect(() =>
      addPlannerWindow(
        p,
        {
          wallId,
          position: 0.55,
          width: 1200,
          height: 1200,
          sillHeight: 900,
          type: "fixed",
        },
        ids("window-overlap"),
      ),
    ).toThrow(/overlaps/i);
    expect(() =>
      addPlannerWindow(
        p,
        {
          wallId,
          position: 0.02,
          width: 600,
          height: 1200,
          sillHeight: 900,
          type: "fixed",
        },
        ids("window-overhang"),
      ),
    ).toThrow(/fit fully/i);
  });

  it("allows openings at the same normalized position on different walls", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } },
      ids("wall-a"),
    );
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 2000 }, end: { x: 4000, y: 2000 } },
      ids("wall-b"),
    );
    const wallA = p.floors[0]!.walls[0]!.id;
    const wallB = p.floors[0]!.walls[1]!.id;
    p = addPlannerDoor(
      p,
      {
        wallId: wallA,
        position: 0.5,
        width: 900,
        height: 2100,
        type: "single",
        swingDirection: "left",
        flipSide: false,
      },
      ids("door-a"),
    );
    p = addPlannerWindow(
      p,
      {
        wallId: wallB,
        position: 0.5,
        width: 1200,
        height: 1200,
        sillHeight: 900,
        type: "fixed",
      },
      ids("window-b"),
    );
    expect(p.floors[0]!.doors).toHaveLength(1);
    expect(p.floors[0]!.windows).toHaveLength(1);
  });

  it("repositions a door along its host wall from a world point", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } },
      ids("wall-1"),
    );
    const wallId = p.floors[0]!.walls[0]!.id;
    p = addPlannerDoor(
      p,
      {
        wallId,
        position: 0.25,
        width: 900,
        height: 2100,
        type: "single",
        swingDirection: "left",
        flipSide: false,
      },
      ids("door-1"),
    );
    p = repositionPlannerOpening(p, "doors", "door-1", { x: 2800, y: 30 });
    expect(p.floors[0]!.doors[0]!.position).toBeCloseTo(2800 / 4000, 5);
  });

  it("rejects reposition that would overlap another opening", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } },
      ids("wall-1"),
    );
    const wallId = p.floors[0]!.walls[0]!.id;
    p = addPlannerDoor(
      p,
      {
        wallId,
        position: 0.25,
        width: 900,
        height: 2100,
        type: "single",
        swingDirection: "left",
        flipSide: false,
      },
      ids("door-1"),
    );
    p = addPlannerWindow(
      p,
      {
        wallId,
        position: 0.7,
        width: 1200,
        height: 1200,
        sillHeight: 900,
        type: "fixed",
      },
      ids("window-1"),
    );
    expect(() =>
      repositionPlannerOpening(p, "doors", "door-1", { x: 2800, y: 0 }),
    ).toThrow(/overlap/i);
  });

  it("repositions a window and clamps off-wall pointer onto the host", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 0 }, end: { x: 5000, y: 0 } },
      ids("wall-1"),
    );
    const wallId = p.floors[0]!.walls[0]!.id;
    p = addPlannerWindow(
      p,
      {
        wallId,
        position: 0.4,
        width: 1200,
        height: 1200,
        sillHeight: 900,
        type: "fixed",
      },
      ids("window-1"),
    );
    // Far off the wall band still projects onto the host centreline.
    p = repositionPlannerOpening(p, "windows", "window-1", { x: 3500, y: 900 });
    expect(p.floors[0]!.windows[0]!.position).toBeCloseTo(3500 / 5000, 5);
  });

  it("rejects reposition of a missing opening", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } },
      ids("wall-1"),
    );
    expect(() =>
      repositionPlannerOpening(p, "doors", "no-such-door", { x: 2000, y: 0 }),
    ).toThrow(/does not exist/i);
    expect(() =>
      repositionPlannerOpening(p, "windows", "no-such-window", { x: 2000, y: 0 }),
    ).toThrow(/does not exist/i);
  });

  it("clamps reposition near a wall end to the end-margin centre", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 2000 }, end: { x: 2000, y: 2000 } },
      ids("wall-1"),
    );
    const wallId = p.floors[0]!.walls[0]!.id;
    p = addPlannerDoor(
      p,
      {
        wallId,
        position: 0.5,
        width: 900,
        height: 2100,
        type: "single",
        swingDirection: "left",
        flipSide: false,
      },
      ids("door-1"),
    );
    // half 450 + end margin 80 → min centre 530 on a 2000 mm wall
    p = repositionPlannerOpening(p, "doors", "door-1", { x: 0, y: 2000 });
    expect(p.floors[0]!.doors[0]!.position).toBeCloseTo(530 / 2000, 5);
  });
});
