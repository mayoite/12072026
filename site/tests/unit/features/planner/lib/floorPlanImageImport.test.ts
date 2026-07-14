import { describe, expect, it } from "vitest";
import { readFloorPlanImageFile } from "@/features/planner/lib/floorPlanImageImport";

describe("floorPlanImageImport", () => {
  it("should have function readFloorPlanImageFile defined", () => {
    expect(readFloorPlanImageFile).toBeTypeOf("function");
    expect(readFloorPlanImageFile.name.length).toBeGreaterThan(0);
  });
});