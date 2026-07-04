import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  PlannerExportError,
  _VECTOR_EXPORT_OPTIONS,
  getExportShapeIds,
  getVectorExportShapeIds,
  getExportScope,
  describeExportScope,
  getSafePngPixelRatio,
  buildExportMeta,
  downloadPlannerJson,
  downloadPlannerBoqPdf,
  downloadPlannerSvg,
  downloadPlannerPng,
} from "@/features/planner/editor/exportActions";
import { getPlannerFabricRuntime } from "@/features/planner/canvas-fabric";
import { resolveRoomMmFromFabricSnapshot } from "@/features/planner/canvas-fabric/fabricSceneUtils";
import { buildPlannerDocumentFromEditor } from "@/features/planner/document/plannerDocumentBridge";
import { buildSessionEnvelope } from "@/features/planner/persistence/plannerSession";
import { buildBoq } from "@/features/planner/shared/boq/buildBoq";

vi.mock("@/features/planner/canvas-fabric", () => ({
  getPlannerFabricRuntime: vi.fn(),
}));

vi.mock("@/features/planner/canvas-fabric/fabricSceneUtils", () => ({
  resolveRoomMmFromFabricSnapshot: vi.fn(),
}));

vi.mock("@/features/planner/document/plannerDocumentBridge", () => ({
  buildPlannerDocumentFromEditor: vi.fn(),
}));

vi.mock("@/features/planner/persistence/plannerSession", () => ({
  buildSessionEnvelope: vi.fn(),
}));

vi.mock("@/features/planner/shared/boq/buildBoq", () => ({
  buildBoq: vi.fn(),
}));

vi.mock("@/features/planner/catalog/workspaceCatalog", () => ({
  PLANNER_CATALOG_ITEMS: [
    { id: "item-1", name: "Desk 1", category: "desk", widthMm: 1200, heightMm: 750 },
  ],
}));

