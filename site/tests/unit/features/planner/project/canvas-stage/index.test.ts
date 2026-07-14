import { describe, expect, it } from "vitest";
import { PlannerCanvasStage } from "@/features/planner/project/canvas-stage";

describe("canvas-stage barrel", () => {
  it("re-exports PlannerCanvasStage component", () => {
    expect(PlannerCanvasStage).toBeDefined();
    expect(
      typeof PlannerCanvasStage === "function" || typeof PlannerCanvasStage === "object",
    ).toBe(true);
  });
});
