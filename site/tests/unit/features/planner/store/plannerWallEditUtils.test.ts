import { describe, expect, it, vi } from "vitest";
import { buildConnectedWallUpdates, applyConnectedWallUpdates, buildSplitWalls } from "@/features/planner/store/plannerWallEditUtils";

vi.mock("@/features/planner/store/plannerStore", () => ({
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

describe("plannerWallEditUtils", () => {
  it("should have function buildConnectedWallUpdates defined", () => {
    expect(buildConnectedWallUpdates).toBeTypeOf("function");
  });
  it("should have function applyConnectedWallUpdates defined", () => {
    expect(applyConnectedWallUpdates).toBeTypeOf("function");
  });
  it("should have function buildSplitWalls defined", () => {
    expect(buildSplitWalls).toBeTypeOf("function");
  });
});