import { describe, expect, it } from "vitest";
import {
  INVENTORY_CATEGORIES,
  INVENTORY_ROOM_GROUPS,
  inventoryCategoriesForProduct,
  inventoryRoomGroupsForProduct,
  INVENTORY_SORT_OPTIONS,
  INVENTORY_DENSITY_OPTIONS,
} from "@/features/planner/project/catalog/inventory/inventoryTaxonomy";
import type { PlannerCatalogItem } from "@/features/planner/project/catalog/catalogTypes";

describe("inventoryTaxonomy", () => {
  it("lists categories, sort, and density options", () => {
    expect(INVENTORY_CATEGORIES.length).toBeGreaterThan(0);
    expect(INVENTORY_ROOM_GROUPS.length).toBeGreaterThan(0);
    expect(INVENTORY_SORT_OPTIONS.length).toBeGreaterThan(0);
    expect(INVENTORY_DENSITY_OPTIONS.length).toBeGreaterThan(0);
  });

  it("maps product to category/room groups", () => {
    const product = {
      id: "p1",
      name: "Desk",
      category: "Furniture",
      roomTags: ["Office"],
    } as PlannerCatalogItem;
    const cats = inventoryCategoriesForProduct(product);
    expect(Array.isArray(cats)).toBe(true);
    const rooms = inventoryRoomGroupsForProduct(product);
    expect(Array.isArray(rooms)).toBe(true);
  });
});
