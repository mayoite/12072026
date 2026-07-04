import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { usePlannerPanels, getStepLeftOpenDefault, getStepRightOpenDefault, getStepLeftEmphasis } from "@/features/planner/editor/usePlannerPanels";

vi.mock("@/features/planner/editor/plannerWorkspacePreferences", () => ({
  readPlannerWorkspacePreferences: vi.fn().mockReturnValue({
    leftOpen: true,
    rightOpen: false,
    leftCollapsed: false,
    rightCollapsed: false,
    catalogQuery: "",
    viewMode: "2d",
  }),
  writePlannerWorkspacePreferences: vi.fn(),
}));

describe("usePlannerPanels hook & functions", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("calculates correct default open states by step", () => {
    expect(getStepLeftOpenDefault("draw", false)).toBe(true);
    expect(getStepLeftOpenDefault("review", false)).toBe(false);
    expect(getStepRightOpenDefault("review", false)).toBe(true);
    expect(getStepLeftEmphasis("place")).toBe("prominent");
  });

  it("manages panel toggles and overrides", async () => {
    const { result } = renderHook(() => usePlannerPanels({ enabled: true }));

    await waitFor(() => {
      expect(result.current.rightOpen).toBe(false);
    });
    expect(result.current.leftOpen).toBe(true);

    act(() => {
      result.current.toggleRight();
    });

    expect(result.current.rightOpen).toBe(true);
    expect(result.current.rightManualOverride).toBe(true);
  });
});
