import { describe, expect, it } from "vitest";

import {
  MIN_WALL_SEGMENT_MM,
  shouldCommitWallSegment,
  wallSegmentLengthMm,
  wallSegmentAngleDegrees,
  exactWallEndPoint,
} from "@/features/planner/canvas/wallDrawGeometry";
import { CANVAS_TOOL_GUIDANCE } from "@/features/planner/editor/canvasTool";
import { addPlannerWall } from "@/features/planner/model/actions/walls";
import {
  createPlannerProject,
  createRectangularRoomProject,
} from "@/features/planner/model/project";
import { executePlannerCommand } from "@/features/planner/lib/commands/plannerCommand";
import { createPlannerHistory } from "@/features/planner/store/history";
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

  it("resolves exact length and angle into a canonical endpoint", () => {
    const end = exactWallEndPoint({ x: 100, y: 200 }, 3000, 90);
    expect(end.x).toBeCloseTo(100, 8);
    expect(end.y).toBeCloseTo(3200, 8);
    expect(wallSegmentAngleDegrees({ x: 100, y: 200 }, { x: 100, y: 3200 })).toBe(90);
  });

  it("accepts segments at or above the minimum mm gate", () => {
    const start = { x: 100, y: 200 };
    expect(shouldCommitWallSegment(start, { x: 100 + MIN_WALL_SEGMENT_MM, y: 200 })).toBe(
      true,
    );
    expect(shouldCommitWallSegment(start, { x: 100, y: 200 + 2500 })).toBe(true);
  });

  it("uses Euclidean length for diagonal segments (3-4-5)", () => {
    const start = { x: 0, y: 0 };
    // Exactly 10 mm hypotenuse when 6+8 would be wrong if axis-only.
    expect(wallSegmentLengthMm(start, { x: 6, y: 8 })).toBe(10);
    expect(shouldCommitWallSegment(start, { x: 6, y: 8 })).toBe(true);
    // Just under 10 mm diagonal must reject (anti-axis-only / anti-abs(dx) lie).
    expect(shouldCommitWallSegment(start, { x: 5.9, y: 7.9 })).toBe(false);
  });

  it("honors an explicit minMm override", () => {
    const start = { x: 0, y: 0 };
    expect(shouldCommitWallSegment(start, { x: 50, y: 0 }, 100)).toBe(false);
    expect(shouldCommitWallSegment(start, { x: 100, y: 0 }, 100)).toBe(true);
    expect(shouldCommitWallSegment(start, { x: 99.9, y: 0 }, 100)).toBe(false);
  });

  it("exports MIN_WALL_SEGMENT_MM as the 10 mm product gate", () => {
    expect(MIN_WALL_SEGMENT_MM).toBe(10);
    const start = { x: 0, y: 0 };
    expect(shouldCommitWallSegment(start, { x: 10, y: 0 })).toBe(true);
    expect(shouldCommitWallSegment(start, { x: 9.999, y: 0 })).toBe(false);
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

  it("rejects zero-length and direction-insensitive duplicate walls", () => {
    const seed = createRectangularRoomProject({
      name: "Duplicate guard",
      widthMm: 5000,
      depthMm: 4000,
    });
    const first = seed.floors[0]!.walls[0]!;
    const zero = addPlannerWall(
      seed,
      { start: { x: 200, y: 200 }, end: { x: 200, y: 200 } },
      () => "zero-wall",
    );
    const duplicate = addPlannerWall(
      seed,
      { start: first.end, end: first.start },
      () => "duplicate-wall",
    );

    expect(zero).toBe(seed);
    expect(duplicate).toBe(seed);
    expect(seed.floors[0]!.walls).toHaveLength(4);
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

/**
 * Host path residual (SCORECARD #7): Fabric stage is press→drag→release.
 * Commit only when shouldCommitWallSegment gates true, then addPlannerWall
 * mutates the seed room 4 → 5. Pure unit — no Playwright / Fabric.
 */
describe("host wall commit path (pointer gate → document Δ)", () => {
  function seedFourWallRoom() {
    return createRectangularRoomProject({
      name: "Host commit seed",
      widthMm: 5000,
      depthMm: 4000,
      idFactory: ids("hf", "hp", "hw1", "hw2", "hw3", "hw4"),
    });
  }

  /** Mirrors PlannerFabricStage commitWallAt: gate then onWallDrawn → addPlannerWall. */
  function commitWallIfLongEnough(
    project: ReturnType<typeof createRectangularRoomProject>,
    start: { x: number; y: number },
    end: { x: number; y: number },
    wallId: string,
  ) {
    if (!shouldCommitWallSegment(start, end)) {
      return { committed: false as const, project };
    }
    return {
      committed: true as const,
      project: addPlannerWall(project, { start, end }, () => wallId),
    };
  }

  it("press-drag-release long segment: shouldCommit + addPlannerWall grows seed 4→5", () => {
    const seed = seedFourWallRoom();
    expect(seed.floors[0].walls).toHaveLength(4);

    // Host drag endpoints in project mm (press at start, release at end).
    const press = { x: 800, y: 1200 };
    const release = { x: 3200, y: 1200 };
    expect(shouldCommitWallSegment(press, release)).toBe(true);

    const result = commitWallIfLongEnough(seed, press, release, "host-wall-5");
    expect(result.committed).toBe(true);
    expect(result.project.floors[0].walls).toHaveLength(5);
    expect(result.project.floors[0].walls.at(-1)?.id).toBe("host-wall-5");
    expect(result.project.floors[0].walls.at(-1)?.start).toEqual(press);
    expect(result.project.floors[0].walls.at(-1)?.end).toEqual(release);
    expect(summarizeFloorMetrics(result.project.floors[0]).walls).toBe(5);
  });

  it("short drag below MIN_WALL_SEGMENT_MM does not mutate the seed room", () => {
    const seed = seedFourWallRoom();
    const press = { x: 100, y: 100 };
    const release = { x: 100 + (MIN_WALL_SEGMENT_MM - 1), y: 100 };
    expect(shouldCommitWallSegment(press, release)).toBe(false);

    const result = commitWallIfLongEnough(seed, press, release, "should-not-exist");
    expect(result.committed).toBe(false);
    expect(result.project.floors[0].walls).toHaveLength(4);
    expect(result.project).toBe(seed);
  });

  it("reverse drag direction at exact min still commits (gate is undirected length)", () => {
    const seed = seedFourWallRoom();
    const press = { x: 2000, y: 500 };
    const release = { x: 2000 - MIN_WALL_SEGMENT_MM, y: 500 };
    expect(shouldCommitWallSegment(press, release)).toBe(true);

    const result = commitWallIfLongEnough(seed, press, release, "host-wall-rev");
    expect(result.committed).toBe(true);
    expect(result.project.floors[0].walls).toHaveLength(5);
  });
});

describe("wall tool guidance honesty (drag, not two-click)", () => {
  it("CANVAS_TOOL_GUIDANCE.wall describes drag-to-draw, not two discrete clicks", () => {
    const wall = CANVAS_TOOL_GUIDANCE.wall.toLowerCase();
    expect(wall).toMatch(/drag/);
    expect(wall).toMatch(/press|release/);
    expect(wall).not.toMatch(/click start and end/);
    expect(wall).not.toMatch(/start and end points/);
    expect(wall).not.toMatch(/two[- ]click/);
  });
});
