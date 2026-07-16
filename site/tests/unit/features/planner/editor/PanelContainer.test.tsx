import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PanelContainer } from "@/features/planner/editor/PanelContainer";

describe("PanelContainer", () => {
  it("renders title and children when open and docked", () => {
    render(
      <PanelContainer
        id="left"
        title="Left panel"
        state="docked"
        width={280}
        height={600}
        x={0}
        y={0}
        zIndex={1}
        isOpen
      >
        <div>panel-body</div>
      </PanelContainer>,
    );
    expect(screen.getByText("Left panel")).toBeDefined();
    expect(screen.getByText("panel-body")).toBeDefined();
  });

  it("shows compact chrome when contentOnly", () => {
    render(
      <PanelContainer
        id="left"
        title="Inventory"
        state="docked"
        width={280}
        height={600}
        x={0}
        y={0}
        zIndex={1}
        isOpen
        contentOnly
      >
        <div>tabs-own-header</div>
      </PanelContainer>,
    );
    expect(screen.getByTestId("panel-grip-left")).toBeDefined();
    expect(screen.getByText("Inventory")).toBeDefined();
    expect(screen.queryByRole("heading", { name: "Inventory" })).toBeNull();
  });

  it("exposes undock control when docked", () => {
    const onUndock = vi.fn();
    render(
      <PanelContainer
        id="left"
        title="Inventory"
        state="docked"
        width={280}
        height={600}
        x={0}
        y={0}
        zIndex={1}
        isOpen
        onUndock={onUndock}
        contentOnly
      >
        <div>body</div>
      </PanelContainer>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Undock panel" }));
    expect(onUndock).toHaveBeenCalledTimes(1);
  });

  it("exposes dock control when floating", () => {
    const onDock = vi.fn();
    render(
      <PanelContainer
        id="left"
        title="Inventory"
        state="floating"
        width={280}
        height={600}
        x={40}
        y={40}
        zIndex={5}
        isOpen
        onDock={onDock}
      >
        <div>body</div>
      </PanelContainer>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Dock panel" }));
    expect(onDock).toHaveBeenCalledTimes(1);
  });
});
