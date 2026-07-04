import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import PlannerWorkspaceLayout, { metadata } from "@/app/planner/(workspace)/layout";

describe("PlannerWorkspaceLayout", () => {
  it("exports correct metadata", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Planner Workspace | One&Only");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("renders children directly", () => {
    const children = <div data-testid="workspace-child">Workspace child content</div>;
    render(<PlannerWorkspaceLayout>{children}</PlannerWorkspaceLayout>);

    expect(screen.getByTestId("workspace-child")).toBeInTheDocument();
    expect(screen.getByText("Workspace child content")).toBeInTheDocument();
  });
});
