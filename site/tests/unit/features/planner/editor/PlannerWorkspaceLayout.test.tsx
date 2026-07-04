import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlannerWorkspaceLayout } from "@/features/planner/editor/PlannerWorkspaceLayout";

vi.mock("@/features/planner/editor/PlannerMobileDock", () => ({
  PlannerMobileDock: () => <div data-testid="mobile-dock">Mobile Dock</div>,
}));

describe("PlannerWorkspaceLayout", () => {
  it("renders structure correctly", () => {
    const mockClose = vi.fn();
    render(
      <PlannerWorkspaceLayout
        topBar={<div>TopBarContent</div>}
        leftPanel={<div>LeftPanelContent</div>}
        rightPanel={<div>RightPanelContent</div>}
        canvasArea={<div>CanvasAreaContent</div>}
        sessionDialog={<div>SessionDialogContent</div>}
        templateModal={<div>TemplateModalContent</div>}
        exportModal={<div>ExportModalContent</div>}
        dragOverlay={<div>DragOverlayContent</div>}
        mobileToolbar={<div data-testid="mobile-dock">Mobile Dock</div>}
        isCompact={true}
        plannerStep="draw"
        leftOpenRaw={true}
        rightOpenRaw={false}
        leftCollapsed={false}
        rightCollapsed={false}
        isCanvasDragging={false}
        closeAll={mockClose}
        toggleLeft={vi.fn()}
        toggleRight={vi.fn()}
        isOnline={false}
      />
    );

    expect(screen.getByText("Workspace Planner")).toBeInTheDocument();
    expect(screen.getByText("TopBarContent")).toBeInTheDocument();
    expect(screen.getByText("LeftPanelContent")).toBeInTheDocument();
    expect(screen.getByText("CanvasAreaContent")).toBeInTheDocument();
    expect(screen.getByText("RightPanelContent")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-dock")).toBeInTheDocument();

    const backdropBtn = screen.getByRole("button", { name: "Close panel" });
    fireEvent.click(backdropBtn);
    expect(mockClose).toHaveBeenCalled();
  });
});
