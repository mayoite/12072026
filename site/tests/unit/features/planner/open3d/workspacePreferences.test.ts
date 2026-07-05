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

  it("panelRatios default support >=60% canvas width at 1440px (task5; GS: REC-01 Figma minimize-UI, REC-04 catalogue-first sidebar, no donor px widths)", () => {
    const ratios = DEFAULT_PLANNER_WORKSPACE_PREFERENCES.panelRatios;
    // simulate 1440 avail ~1320 (margin for rail+chrome); total side <=~0.345 to guarantee 60%
    const avail = 1320;
    const leftW = Math.round(avail * ratios.catalogue);
    const rightW = Math.round(avail * ratios.properties);
    const canvasW = 1440 - (leftW + rightW + 120); // rail+header margins
    expect(canvasW).toBeGreaterThanOrEqual(Math.round(1440 * 0.6));
    expect(ratios.catalogue).toBeLessThanOrEqual(0.18);
    expect(ratios.properties).toBeLessThanOrEqual(0.18);
  });
});
