import { describe, expect, it } from "vitest";
import { GENERATED_CATALOG_ITEMS_PART2 } from "@/features/planner/catalog-api/generatedCatalogItemsPart2";

describe("generatedCatalogItemsPart2", () => {
  it("exports a non-empty catalog part", () => {
    expect(GENERATED_CATALOG_ITEMS_PART2.length).toBeGreaterThan(10);
  });

  it("has unique ids within the part", () => {
    const ids = GENERATED_CATALOG_ITEMS_PART2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("items include name, shapeType, and plan footprint", () => {
    for (const item of GENERATED_CATALOG_ITEMS_PART2.slice(0, 15)) {
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.shapeType.length).toBeGreaterThan(0);
      expect(item.widthMm).toBeGreaterThan(0);
      expect(item.heightMm).toBeGreaterThan(0);
      expect(typeof item.depthMm).toBe("number");
      expect(item.depthMm).toBeGreaterThanOrEqual(0);
    }
  });

  it("does not overlap part1 id prefix sample", () => {
    const sample = GENERATED_CATALOG_ITEMS_PART2[0];
    expect(sample?.id).toBeDefined();
    expect(sample?.id).not.toMatch(/^table-top-25mm-thick-pre-laminate-particle-board-1-seater/);
  });
});
