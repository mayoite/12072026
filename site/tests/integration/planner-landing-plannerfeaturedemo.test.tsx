import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PlannerFeatureDemo } from "@/features/planner/landing/PlannerFeatureDemo";

describe("PlannerFeatureDemo", () => {
  it("renders measure demo with layout preview", () => {
    render(<PlannerFeatureDemo slug="measure" />);
    expect(screen.getByText("Layout preview")).toBeInTheDocument();
    expect(document.querySelector("svg")).not.toBeNull();
  });

  it("renders catalog demo with layout preview", () => {
    render(<PlannerFeatureDemo slug="catalog" />);
    expect(screen.getByText("Layout preview")).toBeInTheDocument();
    expect(document.querySelector("svg")).not.toBeNull();
  });
});
