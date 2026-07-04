import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PanelContainer } from "../src/editor/PanelContainer";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PanelContainer", () => {
  it("renders docked and floating controls and closes on Escape", () => {
    const onUndock = vi.fn();
    const onDock = vi.fn();
    const onMinimize = vi.fn();
    const onClose = vi.fn();

    const view = render(
      <PanelContainer
        id="left"
        title="Inventory"
        state="docked"
        width={310}
        height={0}
        x={0}
        y={0}
        zIndex={55}
        isOpen
        onUndock={onUndock}
        onMinimize={onMinimize}
        onClose={onClose}
      >
        <div>Panel body</div>
      </PanelContainer>,
    );

    const region = screen.getByRole("region", { name: "Inventory panel" });
    expect(screen.getByText("Panel body")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Undock panel" }));
    expect(onUndock).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(region, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);

    view.rerender(
      <PanelContainer
        id="left"
        title="Inventory"
        state="floating"
        width={310}
        height={240}
        x={40}
        y={60}
        zIndex={100}
        isOpen
        onDock={onDock}
        onMinimize={onMinimize}
        onClose={onClose}
      >
        <div>Panel body</div>
      </PanelContainer>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Dock panel" }));
    expect(onDock).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: "Undock panel" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Minimize panel" }));
    expect(onMinimize).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Close panel" })).toBeInTheDocument();
  });

  it("moves and resizes floating panels", () => {
    const onMove = vi.fn();
    const onResize = vi.fn();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 300,
      bottom: 200,
      width: 300,
      height: 200,
      toJSON: () => ({}),
    } as DOMRect);

    render(
      <PanelContainer
        id="right"
        title="Properties"
        state="floating"
        width={300}
        height={200}
        x={100}
        y={100}
        zIndex={100}
        isOpen
        onDock={vi.fn()}
        onMove={onMove}
        onResize={onResize}
      >
        <div>Floating body</div>
      </PanelContainer>,
    );

    expect(screen.getByRole("button", { name: "Dock panel" })).toBeInTheDocument();
    expect(screen.getAllByRole("separator", { name: "Resize panel width" })).toHaveLength(2);
    expect(screen.getAllByRole("separator", { name: "Resize panel height" })).toHaveLength(2);

    const title = screen.getByRole("heading", { name: "Properties" });
    fireEvent.mouseDown(title.parentElement as HTMLElement, {
      clientX: 100,
      clientY: 100,
    });
    fireEvent.mouseMove(document, {
      clientX: 140,
      clientY: 165,
    });
    fireEvent.mouseUp(document);
    expect(onMove).toHaveBeenCalledWith(140, 165);

    const widthHandles = screen.getAllByRole("separator", { name: "Resize panel width" });
    fireEvent.mouseDown(widthHandles[0], {
      clientX: 300,
      clientY: 100,
    });
    fireEvent.mouseMove(document, {
      clientX: 340,
      clientY: 100,
    });
    fireEvent.mouseUp(document);
    expect(onResize).toHaveBeenCalledWith(340, 200);
  });
});
