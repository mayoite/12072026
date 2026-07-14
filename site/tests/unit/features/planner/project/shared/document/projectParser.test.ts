import { describe, expect, it } from "vitest";
import {
  parsePlannerProject,
  parsePlannerSceneEnvelope,
} from "@/features/planner/project/shared/document/projectParser";
import {
  createPlannerProject,
  createPlannerSceneEnvelope,
} from "@/features/planner/project/model/project";

describe("projectParser", () => {
  it("parses project and envelope objects", () => {
    const project = createPlannerProject({ name: "Parse Me" });
    const parsed = parsePlannerProject(project);
    expect(parsed.name).toBe("Parse Me");
    expect(parsed.floors.length).toBe(1);
    const env = createPlannerSceneEnvelope(project);
    const parsedEnv = parsePlannerSceneEnvelope(env);
    expect(parsedEnv.project.name).toBe("Parse Me");
    expect(parsedEnv.version).toBe(1);
  });
});
