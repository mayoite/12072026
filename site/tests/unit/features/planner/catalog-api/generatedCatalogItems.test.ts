import { describe, expect, it } from "vitest";
import {
  GENERATED_CATALOG_COUNT,
  GENERATED_CATALOG_ITEMS,
} from "@/features/planner/catalog-api/generatedCatalogItems";
import { GENERATED_CATALOG_ITEMS_PART1 } from "@/features/planner/catalog-api/generatedCatalogItemsPart1";
import { GENERATED_CATALOG_ITEMS_PART2 } from "@/features/planner/catalog-api/generatedCatalogItemsPart2";

describe("generatedCatalogItems", () => {
  it("concatenates part1 and part2", () => {
    expect(GENERATED_CATALOG_ITEMS).toHaveLength(
      GENERATED_CATALOG_ITEMS_PART1.length + GENERATED_CATALOG_ITEMS_PART2.length,
    );
    expect(GENERATED_CATALOG_COUNT).toBe(GENERATED_CATALOG_ITEMS.length);
  });

  it("has unique ids across the full catalog", () => {
    const ids = GENERATED_CATALOG_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("items carry required placement fields", () => {
    expect(GENERATED_CATALOG_ITEMS.length).toBeGreaterThan(0);
    for (const item of GENERATED_CATALOG_ITEMS.slice(0, 20)) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.widthMm).toBeGreaterThan(0);
      expect(item.heightMm).toBeGreaterThan(0);
      expect(item.shapeType.length).toBeGreaterThan(0);
      expect(Array.isArray(item.tags)).toBe(true);
    }
  });
});
