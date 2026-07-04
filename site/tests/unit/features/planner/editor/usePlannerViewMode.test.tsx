import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlannerViewMode } from "@/features/planner/editor/usePlannerViewMode";
import { usePlannerCatalogStore } from "@/features/planner/catalog/catalogStore";
import * as prefs from "@/features/planner/editor/plannerWorkspacePreferences";

vi.mock("@/features/planner/editor/plannerWorkspacePreferences", () => {
  return {
    readPlannerWorkspacePreferences: vi.fn(),
    writePlannerWorkspacePreferences: vi.fn(),
  };
});

describe("usePlannerViewMode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlannerCatalogStore.setState({ query: "" });
  });

  it("hydrates viewMode and catalogQuery from preferences on mount", async () => {
    vi.mocked(prefs.readPlannerWorkspacePreferences).mockReturnValue({
      leftOpen: true,
      rightOpen: false,
      leftCollapsed: false,
      rightCollapsed: false,
      viewMode: "split",
      catalogQuery: "office chair",
    });

    const { result } = renderHook(() => usePlannerViewMode());

    // Wait for the Promise.resolve() in useEffect to resolve
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(prefs.readPlannerWorkspacePreferences).toHaveBeenCalled();
    expect(result.current.viewMode).toBe("split");
    expect(usePlannerCatalogStore.getState().query).toBe("office chair");
  });

  it("writes preference when viewMode changes after hydration", async () => {
    vi.mocked(prefs.readPlannerWorkspacePreferences).mockReturnValue({
      leftOpen: true,
      rightOpen: false,
      leftCollapsed: false,
      rightCollapsed: false,
      viewMode: "2d",
      catalogQuery: "",
    });

    const { result } = renderHook(() => usePlannerViewMode());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    vi.mocked(prefs.writePlannerWorkspacePreferences).mockClear();

    act(() => {
      result.current.setViewMode("3d");
    });

    expect(result.current.viewMode).toBe("3d");
    expect(prefs.writePlannerWorkspacePreferences).toHaveBeenCalledWith({ viewMode: "3d" });
  });

  it("writes preference when catalog query changes", async () => {
    vi.mocked(prefs.readPlannerWorkspacePreferences).mockReturnValue({
      leftOpen: true,
      rightOpen: false,
      leftCollapsed: false,
      rightCollapsed: false,
      viewMode: "2d",
      catalogQuery: "",
    });

    renderHook(() => usePlannerViewMode());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      usePlannerCatalogStore.setState({ query: "desk" });
    });

    expect(prefs.writePlannerWorkspacePreferences).toHaveBeenCalledWith({ catalogQuery: "desk" });
  });
});
