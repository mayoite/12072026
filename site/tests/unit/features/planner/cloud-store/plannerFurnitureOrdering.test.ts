import { describe, expect, it, vi } from "vitest";
import { buildFurnitureBatch, bringFurnitureItemToFront, sendFurnitureItemToBack } from "@/features/planner/cloud-store/plannerFurnitureOrdering";

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

describe("plannerFurnitureOrdering", () => {
  it("should have function buildFurnitureBatch defined", () => {
    expect(buildFurnitureBatch).toBeTypeOf("function"); expect(String(buildFurnitureBatch)).toContain('function');
  });
  it("should have function bringFurnitureItemToFront defined", () => {
    expect(bringFurnitureItemToFront).toBeTypeOf("function"); expect(String(bringFurnitureItemToFront)).toContain('function');
  });
  it("should have function sendFurnitureItemToBack defined", () => {
    expect(sendFurnitureItemToBack).toBeTypeOf("function"); expect(String(sendFurnitureItemToBack)).toContain('function');
  });
});