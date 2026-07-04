import { describe, it, expect, vi } from "vitest";
import { PLANNER_LANDING_ICONS } from "@/features/planner/landing/plannerLandingIcons";

vi.mock("@phosphor-icons/react", () => ({
  Ruler: () => "RulerIcon",
  Layout: () => "LayoutIcon",
  Cube: () => "CubeIcon",
  Export: () => "ExportIcon",
  Sparkle: () => "SparkleIcon",
}));

describe("plannerLandingIcons", () => {
  it("maps keys to the expected icon components", () => {
    expect(PLANNER_LANDING_ICONS.measure).toBeDefined();
    expect(PLANNER_LANDING_ICONS.catalog).toBeDefined();
    expect(PLANNER_LANDING_ICONS["3d-view"]).toBeDefined();
    expect(PLANNER_LANDING_ICONS.export).toBeDefined();
    expect(PLANNER_LANDING_ICONS["ai-assist"]).toBeDefined();
  });
});
