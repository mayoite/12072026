import { describe, expect, it } from "vitest";
import {
  AUTHORING_WIDTH_PX,
  STAGE_MIN_FRACTION,
  STUDIO_REGION_IDS,
  STUDIO_REGION_TEST_IDS,
  stageMeetsMinimumAt1280,
  stageWidthFractionAt,
} from "@/features/admin/svg-editor/stageLayoutContract";

describe("stageLayoutContract", () => {
  it("regions and stage fraction at 1280", () => {
    expect([...STUDIO_REGION_IDS]).toEqual(["command", "stage", "layers", "properties"]);
    for (const id of STUDIO_REGION_IDS) {
      expect(STUDIO_REGION_TEST_IDS[id]).toContain(id);
    }
    expect(stageWidthFractionAt(AUTHORING_WIDTH_PX)).toBeGreaterThanOrEqual(STAGE_MIN_FRACTION);
    expect(stageMeetsMinimumAt1280()).toBe(true);
  });
});
