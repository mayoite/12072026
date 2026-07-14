import { describe, expect, it } from "vitest";
import {
  filterByCategory,
  normalizeCatalogItem,
  searchCatalog,
} from "@/features/planner/shared/catalog";

describe("shared/catalog index", () => {
  it("re-exports normalizeCatalogItem for partial product rows", () => {
    const item = normalizeCatalogItem({
      id: "d1",
      name: "Desk",
      category: "desks",
      dimensions: { widthMm: 1200, depthMm: 600, heightMm: 750 },
    } as never);
    expect(item).toBeDefined();
    if (item && typeof item === "object" && "name" in item) {
      expect((item as { name: string }).name).toBe("Desk");
    }
  });

  it("re-exports filter and search helpers as functions", () => {
    expect(filterByCategory).toBeTypeOf("function");
    expect(searchCatalog).toBeTypeOf("function");
  });
});
