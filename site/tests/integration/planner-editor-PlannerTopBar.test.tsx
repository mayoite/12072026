import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PlannerTopBar } from "@/features/planner/editor/PlannerTopBar";

vi.mock("@/components/ui/Logo", () => ({
  OneAndOnlyLogo: () => <span data-testid="logo" />,
}));

describe("PlannerTopBar", () => {
  const baseProps = {
    guestMode: false,
    planName: "HQ Layout",
    plannerStep: "draw" as const,
    disabledSteps: {},
    onPlannerStepChange: vi.fn(),
    saveStatus: "saved" as const,
    lastSavedAt: "2026-06-15T10:00:00.000Z",
    onRetrySave: vi.fn(),
    onOpenSession: vi.fn(),
    onSaveDraft: vi.fn(),
    onImport: vi.fn(),
    onOpenTemplates: vi.fn(),
    onOpenAi: vi.fn(),
  };

  it("renders brand, workflow steps, and session actions", () => {
    render(<PlannerTopBar {...baseProps} />);
    expect(screen.getAllByText("HQ Layout").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /Place/i }));
    expect(baseProps.onPlannerStepChange).toHaveBeenCalledWith("place");
    fireEvent.click(screen.getByRole("button", { name: "Save local draft" }));
    expect(baseProps.onSaveDraft).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Import planner JSON" }));
    expect(baseProps.onImport).toHaveBeenCalled();
  });

  it("opens overflow menu actions", () => {
    render(<PlannerTopBar {...baseProps} guestMode />);
    const moreActionsButtons = screen.getAllByRole("button", { name: "More actions" });
    fireEvent.click(moreActionsButtons[moreActionsButtons.length - 1]);
    fireEvent.click(screen.getAllByRole("menuitem", { name: "Templates" })[0]);
    expect(baseProps.onOpenTemplates).toHaveBeenCalled();
    fireEvent.click(moreActionsButtons[moreActionsButtons.length - 1]);
    fireEvent.click(screen.getAllByRole("menuitem", { name: "AI advisor" })[0]);
    expect(baseProps.onOpenAi).toHaveBeenCalled();
  });

  it("opens sessions and closes menu on outside click", () => {
    const onOpenSession = vi.fn();
    render(
      <PlannerTopBar
        {...baseProps}
        onOpenSession={onOpenSession}
      />,
    );

    const moreActionsButtons = screen.getAllByRole("button", { name: "More actions" });
    fireEvent.click(moreActionsButtons[moreActionsButtons.length - 1]);
    fireEvent.click(screen.getByRole("menuitem", { name: "Plan sessions" }));
    expect(onOpenSession).toHaveBeenCalled();

    fireEvent.click(moreActionsButtons[moreActionsButtons.length - 1]);
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("menuitem", { name: "Plan sessions" })).not.toBeInTheDocument();
  });

  it("shows fallback title when plan name is blank", () => {
    render(<PlannerTopBar {...baseProps} planName="   " />);
    expect(screen.getAllByText("Workspace Planner").length).toBeGreaterThan(0);
  });
});
