import { describe, expect, it } from "vitest";
import {
  createPlannerProject,
  createRectangularRoomProject,
  createPlannerSceneEnvelope,
} from "@/features/planner/model/project";

function ids(...values: string[]) {
  let i = 0;
  return () => values[i++] ?? `gen-${i}`;
}

describe("project factory", () => {
  it("creates empty project with one floor and defaults", () => {
    const p = createPlannerProject({
      name: "Alpha",
      now: "2026-01-01T00:00:00.000Z",
      idFactory: ids("floor", "project"),
    });
    expect(p.name).toBe("Alpha");
    expect(p.floors).toHaveLength(1);
    expect(p.activeFloorId).toBe("floor");
    expect(p.id).toBe("project");
    expect(p.displayUnit).toBe("mm");
    expect(p.createdAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("builds rectangular room with four walls and envelope", () => {
    const p = createRectangularRoomProject({
      widthMm: 6000,
      depthMm: 4000,
      wallHeightMm: 2700,
      wallThicknessMm: 150,
      idFactory: ids("floor", "project", "w1", "w2", "w3", "w4"),
    });
    expect(p.floors[0]!.walls).toHaveLength(4);
    expect(p.floors[0]!.walls[0]).toMatchObject({ height: 2700, thickness: 150 });
    const env = createPlannerSceneEnvelope(p);
    expect(env.type).toBe("open3d-floorplan-project");
    expect(env.version).toBe(1);
    expect(env.project).toBe(p);
  });
});
