import { describe, expect, it } from "vitest";
import { addPlannerWall } from "@/features/planner/project/model/actions/walls";
import { createPlannerProject } from "@/features/planner/project/model/project";

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
});
