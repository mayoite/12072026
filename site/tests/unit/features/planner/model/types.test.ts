import { describe, expect, it } from "vitest";
import type {
  PlannerProject,
  PlannerFloor,
  PlannerWall,
  PlannerSceneEnvelope,
} from "@/features/planner/model/types";
import { createPlannerProject, createPlannerSceneEnvelope } from "@/features/planner/model/project";

describe("model types (compile + structural)", () => {
  it("project and envelope shapes match factory output", () => {
    const project: PlannerProject = createPlannerProject({ name: "Typed" });
    const floor: PlannerFloor = project.floors[0]!;
    expect(floor.name).toBe("Ground Floor");
    const wall: PlannerWall = {
      id: "w",
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      height: 1,
      thickness: 1,
    };
    expect(wall.start.x).toBe(0);
    const envelope: PlannerSceneEnvelope = createPlannerSceneEnvelope(project);
    expect(envelope.units).toBe("mm");
    expect(envelope.project.id).toBe(project.id);
  });
});
