import { describe, it, expect } from "vitest";

import { applySketchWallObjects } from "@/features/planner/ai/applySketchWallObjects";
import { createPlannerProject } from "@/features/planner/model/project";

describe("applySketchWallObjects", () => {
  it("applies wall objects as one document mutation", () => {
    const project = createPlannerProject({ name: "Sketch apply" });
    let id = 0;
    const next = applySketchWallObjects(
      project,
      [
        { type: "wall", x1: 0, y1: 0, x2: 4000, y2: 0 },
        { type: "wall", x1: 4000, y1: 0, x2: 4000, y2: 3000 },
        { type: "wall", x1: 4000, y1: 3000, x2: 0, y2: 3000 },
        { type: "wall", x1: 0, y1: 3000, x2: 0, y2: 0 },
      ],
      () => `wall-${++id}`,
    );

    const floor = next.floors[0];
    expect(floor?.walls).toHaveLength(4);
    expect(next).not.toBe(project);
  });
});
