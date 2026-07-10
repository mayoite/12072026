import { describe, expect, it } from "vitest";

import type { Open3dCatalogItem } from "@/features/planner/open3d/catalog/catalogTypes";
import { inventoryCategoriesForProduct } from "@/features/planner/open3d/catalog/inventory/inventoryTaxonomy";
import { mapDescriptorToCatalogItem } from "@/features/planner/open3d/catalog/svg/descriptorCatalogBridge.server";
import type { BlockDescriptor } from "@/features/planner/open3d/catalog/svg/svgTypes";

function symbolItem(slug: string): Open3dCatalogItem {
  const descriptor = {
    schemaVersion: "2026-07-04.v2",
    id: "f81e3a1b-16f4-4000-8000-000000000099",
    slug,
    sku: "OFL-TEST",
    sourceProvenance: "native",
    geometry: { widthMm: 800, depthMm: 600, heightMm: 750 },
    viewBox: { x: 0, y: 0, width: 800, height: 600 },
    mounting: ["floor"],
    themeTokens: { currentColor: "currentColor" },
    rovingFocus: [],
    liveAnnouncementCategories: ["status"],
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    checksum: "0".repeat(64),
    generatedAt: 1,
  } as BlockDescriptor;
  return mapDescriptorToCatalogItem(descriptor);
}

describe("Symbols inventory slice", () => {
  it("maps descriptor-loader items to Symbols category", () => {
    const item = symbolItem("desk-linear-1200-001");
    expect(item.category).toBe("Symbols");
    expect(item.tags).toContain("symbol");
  });

  it("svg-catalog subcategory filter matches descriptor symbols", () => {
    const symbols = inventoryCategoriesForProduct("office-systems").find(
      (c) => c.id === "symbols",
    );
    const svgCatalog = symbols?.subCategories.find((s) => s.id === "svg-catalog");
    expect(svgCatalog).toBeDefined();

    const item = symbolItem("chaise-lounge-001");
    const matches = svgCatalog!.filterTags.some((tag) =>
      item.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
    );
    expect(matches).toBe(true);
  });
});
