import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  normalizeLayerManagerUiState,
  loadLayerManagerUiStateFromStorage,
  DEFAULT_LAYER_MANAGER_UI_STATE,
  LAYER_MANAGER_UI_STATE_KEY,
} from "@/features/planner/editor/layerManagerUiState";

describe("layerManagerUiState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("normalizeLayerManagerUiState", () => {
    it("returns default state when input is null, undefined, or not an object", () => {
      expect(normalizeLayerManagerUiState(null)).toEqual(DEFAULT_LAYER_MANAGER_UI_STATE);
      expect(normalizeLayerManagerUiState(undefined)).toEqual(DEFAULT_LAYER_MANAGER_UI_STATE);
      expect(normalizeLayerManagerUiState("not-an-object")).toEqual(DEFAULT_LAYER_MANAGER_UI_STATE);
    });

    it("keeps valid properties and falls back on invalid ones", () => {
      const input = {
        activeCategory: "furniture", // valid
        query: 123, // invalid
        collapsedGroups: { groupA: true, groupB: "not-a-boolean", groupC: false }, // semi-valid
      };

      const result = normalizeLayerManagerUiState(input);
      expect(result).toEqual({
        activeCategory: "furniture",
        query: "",
        collapsedGroups: { groupA: true, groupC: false },
      });
    });

    it("falls back to default activeCategory if not one of the allowed categories", () => {
      const input = {
        activeCategory: "invalid-category",
        query: "search",
      };

      const result = normalizeLayerManagerUiState(input);
      expect(result.activeCategory).toBe(DEFAULT_LAYER_MANAGER_UI_STATE.activeCategory);
      expect(result.query).toBe("search");
    });
  });

  describe("loadLayerManagerUiStateFromStorage", () => {
    it("returns default state when localStorage is empty", () => {
      expect(loadLayerManagerUiStateFromStorage()).toEqual(DEFAULT_LAYER_MANAGER_UI_STATE);
    });

    it("loads and normalizes valid state from localStorage", () => {
      localStorage.setItem(
        LAYER_MANAGER_UI_STATE_KEY,
        JSON.stringify({
          activeCategory: "wall",
          query: "pillar",
          collapsedGroups: { walls: true },
        })
      );

      const state = loadLayerManagerUiStateFromStorage();
      expect(state).toEqual({
        activeCategory: "wall",
        query: "pillar",
        collapsedGroups: { walls: true },
      });
    });

    it("handles corrupt JSON in localStorage gracefully", () => {
      localStorage.setItem(LAYER_MANAGER_UI_STATE_KEY, "corrupted-json{");
      const state = loadLayerManagerUiStateFromStorage();
      expect(state).toEqual(DEFAULT_LAYER_MANAGER_UI_STATE);
    });
  });
});
