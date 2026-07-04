import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { PlannerSessionDialog } from "@/features/planner/ui/PlannerSessionDialog";

// Mock radix dialog
vi.mock("@radix-ui/react-dialog", () => {
  return {
    Root: ({ children, open }: any) => <div data-testid="dialog-root" data-open={open}>{children}</div>,
    Trigger: ({ children }: any) => <div data-testid="dialog-trigger">{children}</div>,
    Portal: ({ children }: any) => <div data-testid="dialog-portal">{children}</div>,
    Overlay: ({ className }: any) => <div className={className} data-testid="dialog-overlay" />,
    Content: ({ children, className }: any) => <div className={className} data-testid="dialog-content">{children}</div>,
    Title: ({ children, className }: any) => <h3 className={className}>{children}</h3>,
    Description: ({ children, className }: any) => <p className={className}>{children}</p>,
    Close: ({ children }: any) => <div data-testid="dialog-close">{children}</div>,
  };
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
