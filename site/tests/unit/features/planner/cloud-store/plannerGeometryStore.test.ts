import { describe, expect, it, vi } from "vitest";
import { usePlannerGeometryStore } from "@/features/planner/cloud-store/plannerGeometryStore";

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

describe("plannerGeometryStore", () => {
  it("should have hook usePlannerGeometryStore defined", () => {
    expect(usePlannerGeometryStore).toBeTypeOf("function");
    expect(usePlannerGeometryStore.name.length).toBeGreaterThan(0);
  });
});