import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkspaceLeftPanel } from "@/features/planner/editor/WorkspaceLeftPanel";

vi.mock("@/features/planner/editor/InventoryPanel", () => ({
  InventoryPanel: () => <div data-testid="inventory">inventory</div>,
}));

describe("WorkspaceLeftPanel", () => {
  it("renders inventory panel (library chrome lives on the inventory surface)", () => {
    render(
      <WorkspaceLeftPanel
        catalogItems={[]}
        isLoading={false}
        catalogStatus="ready"
        onItemPlace={vi.fn()}
        onWorkstationConfigPlace={vi.fn()}
        onWorkstationConfigBatchPlace={vi.fn()}
      />,
    );
    expect(screen.getByTestId("inventory")).toBeInTheDocument();
    expect(screen.getByText("inventory")).toBeInTheDocument();
  });
});
