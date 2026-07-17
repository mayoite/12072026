import { beforeEach, describe, expect, it, vi } from "vitest";

const { jsPdfState, MockJsPDF } = vi.hoisted(() => {
  const jsPdfState = {
    save: vi.fn(),
    addImage: vi.fn(),
    addPage: vi.fn(),
    rect: vi.fn(),
    text: vi.fn(),
    setFillColor: vi.fn(),
    setFont: vi.fn(),
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
  };

  class MockJsPDF {
    internal = {
      pageSize: {
        getWidth: () => 297,
        getHeight: () => 210,
      },
    };

    save = jsPdfState.save;
    addImage = jsPdfState.addImage;
    addPage = jsPdfState.addPage;
    rect = jsPdfState.rect;
    text = jsPdfState.text;
    setFillColor = jsPdfState.setFillColor;
    setFont = jsPdfState.setFont;
    setFontSize = jsPdfState.setFontSize;
    setTextColor = jsPdfState.setTextColor;
  }

  return { jsPdfState, MockJsPDF };
});

vi.mock("jspdf", () => ({
  __esModule: true,
  jsPDF: MockJsPDF,
}));

import {
  exportBoqToPdf,
  PDF_DEMO_COMMERCIAL_DISCLAIMER,
} from "@/features/planner/shared/export/pdfExport";

describe("pdfExport", () => {
  beforeEach(() => {
    jsPdfState.save.mockClear();
    jsPdfState.text.mockClear();
    jsPdfState.addPage.mockClear();
  });

  it("should have function exportBoqToPdf defined", () => {
    expect(exportBoqToPdf).toBeTypeOf("function");
    expect(exportBoqToPdf.name.length).toBeGreaterThan(0);
  });

  it("writes demo commercial disclaimer and grand total when demoPricing is on", async () => {
    await exportBoqToPdf({
      layout: {
        projectName: "Demo Plan",
        roomWidthMm: 0,
        roomDepthMm: 0,
        unitSystem: "metric",
        generatedAt: "2026-07-18T00:00:00.000Z",
      },
      rows: [
        {
          name: "Desk",
          category: "desks",
          quantity: 2,
          widthCm: 140,
          depthCm: 70,
          heightCm: 75,
          unitPriceInr: 1000,
        },
      ],
      demoPricing: true,
      grandTotalInr: 2360,
      fileName: "demo.pdf",
    });

    expect(jsPdfState.text).toHaveBeenCalledWith(
      PDF_DEMO_COMMERCIAL_DISCLAIMER,
      expect.any(Number),
      expect.any(Number),
    );
    const texts = jsPdfState.text.mock.calls.map((c) => String(c[0]));
    expect(
      texts.some(
        (t) =>
          t.includes("Grand total (demo list)") &&
          t.replace(/,/g, "").includes("2360"),
      ),
    ).toBe(true);
    expect(jsPdfState.save).toHaveBeenCalledWith("demo.pdf");
  });

  it("omits demo disclaimer when demoPricing is off", async () => {
    await exportBoqToPdf({
      layout: {
        projectName: "Plain",
        roomWidthMm: 0,
        roomDepthMm: 0,
        unitSystem: "metric",
        generatedAt: "2026-07-18T00:00:00.000Z",
      },
      rows: [],
      demoPricing: false,
      fileName: "plain.pdf",
    });

    const texts = jsPdfState.text.mock.calls.map((c) => String(c[0]));
    expect(texts).not.toContain(PDF_DEMO_COMMERCIAL_DISCLAIMER);
  });
});
