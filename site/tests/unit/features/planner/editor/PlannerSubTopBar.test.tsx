import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlannerSubTopBar } from "@/features/planner/editor/PlannerSubTopBar";

vi.mock("@/features/planner/canvas-fabric", () => ({
  useFloorplan: vi.fn().mockReturnValue({ zoom: 1, setZoom: vi.fn() }),
}));

vi.mock("@/features/planner/canvas-fabric/FabricCanvasSubToolbar", () => ({
  FabricCanvasSubToolbar: () => <div data-testid="sub-toolbar">Sub Toolbar</div>,
}));

vi.mock("@/features/planner/canvas-fabric/components/ZoomControl", () => ({
  ZoomControl: () => <div data-testid="zoom-control">Zoom Control</div>,
}));

describe("PlannerSubTopBar", () => {
  it("renders buttons and handles view mode change", () => {
    const mockChange = vi.fn();
    render(
      <PlannerSubTopBar
        viewMode="2d"
        onViewModeChange={mockChange}
        leftCollapsed={false}
        rightCollapsed={false}
      />
    );

    expect(screen.getByTestId("sub-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("zoom-control")).toBeInTheDocument();

    const modeBtn = screen.getByRole("button", { name: "3D" });
    fireEvent.click(modeBtn);

    expect(mockChange).toHaveBeenCalledWith("3d");
  });
});
