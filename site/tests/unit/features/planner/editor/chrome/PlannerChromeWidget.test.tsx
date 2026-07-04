import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlannerChromeWidget } from "@/features/planner/editor/chrome/PlannerChromeWidget";

vi.mock("@/features/planner/editor/chrome/plannerChromeLayout", () => ({
  getPlannerChromePreviewEdge: vi.fn(),
  getPlannerChromeTooltipSide: vi.fn().mockReturnValue("top"),
  movePlannerChromePlacementWithKeyboard: vi.fn(),
  PLANNER_CHROME_DEFAULTS: { tools: { edge: "left", offset: 0 } },
  resolvePlannerChromeCollisions: vi.fn().mockImplementation((layout) => layout),
  snapPlannerChromePlacement: vi.fn(),
}));

vi.mock("@/features/planner/editor/chrome/plannerChromeStorage", () => ({
  readPlannerChromeLayout: vi.fn().mockReturnValue({
    tools: { edge: "left", offset: 0, x: 0.1, y: 0.1 },
  }),
  writePlannerChromeLayout: vi.fn(),
}));

describe("PlannerChromeWidget", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });

  it("renders correctly with handle and children", () => {
    const mockRef = { current: document.createElement("div") };
    render(
      <PlannerChromeWidget
        dockId="tools"
        layerRef={mockRef}
        label="Tools widget"
      >
        <div data-testid="widget-child">Hello Widget</div>
      </PlannerChromeWidget>
    );

    expect(screen.getByText("Hello Widget")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Move Tools widget" })).toBeInTheDocument();
  });
});
