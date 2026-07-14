import { describe, expect, it, vi } from "vitest";
import * as Module from "@/features/planner/cloud-store/index";

vi.mock("@/features/planner/cloud-store/favoritesStore", () => ({
  useFavoritesStore: {
    getState: () => ({
      favorites: [],
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      toggleFavorite: vi.fn(),
      isFavorite: () => false,
    }),
    subscribe: vi.fn(),
  },
}));

vi.mock("@/features/planner/cloud-store/plannerStore", () => ({
  usePlannerStore: {
    getState: () => ({
      document: {
        walls: [],
        furniture: [],
        roomWidth: 800,
        roomHeight: 600,
      },
      addFurnitureItem: vi.fn(),
      removeFurnitureItem: vi.fn(),
      updateFurnitureItem: vi.fn(),
      history: { undo: vi.fn(), redo: vi.fn() },
    }),
    subscribe: vi.fn(),
  },
}));

describe("index", () => {
  it("should import successfully", () => {
    expect(Module).toBeDefined();`n    expect(Object.keys(Module).length).toBeGreaterThan(0);
  });
});