import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { PlannerSessionDialog } from "@/features/planner/ui/PlannerSessionDialog";

vi.mock("@ark-ui/react/dialog", () => {
  const Dialog = {
    Root: ({ children, open }: { children: React.ReactNode; open?: boolean }) => (
      <div data-testid="dialog-root" data-open={open}>{children}</div>
    ),
    Backdrop: ({ className }: { className?: string }) => (
      <div className={className} data-testid="dialog-backdrop" />
    ),
    Positioner: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-positioner">{children}</div>
    ),
    Content: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className} data-testid="dialog-content">{children}</div>
    ),
    Title: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <h3 className={className}>{children}</h3>
    ),
    Description: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <p className={className}>{children}</p>
    ),
    CloseTrigger: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-close">{children}</div>
    ),
  };
  return { Dialog };
});

describe("PlannerSessionDialog", () => {
  const onSaveCloud = vi.fn();
  const onSaveDraft = vi.fn();
  const onPlanNameChange = vi.fn();
  const onLoadPlan = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when open", () => {
    render(
      <PlannerSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        planName="My Plan"
        onPlanNameChange={onPlanNameChange}
        plans={[]}
        isAuthenticated={true}
        onSaveCloud={onSaveCloud}
        onSaveDraft={onSaveDraft}
        onLoadPlan={onLoadPlan}
        onImport={vi.fn()}
      />
    );

    expect(screen.getByDisplayValue("My Plan")).toBeInTheDocument();
  });

  it("renders lists of plans correctly", () => {
    const plans = [
      { id: "1", name: "Plan One", source: "local" as const, canDelete: true },
    ];
    render(
      <PlannerSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        planName="My Plan"
        onPlanNameChange={onPlanNameChange}
        plans={plans}
        isAuthenticated={true}
        onSaveCloud={onSaveCloud}
        onSaveDraft={onSaveDraft}
        onLoadPlan={onLoadPlan}
        onImport={vi.fn()}
      />
    );

    expect(screen.getByText("Plan One")).toBeDefined();
  });
});
