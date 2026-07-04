import { describe, expect, it } from "vitest";
import { PlannerToolsShowcase } from "@/features/planner/landing/PlannerToolsShowcase";

describe("PlannerToolsShowcase", () => {
  it("exports PlannerToolsShowcase component", () => {
    expect(PlannerToolsShowcase).toBeTypeOf("function");
  });
});
