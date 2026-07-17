import { beforeEach, describe, expect, it } from "vitest";
import {
  addRecentItem,
  getRecentItems,
  addFavoriteItem,
  isFavorite,
  removeFavoriteItem,
} from "@/features/planner/catalog/recentFavorites";

describe("recentFavorites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds recent items and favorites by catalog id", () => {
    addRecentItem({ sku: "DESK-1", id: "desk-1", name: "Desk" });
    addRecentItem({ sku: "DESK-1", id: "desk-1", name: "Desk" });
    const recent = getRecentItems();
    expect(recent.filter((i) => i.catalogId === "desk-1" || i.sku === "DESK-1").length).toBe(1);

    addFavoriteItem({ sku: "DESK-1", id: "desk-1", name: "Desk", category: "Furniture" });
    expect(isFavorite("desk-1")).toBe(true);
    removeFavoriteItem("desk-1");
    expect(isFavorite("desk-1")).toBe(false);
  });
});
