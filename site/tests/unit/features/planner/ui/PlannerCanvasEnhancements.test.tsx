import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { PlannerCanvasEnhancements } from "@/features/planner/ui/PlannerCanvasEnhancements";
import { usePlannerWorkspaceStore } from "@/features/planner/store/workspaceStore";
import { getPlannerFabricRuntime } from "@/features/planner/canvas-fabric";
import { applySuggestedLayout } from "@/features/planner/ai/applySuggestedLayout";

vi.mock("@/features/planner/ai/applySuggestedLayout", () => ({
  applySuggestedLayout: vi.fn(),
}));

vi.mock("@/features/planner/canvas-fabric", () => ({
  getPlannerFabricRuntime: vi.fn(),
}));

vi.mock("@/features/planner/onboarding/OnboardingCoach", () => ({
  OnboardingCoach: () => <div data-testid="onboarding-coach" />,
}));

vi.mock("@/features/planner/store/workspaceStore", () => ({
  usePlannerWorkspaceStore: vi.fn(),
}));

vi.mock("../onboarding/steps", () => ({
  PLANNER_ONBOARDING_STEPS: [],
}));

describe("PlannerCanvasEnhancements", () => {
  let pendingBootstrapLayout: any = null;
  const setPendingBootstrapLayout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb: any) => {
      cb();
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(vi.fn());

    // Mock usePlannerWorkspaceStore behaviour
    vi.mocked(usePlannerWorkspaceStore).mockImplementation((selector: any) => {
      const state = {
        pendingBootstrapLayout,
        setPendingBootstrapLayout,
      };
      return selector(state);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders OnboardingCoach correctly", () => {
    const { getByTestId } = render(<PlannerCanvasEnhancements guestMode={true} />);
    expect(getByTestId("onboarding-coach")).toBeDefined();
  });

  it("applies suggested layout if pendingBootstrapLayout is present and runtime has no objects", () => {
    pendingBootstrapLayout = { layout: "test-layout" };
    const mockRuntime = {
      exportDraft: vi.fn(() => JSON.stringify({ objects: [] })),
      fitToContent: vi.fn(),
    };
    vi.mocked(getPlannerFabricRuntime).mockReturnValue(mockRuntime as any);

    render(<PlannerCanvasEnhancements guestMode={false} />);

    expect(mockRuntime.exportDraft).toHaveBeenCalled();
    expect(applySuggestedLayout).toHaveBeenCalledWith(null, pendingBootstrapLayout);
    expect(setPendingBootstrapLayout).toHaveBeenCalledWith(null);
  });
});
