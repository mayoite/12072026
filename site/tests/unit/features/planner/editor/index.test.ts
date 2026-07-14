import { describe, expect, it } from "vitest";
import * as editor from "@/features/planner/editor";

describe("editor barrel", () => {
  it("re-exports workspace entry components", () => {
    expect(typeof editor.OOPlannerWorkspace === "function" || typeof editor.OOPlannerWorkspace === "object").toBe(
      true,
    );
    expect(typeof editor.WorkspaceShell === "function" || typeof editor.WorkspaceShell === "object").toBe(true);
    expect(typeof editor.PlannerFabricStage === "function" || typeof editor.PlannerFabricStage === "object").toBe(
      true,
    );
    expect(editor.OOPlannerWorkspace).toBeDefined();
    expect(editor.WorkspaceShell).toBeDefined();
    expect(editor.PlannerFabricStage).toBeDefined();
  });
});
