import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlannerEmptyCanvas } from "@/features/planner/ui/PlannerEmptyCanvas";

describe("PlannerEmptyCanvas", () => {
  afterEach(() => cleanup());

  it("renders guidance and action buttons", () => {
    const onDrawWalls = vi.fn();
    const onOpenTemplates = vi.fn();
    const onQuickLayout = vi.fn();
    const onUploadFloorPlan = vi.fn();
    render(
      <PlannerEmptyCanvas
        onDrawWalls={onDrawWalls}
        onOpenTemplates={onOpenTemplates}
        onQuickLayout={onQuickLayout}
        onUploadFloorPlan={onUploadFloorPlan}
      />,
    );
    expect(screen.getByLabelText("Empty canvas guidance")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: /Draw walls/i }));
    fireEvent.click(screen.getByRole("button", { name: /Use template/i }));
    fireEvent.click(screen.getByRole("button", { name: /Quick layout/i }));
    fireEvent.click(screen.getByRole("button", { name: /Upload reference image/i }));
    expect(onDrawWalls).toHaveBeenCalled();
    expect(onOpenTemplates).toHaveBeenCalled();
    expect(onQuickLayout).toHaveBeenCalled();
    expect(onUploadFloorPlan).toHaveBeenCalled();
  });

  it("shows guest kicker when guestMode", () => {
    render(
      <PlannerEmptyCanvas
        guestMode
        onDrawWalls={vi.fn()}
        onOpenTemplates={vi.fn()}
      />,
    );
    expect(screen.getByText(/Guest session/i)).toBeDefined();
  });
});
