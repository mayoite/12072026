import { describe, it, expect, vi } from "vitest";
import {
  buildPlanner3DSceneDocument,
  mmToWorld,
  formatMm,
  formatMeters,
  formatAreaSqm,
  summarizePlannerDocument,
} from "@/features/planner/3d/types";
import { normalizePlannerDocument, getPlannerSceneEnvelope } from "@/features/planner/model";

vi.mock("@/features/planner/model", () => ({
  normalizePlannerDocument: vi.fn(),
  getPlannerSceneEnvelope: vi.fn(),
}));

describe("Planner3D types and helper functions", () => {
  it("converts mm to world coordinates", () => {
    expect(mmToWorld(1000)).toBe(1.0);
    expect(mmToWorld(0)).toBe(0);
    expect(mmToWorld(-500)).toBe(-0.5);
  });

  it("formats mm to localized strings", () => {
    expect(formatMm(1500)).toBe("1,500 mm");
    expect(formatMm(2000.4)).toBe("2,000 mm");
  });

  it("formats meters from mm", () => {
    expect(formatMeters(15000)).toBe("15 m");
    expect(formatMeters(9500)).toBe("9.5 m");
  });

  it("formats area in sqm", () => {
    expect(formatAreaSqm(5000000)).toBe("5.0 m2");
  });

  describe("buildPlanner3DSceneDocument", () => {
    it("handles full and empty documents with fallbacks", () => {
      const mockNormalizedDoc = {
        id: "doc-123",
        name: "Test Doc",
        projectName: "Project A",
        clientName: "Client B",
        roomWidthMm: 5000,
        roomDepthMm: 4000,
        sceneJson: {
          room: {
            widthMm: 6000,
            depthMm: 5000,
            wallHeightMm: 2400,
            wallThicknessMm: 150,
            floorThicknessMm: 50,
          },
          items: [
            {
              id: "item-1",
              name: "Desk A",
              category: "Desks",
              centerMm: { xMm: 1000, yMm: 1200 },
              sizeMm: { widthMm: 1200, depthMm: 800, heightMm: 750 },
              rotationDeg: 90,
            },
            {
              id: "",
              name: "",
              category: "Storage Units",
              centerMm: null,
              sizeMm: null,
              rotationDeg: -45,
            },
            {
              category: "Seating",
            },
            null,
            "invalid-item",
          ],
        },
      };

      vi.mocked(normalizePlannerDocument).mockReturnValue(mockNormalizedDoc as any);
      vi.mocked(getPlannerSceneEnvelope).mockReturnValue(mockNormalizedDoc.sceneJson as any);

      const sceneDoc = buildPlanner3DSceneDocument(mockNormalizedDoc as any);

      expect(sceneDoc.id).toBe("doc-123");
      expect(sceneDoc.title).toBe("Test Doc");
      expect(sceneDoc.note).toBe("Project A");

      // Room fields
      expect(sceneDoc.room.widthMm).toBe(6000);
      expect(sceneDoc.room.depthMm).toBe(5000);
      expect(sceneDoc.room.wallHeightMm).toBe(2400);
      expect(sceneDoc.room.wallThicknessMm).toBe(150);
      expect(sceneDoc.room.floorThicknessMm).toBe(50);

      // Items length (should skip null/invalid-item)
      expect(sceneDoc.items).toHaveLength(3);

      // Verify item 1
      expect(sceneDoc.items[0]).toEqual({
        id: "item-1",
        name: "Desk A",
        category: "Desks",
        centerMm: { xMm: 1000, yMm: 1200 },
        sizeMm: { widthMm: 1200, depthMm: 800, heightMm: 750 },
        rotationDeg: 90,
        color: "var(--text-subtle)",
      });

      // Verify item 2 (checks fallback naming, sizing, default center, color resolving)
      expect(sceneDoc.items[1].id).toBe("planner-item-2");
      expect(sceneDoc.items[1].name).toBe("Planner item 2");
      expect(sceneDoc.items[1].category).toBe("Storage Units");
      expect(sceneDoc.items[1].centerMm).toEqual({ xMm: 3000, yMm: 2500 }); // room center
      expect(sceneDoc.items[1].sizeMm).toEqual({ widthMm: 1200, depthMm: 1200, heightMm: 900 });
      expect(sceneDoc.items[1].rotationDeg).toBe(315); // -45 % 360 = 315
      expect(sceneDoc.items[1].color).toBe("var(--text-muted)"); // storage fallback

      // Verify item 3 color fallback for seating
      expect(sceneDoc.items[2].color).toBe("var(--color-bronze-500)"); // seating fallback
    });

    it("uses document client/project name fallbacks", () => {
      const mockDoc = {
        id: null,
        name: "Doc Untitled",
        clientName: "Only Client",
        sceneJson: null,
      };

      vi.mocked(normalizePlannerDocument).mockReturnValue(mockDoc as any);
      vi.mocked(getPlannerSceneEnvelope).mockReturnValue(null as any);

      const sceneDoc = buildPlanner3DSceneDocument(mockDoc as any);
      expect(sceneDoc.id).toBe("planner-preview");
      expect(sceneDoc.note).toBe("Only Client");
    });
  });

  describe("summarizePlannerDocument", () => {
    it("calculates room area, footprint and largest item", () => {
      const mockNormalizedDoc = {
        id: "doc-1",
        name: "Test Doc",
        sceneJson: {
          room: {
            widthMm: 5000,
            depthMm: 4000,
          },
          items: [
            {
              id: "item-1",
              name: "Small Table",
              category: "Tables",
              sizeMm: { widthMm: 1000, depthMm: 1000, heightMm: 750 },
            },
            {
              id: "item-2",
              name: "Big Desk",
              category: "Desks",
              sizeMm: { widthMm: 2000, depthMm: 1500, heightMm: 750 },
            },
          ],
        },
      };

      vi.mocked(normalizePlannerDocument).mockReturnValue(mockNormalizedDoc as any);
      vi.mocked(getPlannerSceneEnvelope).mockReturnValue(mockNormalizedDoc.sceneJson as any);

      const summary = summarizePlannerDocument(mockNormalizedDoc as any);

      // Room Area: 5000 * 4000 = 20,000,000 mm2 = 20 sqm
      expect(summary.roomAreaSqm).toBe(20);
      // Footprint: (1000*1000) + (2000*1500) = 1,000,000 + 3,000,000 = 4,000,000 mm2 = 4 sqm
      expect(summary.totalFootprintSqm).toBe(4);
      expect(summary.itemCount).toBe(2);
      expect(summary.largestItemName).toBe("Big Desk");
    });

    it("handles empty items list", () => {
      const mockNormalizedDoc = {
        sceneJson: {
          room: { widthMm: 3000, depthMm: 3000 },
          items: [],
        },
      };

      vi.mocked(normalizePlannerDocument).mockReturnValue(mockNormalizedDoc as any);
      vi.mocked(getPlannerSceneEnvelope).mockReturnValue(mockNormalizedDoc.sceneJson as any);

      const summary = summarizePlannerDocument(mockNormalizedDoc as any);
      expect(summary.itemCount).toBe(0);
      expect(summary.largestItemName).toBeNull();
      expect(summary.totalFootprintSqm).toBe(0);
    });
  });
});
