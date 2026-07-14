import { describe, expect, it } from "vitest";
import { collectPlannerExportCss, createPlannerSvgColorResolver, getPlannerCanvasColorResolver, resetPlannerCanvasColorResolver, finalizePlannerExportSvg } from "@/features/planner/lib/plannerSvgExportColors";

describe("plannerSvgExportColors", () => {
  it("should have function collectPlannerExportCss defined", () => {
    expect(collectPlannerExportCss).toBeTypeOf("function"); expect(String(collectPlannerExportCss)).toContain('function');
  });
  it("should have function createPlannerSvgColorResolver defined", () => {
    expect(createPlannerSvgColorResolver).toBeTypeOf("function"); expect(String(createPlannerSvgColorResolver)).toContain('function');
  });
  it("should have function getPlannerCanvasColorResolver defined", () => {
    expect(getPlannerCanvasColorResolver).toBeTypeOf("function"); expect(String(getPlannerCanvasColorResolver)).toContain('function');
  });
  it("should have function resetPlannerCanvasColorResolver defined", () => {
    expect(resetPlannerCanvasColorResolver).toBeTypeOf("function"); expect(String(resetPlannerCanvasColorResolver)).toContain('function');
  });
  it("should have function finalizePlannerExportSvg defined", () => {
    expect(finalizePlannerExportSvg).toBeTypeOf("function"); expect(String(finalizePlannerExportSvg)).toContain('function');
  });
});