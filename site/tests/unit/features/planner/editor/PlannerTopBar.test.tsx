import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlannerTopBar } from "@/features/planner/editor/PlannerTopBar";

vi.mock("@/features/planner/components/PlannerThemeToggle", () => ({
  PlannerThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

vi.mock("@/features/planner/components/WorkspaceThemeProvider", () => ({
  useTheme: vi.fn().mockReturnValue({ resolvedTheme: "light" }),
}));

vi.mock("@/components/ui/Logo", () => ({
  OneAndOnlyLogo: () => <div data-testid="logo">Logo</div>,
}));

vi.mock("@/features/planner/ui/PlannerSaveIndicator", () => ({
  PlannerSaveIndicator: () => <div data-testid="save-indicator">Save Indicator</div>,
}));

vi.mock("@/features/planner/editor/PlannerStepBar", () => ({
  PlannerStepBar: () => <div data-testid="step-bar">Step Bar</div>,
}));

describe("PlannerTopBar", () => {
  it("renders elements correctly and opens menu", () => {
    const mockOpenTemplates = vi.fn();
    render(
      <PlannerTopBar
        guestMode={true}
        planName="My Awesome Plan"
        plannerStep="draw"
        disabledSteps={{}}
        onPlannerStepChange={vi.fn()}
        saveStatus="saved"
        lastSavedAt={null}
        onRetrySave={vi.fn()}
        onOpenSession={vi.fn()}
        onSaveDraft={vi.fn()}
        onImport={vi.fn()}
        onOpenTemplates={mockOpenTemplates}
        onOpenAi={vi.fn()}
      />
    );

    expect(screen.getAllByText("My Awesome Plan").length).toBeGreaterThan(0);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("step-bar")).toBeInTheDocument();
    expect(screen.getByTestId("save-indicator")).toBeInTheDocument();

    const templatesBtn = screen.getByRole("button", { name: "Open layout templates" });
    fireEvent.click(templatesBtn);
    expect(mockOpenTemplates).toHaveBeenCalled();
  });
});
