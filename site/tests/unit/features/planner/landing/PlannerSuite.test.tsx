import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { PlannerSuite } from "@/features/planner/landing/PlannerSuite";

describe("PlannerSuite", () => {
  it("should render component PlannerSuite", () => {
    // Basic test
    const { container } = render(React.createElement(PlannerSuite));
    expect(container).toBeDefined();
  });
  it("should have function PlannerSuite defined", () => {
    expect(PlannerSuite).toBeTypeOf("function");
  });
});
