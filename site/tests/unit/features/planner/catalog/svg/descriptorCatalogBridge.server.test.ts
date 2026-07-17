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
