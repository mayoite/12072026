import { describe, expect, it } from "vitest";
import { PLANNER_ONBOARDING_STEPS } from "@/features/planner/onboarding/steps";

describe("onboarding steps", () => {
  it("lists coach steps with unique ids", () => {
    expect(PLANNER_ONBOARDING_STEPS.length).toBeGreaterThanOrEqual(5);
    const ids = PLANNER_ONBOARDING_STEPS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(
      expect.arrayContaining(["welcome", "catalog", "tools", "3d-view", "help"]),
    );
    for (const step of PLANNER_ONBOARDING_STEPS) {
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.description.length).toBeGreaterThan(0);
    }
  });
});
