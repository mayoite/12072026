import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepsChrome } from "@/features/planner/editor/chrome/widgets/StepsChrome";
import type { PlannerStep } from "@/features/planner/editor/plannerStep";

vi.mock("@/features/planner/editor/PlannerStepBar", () => ({
  PlannerStepBar: ({ current, disabledSteps, onChange, compact, showIntro }: any) => (
    <div data-testid="step-bar" data-current={current} data-compact={compact} data-show-intro={showIntro}>
      <button onClick={() => onChange("place")}>Change to Place</button>
      <div data-testid="disabled-draw">{String(disabledSteps?.draw)}</div>
    </div>
  ),
}));

describe("StepsChrome", () => {
  it("renders PlannerStepBar with correct props", () => {
    const onChange = vi.fn();
    const disabledSteps: Partial<Record<PlannerStep, boolean>> = { draw: true };
    render(<StepsChrome current="draw" disabledSteps={disabledSteps} onChange={onChange} />);

    const stepBar = screen.getByTestId("step-bar");
    expect(stepBar.getAttribute("data-current")).toBe("draw");
    expect(stepBar.getAttribute("data-compact")).toBe("true");
    expect(stepBar.getAttribute("data-show-intro")).toBe("false");
    expect(screen.getByTestId("disabled-draw").textContent).toBe("true");

    screen.getByText("Change to Place").click();
    expect(onChange).toHaveBeenCalledWith("place");
  });
});
