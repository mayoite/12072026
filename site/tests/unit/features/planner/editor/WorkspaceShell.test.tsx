import { describe, expect, it, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { WorkspaceShell } from "@/features/planner/editor/WorkspaceShell";

afterEach(() => cleanup());

describe("WorkspaceShell", () => {
  it("renders project name and children canvas region", () => {
    render(
      <WorkspaceShell
        projectName="Shell Plan"
        leftPanel={<div data-testid="left">left</div>}
        rightPanel={<div data-testid="right">right</div>}
      >
        <div data-testid="canvas">canvas</div>
      </WorkspaceShell>,
    );
    expect(document.body.textContent).toMatch(/Shell Plan/);
    expect(screen.getByTestId("canvas")).toHaveTextContent("canvas");
  });
});
