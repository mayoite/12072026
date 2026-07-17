import { describe, expect, it } from "vitest";
import {
  PLANNER_STEPS,
  PLANNER_STEP_LABELS,
  PLANNER_STEP_DETAILS,
  derivePlannerStepCompletion,
  plannerForwardWarning,
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

  it("derives completion from measured room, furniture, and quote readiness", () => {
    expect(derivePlannerStepCompletion()).toEqual({
      draw: "incomplete",
      place: "incomplete",
      review: "incomplete",
    });
    expect(
      derivePlannerStepCompletion({
        walls: 4,
        furniture: 1,
        boqReady: true,
        closedRoom: true,
        planWidthMm: 5000,
        planDepthMm: 4000,
      }),
    ).toEqual({ draw: "complete", place: "complete", review: "complete" });
  });

  it("warns on incomplete forward exploration without blocking it", () => {
    const completion = derivePlannerStepCompletion({
      walls: 0,
      furniture: 0,
      boqReady: false,
      closedRoom: false,
    });
    expect(plannerForwardWarning("draw", completion)).toBeNull();
    expect(plannerForwardWarning("place", completion)).toContain("Draw room");
    expect(plannerForwardWarning("review", completion)).toContain(
      "Draw room and Place furniture",
    );
  });
});
