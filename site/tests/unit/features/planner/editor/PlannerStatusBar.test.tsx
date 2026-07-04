import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlannerStatusBar } from "@/features/planner/editor/PlannerStatusBar";
import { isPlannerDevToolsEnabled } from "@/features/planner/editor/plannerToolVisibility";

vi.mock("@/features/planner/editor/plannerToolVisibility", () => ({
  isPlannerDevToolsEnabled: vi.fn(),
  PLANNER_TOOL_VISIBILITY_LABELS: { balanced: "Balanced", full: "Full" },
  PLANNER_TOOL_VISIBILITY_MODES: ["balanced", "full"],
}));

describe("PlannerStatusBar", () => {
  const metrics = {
    shapeCount: 10,
    roomAreaSqm: 45.5,
    zoneAreaSqm: 12,
    totalFloorAreaSqm: 57.5,
    wallCount: 4,
    furnitureCount: 6,
    calibrated: true,
  };

  it("renders metrics details correctly", () => {
    vi.mocked(isPlannerDevToolsEnabled).mockReturnValue(false);

    render(<PlannerStatusBar metrics={metrics} />);

    expect(screen.getByText("10 objects")).toBeInTheDocument();
    expect(screen.getByText("4 walls")).toBeInTheDocument();
    expect(screen.getByText("6 furniture")).toBeInTheDocument();
    expect(screen.getByText("Rooms 46 m²")).toBeInTheDocument();
    expect(screen.getByText("58 m²")).toBeInTheDocument(); // total floor
    expect(screen.getByText(/\(calibrated\)/)).toBeInTheDocument();
  });

  it("renders grid button and handles toggle click", () => {
    const mockToggle = vi.fn();
    render(<PlannerStatusBar metrics={metrics} onToggleGrid={mockToggle} showGrid={true} />);

    const gridBtn = screen.getByRole("button", { name: "Hide alignment grid" });
    expect(gridBtn).toBeInTheDocument();

    fireEvent.click(gridBtn);
    expect(mockToggle).toHaveBeenCalled();
  });
});
