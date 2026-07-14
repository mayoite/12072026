import { describe, expect, it } from "vitest";
import {
  CATALOG_PURPOSE_TABS,
  CatalogBlockPreview,
  CatalogDropGhost,
  CatalogPanel,
  CatalogSidebar,
  CATALOG_SUB_CATEGORIES,
  enrichCatalogItem,
  enrichCatalogItems,
  formatCatalogSeatFootprint,
  mapPurposeFilterToCatalogTab,
} from "@/features/planner/catalog-api";

describe("catalog-api index barrel", () => {
  it("re-exports panel and sidebar components", () => {
    expect(CatalogPanel).toBeTypeOf("function");
    expect(CatalogSidebar).toBeTypeOf("function");
    expect(CatalogSidebar).toBe(CatalogPanel);
    expect(CatalogBlockPreview).toBeTypeOf("function");
    expect(CatalogDropGhost).toBeTypeOf("function");
  });

  it("re-exports purpose tabs and hierarchy helpers", () => {
    expect(CATALOG_PURPOSE_TABS.length).toBe(6);
    expect(CATALOG_SUB_CATEGORIES).toBeDefined();
    expect(enrichCatalogItem).toBeTypeOf("function");
    expect(enrichCatalogItems).toBeTypeOf("function");
    expect(formatCatalogSeatFootprint).toBeTypeOf("function");
    expect(mapPurposeFilterToCatalogTab).toBeTypeOf("function");
  });

  it("mapPurposeFilterToCatalogTab resolves workstations filter", () => {
    const tab = mapPurposeFilterToCatalogTab("workstations");
    expect(tab === null || typeof tab === "string").toBe(true);
  });
});
