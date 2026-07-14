import { describe, expect, it, vi } from "vitest";
import { getSelectedItemTypeFromState, getSelectedItemFromState, getClipboardEntryFromState, getSelectAllTargetId, buildPastedClipboardEntry, buildPasteStatePatch } from "@/features/planner/cloud-store/plannerSelectionUtils";

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

describe("plannerSelectionUtils", () => {
  it("should have function getSelectedItemTypeFromState defined", () => {
    expect(getSelectedItemTypeFromState).toBeTypeOf("function");
  });
  it("should have function getSelectedItemFromState defined", () => {
    expect(getSelectedItemFromState).toBeTypeOf("function");
  });
  it("should have function getClipboardEntryFromState defined", () => {
    expect(getClipboardEntryFromState).toBeTypeOf("function");
  });
  it("should have function getSelectAllTargetId defined", () => {
    expect(getSelectAllTargetId).toBeTypeOf("function");
  });
  it("should have function buildPastedClipboardEntry defined", () => {
    expect(buildPastedClipboardEntry).toBeTypeOf("function");
  });
  it("should have function buildPasteStatePatch defined", () => {
    expect(buildPasteStatePatch).toBeTypeOf("function");
  });
});