import { describe, expect, it } from "vitest";
import {
  STUDIO_DRAG_ACTIONS,
  STUDIO_KEYBOARD_CONTROL_LABELS,
  STUDIO_NON_DRAG_ALTERNATIVES,
  STUDIO_NUDGE_STEP,
  STUDIO_NUDGE_STEP_FAST,
  STUDIO_ZOOM_MAX,
  STUDIO_ZOOM_MIN,
  STUDIO_ZOOM_STEP,
} from "@/features/admin/svg-editor/studioA11yContract";

describe("studioA11yContract", () => {
  it("covers drag alternatives and keyboard labels", () => {
    for (const a of STUDIO_DRAG_ACTIONS) {
      expect(STUDIO_NON_DRAG_ALTERNATIVES[a].length).toBeGreaterThan(0);
    }
    expect(STUDIO_KEYBOARD_CONTROL_LABELS).toContain("Add rectangle");
    expect(STUDIO_NUDGE_STEP_FAST).toBe(STUDIO_NUDGE_STEP * 10);
    expect(STUDIO_ZOOM_STEP).toBeGreaterThan(1);
    expect(STUDIO_ZOOM_MIN).toBeLessThan(STUDIO_ZOOM_MAX);
  });
});
