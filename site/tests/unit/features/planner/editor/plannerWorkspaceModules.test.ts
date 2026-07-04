import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  usePlannerShellVisible,
  usePlannerWorkspacePreferences,
} from "@/features/planner/editor/usePlannerWorkspacePreferences";
import { usePlannerCatalogPlacement } from "@/features/planner/editor/usePlannerCatalogPlacement";
import { usePlannerWorkspaceTooling } from "@/features/planner/editor/usePlannerWorkspaceTooling";
import { usePlannerSelectionPanel } from "@/features/planner/editor/usePlannerWorkspaceBootstrap";
import { usePlannerWorkspaceStore } from "@/features/planner/store/workspaceStore";
import { usePlannerStore } from "@/features/planner/store/plannerStore";

vi.mock("@/features/planner/catalog/placementCatalogResolver", () => ({
  getDefaultPlacementCatalogItemId: vi.fn(() => "desk-1"),
  isFurniturePlacementCatalogItem: vi.fn(() => true),
}));

vi.mock("@/features/planner/catalog/catalogBlockBridge", () => ({
  catalogFootprintToCanvasUnits: vi.fn(() => ({ width: 10, depth: 8 })),
  resolveCatalogItemBlock2D: vi.fn(() => null),
  resolveCatalogPlacementFootprintMm: vi.fn(() => ({ L: 1200, D: 600 })),
}));

describe("planner workspace extracted modules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    usePlannerWorkspaceStore.setState({ plannerStep: "draw" });
    usePlannerStore.setState({ tool: "select", activeCatalogId: null });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("usePlannerShellVisible becomes true after mount", async () => {
    const { result } = renderHook(() => usePlannerShellVisible());
    expect(result.current).toBe(false);
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("usePlannerWorkspacePreferences hydrates saved view mode", async () => {
    localStorage.setItem(
      "planner-workspace-preferences-v1",
      JSON.stringify({ viewMode: "split", catalogQuery: "" }),
    );

    const { result } = renderHook(() => usePlannerWorkspacePreferences());
    await waitFor(() => {
      expect(result.current.preferencesHydrated).toBe(true);
    });
    expect(result.current.viewMode).toBe("split");
  });

  it("usePlannerCatalogPlacement inserts a generic catalog object", () => {
    const insertObject = vi.fn();
    const { result } = renderHook(() => usePlannerCatalogPlacement(insertObject));

    act(() => {
      result.current.placeCatalogIntoFabric({
        id: "chair-1",
        name: "Task Chair",
        shortName: "Chair",
        category: "seating",
        shapeType: "furniture",
        widthMm: 600,
        heightMm: 600,
        depthMm: 600,
        description: "Chair",
        tags: [],
      } as never);
    });

    expect(insertObject).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "GENERIC",
        object: expect.objectContaining({
          catalogItemId: "chair-1",
          variant: "furniture",
        }),
      }),
    );
  });

  it("usePlannerWorkspaceTooling applies planner tool binding", () => {
    const setPlannerStep = vi.fn();
    const setLeftTab = vi.fn();
    const setLeftOpen = vi.fn();
    const applyStepLayout = vi.fn();
    const insertObject = vi.fn();
    const placeCatalogIntoFabric = vi.fn();
    const recordRecentPlacement = vi.fn();
    const setIsTemplateOpen = vi.fn();
    const setSessionStatusMessage = vi.fn();
    const setViewMode = vi.fn();

    const { result } = renderHook(() =>
      usePlannerWorkspaceTooling({
        applyStepLayout,
        insertObject,
        isTemplateOpen: false,
        leftOpen: false,
        placeCatalogIntoFabric,
        recordRecentPlacement,
        setIsTemplateOpen,
        setLeftOpen,
        setLeftTab,
        setPlannerStep,
        setSessionStatusMessage,
        setViewMode,
        shapeCount: 0,
      }),
    );

    act(() => {
      result.current.applyToolBinding({ toolId: "planner-wall", plannerTool: "wall" });
    });

    expect(usePlannerStore.getState().tool).toBe("wall");
  });

  it("usePlannerSelectionPanel opens the right panel when a selection appears", () => {
    const setRightOpen = vi.fn();

    const { rerender } = renderHook(
      ({ selectionStatus }) =>
        usePlannerSelectionPanel({
          isCompact: false,
          rightOpen: false,
          selectionStatus,
          setRightOpen,
        }),
      { initialProps: { selectionStatus: null as string | null } },
    );

    rerender({ selectionStatus: "wall-1" });
    expect(setRightOpen).toHaveBeenCalledWith(true);
  });
});
