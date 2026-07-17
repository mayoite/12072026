import { describe, expect, it } from "vitest";

import {
  DEFAULT_WALL_THICKNESS_MM,
  joinWallSegmentToFloor,
  snapToNearestWallEndpoint,
  WALL_JOIN_EPSILON_MM,
} from "@/features/planner/model/wallContract";
import type { PlannerWall } from "@/features/planner/model/types";

function wall(
  id: string,
  start: { x: number; y: number },
  end: { x: number; y: number },
): PlannerWall {
  return {
    id,
    start,
    end,
    thickness: DEFAULT_WALL_THICKNESS_MM,
    height: 2700,
    color: "var(--text-inverse-body)",
  };
}

describe("wallContract", () => {
  it("snaps to the nearest centreline endpoint within join epsilon", () => {
    const walls = [wall("a", { x: 0, y: 0 }, { x: 4000, y: 0 })];
    const snapped = snapToNearestWallEndpoint(
      { x: WALL_JOIN_EPSILON_MM * 0.4, y: 0 },
      walls,
    );
    expect(snapped).toEqual({ x: 0, y: 0 });
  });

  it("does not snap beyond join epsilon", () => {
    const walls = [wall("a", { x: 0, y: 0 }, { x: 4000, y: 0 })];
    const raw = { x: WALL_JOIN_EPSILON_MM + 1, y: 0 };
    expect(snapToNearestWallEndpoint(raw, walls)).toEqual(raw);
  });

  it("coalesces near-miss joins onto shared coordinates", () => {
    const walls = [wall("a", { x: 0, y: 0 }, { x: 4000, y: 0 })];
    const joined = joinWallSegmentToFloor(
      walls,
      { x: 4000.4, y: 0.3 },
      { x: 4000, y: 3000 },
    );
    expect(joined.start).toEqual({ x: 4000, y: 0 });
    expect(joined.walls[0]!.end).toEqual({ x: 4000, y: 0 });
  });
});
