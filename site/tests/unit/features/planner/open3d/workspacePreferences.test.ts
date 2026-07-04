import { describe, expect, it } from "vitest";

import {
  DEFAULT_PLANNER_WORKSPACE_PREFERENCES,
  parsePlannerWorkspacePreferences,
} from "@/features/planner/open3d/store/workspacePreferences";

describe("planner workspace preferences", () => {
  it("accepts valid versioned preferences", () => {
    const input = {
      ...DEFAULT_PLANNER_WORKSPACE_PREFERENCES,
      density: "touch" as const,
      collapsedPanels: ["properties"] as const,
    };

    expect(parsePlannerWorkspacePreferences(input)).toEqual(input);
  });

  it("recovers invalid preferences to safe defaults", () => {
    const recovered = parsePlannerWorkspacePreferences({
      version: 1,
      panelRatios: { catalogue: 2, properties: -1 },
    });

    expect(recovered).toEqual(DEFAULT_PLANNER_WORKSPACE_PREFERENCES);
    expect(recovered).not.toBe(DEFAULT_PLANNER_WORKSPACE_PREFERENCES);
    expect(recovered.panelRatios).not.toBe(
      DEFAULT_PLANNER_WORKSPACE_PREFERENCES.panelRatios,
    );
  });
});
