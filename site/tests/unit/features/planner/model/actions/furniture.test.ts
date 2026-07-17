import { describe, expect, it } from "vitest";
import { addPlannerFurniture, rotatePlannerFurniture } from "@/features/planner/model/actions/furniture";
import { createPlannerProject } from "@/features/planner/model/project";

function ids(...values: string[]) {
  let i = 0;
  return () => values[i++] ?? `gen-${i}`;
}

describe("furniture actions", () => {
  it("adds furniture and rotates by absolute degrees", () => {
    let p = createPlannerProject({ idFactory: ids("floor", "project") });
    p = addPlannerFurniture(
      p,
      {
        catalogId: "desk",
        position: { x: 100, y: 200 },
        rotation: -10,
        scale: { x: 1, y: 1, z: 1 },
        width: 1200,
        depth: 600,
        height: 750,
      },
      ids("furn-1"),
    );
    expect(p.floors[0]!.furniture).toHaveLength(1);
    expect(p.floors[0]!.furniture[0]!.rotation).toBe(350);
    p = rotatePlannerFurniture(p, "furn-1", 90);
    expect(p.floors[0]!.furniture[0]!.rotation).toBe(90);
  });
});
