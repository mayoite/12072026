import { describe, expect, it } from "vitest";
import { exportBoqToPdf } from "@/features/planner/shared/export/pdfExport";

describe("pdfExport", () => {
  it("should have function exportBoqToPdf defined", () => {
    expect(exportBoqToPdf).toBeTypeOf("function");
    expect(exportBoqToPdf.name.length).toBeGreaterThan(0);
  });
});