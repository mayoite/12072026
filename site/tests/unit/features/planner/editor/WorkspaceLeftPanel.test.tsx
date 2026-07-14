import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkspaceLeftPanel } from "@/features/planner/editor/WorkspaceLeftPanel";

vi.mock("@/features/planner/editor/InventoryPanel", () => ({
  InventoryPanel: () => <div data-testid="inventory">inventory</div>,
}));
vi.mock("@/features/planner/ai/AIAssistDrawer", () => ({
  AIAssistDrawer: () => <div data-testid="ai-assist">ai</div>,
}));

describe("WorkspaceLeftPanel", () => {
  it("renders library tab chrome", () => {
    render(
      <WorkspaceLeftPanel
        catalogItems={[]}
        isLoading={false}
        catalogStatus="ready"
        onItemPlace={vi.fn()}
        onWorkstationConfigPlace={vi.fn()}
        onWorkstationConfigBatchPlace={vi.fn()}
        workspaceBridge={
          {
            getProjectSnapshot: () => null,
            applyLayout: vi.fn(),
          } as never
        }
      />,
    );
    expect(screen.getByRole("tablist", { name: /left panel/i })).toBeDefined();
    expect(document.body.textContent).toMatch(/Library|AI/i);
  });
});
