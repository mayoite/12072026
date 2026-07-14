import { describe, it, expect } from "vitest";
import {
  millimetersToCatalogCmFields,
  managedProductRowToCatalogItem,
  standardCatalogApiItemToCatalogItem,
} from "@/features/planner/catalog-api/managedProductCatalogBridge";

describe("managedProductCatalogBridge", () => {
  it("converts millimeters to catalog cm fields", () => {
    expect(millimetersToCatalogCmFields(1200, 600)).toEqual({
      widthMm: 120,
      heightMm: 60,
    });
  });

  describe("managedProductRowToCatalogItem", () => {
    it("returns null if row is inactive", () => {
      const row = { active: false } as any;
      expect(managedProductRowToCatalogItem(row)).toBeNull();
    });

    it("returns null if width or depth mm are missing", () => {
      const row = { active: true, specs: { widthMm: 0 } } as any;
      expect(managedProductRowToCatalogItem(row)).toBeNull();
    });

    it("converts a valid managed product row", () => {
      const row = {
        id: "prod-1",
        name: "Standard Executive Table",
        active: true,
        category: "desks",
        series_name: "Executive Series",
        category_name: "Desks",
        description: "Exec Desk",
        slug: "exec-desk",
        flagship_image: "image.png",
        images: [],
        specs: {
          widthMm: 1600,
          depthMm: 800,
          heightMm: 750,
        },
      } as any;

      const item = managedProductRowToCatalogItem(row);
      expect(item).not.toBeNull();
      expect(item?.id).toBe("prod-1");
      expect(item?.widthMm).toBe(160); // 1600 / 10
      expect(item?.category).toBe("desks");
    });
  });

  describe("standardCatalogApiItemToCatalogItem", () => {
    it("converts valid API item", () => {
      const apiItem = {
        id: "api-item-1",
        name: "Meeting Pod 4p",
        active: true,
        visible: true,
        category: "rooms",
        subcategory: "meeting-rooms",
        width_mm: 2400,
        depth_mm: 2000,
        height_mm: 2200,
        description: "Meeting pod",
        image_url: "pod.png",
      } as any;

      const item = standardCatalogApiItemToCatalogItem(apiItem);
      expect(item).not.toBeNull();
      expect(item?.id).toBe("api-item-1");
      expect(item?.widthMm).toBe(240);
      expect(item?.category).toBe("rooms");
    });
  });
});
