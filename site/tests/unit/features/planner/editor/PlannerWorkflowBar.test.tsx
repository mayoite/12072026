import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PlannerWorkflowBar } from "@/features/planner/editor/PlannerWorkflowBar";

afterEach(() => cleanup());

describe("PlannerWorkflowBar", () => {
  it("renders three workflow steps and denser completion (Done only when complete)", () => {
    const onStepChange = vi.fn();
    render(
      <PlannerWorkflowBar
        currentStep="draw"
        onStepChange={onStepChange}
        planMetrics={{
          objects: 4,
          walls: 4,
          furniture: 2,
          workstationSeats: 0,
          floorLabel: "Ground",
          boqReady: true,
          validationErrors: 0,
          closedRoom: true,
          planWidthMm: 5000,
          planDepthMm: 4000,
        }}
      />,
    );

    const nav = screen.getByRole("navigation", { name: "Planner workflow" });
    expect(nav).toHaveAttribute("data-current", "draw");
    expect(nav).toHaveAttribute("data-density", "compact");

    // Measured room + furniture + quote ready → Done badges; no Incomplete spam.
    expect(screen.getAllByText("Done").length).toBe(3);
    expect(screen.queryByText("Incomplete")).not.toBeInTheDocument();
    expect(screen.queryByText("Complete")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /2\.\s*Place/i }));
    expect(onStepChange).toHaveBeenCalledWith("place");
  });

  it("exposes completion in aria-label even when incomplete is not painted", () => {
    render(
      <PlannerWorkflowBar
        currentStep="place"
        onStepChange={vi.fn()}
        planMetrics={{
          objects: 0,
          walls: 0,
          furniture: 0,
          workstationSeats: 0,
          floorLabel: "Ground",
          boqReady: false,
          validationErrors: 0,
        }}
      />,
    );

    const drawBtn = screen.getByRole("button", { name: /1\.\s*Draw/i });
    expect(drawBtn).toHaveAttribute("data-completion", "incomplete");
    expect(drawBtn.getAttribute("aria-label") ?? "").toMatch(/incomplete/i);
    expect(screen.queryByText("Incomplete")).not.toBeInTheDocument();
  });
});
