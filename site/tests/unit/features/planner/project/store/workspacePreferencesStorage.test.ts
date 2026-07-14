import { describe, expect, it, beforeEach } from "vitest";
import {
  PLANNER_WORKSPACE_PREFS_STORAGE_KEY,
  readPlannerWorkspacePreferencesFromStorage,
  writePlannerWorkspacePreferencesToStorage,
  patchPlannerWorkspacePreferences,
} from "@/features/planner/project/store/workspacePreferencesStorage";
import { DEFAULT_PLANNER_WORKSPACE_PREFERENCES } from "@/features/planner/project/store/workspacePreferences";

describe("workspacePreferencesStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reads defaults when empty; write/read round-trips", () => {
    const initial = readPlannerWorkspacePreferencesFromStorage();
    expect(initial?.version).toBe(DEFAULT_PLANNER_WORKSPACE_PREFERENCES.version);
    writePlannerWorkspacePreferencesToStorage({
      ...DEFAULT_PLANNER_WORKSPACE_PREFERENCES,
      gridEnabled: false,
    });
    const raw = localStorage.getItem(PLANNER_WORKSPACE_PREFS_STORAGE_KEY);
    expect(raw).toContain("gridEnabled");
    const next = readPlannerWorkspacePreferencesFromStorage();
    expect(next?.gridEnabled).toBe(false);
  });

  it("patch merges partial updates", () => {
    const patched = patchPlannerWorkspacePreferences({ snapEnabled: false });
    expect(patched.snapEnabled).toBe(false);
    expect(patched.version).toBe(1);
  });
});
