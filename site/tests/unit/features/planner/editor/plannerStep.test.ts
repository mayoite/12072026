import { describe, expect, it } from "vitest";
import {
  PLANNER_STEPS,
  PLANNER_STEP_LABELS,
  PLANNER_STEP_DETAILS,
  type PlannerStep,
} from "@/features/planner/editor/plannerStep";

describe("plannerStep", () => {
  it("exposes draw → place → review with labels and details", () => {
    expect(PLANNER_STEPS).toEqual(["draw", "place", "review"]);
    for (const step of PLANNER_STEPS as PlannerStep[]) {
      expect(PLANNER_STEP_LABELS[step].length).toBeGreaterThan(0);
      expect(PLANNER_STEP_DETAILS[step].length).toBeGreaterThan(3);
    }
    expect(PLANNER_STEP_LABELS.draw).toBe("Draw room");
    expect(PLANNER_STEP_LABELS.place).toBe("Place furniture");
    expect(PLANNER_STEP_LABELS.review).toBe("Review & quote");
    expect(PLANNER_STEP_DETAILS.place.toLowerCase()).toMatch(/furniture|door/);
  });
});
