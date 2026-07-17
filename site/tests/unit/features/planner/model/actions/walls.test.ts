import { describe, expect, it } from "vitest";
import { addPlannerWall } from "@/features/planner/model/actions/walls";
import { createPlannerProject } from "@/features/planner/model/project";
import { WALL_JOIN_EPSILON_MM } from "@/features/planner/model/wallContract";

function ids(...values: string[]) {
  let i = 0;
  return () => values[i++] ?? `gen-${i}`;
}

describe("walls actions", () => {
  it("adds a wall segment to the active floor", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    p = addPlannerWall(
      p,
      {
        start: { x: 0, y: 0 },
        end: { x: 2000, y: 0 },
        height: 2700,
        thickness: 150,
      },
      ids("wall-1"),
      "2026-01-01T00:00:00.000Z",
    );
    expect(p.floors[0]!.walls).toHaveLength(1);
    expect(p.floors[0]!.walls[0]!.end.x).toBe(2000);
    expect(p.updatedAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("joins near-miss endpoints onto shared centreline coordinates", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } },
      ids("w1"),
    );
    p = addPlannerWall(
      p,
      {
        start: { x: 4000 + WALL_JOIN_EPSILON_MM * 0.5, y: 0 },
        end: { x: 4000, y: 3000 },
      },
      ids("w2"),
    );
    const walls = p.floors[0]!.walls;
    expect(walls).toHaveLength(2);
    expect(walls[0]!.end).toEqual(walls[1]!.start);
  });

  it("creates an auto room when four walls form a closed centreline cycle", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    const makeId = ids("w1", "w2", "w3", "w4", "room-1", "room-2");
    p = addPlannerWall(p, { start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } }, makeId);
    p = addPlannerWall(p, { start: { x: 4000, y: 0 }, end: { x: 4000, y: 3000 } }, makeId);
    p = addPlannerWall(p, { start: { x: 4000, y: 3000 }, end: { x: 0, y: 3000 } }, makeId);
    p = addPlannerWall(p, { start: { x: 0, y: 3000 }, end: { x: 0, y: 0 } }, makeId);

    const floor = p.floors[0]!;
    expect(floor.walls).toHaveLength(4);
    expect(floor.rooms.length).toBeGreaterThanOrEqual(1);
    const room = floor.rooms[0]!;
    expect(room.walls).toHaveLength(4);
    expect(room.area).toBeCloseTo(12, 1);
  });
});
