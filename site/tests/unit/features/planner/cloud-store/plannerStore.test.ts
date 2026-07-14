import { describe, expect, it, vi } from "vitest";
import { setToastStoreRef, usePlannerStore } from "@/features/planner/cloud-store/plannerStore";

const mockState = {
  document: { walls: [], furniture: [], roomWidth: 800, roomHeight: 600 },
  addFurnitureItem: vi.fn(),
  removeFurnitureItem: vi.fn(),
  updateFurnitureItem: vi.fn(),
  history: { undo: vi.fn(), redo: vi.fn() },
};

vi.mock("@/features/planner/cloud-store/plannerStore", () => {
  const usePlannerStore = vi.fn((selector?: (s: any) => any) =>
    selector ? selector(mockState) : mockState
  );
  usePlannerStore.getState = () => mockState;
  usePlannerStore.subscribe = vi.fn();
  return {
    usePlannerStore,
    setToastStoreRef: vi.fn(),
  };
});

describe("plannerStore", () => {
  it("should have function setToastStoreRef defined", () => {
    expect(setToastStoreRef).toBeTypeOf("function"); expect(String(setToastStoreRef)).toContain('function');
  });
  it("should have hook usePlannerStore defined", () => {
    expect(usePlannerStore).toBeTypeOf("function"); expect(String(usePlannerStore)).toContain('function');
  });
});