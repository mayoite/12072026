import { describe, expect, it } from "vitest";
import { buildBoq, exportBoqToCsv } from "@/features/planner/shared";
import type { BoqSummary } from "@/features/planner/shared/boq/types";
import type { ExportLayout } from "@/features/planner/shared/export/types";

describe("shared index", () => {
  it("re-exports boq and export entry points", () => {
    const boq = buildBoq([], new Map());
    expect(boq.lineItems).toEqual([]);
    expect(boq.gstRate).toBe(0.18);

    const layout: ExportLayout = {
      projectName: "HQ",
      roomWidthMm: 1000,
      roomDepthMm: 1000,
      unitSystem: "metric",
      generatedAt: boq.generatedAt,
    };
    const summary: BoqSummary = boq;
    expect(exportBoqToCsv(summary, layout)).toContain("Project,HQ");
  });
});
