import { describe, expect, it } from "vitest";
import { inspectPlannerProject, assertPlannerProject } from "@/features/planner/project/model/invariants";
import { createPlannerProject, createRectangularRoomProject } from "@/features/planner/project/model/project";

describe("invariants", () => {
  it("passes clean rectangular projects", () => {
    const p = createRectangularRoomProject({ widthMm: 4000, depthMm: 3000 });
    expect(inspectPlannerProject(p)).toEqual([]);
    expect(() => assertPlannerProject(p)).not.toThrow();
  });

  it("flags missing active floor and bad walls", () => {
    const p = createPlannerProject();
    p.activeFloorId = "missing";
    const issues = inspectPlannerProject(p);
    expect(issues.some((i) => i.code === "missing-active-floor")).toBe(true);
    expect(() => assertPlannerProject(p)).toThrow(/active floor/i);

    const bad = createRectangularRoomProject({ widthMm: 1000, depthMm: 1000 });
    bad.floors[0]!.walls[0] = {
      ...bad.floors[0]!.walls[0]!,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      height: 0,
    };
    expect(inspectPlannerProject(bad).some((i) => i.code === "invalid-dimension")).toBe(true);
  });
});
