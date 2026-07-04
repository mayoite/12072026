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
});
