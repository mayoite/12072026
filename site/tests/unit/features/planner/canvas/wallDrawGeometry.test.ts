import { describe, expect, it } from "vitest";

import {
  MIN_WALL_SEGMENT_MM,
  shouldCommitWallSegment,
  wallSegmentLengthMm,
} from "@/features/planner/canvas/wallDrawGeometry";
import { addPlannerWall } from "@/features/planner/project/model/actions/walls";
import {
  createPlannerProject,
  createRectangularRoomProject,
} from "@/features/planner/project/model/project";
import { executePlannerCommand } from "@/features/planner/project/lib/commands/plannerCommand";
import { createPlannerHistory } from "@/features/planner/project/store/history";
import { summarizeFloorMetrics } from "@/features/planner/editor/workspacePlanMetrics";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

describe("wallDrawGeometry", () => {
  it("rejects segments shorter than the minimum mm gate", () => {
    const start = { x: 0, y: 0 };
    expect(shouldCommitWallSegment(start, { x: MIN_WALL_SEGMENT_MM - 0.01, y: 0 })).toBe(
      false,
    );
    expect(shouldCommitWallSegment(start, { x: 0, y: 0 })).toBe(false);
    expect(wallSegmentLengthMm(start, { x: 3, y: 4 })).toBe(5);
  });

  it("accepts segments at or above the minimum mm gate", () => {
    const start = { x: 100, y: 200 };
    expect(shouldCommitWallSegment(start, { x: 100 + MIN_WALL_SEGMENT_MM, y: 200 })).toBe(
      true,
    );
    expect(shouldCommitWallSegment(start, { x: 100, y: 200 + 2500 })).toBe(true);
  });
});

describe("addPlannerWall Δ walls (seed room → draw)", () => {
  it("increases wall count on a rectangular seed room (W1 pure path)", () => {
    const seed = createRectangularRoomProject({
      name: "Seed",
      widthMm: 5000,
      depthMm: 4000,
      idFactory: ids(
        "floor",
        "project",
        "w1",
        "w2",
        "w3",
        "w4",
      ),
    });
    const before = seed.floors[0].walls.length;
    expect(before).toBe(4);

    const next = addPlannerWall(
      seed,
      { start: { x: 500, y: 500 }, end: { x: 3500, y: 500 } },
      () => "wall-drawn-1",
      "2026-07-12T00:00:00.000Z",
    );

    expect(next.floors[0].walls).toHaveLength(before + 1);
    expect(next.floors[0].walls.at(-1)?.id).toBe("wall-drawn-1");
    expect(next.floors[0].walls.at(-1)?.start).toEqual({ x: 500, y: 500 });
    expect(next.floors[0].walls.at(-1)?.end).toEqual({ x: 3500, y: 500 });
    expect(summarizeFloorMetrics(next.floors[0]).walls).toBe(before + 1);
  });

  it("routes through document.update so workspace history records the Δ", () => {
    const seed = createRectangularRoomProject({
      name: "History seed",
      widthMm: 5000,
      depthMm: 4000,
      idFactory: ids("hf", "hp", "a", "b", "c", "d"),
    });
    const history = createPlannerHistory(seed);
    const before = seed.floors[0].walls.length;

    const result = executePlannerCommand(history, {
      type: "document.update",
      updater: (project) =>
        addPlannerWall(
          project,
          { start: { x: 0, y: 1000 }, end: { x: 4000, y: 1000 } },
          () => "wall-via-command",
        ),
      now: "2026-07-12T01:00:00.000Z",
    });

    expect(result.status).toBe("applied");
    expect(result.history.present.floors[0].walls).toHaveLength(before + 1);
    expect(result.history.past).toHaveLength(1);
    expect(result.history.past[0].floors[0].walls).toHaveLength(before);
  });

  it("appends onto empty project floors as well", () => {
    const empty = createPlannerProject({
      idFactory: ids("ef", "ep"),
      name: "Empty",
    });
    expect(empty.floors[0].walls).toHaveLength(0);
    const next = addPlannerWall(
      empty,
      { start: { x: 0, y: 0 }, end: { x: 100, y: 0 } },
      () => "first-wall",
    );
    expect(next.floors[0].walls).toHaveLength(1);
  });
});
