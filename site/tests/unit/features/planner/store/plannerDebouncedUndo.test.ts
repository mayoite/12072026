import { describe, expect, it, vi } from "vitest";
import { captureDebounceSnapshot, scheduleDebounceCommit, flushDebounce } from "@/features/planner/store/plannerDebouncedUndo";

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

describe("plannerDebouncedUndo", () => {
  it("should have function captureDebounceSnapshot defined", () => {
    expect(captureDebounceSnapshot).toBeTypeOf("function");
  });
  it("should have function scheduleDebounceCommit defined", () => {
    expect(scheduleDebounceCommit).toBeTypeOf("function");
  });
  it("should have function flushDebounce defined", () => {
    expect(flushDebounce).toBeTypeOf("function");
  });
});