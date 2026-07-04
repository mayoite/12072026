import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  usePlannerViewMode,
  usePlannerWorkspaceUiState,
  usePlannerCatalogDrop,
  usePlannerDocument,
  usePlannerKeyboardHandlers,
} from "@/features/planner/editor/plannerWorkspaceHooks";
import { useFloorplan } from "@/features/planner/canvas-fabric/context/FloorplanContext";

vi.mock("@/features/planner/canvas-fabric/context/FloorplanContext", () => ({
  useFloorplan: vi.fn(),
}));

describe("plannerWorkspaceHooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("usePlannerViewMode changes mode", () => {
    const { result } = renderHook(() => usePlannerViewMode());
    expect(result.current.viewMode).toBe("2d");

    act(() => {
      result.current.handleViewModeChange("3d");
    });
    expect(result.current.viewMode).toBe("3d");
  });

  it("usePlannerWorkspaceUiState manages modal state and tool visibility", () => {
    localStorage.setItem("planner-tool-visibility-mode", "balanced");

    const { result } = renderHook(() => usePlannerWorkspaceUiState());

    expect(result.current.viewMode).toBe("2d");
    expect(result.current.toolVisibilityMode).toBe("balanced");
    expect(result.current.isTemplateOpen).toBe(false);
    expect(result.current.isExportOpen).toBe(false);
    expect(result.current.isSessionOpen).toBe(false);

    act(() => {
      result.current.setIsTemplateOpen(true);
      result.current.setIsExportOpen(true);
      result.current.setIsSessionOpen(true);
    });

    expect(result.current.isTemplateOpen).toBe(true);
    expect(result.current.isExportOpen).toBe(true);
    expect(result.current.isSessionOpen).toBe(true);

    act(() => {
      result.current.handleToolVisibilityModeChange("all");
    });

    expect(result.current.toolVisibilityMode).toBe("all");
    expect(localStorage.getItem("planner-tool-visibility-mode")).toBe("all");
  });

  it("usePlannerCatalogDrop inserts object on drop", () => {
    const mockInsert = vi.fn();
    vi.mocked(useFloorplan).mockReturnValue({
      insertObject: mockInsert,
    } as any);

    const { result } = renderHook(() => usePlannerCatalogDrop({ current: null }));

    const mockItem = { id: "item-123" } as any;
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { catalogItem: mockItem },
    } as any;

    act(() => {
      result.current.handleCanvasDrop(mockEvent);
    });

    expect(mockInsert).toHaveBeenCalledWith({
      type: "CATALOG",
      object: { catalogItemId: "item-123" },
    });
  });

  it("usePlannerDocument exports and imports", async () => {
    const mockExport = vi.fn().mockReturnValue("exported-state");
    const mockImport = vi.fn();
    vi.mocked(useFloorplan).mockReturnValue({
      exportDraft: mockExport,
      importDraft: mockImport,
    } as any);

    const { result } = renderHook(() => usePlannerDocument());
    const doc = await result.current.saveDocument("my-doc");
    expect(doc?.data).toBe("exported-state");

    await result.current.loadDocument("exported-state");
    expect(mockImport).toHaveBeenCalledWith("exported-state");
  });

  it("usePlannerKeyboardHandlers fires on keypress", () => {
    const mockApply = vi.fn();
    renderHook(() => usePlannerKeyboardHandlers(mockApply));

    const ev = new KeyboardEvent("keydown", { key: "w" });
    document.dispatchEvent(ev);

    expect(mockApply).toHaveBeenCalledWith({ toolId: "planner-wall", plannerTool: "wall" });
  });
});
