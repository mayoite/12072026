import { describe, expect, it } from "vitest";
import { addLinearDimension, addRectangularRoom } from "@/features/planner/model/operations/pureActions";
import { createPlannerProject } from "@/features/planner/model/project";
import { buildWallGraph, findEnclosedRooms } from "@/features/planner/lib/geometry/wallGraph";

function ids(...values: string[]) {
  let i = 0;
  return () => values[i++] ?? `gen-${i}`;
}

describe("addRectangularRoom + linear dimensions", () => {
  it("creates four walls, one room, and durable dimension annotations", () => {
    const project = createPlannerProject({ idFactory: ids("floor", "project") });
    const result = addRectangularRoom(
      project,
      { x: 0, y: 0 },
      { x: 5000, y: 4000 },
      {
        idFactory: ids(
          "w1",
          "w2",
          "w3",
          "w4",
          "room",
          "d1",
          "d2",
          "d3",
          "d4",
          "d5",
          "d6",
        ),
        wallThicknessMm: 150,
        attachDimensions: true,
      },
    );
    const floor = result.project.floors[0]!;
    expect(floor.walls).toHaveLength(4);
    expect(floor.rooms).toHaveLength(1);
    expect(floor.rooms[0]!.area).toBeCloseTo(20, 1);
    expect(floor.rooms[0]!.walls).toHaveLength(4);
    // 4 wall dims + 2 overall (width/depth)
    expect(floor.annotations.length).toBeGreaterThanOrEqual(6);

    const cycles = findEnclosedRooms(buildWallGraph(floor.walls));
    expect(cycles.length).toBeGreaterThanOrEqual(1);
    expect(cycles[0]!.areaMm2).toBeCloseTo(20_000_000, 0);
  });

  it("adds a free linear dimension annotation via tool path", () => {
    const project = createPlannerProject({ idFactory: ids("floor", "project") });
    const withDim = addLinearDimension(
      project,
      { x: 0, y: 0 },
      { x: 2500, y: 0 },
      { idFactory: ids("dim-1") },
    );
    expect(withDim.project.floors[0]!.annotations).toHaveLength(1);
    expect(withDim.project.floors[0]!.annotations[0]!.label).toBeDefined();
    expect(withDim.action.type).toBe("ADD_ANNOTATION");
  });
});
