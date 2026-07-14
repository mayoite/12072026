import { describe, expect, it, vi } from "vitest";
import { downloadCsv, exportBoqToCsv } from "@/features/planner/shared/export/exportBoqCsv";
import type { BoqSummary } from "@/features/planner/shared/boq/types";
import type { ExportLayout } from "@/features/planner/shared/export/types";

const layout: ExportLayout = {
  projectName: 'HQ, "Main"',
  clientName: "Acme",
  preparedBy: "Planner",
  roomWidthMm: 6000,
  roomDepthMm: 4000,
  unitSystem: "metric",
  generatedAt: "2026-07-13T12:00:00.000Z",
};

const boq: BoqSummary = {
  lineItems: [
    {
      catalogId: "d1",
      name: 'Desk, "Pro"',
      sku: "S1",
      category: "desks",
      quantity: 2,
      unitPriceInr: 1000,
      dimensions: { widthMm: 1200, depthMm: 600, heightMm: 750 },
    },
  ],
  totalItems: 2,
  totalPriceInr: 2000,
  generatedAt: layout.generatedAt,
  subtotalInr: 2000,
  gstRate: 0.18,
  gstAmountInr: 360,
  grandTotalInr: 2360,
};

describe("exportBoqCsv", () => {
  it("includes project metadata and line items", () => {
    const csv = exportBoqToCsv(boq, layout);
    expect(csv).toContain("Project,");
    expect(csv).toContain("Client,Acme");
    expect(csv).toContain("Prepared By,Planner");
    expect(csv).toContain("6000mm x 4000mm");
    expect(csv).toContain("Category,Item,Qty");
    expect(csv).toContain("desks");
    expect(csv).toContain("Total Items,2");
  });

  it("escapes commas and quotes in fields", () => {
    const csv = exportBoqToCsv(boq, layout);
    expect(csv).toContain('"HQ, ""Main"""');
    expect(csv).toContain('"Desk, ""Pro"""');
  });

  it("downloadCsv creates object URL and clicks anchor", () => {
    const click = vi.fn();
    const revoke = vi.fn();
    const create = vi.fn(() => "blob:test");
    vi.stubGlobal("URL", {
      createObjectURL: create,
      revokeObjectURL: revoke,
    });
    const originalCreate = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") {
        return { href: "", download: "", click } as unknown as HTMLAnchorElement;
      }
      return originalCreate(tag);
    });

    downloadCsv("a,b\n", "boq.csv");
    expect(create).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(revoke).toHaveBeenCalledWith("blob:test");
    vi.restoreAllMocks();
  });
});
