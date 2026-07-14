import { describe, expect, it } from "vitest";
import {
  exportBoqToCsv,
  exportBoqToJson,
  downloadCsv,
  downloadJson,
} from "@/features/planner/shared/export";
import type { BoqSummary } from "@/features/planner/shared/boq/types";
import type { ExportLayout } from "@/features/planner/shared/export/types";

const layout: ExportLayout = {
  projectName: "HQ",
  roomWidthMm: 1000,
  roomDepthMm: 1000,
  unitSystem: "metric",
  generatedAt: "2026-07-13T12:00:00.000Z",
};

const boq: BoqSummary = {
  lineItems: [],
  totalItems: 0,
  totalPriceInr: 0,
  generatedAt: layout.generatedAt,
  subtotalInr: 0,
  gstRate: 0.18,
  gstAmountInr: 0,
  grandTotalInr: 0,
};

describe("shared/export index", () => {
  it("re-exports csv and json exporters", () => {
    expect(exportBoqToCsv(boq, layout)).toContain("Project,HQ");
    expect(exportBoqToJson(boq, layout).type).toBe("oando-boq-export");
    expect(downloadCsv).toBeTypeOf("function");
    expect(downloadJson).toBeTypeOf("function");
  });
});
