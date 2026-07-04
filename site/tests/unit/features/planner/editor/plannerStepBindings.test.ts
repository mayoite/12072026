import { describe, it, expect } from "vitest";
import { getStepToolBinding, getStepLeftTab } from "@/features/planner/editor/plannerStepBindings";
import type { PlannerStep } from "@/features/planner/editor/plannerStep";

describe("getStepToolBinding", () => {
  it("returns wall tool binding for draw step", () => {
    expect(getStepToolBinding("draw")).toEqual({ toolId: "planner-wall", plannerTool: "wall" });
  });

  it("returns furniture tool binding for place step", () => {
    expect(getStepToolBinding("place")).toEqual({ toolId: "planner-furniture", plannerTool: "furniture" });
  });

  it("returns measure tool binding for review step", () => {
    expect(getStepToolBinding("review")).toEqual({ toolId: "planner-measurement", plannerTool: "measure" });
  });

  it("returns select tool binding for other steps or default", () => {
    expect(getStepToolBinding("export" as PlannerStep)).toEqual({ toolId: "select", plannerTool: "select" });
  });
});

describe("getStepLeftTab", () => {
  it("always returns library", () => {
    expect(getStepLeftTab("draw")).toBe("library");
    expect(getStepLeftTab("place")).toBe("library");
    expect(getStepLeftTab("review")).toBe("library");
    expect(getStepLeftTab("export" as PlannerStep)).toBe("library");
  });
});