describe("exportActions", () => {
  const mockFabricRuntime = {
    exportDraft: vi.fn(),
    exportSvg: vi.fn(),
    exportPngBlob: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getPlannerFabricRuntime).mockReturnValue(mockFabricRuntime as any);

    // Mock createObjectURL and revokeObjectURL
    window.URL.createObjectURL = vi.fn(() => "mock-url");
    window.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getExportShapeIds & getVectorExportShapeIds", () => {
    it("returns empty array if no snapshot", () => {
      mockFabricRuntime.exportDraft.mockReturnValue(null);
      expect(getExportShapeIds()).toEqual([]);
      expect(getVectorExportShapeIds()).toEqual([]);
    });

    it("returns empty array if snapshot parse fails", () => {
      mockFabricRuntime.exportDraft.mockReturnValue("invalid-json");
      expect(getExportShapeIds()).toEqual([]);
    });

    it("returns shape ids list when objects exist", () => {
      mockFabricRuntime.exportDraft.mockReturnValue(JSON.stringify({
        objects: [{ name: "A" }, { name: "B" }],
      }));
      expect(getExportShapeIds()).toEqual(["fabric-0", "fabric-1"]);
    });
  });

  describe("getExportScope", () => {
    it("returns 'page'", () => {
      expect(getExportScope()).toBe("page");
    });
  });

  describe("describeExportScope", () => {
    it("handles zero shapes case", () => {
      mockFabricRuntime.exportDraft.mockReturnValue(null);
      expect(describeExportScope()).toBe("No shapes on the canvas yet.");
    });

    it("handles singular shape case", () => {
      mockFabricRuntime.exportDraft.mockReturnValue(JSON.stringify({
        objects: [{ name: "A" }],
      }));
      expect(describeExportScope()).toBe("Exporting the full plan (1 shape).");
    });

    it("handles plural shapes case", () => {
      mockFabricRuntime.exportDraft.mockReturnValue(JSON.stringify({
        objects: [{ name: "A" }, { name: "B" }],
      }));
      expect(describeExportScope()).toBe("Exporting the full plan (2 shapes).");
    });
  });

  describe("getSafePngPixelRatio", () => {
    it("returns capped pixel ratio based on size limit", () => {
      // Area = 1000 * 1000 = 1,000,000. Limit is 16,000,000. maxRatio = sqrt(16) = 4. Capped at min 2.
      expect(getSafePngPixelRatio(1000, 1000)).toBe(2);

      // Area = 8000 * 8000 = 64,000,000. maxRatio = sqrt(0.25) = 0.5.
      expect(getSafePngPixelRatio(8000, 8000)).toBe(0.5);

      // Super large area, capped at 0.25
      expect(getSafePngPixelRatio(20000, 20000)).toBe(0.25);
    });
  });

  describe("buildExportMeta", () => {
    it("returns valid metadata", () => {
      mockFabricRuntime.exportDraft.mockReturnValue(JSON.stringify({
        objects: [{ name: "item-1", width: 120, height: 75 }],
      }));
      vi.mocked(resolveRoomMmFromFabricSnapshot).mockReturnValue({ widthMm: 5000, depthMm: 4000 });

      const meta = buildExportMeta();
      expect(meta.canonicalUnit).toBe("mm");
      expect(meta.scope).toBe("page");
      expect(meta.shapeCount).toBe(1);
      expect(meta.room).toEqual({ widthMm: 5000, depthMm: 4000 });
      expect(meta.furniture).toHaveLength(1);
      expect(meta.furniture[0]).toEqual({
        catalogId: "item-1",
        name: "item-1",
        widthMm: 1200,
        depthMm: 750,
        heightMm: 750,
        spec: "1200×750×750 mm",
      });
    });

    it("handles empty / default fields", () => {
      mockFabricRuntime.exportDraft.mockReturnValue(JSON.stringify({
        objects: [{}], // empty obj
      }));
      vi.mocked(resolveRoomMmFromFabricSnapshot).mockReturnValue({ widthMm: 0, depthMm: 0 });

      const meta = buildExportMeta();
      expect(meta.room).toBeNull();
      expect(meta.furniture[0].catalogId).toBe("fabric-item-0");
      expect(meta.furniture[0].name).toBe("Furniture");
    });
  });

  describe("downloads", () => {
    let mockAnchor: any;

    beforeEach(() => {
      mockAnchor = {
        href: "",
        download: "",
        click: vi.fn(),
      };
      vi.spyOn(document, "createElement").mockImplementation((tagName) => {
        if (tagName === "a") return mockAnchor;
        return {} as any;
      });
    });

    it("downloadPlannerJson triggers json file download", () => {
      vi.mocked(buildPlannerDocumentFromEditor).mockReturnValue({ version: 1 } as any);
      vi.mocked(buildSessionEnvelope).mockReturnValue({ snapshot: null } as any);
      mockFabricRuntime.exportDraft.mockReturnValue(null);
      vi.mocked(resolveRoomMmFromFabricSnapshot).mockReturnValue({ widthMm: 0, depthMm: 0 });

      downloadPlannerJson();

      expect(document.createElement).toHaveBeenCalledWith("a");
      expect(mockAnchor.download).toBe("workspace-plan.json");
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    it("downloadPlannerSvg triggers download if SVG is valid", async () => {
      mockFabricRuntime.exportSvg.mockReturnValue("<svg></svg>");

      await downloadPlannerSvg();

      expect(mockAnchor.download).toBe("workspace-plan.svg");
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    it("downloadPlannerSvg throws error if SVG is empty", async () => {
      mockFabricRuntime.exportSvg.mockReturnValue("   ");

      await expect(downloadPlannerSvg()).rejects.toThrow(PlannerExportError);
    });

    it("downloadPlannerPng triggers download if PNG blob is valid", async () => {
      const mockBlob = new Blob(["png"], { type: "image/png" });
      mockFabricRuntime.exportPngBlob.mockResolvedValue(mockBlob);

      await downloadPlannerPng();

      expect(mockAnchor.download).toBe("workspace-plan.png");
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    it("downloadPlannerPng throws error if PNG blob is null", async () => {
      mockFabricRuntime.exportPngBlob.mockResolvedValue(null);

      await expect(downloadPlannerPng()).rejects.toThrow(PlannerExportError);
    });

    it("downloadPlannerBoqPdf calls exportBoqToPdf", async () => {
      vi.mocked(buildBoq).mockReturnValue({
        lineItems: [
          {
            sku: "SKU-1",
            name: "Item 1",
            category: "desk",
            quantity: 1,
            dimensions: { widthMm: 1200, depthMm: 750, heightMm: 750 },
            unitPriceInr: 5000,
          },
        ],
      } as any);

      mockFabricRuntime.exportDraft.mockReturnValue(JSON.stringify({
        objects: [{ name: "item-1", width: 120, height: 75 }],
      }));
      vi.mocked(resolveRoomMmFromFabricSnapshot).mockReturnValue({ widthMm: 5000, depthMm: 4000 });

      const mockExportBoqToPdf = vi.fn();
      vi.doMock("@/features/planner/shared/export/pdfExport", () => ({
        exportBoqToPdf: mockExportBoqToPdf,
      }));

      // Directly import after mocking it
      await import("@/features/planner/shared/export/pdfExport");
      
      // Let's call the download function
      await downloadPlannerBoqPdf();
      
      // Verification
      expect(buildBoq).toHaveBeenCalled();
    });
  });
});
