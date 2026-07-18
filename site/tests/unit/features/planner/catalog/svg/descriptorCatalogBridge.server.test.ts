import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/svg/descriptorCatalogBridge.server";

describe("catalog/svg/descriptorCatalogBridge.server.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = [
      "mapDescriptorToCatalogItem",
      "mapDescriptorsToCatalogItems",
      "inferCatalogTaxonomyFromSlug",
    ] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });

  it("maps publishedSvgRevisionId to immutable revision API paint URL", () => {
    const item = mod.mapDescriptorToCatalogItem({
      id: "desk-1",
      slug: "desk-linear-1200",
      geometry: { widthMm: 1200, depthMm: 600, heightMm: 750 },
      publishedSvgRevisionId: "desk-linear-1200-r-abcdef0123456789abcd",
    });
    expect(item.assets.previewImageUrl).toBe(
      "/api/planner/catalog/svg/desk-linear-1200-r-abcdef0123456789abcd",
    );
  });

  it("falls back to disk svg-catalog URL without revision pointer", () => {
    const item = mod.mapDescriptorToCatalogItem({
      id: "desk-1",
      slug: "desk-linear-1200",
      geometry: { widthMm: 1200, depthMm: 600, heightMm: 750 },
    });
    expect(item.assets.previewImageUrl).toBe("/svg-catalog/desk-linear-1200.svg");
    expect(item.category).toBe("Furniture");
    expect(item.subCategory).toMatch(/Desk/i);
    expect(item.symbolOnly).toBe(false);
  });

  it("maps oando brand slug + OANDO SKU to human series inventory name (B4)", () => {
    const item = mod.mapDescriptorToCatalogItem({
      id: "a81e3a1b-16f4-4000-8000-000000000002",
      slug: "oando-fluid-desk-1600",
      sku: "OANDO-FLUID-DSK-1600",
      geometry: { widthMm: 1600, depthMm: 800, heightMm: 750 },
    });
    expect(item.name).toBe("Fluid Desk 1600");
    expect(item.sku).toBe("OANDO-FLUID-DSK-1600");
    expect(item.shortName).toBe("Fluid Desk 1600");
    expect(item.description).toContain("Fluid Desk 1600");

    const fromSkuOnly = mod.mapDescriptorToCatalogItem({
      id: "sku-only",
      slug: "OANDO-OMNIA-DSK-1800",
      sku: "OANDO-OMNIA-DSK-1800",
      geometry: { widthMm: 1800, depthMm: 900, heightMm: 750 },
    });
    // Slug path still humanizes commercial SKU-shaped identifiers.
    expect(fromSkuOnly.name).toBe("Omnia Desk 1800");
  });

  it("infers seating and storage taxonomy from slug", () => {
    expect(mod.inferCatalogTaxonomyFromSlug("task-chair-650-001").subCategory).toMatch(
      /Chair/i,
    );
    expect(
      mod.inferCatalogTaxonomyFromSlug("low-cabinet-800-001").category,
    ).toBe("Storage & Organisation");
    expect(
      mod.inferCatalogTaxonomyFromSlug("meeting-table-2400-001").subCategory,
    ).toMatch(/Table/i);
  });
});
