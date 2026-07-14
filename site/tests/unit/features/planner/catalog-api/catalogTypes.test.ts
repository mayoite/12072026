import { describe, expect, it } from "vitest";
import {
  CATALOG_CATEGORIES,
  CATALOG_PURPOSE_TABS,
  type CatalogItem,
  type CatalogPurposeTab,
} from "@/features/planner/catalog-api/catalogTypes";

describe("catalogTypes", () => {
  it("defines six purpose tabs with unique ids and labels", () => {
    expect(CATALOG_PURPOSE_TABS).toHaveLength(6);
    const ids = CATALOG_PURPOSE_TABS.map((t) => t.id);
    expect(new Set(ids).size).toBe(6);
    expect(ids).toEqual([
      "workstations",
      "seating",
      "meeting",
      "storage",
      "cabins",
      "accessories",
    ]);
    for (const tab of CATALOG_PURPOSE_TABS) {
      expect(tab.label.length).toBeGreaterThan(0);
    }
  });

  it("defines legacy categories with unique ids", () => {
    expect(CATALOG_CATEGORIES.length).toBeGreaterThanOrEqual(4);
    const ids = CATALOG_CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("desks");
    expect(ids).toContain("storage");
  });

  it("accepts a well-formed CatalogItem value", () => {
    const purpose: CatalogPurposeTab = "workstations";
    const item: CatalogItem = {
      id: "desk-1",
      name: "Task Desk",
      category: "desks",
      shapeType: "planner-desk",
      widthMm: 120,
      heightMm: 60,
      depthMm: 60,
      description: "desk",
      tags: ["desk"],
      purposeTab: purpose,
      availability: "in-stock",
    };
    expect(item.widthMm).toBe(120);
    expect(item.purposeTab).toBe("workstations");
    expect(item.availability).toBe("in-stock");
  });
});
