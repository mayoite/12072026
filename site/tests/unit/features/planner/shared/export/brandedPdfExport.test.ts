import { beforeEach, describe, expect, it, vi } from "vitest";

const exportBoqToPdf = vi.fn(async () => undefined);

vi.mock("@/features/planner/shared/export/pdfExport", () => ({
  exportBoqToPdf: (...args: unknown[]) => exportBoqToPdf(...args),
}));

import {
  exportBrandedPdf,
  exportBoqOnly,
} from "@/features/planner/shared/export/brandedPdfExport";

describe("brandedPdfExport", () => {
  beforeEach(() => {
    exportBoqToPdf.mockClear();
  });

  it("exportBoqOnly delegates to branded BOQ PDF with project name and rows", async () => {
    const rows = [
      {
        sku: "CH-1",
        name: "Task Chair",
        category: "furniture",
        quantity: 2,
        widthCm: 60,
        depthCm: 60,
        heightCm: 90,
        unitPriceInr: 0,
        spec: "unpriced · box",
      },
    ];

    await exportBoqOnly("Demo Plan", rows, { brandName: "One&Only" });

    expect(exportBoqToPdf).toHaveBeenCalledTimes(1);
    const arg = exportBoqToPdf.mock.calls[0]?.[0] as {
      layout: { projectName: string; preparedBy?: string };
      rows: typeof rows;
      fileName: string;
    };
    expect(arg.layout.projectName).toBe("Demo Plan");
    expect(arg.layout.preparedBy).toMatch(/One&Only/i);
    expect(arg.rows).toEqual(rows);
    expect(arg.fileName).toMatch(/demo-plan/i);
    expect(arg.fileName).toMatch(/\.pdf$/i);
  });

  it("exportBrandedPdf enriches preparedBy and filename", async () => {
    await exportBrandedPdf({
      layout: {
        projectName: "HQ Floor",
        roomWidthMm: 10000,
        roomDepthMm: 8000,
        unitSystem: "metric",
        generatedAt: "2026-07-17T00:00:00.000Z",
      },
      rows: [],
      brandName: "One&Only",
    });

    expect(exportBoqToPdf).toHaveBeenCalledTimes(1);
    const arg = exportBoqToPdf.mock.calls[0]?.[0] as {
      layout: { preparedBy?: string };
      fileName: string;
    };
    expect(arg.layout.preparedBy).toBe("One&Only Space Planner");
    expect(arg.fileName).toMatch(/hq-floor/i);
  });
});
