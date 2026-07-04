import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isPlannerToolVisible,
  readPlannerToolVisibilityMode,
  writePlannerToolVisibilityMode,
  isPlannerDevToolsEnabled,
} from "@/features/planner/editor/plannerToolVisibility";

describe("plannerToolVisibility", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubEnv("NODE_ENV", "development");
  });

  it("checks tool visibility under different modes", () => {
    const wallTool = { plannerTool: "wall" } as any;
    const selectTool = { plannerTool: "select" } as any;

    // Always visible tools
    expect(isPlannerToolVisible("review", selectTool, "step")).toBe(true);

    // Step-focused visibility
    expect(isPlannerToolVisible("review", wallTool, "step")).toBe(false);
    expect(isPlannerToolVisible("draw", wallTool, "step")).toBe(true);

    // Balanced visibility
    expect(isPlannerToolVisible("review", wallTool, "balanced")).toBe(true);
  });

  it("reads and writes visibility mode to local storage", () => {
    writePlannerToolVisibilityMode("balanced");
    expect(readPlannerToolVisibilityMode()).toBe("balanced");
  });

  it("checks if planner dev tools are enabled", () => {
    expect(isPlannerDevToolsEnabled()).toBe(true);
  });
});
