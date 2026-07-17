import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import { PlannerSkeleton } from "@/features/planner/ui/PlannerSkeleton";

describe("PlannerSkeleton", () => {
  it("renders with shimmer elements", () => {
    render(<PlannerSkeleton />);
    expect(screen.getByLabelText("Loading planner...")).toBeDefined();
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("reserves denser paper shell chrome (top + workflow + status, no save claim)", () => {
    const { container } = render(<PlannerSkeleton />);
    const root = container.querySelector(".planner-skeleton");
    expect(root).not.toBeNull();
    expect(root).toHaveAttribute("data-planner-surface", "paper");
    expect(root).toHaveAttribute("data-planner-density", "compact");
    expect(root).toHaveAttribute("data-chrome-mode", "slim");
    expect(screen.getByText("Loading workspace…")).toBeInTheDocument();
    // Status strip placeholder marks TopBar as sole save authority.
    expect(container.querySelector("[data-save-authority='topbar']")).not.toBeNull();
    expect(container.textContent).not.toMatch(/Saved|Ready \(local\)|Unsaved/i);
  });
});
