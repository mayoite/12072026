import { describe, it, expect, vi, beforeEach } from "vitest";
import { getEditorSelectionStatus } from "@/features/planner/editor/editorSelectionStatus";
import { getPlannerFabricRuntimeState } from "@/features/planner/canvas-fabric";

vi.mock("@/features/planner/canvas-fabric", () => ({
  getPlannerFabricRuntimeState: vi.fn(),
}));

describe("getEditorSelectionStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when there are no selections", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      selections: [],
    } as any);

    expect(getEditorSelectionStatus()).toBeNull();
  });

  it("returns '[count] items' when selections length is greater than 1", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      selections: [
        { name: "GENERIC:chair" },
        { name: "GENERIC:desk" },
      ],
    } as any);

    expect(getEditorSelectionStatus()).toBe("2 items");
  });

  it("returns '1 item' if selected name is empty or whitespace", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      selections: [{ name: "   " }],
    } as any);

    expect(getEditorSelectionStatus()).toBe("1 item");
  });

  it("returns the second part of a colon-separated name", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      selections: [{ name: "GENERIC:Office Chair" }],
    } as any);

    expect(getEditorSelectionStatus()).toBe("Office Chair");
  });

  it("returns name if it does not contain a colon", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      selections: [{ name: "CustomFurniture" }],
    } as any);

    expect(getEditorSelectionStatus()).toBe("CustomFurniture");
  });

  it("handles complex names with multiple colons", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      selections: [{ name: "CAT:SubCat:ItemName" }],
    } as any);

    expect(getEditorSelectionStatus()).toBe("SubCat:ItemName");
  });
});
