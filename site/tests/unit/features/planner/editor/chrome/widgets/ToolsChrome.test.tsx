import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolsChrome } from "@/features/planner/editor/chrome/widgets/ToolsChrome";

vi.mock("@/features/planner/editor/PlannerToolRail", () => ({
  PlannerToolRail: ({ activeTool, activePlannerTool, step, visibilityMode, tooltipSide, onSelect }: any) => (
    <div
      data-testid="tool-rail"
      data-active-tool={activeTool}
      data-active-planner-tool={activePlannerTool}
      data-step={step}
      data-visibility={visibilityMode}
      data-tooltip-side={tooltipSide}
    >
      <button onClick={() => onSelect("select", "select")}>Select Tool</button>
    </div>
  ),
}));

describe("ToolsChrome", () => {
  it("renders PlannerToolRail with correct props", () => {
    const onSelect = vi.fn();
    render(
      <ToolsChrome
        activeTool="select"
        activePlannerTool="select"
        step="draw"
        visibilityMode="full"
        tooltipSide="right"
        onSelect={onSelect}
      />
    );

    const toolRail = screen.getByTestId("tool-rail");
    expect(toolRail.getAttribute("data-active-tool")).toBe("select");
    expect(toolRail.getAttribute("data-active-planner-tool")).toBe("select");
    expect(toolRail.getAttribute("data-step")).toBe("draw");
    expect(toolRail.getAttribute("data-visibility")).toBe("full");
    expect(toolRail.getAttribute("data-tooltip-side")).toBe("right");

    screen.getByText("Select Tool").click();
    expect(onSelect).toHaveBeenCalledWith("select", "select");
  });
});
