import { afterEach, describe, expect, it } from "vitest";

import { DEFAULT_PLANNER_WORKSPACE_PREFERENCES } from "@/features/planner/project/store/workspacePreferences";
import {
  patchPlannerWorkspacePreferences,
  PLANNER_WORKSPACE_PREFS_STORAGE_KEY,
  readPlannerWorkspacePreferencesFromStorage,
} from "@/features/planner/project/store/workspacePreferencesStorage";

describe("workspacePreferencesStorage", () => {
  afterEach(() => {
    localStorage.removeItem(PLANNER_WORKSPACE_PREFS_STORAGE_KEY);
  });

  it("patches grid and snap flags independently", () => {
    const updated = patchPlannerWorkspacePreferences({
      gridEnabled: false,
      snapEnabled: false,
    });
    expect(updated.gridEnabled).toBe(false);
    expect(updated.snapEnabled).toBe(false);
    expect(updated.density).toBe(DEFAULT_PLANNER_WORKSPACE_PREFERENCES.density);

    const restored = readPlannerWorkspacePreferencesFromStorage();
    expect(restored?.gridEnabled).toBe(false);
    expect(restored?.snapEnabled).toBe(false);
  });
});