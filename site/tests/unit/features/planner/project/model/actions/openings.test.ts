import { describe, expect, it } from "vitest";
import { addPlannerWall } from "@/features/planner/project/model/actions/walls";
import { addPlannerDoor, addPlannerWindow } from "@/features/planner/project/model/actions/openings";
import { createPlannerProject } from "@/features/planner/project/model/project";

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
        position: 0.6,
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
  });
});
