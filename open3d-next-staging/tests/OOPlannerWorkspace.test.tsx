import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../src/canvas-fabric/FeasibilityCanvas", () => ({
  FeasibilityCanvas: () => React.createElement("div", { "data-testid": "feasibility-canvas" }),
}));

import { OOPlannerWorkspace } from "../src/editor/OOPlannerWorkspace";

describe("OOPlannerWorkspace", () => {
  it("shows the route heading for guests", () => {
    render(<OOPlannerWorkspace guestMode planId="P-14" />);

    expect(screen.getByRole("heading", { name: "OOPlanner P-14" })).toBeInTheDocument();
    expect(screen.getByText(/Guest route/i)).toBeInTheDocument();
    expect(screen.getByText(/hidden feasibility slice/i)).toBeInTheDocument();
    expect(screen.getByTestId("feasibility-canvas")).toBeInTheDocument();
  });
});
