import { describe, expect, it } from "vitest";
import { createPlannerPdf } from "@/features/planner/lib/vectorPdfExport";

describe("vectorPdfExport", () => {
  it("should have function createPlannerPdf defined", () => {
    expect(createPlannerPdf).toBeTypeOf("function");
  });
});