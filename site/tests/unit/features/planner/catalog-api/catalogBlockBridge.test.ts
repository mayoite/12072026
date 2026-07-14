import { describe, it, expect, vi } from "vitest";
import {
  plannerCanvasUnits,
  shapePropsToCanvasCm,
  normalizeCatalogMm,
  _catalogMmToCanvasCm,
  _moduleLengthMmFromItem,
  _straightWorkstationFootprintMm,
  resolveCatalogPlacementFootprintMm,
  _catalogFootprintToCanvasUnits,
  resolveBuddyBlock2D,
  _resolveCatalogItemBlock2D,
} from "@/features/planner/catalog-api/catalogBlockBridge";

vi.mock("@/lib/catalog/blocks2d", () => ({
  BLOCK_STYLE: {
    panel: "var(--color-bronze-200)",
    surfaceStroke: "var(--color-black)",
    surface: "var(--color-white-50)",
    glyph: "var(--color-bronze-900)",
    glyphDark: "var(--color-dark-midnight-blue-850)",
  },
  buildBlock2D: vi.fn().mockImplementation((prod) => ({ id: prod.id, built: true })),
  buildGenericBlock2D: vi.fn().mockImplementation((kind, l, d) => ({ kind, l, d })),
  buildMeetingRoomBlock: vi.fn().mockImplementation((foot, pax, label) => ({ foot, pax, label })),
}));

vi.mock("@/features/planner/catalog-api/workspaceCatalog", () => ({
  PLANNER_CATALOG_ITEMS: [
    { id: "buddy-desk-1", name: "Buddy Single Desk (1200mm)", tags: [], seatCount: 1, widthMm: 120, heightMm: 60, category: "desks" },
    { id: "buddy-desk-sharing", name: "Sharing Desk", tags: ["sharing"], seatCount: 2, widthMm: 240, heightMm: 120, category: "desks" },
  ],
}));

vi.mock("@/features/planner/catalog-api/shapeTypeRegistry", () => ({
  isCatalogShapeType: vi.fn().mockReturnValue(false),
  isRoomCatalogShapeType: vi.fn().mockReturnValue(false),
  PlannerCatalogShapeType: { desk: "desk", zone: "zone" },
  catalogShapeTypeToFurnitureType: vi.fn().mockReturnValue("desk"),
}));

vi.mock("@/features/planner/lib/canvasBounds", () => ({
  millimetersToCanvasUnits: vi.fn().mockImplementation((mm) => mm / 10),
  PLANNER_MIN_CANVAS_UNIT: 1,
}));

vi.mock("./furnitureBlocks2d", () => ({
  isLShapedDesk: vi.fn().mockReturnValue(false),
  resolveFurnitureBlockKind: vi.fn().mockReturnValue("desk-workstation"),
}));

describe("catalogBlockBridge", () => {
  it("computes plannerCanvasUnits correctly", () => {
    expect(plannerCanvasUnits(500)).toBe(500);
    expect(plannerCanvasUnits(1200)).toBe(120);
    expect(plannerCanvasUnits(0)).toBe(1);
  });

  it("converts shapePropsToCanvasCm correctly", () => {
    expect(shapePropsToCanvasCm(1200, 600)).toEqual({
      widthCm: 120,
      depthCm: 60,
    });
  });

  it("normalizes catalog mm", () => {
    expect(normalizeCatalogMm(1200)).toBe(1200);
  });

  it("resolves catalog placement footprint", () => {
    const item = {
      id: "buddy-desk-1",
      name: "Buddy Single Desk (1200mm)",
      tags: [],
      seatCount: 1,
      widthMm: 1200,
      heightMm: 600,
      category: "desks",
    };
    const footprint = resolveCatalogPlacementFootprintMm(item as any);
    expect(footprint).toEqual({ widthMm: 1200, depthMm: 600 });
  });

  it("resolves buddy block 2d", () => {
    const shape = {
      props: {
        widthMm: 120,
        heightMm: 60,
        catalogId: "buddy-desk-1",
        furnitureType: "desk",
      },
    };
    const block = resolveBuddyBlock2D(shape as any);
    expect(block).toEqual({ id: "buddy-catalog-synthetic", built: true });
  });
});
