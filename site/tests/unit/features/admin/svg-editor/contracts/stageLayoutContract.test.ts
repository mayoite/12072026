import { describe, expect, it } from "vitest";
import {
  AUTHORING_WIDTH_PX,
  RAIL_MAX_REM,
  ROOT_FONT_PX,
  STAGE_GAP_REM,
  STAGE_GRID_COLUMNS,
  STAGE_MIN_FRACTION,
  STUDIO_REGION_IDS,
  STUDIO_REGION_TEST_IDS,
  stageMeetsMinimumAt1280,
  stageWidthFractionAt,
} from "@/features/admin/svg-editor/contracts/stageLayoutContract";

describe("stageLayoutContract", () => {
  it("regions and test ids stay in lockstep", () => {
    expect([...STUDIO_REGION_IDS]).toEqual(["command", "stage", "layers", "properties"]);
    for (const id of STUDIO_REGION_IDS) {
      expect(STUDIO_REGION_TEST_IDS[id]).toBe(`admin-studio-region-${id}`);
    }
  });

  it("stage fraction at 1280 meets the minimum", () => {
    expect(STAGE_GRID_COLUMNS).toContain("minmax");
    expect(stageWidthFractionAt(AUTHORING_WIDTH_PX)).toBeGreaterThanOrEqual(STAGE_MIN_FRACTION);
    expect(stageMeetsMinimumAt1280()).toBe(true);
  });

  it("computes stage share from rail and gap", () => {
    const width = AUTHORING_WIDTH_PX;
    const gapPx = STAGE_GAP_REM * ROOT_FONT_PX;
    const preferredRail = RAIL_MAX_REM * ROOT_FONT_PX;
    const usedRail = Math.min(preferredRail, Math.max(0, width - gapPx - 1));
    const expected = (width - gapPx - usedRail) / width;
    expect(stageWidthFractionAt(width)).toBeCloseTo(expected, 10);
  });

  it("shrinks stage when content width is narrow", () => {
    const narrow = stageWidthFractionAt(400);
    const wide = stageWidthFractionAt(1600);
    expect(narrow).toBeLessThan(wide);
    expect(narrow).toBeGreaterThan(0);
    expect(narrow).toBeLessThan(1);
  });
});
