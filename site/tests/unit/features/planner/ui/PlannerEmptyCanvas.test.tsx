import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlannerEmptyCanvas } from "@/features/planner/ui/PlannerEmptyCanvas";

describe("PlannerEmptyCanvas", () => {
  afterEach(() => cleanup());

  it("renders ≤3 primary actions (upload, walls, template) without AI CTA", () => {
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
    fireEvent.click(screen.getByRole("button", { name: /Upload reference/i }));
    expect(onDrawWalls).toHaveBeenCalled();
    expect(onOpenTemplates).toHaveBeenCalled();
    expect(onUploadFloorPlan).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /Quick layout/i })).toBeNull();
    expect(onQuickLayout).not.toHaveBeenCalled();
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
