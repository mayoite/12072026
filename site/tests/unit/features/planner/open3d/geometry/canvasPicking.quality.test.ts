/**
 * Quality non-reg gaps for canvas picking (agent 2).
 * Keeps main canvasPicking.test.ts free of concurrent edit conflict.
 */
import { describe, expect, it } from "vitest";

import { pickOpeningAtPoint } from "@/features/planner/open3d/lib/geometry/canvasPicking";
import type { Open3dWall } from "@/features/planner/open3d/model/types";

describe("pickOpeningAtPoint (quality non-reg)", () => {
  const wall: Open3dWall = {
    id: "w1",
    start: { x: 0, y: 0 },
    end: { x: 4000, y: 0 },
    thickness: 100,
    height: 2700,
  };

  it("returns null when doors and windows are both empty", () => {
    expect(
      pickOpeningAtPoint({ x: 2000, y: 0 }, [], [], [wall], 100),
    ).toBeNull();
  });
});
