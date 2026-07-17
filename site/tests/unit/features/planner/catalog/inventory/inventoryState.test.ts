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
} from "@/features/planner/catalog/inventory/inventoryState";

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

  it("reduces family and facet filter commands and resets them", () => {
    let state = defaultInventoryPanelState();
    state = reduceInventoryCommand(state, {
      type: "SELECT_FAMILY",
      familyKey: "desks",
    });
    state = reduceInventoryCommand(state, {
      type: "SELECT_MATERIAL",
      material: "oak",
    });
    state = reduceInventoryCommand(state, {
      type: "SELECT_AVAILABILITY",
      availability: "backorder",
    });
    state = reduceInventoryCommand(state, {
      type: "SELECT_SEAT_COUNT",
      seatCount: 2,
    });
    state = reduceInventoryCommand(state, {
      type: "SET_WIDTH_RANGE",
      minWidthMm: 1000,
      maxWidthMm: 1600,
    });
    expect(state.selectedFamilyKey).toBe("desks");
    expect(state.selectedMaterial).toBe("oak");
    expect(state.selectedAvailability).toBe("backorder");
    expect(state.selectedSeatCount).toBe(2);
    expect(state.minWidthMm).toBe(1000);
    expect(state.maxWidthMm).toBe(1600);

    state = reduceInventoryCommand(state, { type: "RESET_FILTERS" });
    expect(state.selectedFamilyKey).toBeNull();
    expect(state.selectedMaterial).toBeNull();
    expect(state.selectedAvailability).toBeNull();
    expect(state.selectedSeatCount).toBeNull();
    expect(state.minWidthMm).toBeNull();
    expect(state.maxWidthMm).toBeNull();
  });
});
