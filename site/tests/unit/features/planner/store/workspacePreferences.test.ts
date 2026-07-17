import { describe, expect, it } from "vitest";
import {
  DEFAULT_PLANNER_WORKSPACE_PREFERENCES,
  parsePlannerWorkspacePreferences,
  PlannerWorkspacePreferencesV1Schema,
} from "@/features/planner/store/workspacePreferences";

describe("workspacePreferences", () => {
  it("defaults parse as valid v1", () => {
    const parsed = PlannerWorkspacePreferencesV1Schema.safeParse(
      DEFAULT_PLANNER_WORKSPACE_PREFERENCES,
    );
    expect(parsed.success).toBe(true);
    expect(DEFAULT_PLANNER_WORKSPACE_PREFERENCES.version).toBe(1);
  });

  it("parse recovers independently from invalid input", () => {
    const good = parsePlannerWorkspacePreferences(DEFAULT_PLANNER_WORKSPACE_PREFERENCES);
    expect(good.version).toBe(1);
    const recovered = parsePlannerWorkspacePreferences({ version: 99 });
    expect(recovered.version).toBe(1);
    expect(recovered.units).toBe(DEFAULT_PLANNER_WORKSPACE_PREFERENCES.units);
  });
});
