import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlannerLeftPanel } from "@/features/planner/editor/PlannerLeftPanel";

vi.mock("@/features/planner/ai/AIAssistDrawer", () => ({
  AIAssistDrawer: () => <div data-testid="ai-assist-drawer">AI Assist Drawer</div>,
}));

vi.mock("@/features/planner/catalog/CatalogPanel", () => ({
  CatalogPanel: () => <div data-testid="catalog-panel">Catalog Panel</div>,
}));

vi.mock("@/features/planner/editor/usePlannerPanels", () => ({
  getStepLeftEmphasis: vi.fn().mockReturnValue(true),
}));

vi.mock("./plannerStepBindings", () => ({
  getStepLeftTab: vi.fn().mockReturnValue("library"),
}));

describe("PlannerLeftPanel", () => {
  it("renders correctly with active tabs", () => {
    render(
      <PlannerLeftPanel
        guestMode={false}
        onItemClick={vi.fn()}
        onDragStart={vi.fn()}
      />
    );

    // Default active tab is 'library'
    expect(screen.getByTestId("catalog-panel")).toBeInTheDocument();
    expect(screen.queryByTestId("ai-assist-drawer")).toBeNull();

    // Click on AI Assist tab
    const aiTab = screen.getByRole("tab", { name: "AI Assist" });
    fireEvent.click(aiTab);

    expect(screen.getByTestId("ai-assist-drawer")).toBeInTheDocument();
    expect(screen.queryByTestId("catalog-panel")).toBeNull();
  });
});
