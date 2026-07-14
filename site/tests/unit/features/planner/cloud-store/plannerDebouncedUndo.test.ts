import { describe, expect, it, vi } from "vitest";
import { captureDebounceSnapshot, scheduleDebounceCommit, flushDebounce } from "@/features/planner/cloud-store/plannerDebouncedUndo";

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

describe("plannerDebouncedUndo", () => {
  it("should have function captureDebounceSnapshot defined", () => {
    expect(captureDebounceSnapshot).toBeTypeOf("function"); expect(String(captureDebounceSnapshot)).toContain('function');
  });
  it("should have function scheduleDebounceCommit defined", () => {
    expect(scheduleDebounceCommit).toBeTypeOf("function"); expect(String(scheduleDebounceCommit)).toContain('function');
  });
  it("should have function flushDebounce defined", () => {
    expect(flushDebounce).toBeTypeOf("function"); expect(String(flushDebounce)).toContain('function');
  });
});