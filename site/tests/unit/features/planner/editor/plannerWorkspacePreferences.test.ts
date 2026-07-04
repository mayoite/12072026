import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  readPlannerWorkspacePreferences,
  writePlannerWorkspacePreferences,
  PLANNER_WORKSPACE_DEFAULTS,
  PLANNER_WORKSPACE_PREFERENCES_KEY,
} from "@/features/planner/editor/plannerWorkspacePreferences";

describe("plannerWorkspacePreferences", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("reads defaults when localStorage is empty", () => {
    const preferences = readPlannerWorkspacePreferences();
    expect(preferences).toEqual(PLANNER_WORKSPACE_DEFAULTS);
  });

  it("reads preferences from localStorage correctly", () => {
    localStorage.setItem(
      PLANNER_WORKSPACE_PREFERENCES_KEY,
      JSON.stringify({
        leftOpen: false,
        rightOpen: true,
        leftCollapsed: true,
        rightCollapsed: true,
        viewMode: "split",
        catalogQuery: "desk",
      })
    );
    const preferences = readPlannerWorkspacePreferences();
    expect(preferences).toEqual({
      leftOpen: false,
      rightOpen: true,
      leftCollapsed: true,
      rightCollapsed: true,
      viewMode: "split",
      catalogQuery: "desk",
    });
  });

  it("handles fallback to default values on malformed / missing properties", () => {
    localStorage.setItem(
      PLANNER_WORKSPACE_PREFERENCES_KEY,
      JSON.stringify({
        leftOpen: "not-a-boolean",
        viewMode: "invalid-mode",
        catalogQuery: 123,
      })
    );
    const preferences = readPlannerWorkspacePreferences();
    expect(preferences.leftOpen).toBe(PLANNER_WORKSPACE_DEFAULTS.leftOpen);
    expect(preferences.viewMode).toBe("2d");
    expect(preferences.catalogQuery).toBe("");
  });

  it("handles fallback when localStorage throws (corrupt JSON)", () => {
    localStorage.setItem(PLANNER_WORKSPACE_PREFERENCES_KEY, "{corrupt-json");
    const preferences = readPlannerWorkspacePreferences();
    expect(preferences).toEqual(PLANNER_WORKSPACE_DEFAULTS);
  });

  it("writes patches to localStorage correctly", () => {
    writePlannerWorkspacePreferences({ leftOpen: false });
    let preferences = readPlannerWorkspacePreferences();
    expect(preferences.leftOpen).toBe(false);
    expect(preferences.rightOpen).toBe(PLANNER_WORKSPACE_DEFAULTS.rightOpen);

    writePlannerWorkspacePreferences({ viewMode: "3d", catalogQuery: "chair" });
    preferences = readPlannerWorkspacePreferences();
    expect(preferences.leftOpen).toBe(false);
    expect(preferences.viewMode).toBe("3d");
    expect(preferences.catalogQuery).toBe("chair");
  });

  it("does not crash write when localStorage is disabled or throws", () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error("Quota exceeded");
    };
    expect(() => writePlannerWorkspacePreferences({ leftOpen: false })).not.toThrow();
    localStorage.setItem = originalSetItem;
  });
});
