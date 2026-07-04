import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlannerViewMode } from "@/features/planner/editor/usePlannerViewMode";
import { readPlannerWorkspacePreferences, writePlannerWorkspacePreferences } from "@/features/planner/editor/plannerWorkspacePreferences";

vi.mock("@/features/planner/editor/plannerWorkspacePreferences", () => ({
  readPlannerWorkspacePreferences: vi.fn().mockReturnValue({
    viewMode: "3d",
    catalogQuery: "desk",
  }),
  writePlannerWorkspacePreferences: vi.fn(),
}));

vi.mock("@/features/planner/catalog/catalogStore", () => ({
  usePlannerCatalogStore: {
    getState: () => ({ setQuery: vi.fn() }),
    subscribe: vi.fn().mockReturnValue(vi.fn()),
  },
}));

describe("usePlannerViewMode", () => {
  it("initializes with saved view mode", async () => {
    const { result } = renderHook(() => usePlannerViewMode());

    // Allow promise resolve in hook's useEffect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.viewMode).toBe("3d");
    expect(readPlannerWorkspacePreferences).toHaveBeenCalled();
  });

  it("updates preferences when view mode changes", async () => {
    const { result } = renderHook(() => usePlannerViewMode());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.setViewMode("split");
    });

    expect(result.current.viewMode).toBe("split");
    expect(writePlannerWorkspacePreferences).toHaveBeenCalledWith({ viewMode: "split" });
  });
});
