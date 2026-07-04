import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlannerStepBar } from "@/features/planner/editor/PlannerStepBar";

describe("PlannerStepBar", () => {
  it("renders workflow steps and handles step changes", () => {
    const mockChange = vi.fn();
    render(
      <PlannerStepBar
        current="draw"
        onChange={mockChange}
      />
    );

    // Check tabs
    expect(screen.getByText("Draw")).toBeInTheDocument();
    expect(screen.getByText("Place")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();

    const placeBtn = screen.getByRole("button", { name: "Place: Furniture, doors, windows" });
    fireEvent.click(placeBtn);

    expect(mockChange).toHaveBeenCalledWith("place");
  });

  it("disables steps when configured", () => {
    const mockChange = vi.fn();
    render(
      <PlannerStepBar
        current="draw"
        disabledSteps={{ review: true }}
        onChange={mockChange}
      />
    );

    const reviewBtn = screen.getByRole("button", { name: "Review: Measurements, properties, export (unavailable)" });
    expect(reviewBtn).toBeDisabled();
  });
});
