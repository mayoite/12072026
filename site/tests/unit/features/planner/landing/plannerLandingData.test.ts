import { describe, it, expect } from "vitest";
import { PLANNER_HERO, PLANNER_PROOF, PLANNER_LANDING_FEATURES, PLANNER_STEPS } from "@/features/planner/landing/plannerLandingData";

describe("plannerLandingData", () => {
  it("has correct hero text and CTA links", () => {
    expect(PLANNER_HERO.titleLead).toBe("Plan your ");
    expect(PLANNER_HERO.primaryCta.href).toBe("/planner/guest/");
  });

  it("defines proof parameters", () => {
    expect(PLANNER_PROOF).toHaveLength(3);
    expect(PLANNER_PROOF[0].value).toBe("Import sketch");
  });

  it("builds features from slugs and mapping", () => {
    expect(PLANNER_LANDING_FEATURES).toHaveLength(4);
    expect(PLANNER_LANDING_FEATURES[0].slug).toBe("measure");
  });

  it("defines steps correctly", () => {
    expect(PLANNER_STEPS).toHaveLength(3);
    expect(PLANNER_STEPS[0].step).toBe("01");
  });
});
