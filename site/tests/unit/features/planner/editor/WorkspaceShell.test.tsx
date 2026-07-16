import { describe, expect, it, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
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

  it("left panel title is Inventory (aligned with TopBar toggle)", () => {
    render(
      <WorkspaceShell
        projectName="Named panels"
        leftPanel={<div>library body</div>}
        rightPanel={<div>props body</div>}
      >
        <div>canvas</div>
      </WorkspaceShell>,
    );

    // contentOnly left panel keeps compact dock chrome; region labeled Inventory
    const inventory = screen.getByRole("region", { name: "Inventory panel" });
    expect(inventory).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Properties panel" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Properties", level: 2 })).toBeInTheDocument();
    expect(within(inventory).getByRole("button", { name: "Undock panel" })).toBeInTheDocument();
  });

  it("status bar uses customer-facing quote language, not internal BOQ jargon", () => {
    render(
      <WorkspaceShell
        projectName="Metrics shell"
        planMetrics={{
          objects: 3,
          walls: 2,
          furniture: 1,
          workstationSeats: 0,
          floorLabel: "Ground",
          boqReady: true,
          validationErrors: 0,
        }}
      >
        <div>canvas</div>
      </WorkspaceShell>,
    );

    expect(screen.getByText("Quote ready")).toBeInTheDocument();
    expect(screen.queryByText(/BOQ/i)).not.toBeInTheDocument();
    expect(screen.getByText("Ground")).toBeInTheDocument();
  });

  it("floating panel is distinct from docked (Floating badge + data-state)", () => {
    render(
      <WorkspaceShell
        projectName="Float shell"
        rightPanel={<div>props</div>}
      >
        <div>canvas</div>
      </WorkspaceShell>,
    );

    const properties = screen.getByRole("region", { name: "Properties panel" });
    expect(properties).toHaveAttribute("data-state", "docked");
    fireEvent.click(within(properties).getByRole("button", { name: "Undock panel" }));

    const floating = screen.getByRole("region", { name: "Properties panel" });
    expect(floating).toHaveAttribute("data-state", "floating");
    expect(floating).toHaveAttribute("data-floating", "true");
    expect(within(floating).getByText("Floating")).toBeInTheDocument();
  });
});
