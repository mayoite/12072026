import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlannerToolRail } from "@/features/planner/editor/PlannerToolRail";

vi.mock("@/features/planner/editor/plannerToolVisibility", () => ({
  isPlannerToolVisible: vi.fn().mockReturnValue(true),
}));

vi.mock("@/features/planner/ui/PlannerTooltip", () => ({
  PlannerTooltip: ({ children, label }: any) => <div data-testid="tooltip" data-label={label}>{children}</div>,
}));

describe("PlannerToolRail", () => {
  it("renders visible tools and triggers onSelect when clicked", () => {
    const mockSelect = vi.fn();
    render(
      <PlannerToolRail
        activeTool="select"
        activePlannerTool="select"
        step="draw"
        onSelect={mockSelect}
      />
    );

    // Expecting to find tools like 'Select', 'Pan', 'Wall'
    const selectBtn = screen.getByRole("button", { name: "Select (V)" });
    expect(selectBtn).toBeInTheDocument();

    const wallBtn = screen.getByRole("button", { name: "Wall (W)" });
    fireEvent.click(wallBtn);

    expect(mockSelect).toHaveBeenCalledWith("planner-wall", "wall");
  });
});
