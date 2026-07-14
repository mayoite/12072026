import { describe, expect, it } from "vitest";
import {
  addWall,
  updateWall,
  addFurniture,
  removeFurniture,
  updateProjectName,
} from "@/features/planner/project/model/operations/pureActions";
import {
  createPlannerProject,
  createRectangularRoomProject,
} from "@/features/planner/project/model/project";

function ids(...values: string[]) {
  let i = 0;
  return () => values[i++] ?? `gen-${i}`;
}

describe("pureActions", () => {
  it("adds and updates walls", () => {
    const p = createPlannerProject({ idFactory: ids("floor", "project") });
    const r = addWall(p, { x: 0, y: 0 }, { x: 1000, y: 0 }, { idFactory: ids("w1") });
    expect(r.project.floors[0]!.walls).toHaveLength(1);
    expect(r.action.type).toMatch(/WALL/i);
    const wallId = r.project.floors[0]!.walls[0]!.id;
    const updated = updateWall(r.project, wallId, { thickness: 200 });
    expect(updated.project.floors[0]!.walls[0]!.thickness).toBe(200);
  });

  it("adds furniture and renames project", () => {
    let p = createRectangularRoomProject({
      widthMm: 4000,
      depthMm: 3000,
      idFactory: ids("floor", "project", "w1", "w2", "w3", "w4"),
    });
    const named = updateProjectName(p, "Renamed");
    expect(named.project.name).toBe("Renamed");
    const withFurn = addFurniture(
      named.project,
      "desk",
      { x: 100, y: 100 },
      { idFactory: ids("f1") },
    );
    expect(withFurn.project.floors[0]!.furniture).toHaveLength(1);
    const furnId = withFurn.project.floors[0]!.furniture[0]!.id;
    const cleared = removeFurniture(withFurn.project, furnId);
    expect(cleared.project.floors[0]!.furniture).toHaveLength(0);
  });
});
