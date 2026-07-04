import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlannerWorkflowPanel } from "@/features/planner/editor/PlannerWorkflowPanel";
import { runPlannerComplianceCheck } from "@/features/planner/lib/compliance";

vi.mock("@/features/planner/editor/plannerStep", () => ({
  evaluatePlannerStepGates: vi.fn().mockReturnValue({
    hasSpaceShell: true,
    hasFurniture: true,
    hasMeasurement: true,
    measurementCount: 1,
    canOpenExport: true,
  }),
  getPlannerStepHint: vi.fn().mockReturnValue("Hint text here"),
  getPlannerStepActionLabel: vi.fn().mockReturnValue("Next Step Action"),
  canAdvancePlannerStep: vi.fn().mockReturnValue(true),
  previousPlannerStep: vi.fn().mockReturnValue("draw"),
  nextPlannerStep: vi.fn().mockReturnValue("review"),
  PLANNER_STEP_LABELS: { draw: "Draw", place: "Place", review: "Review" },
}));

vi.mock("@/features/planner/lib/compliance", () => ({
  runPlannerComplianceCheck: vi.fn(),
}));

describe("PlannerWorkflowPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const metrics = {
    shapeCount: 5,
    roomAreaSqm: 20,
    zoneAreaSqm: 0,
    wallCount: 4,
    furnitureCount: 3,
    calibrated: false,
  };

  it("renders clear state when compliance check is clean", () => {
    vi.mocked(runPlannerComplianceCheck).mockReturnValue([]);

    render(
      <PlannerWorkflowPanel
        metrics={metrics}
        step="place"
        onStepChange={vi.fn()}
        onOpenExport={vi.fn()}
      />
    );

    expect(screen.getByText("Clear")).toBeInTheDocument();
    expect(screen.getByText("No overlap or clearance issues detected.")).toBeInTheDocument();
  });

  it("renders warning states when compliance check has violations", () => {
    vi.mocked(runPlannerComplianceCheck).mockReturnValue([
      "CRITICAL: Furniture overlaps",
      "COMPLIANCE WARNING: Clearance narrow",
    ]);

    render(
      <PlannerWorkflowPanel
        metrics={metrics}
        step="place"
        onStepChange={vi.fn()}
        onOpenExport={vi.fn()}
      />
    );

    expect(screen.getByText("1 critical")).toBeInTheDocument();
    expect(screen.getByText("Furniture overlaps")).toBeInTheDocument();
    expect(screen.getByText("Clearance narrow")).toBeInTheDocument();
  });

  it("invokes export when primary action is pressed on review", () => {
    vi.mocked(runPlannerComplianceCheck).mockReturnValue([]);
    const onOpenExport = vi.fn();
    const onStepChange = vi.fn();

    render(
      <PlannerWorkflowPanel
        metrics={metrics}
        step="review"
        onStepChange={onStepChange}
        onOpenExport={onOpenExport}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Next Step Action" }));

    expect(onOpenExport).toHaveBeenCalledTimes(1);
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("goes back to the previous step when back is clicked", () => {
    vi.mocked(runPlannerComplianceCheck).mockReturnValue([]);
    const onStepChange = vi.fn();

    render(
      <PlannerWorkflowPanel
        metrics={metrics}
        step="place"
        onStepChange={onStepChange}
        onOpenExport={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Back to Draw" }));

    expect(onStepChange).toHaveBeenCalledWith("draw");
  });
});
