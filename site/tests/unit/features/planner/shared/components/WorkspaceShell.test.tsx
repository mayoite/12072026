import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { WorkspaceShell, WorkspaceSplitPane, WorkspaceShell, WorkspaceSplitPane } from "@/features/planner/shared/components/WorkspaceShell";

describe("WorkspaceShell", () => {
  it("should render component WorkspaceShell", () => {
    // Basic test
    const { container } = render(React.createElement(WorkspaceShell, {} as any));
    expect(container).toBeDefined();
  });
  it("should render component WorkspaceSplitPane", () => {
    // Basic test
    const { container } = render(React.createElement(WorkspaceSplitPane, {} as any));
    expect(container).toBeDefined();
  });
  it("should have function WorkspaceShell defined", () => {
    expect(WorkspaceShell).toBeTypeOf("function");
  });
  it("should have function WorkspaceSplitPane defined", () => {
    expect(WorkspaceSplitPane).toBeTypeOf("function");
  });
});