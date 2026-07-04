import { describe, expect, it } from "vitest";
import { collectPlannerExportCss, createPlannerSvgColorResolver, getPlannerCanvasColorResolver, resetPlannerCanvasColorResolver, finalizePlannerExportSvg } from "@/features/planner/lib/plannerSvgExportColors";

describe("plannerSvgExportColors", () => {
  it("should have function collectPlannerExportCss defined", () => {
    expect(collectPlannerExportCss).toBeTypeOf("function");
  });
  it("should have function createPlannerSvgColorResolver defined", () => {
    expect(createPlannerSvgColorResolver).toBeTypeOf("function");
  });
  it("should have function getPlannerCanvasColorResolver defined", () => {
    expect(getPlannerCanvasColorResolver).toBeTypeOf("function");
  });
  it("should have function resetPlannerCanvasColorResolver defined", () => {
    expect(resetPlannerCanvasColorResolver).toBeTypeOf("function");
  });
  it("should have function finalizePlannerExportSvg defined", () => {
    expect(finalizePlannerExportSvg).toBeTypeOf("function");
  });
});