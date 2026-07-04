import { describe, it, expect, vi } from "vitest";
import {
  mapPurposeFilterToCatalogTab,
  deriveCatalogSku,
  deriveCatalogShortName,
  deriveCatalogMaterial,
  _deriveCatalogUrl,
  _formatCatalogSeatFootprint,
  _formatCatalogDimensionsLabel,
  resolveCatalogPurposeTab,
  resolveCatalogSubCategory,
  enrichCatalogItem,
  _enrichCatalogItems,
  itemMatchesCatalogSearch,
} from "@/features/planner/catalog/catalogHierarchy";

vi.mock("@/features/planner/catalog/catalogBlockBridge", () => ({
  resolveCatalogPlacementFootprintMm: vi.fn().mockReturnValue({ widthMm: 1200, depthMm: 600 }),
}));

describe("catalogHierarchy", () => {
  it("mapPurposeFilterToCatalogTab maps purposes correctly", () => {
    expect(mapPurposeFilterToCatalogTab("meeting-rooms")).toBe("meeting");
    expect(mapPurposeFilterToCatalogTab("executive-cabin")).toBe("cabins");
    expect(mapPurposeFilterToCatalogTab("mixed")).toBe("workstations");
    expect(mapPurposeFilterToCatalogTab(null)).toBe("workstations");
  });

  const getMockItem = (overrides = {}): any => ({
    id: "item-123",
    name: "particle board desk laminate — CRC Steel Frame Workstation (1200mm)",
    description: "particle board desk laminate",
    tags: ["desks", "2-seater"],
    category: "desks",
    widthMm: 120,
    heightMm: 60,
    shapeType: "linear",
    seatCount: 2,
    ...overrides,
  });

  it("derives catalog SKU", () => {
    const item = getMockItem();
    expect(deriveCatalogSku(item)).toBe("2-SEATER-120");
  });

  it("derives short name and material", () => {
    const item = getMockItem();
    expect(deriveCatalogShortName(item)).toBe("CRC Steel Frame Workstation");
    expect(deriveCatalogMaterial(item)).toBe("particle board desk laminate");
  });

  it("resolves purpose tab and subcategory", () => {
    const item = getMockItem();
    const tab = resolveCatalogPurposeTab(item);
    expect(tab).toBe("workstations");
    expect(resolveCatalogSubCategory(item, tab)).toBe("cluster");
  });

  it("enriches catalog item and runs search match", () => {
    const item = getMockItem();
    const enriched = enrichCatalogItem(item);
    expect(enriched.sku).toBe("2-SEATER-120");
    expect(enriched.purposeTab).toBe("workstations");
    expect(itemMatchesCatalogSearch(item, "CRC")).toBe(true);
    expect(itemMatchesCatalogSearch(item, "notfound")).toBe(false);
  });
});
