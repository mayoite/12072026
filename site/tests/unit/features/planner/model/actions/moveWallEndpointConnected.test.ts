import { describe, expect, it } from "vitest";
import {
  addPlannerWall,
  movePlannerWallEndpointConnected,
} from "@/features/planner/model/actions/walls";
import { createPlannerProject } from "@/features/planner/model/project";

function ids(...values: string[]) {
  let i = 0;
  return () => values[i++] ?? `gen-${i}`;
}

describe("movePlannerWallEndpointConnected", () => {
  it("moves joined endpoints together without breaking the corner", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    const makeId = ids("w1", "w2", "room");
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } },
      makeId,
    );
    p = addPlannerWall(
      p,
      { start: { x: 4000, y: 0 }, end: { x: 4000, y: 3000 } },
      makeId,
    );
    const w1 = p.floors[0]!.walls[0]!;
    p = movePlannerWallEndpointConnected(
      p,
      w1.id,
      "end",
      { x: 4200, y: 100 },
      makeId,
    );
    const walls = p.floors[0]!.walls;
    expect(walls[0]!.end).toEqual({ x: 4200, y: 100 });
    expect(walls[1]!.start).toEqual({ x: 4200, y: 100 });
  });

  it("moves a free start endpoint without inventing joins", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    const makeId = ids("w1", "room");
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 0 }, end: { x: 3000, y: 0 } },
      makeId,
    );
    const wallId = p.floors[0]!.walls[0]!.id;
    p = movePlannerWallEndpointConnected(
      p,
      wallId,
      "start",
      { x: 200, y: 500 },
      makeId,
    );
    expect(p.floors[0]!.walls[0]!.start).toEqual({ x: 200, y: 500 });
    expect(p.floors[0]!.walls[0]!.end).toEqual({ x: 3000, y: 0 });
  });

  it("no-ops for unknown wall id", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    const makeId = ids("w1");
    p = addPlannerWall(
      p,
      { start: { x: 0, y: 0 }, end: { x: 2000, y: 0 } },
      makeId,
    );
    const before = p.floors[0]!.walls[0]!;
    const next = movePlannerWallEndpointConnected(
      p,
      "missing",
      "end",
      { x: 1, y: 1 },
      makeId,
    );
    expect(next.floors[0]!.walls[0]).toEqual(before);
  });
});
