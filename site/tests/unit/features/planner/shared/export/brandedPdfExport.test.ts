import { describe, expect, it } from "vitest";
import { exportBrandedPdf, exportBoqOnly } from "@/features/planner/shared/export/brandedPdfExport";

describe("brandedPdfExport", () => {
  it("should have function exportBrandedPdf defined", () => {
    expect(exportBrandedPdf).toBeTypeOf("function");
  });
  it("should have function exportBoqOnly defined", () => {
    expect(exportBoqOnly).toBeTypeOf("function");
  });
});