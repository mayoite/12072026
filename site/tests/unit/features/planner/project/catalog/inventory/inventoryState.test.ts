import { describe, expect, it } from "vitest";
import {
  defaultInventoryPanelState,
  reduceInventoryCommand,
  defaultCollectionsState,
  addInventoryRecent,
  addInventoryFavorite,
  removeInventoryFavorite,
  isInventoryFavorite,
  INVENTORY_PANEL_CONTRACT,
} from "@/features/planner/project/catalog/inventory/inventoryState";

describe("inventoryState", () => {
  it("defaults and reduces search query command", () => {
    const state = defaultInventoryPanelState();
    expect(state.searchQuery).toBe("");
    expect(state.mode).toBe("browse");
    expect(INVENTORY_PANEL_CONTRACT.panelId).toBe("inventory");
    expect(INVENTORY_PANEL_CONTRACT.minWidth).toBeGreaterThan(0);
    const next = reduceInventoryCommand(state, {
      type: "SET_SEARCH_QUERY",
      query: "desk",
    });
    expect(next.searchQuery).toBe("desk");
    expect(next.mode).toBe("search");
  });

  it("tracks favorites and recents immutably", () => {
    let collections = defaultCollectionsState();
    collections = addInventoryRecent(collections, "item-1", new Date().toISOString());
    collections = addInventoryFavorite(collections, "item-1");
    expect(isInventoryFavorite(collections, "item-1")).toBe(true);
    collections = removeInventoryFavorite(collections, "item-1");
    expect(isInventoryFavorite(collections, "item-1")).toBe(false);
  });
});
