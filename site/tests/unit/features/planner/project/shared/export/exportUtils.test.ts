import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/shared/export/exportUtils";

describe("project/shared/export/exportUtils.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["DEFAULT_PDF_SETTINGS","formatMeasurement","getWallLengthMm","getFloorBounds","exportAsJSON","downloadJSON","downloadWorkstationBoqJSON","downloadFurnitureBoqJSON","downloadFurnitureBoqCSV","exportAsSVG","downloadSVG","exportAsPNG"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
