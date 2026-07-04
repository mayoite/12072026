import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { PlannerLayoutGraphic } from "@/features/planner/landing/PlannerLayoutGraphic";

describe("PlannerLayoutGraphic", () => {
  it("should render component PlannerLayoutGraphic", () => {
    // Basic test
    const { container } = render(React.createElement(PlannerLayoutGraphic));
    expect(container).toBeDefined();
  });
  it("should have function PlannerLayoutGraphic defined", () => {
    expect(PlannerLayoutGraphic).toBeTypeOf("function");
  });
});
