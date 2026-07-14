import { describe, expect, it, vi } from "vitest";
import { callAI, autoFurnishRoom, analyzeSpace } from "@/features/planner/lib/aiService";

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

describe("aiService", () => {
  it("should have function callAI defined", () => {
    expect(callAI).toBeTypeOf("function"); expect(String(callAI)).toContain('function');
  });
  it("should have function autoFurnishRoom defined", () => {
    expect(autoFurnishRoom).toBeTypeOf("function"); expect(String(autoFurnishRoom)).toContain('function');
  });
  it("should have function analyzeSpace defined", () => {
    expect(analyzeSpace).toBeTypeOf("function"); expect(String(analyzeSpace)).toContain('function');
  });
});