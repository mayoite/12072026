import { describe, expect, it, vi } from "vitest";
import {
  downloadJson,
  exportBoqToJson,
} from "@/features/planner/shared/export/exportBoqJson";
import type { BoqSummary } from "@/features/planner/shared/boq/types";
import type { ExportLayout } from "@/features/planner/shared/export/types";

const layout: ExportLayout = {
  projectName: "HQ",
  roomWidthMm: 6000,
  roomDepthMm: 4000,
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

describe("exportBoqJson", () => {
  it("wraps boq in versioned export envelope", () => {
    const data = exportBoqToJson(boq, layout);
    expect(data.type).toBe("oando-boq-export");
    expect(data.version).toBe(1);
    expect(data.layout.projectName).toBe("HQ");
    expect(data.boq.gstRate).toBe(0.18);
  });

  it("downloadJson creates object URL and clicks anchor", () => {
    const click = vi.fn();
    const revoke = vi.fn();
    const create = vi.fn(() => "blob:json");
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

    downloadJson(exportBoqToJson(boq, layout), "boq.json");
    expect(create).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(revoke).toHaveBeenCalledWith("blob:json");
    vi.restoreAllMocks();
  });
});
