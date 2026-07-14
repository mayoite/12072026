import { describe, expect, it } from "vitest";
import { GENERATED_CATALOG_ITEMS_PART1 } from "@/features/planner/catalog-api/generatedCatalogItemsPart1";

describe("generatedCatalogItemsPart1", () => {
  it("exports a non-empty catalog part", () => {
    expect(GENERATED_CATALOG_ITEMS_PART1.length).toBeGreaterThan(10);
  });

  it("has unique ids within the part", () => {
    const ids = GENERATED_CATALOG_ITEMS_PART1.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("starts with expected table-top workstation entry", () => {
    const first = GENERATED_CATALOG_ITEMS_PART1[0];
    expect(first).toBeDefined();
    expect(first?.id).toContain("table-top");
    expect(first?.category).toBe("desks");
    expect(first?.widthMm).toBeGreaterThan(0);
    expect(first?.seatCount).toBe(1);
  });

  it("only uses known catalog categories", () => {
    const allowed = new Set([
      "desks",
      "rooms",
      "equipment",
      "storage",
      "zones",
      "infrastructure",
    ]);
    for (const item of GENERATED_CATALOG_ITEMS_PART1) {
      expect(allowed.has(item.category)).toBe(true);
    }
  });
});
