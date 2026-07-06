import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hooks = vi.hoisted(() => ({
  useDockingSystem: vi.fn(),
  useWorkspaceCanvas: vi.fn(),
}));

vi.mock("../src/editor/useDockingSystem", () => ({
  useDockingSystem: hooks.useDockingSystem,
}));

vi.mock("../src/editor/useWorkspaceCanvas", () => ({
  useWorkspaceCanvas: hooks.useWorkspaceCanvas,
}));

import { WorkspaceShell } from "../src/editor/WorkspaceShell";

const dock = vi.fn();
const undock = vi.fn();
const toggleCollapse = vi.fn();
const move = vi.fn();
const resize = vi.fn();
const reset = vi.fn();
const saveLayout = vi.fn();
const restoreLayout = vi.fn();
const setActivePanel = vi.fn();
const setFocusedPanel = vi.fn();

const basePanels = {
  left: { id: "left", state: "docked", width: 310, height: 0, x: 0, y: 0, zIndex: 55 },
  right: { id: "right", state: "docked", width: 290, height: 0, x: 0, y: 0, zIndex: 55 },
  bottom: { id: "bottom", state: "docked", width: 0, height: 200, x: 0, y: 0, zIndex: 55 },
};

function mockDockingSystem(overrides: Record<string, unknown> = {}) {
  const { panels: overridePanels, ...restOverrides } = overrides;

  hooks.useDockingSystem.mockReturnValue({
    panels: {
      ...basePanels,
      ...(overridePanels ? (overridePanels as object) : {}),
    },
    activePanel: null,
    focusedPanel: null,
    viewportTier: "desktop",
    dock,
    undock,
    toggleCollapse,
    move,
    resize,
    reset,
    saveLayout,
    restoreLayout,
    setActivePanel,
    setFocusedPanel,
    ...restOverrides,
  } as any);
}

function mockWorkspaceCanvas() {
  hooks.useWorkspaceCanvas.mockReturnValue({
    project: {
      name: "Phase 5 Workspace Demo",
      activeFloorId: "floor-1",
      floors: [
        {
          id: "floor-1",
          walls: [{ id: "wall-1" }],
          doors: [],
          windows: [],
          furniture: [],
          rooms: [],
        },
      ],
    },
    activeFloor: {
      id: "floor-1",
      walls: [{ id: "wall-1" }],
      doors: [],
      windows: [],
      furniture: [],
      rooms: [],
    },
    history: { past: [], present: null, future: [], dragStart: null },
    selection: { type: "wall", ids: ["wall-1"] },
    canUndo: false,
    canRedo: false,
    dispatch: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    setSelection: vi.fn(),
    updateProject: vi.fn(),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockDockingSystem();
  mockWorkspaceCanvas();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("WorkspaceShell", () => {
  it("renders the shell chrome and wires panel callbacks", () => {
    mockDockingSystem({
      panels: {
        left: { id: "left", state: "floating", width: 340, height: 240, x: 80, y: 120, zIndex: 70 },
        right: { id: "right", state: "docked", width: 290, height: 0, x: 0, y: 0, zIndex: 55 },
        bottom: { id: "bottom", state: "docked", width: 0, height: 180, x: 0, y: 0, zIndex: 55 },
      },
      activePanel: "right",
      focusedPanel: "left",
      viewportTier: "tablet",
    });

    const onViewModeChange = vi.fn();
    const { container } = render(
      <WorkspaceShell
        projectName="Phase 5 Workspace Demo"
        initialViewMode="3d"
        floors={[{ id: "floor-1", name: "Ground Floor" }]}
        activeFloorId="floor-1"
        isSynced
        leftPanel={<div>Inventory content</div>}
        rightPanel={<div>Properties content</div>}
        bottomPanel={<div>Bottom content</div>}
        statusLeft={<span>Syncing</span>}
        statusRight={<span>Custom status</span>}
        initialProject={{ name: "Seed project" } as any}
        enableCanvasIntegration
        onViewModeChange={onViewModeChange}
      >
        <div>Main canvas</div>
      </WorkspaceShell>,
    );

    expect(container.firstElementChild).toHaveAttribute("data-viewport", "tablet");
    expect(container.firstElementChild).toHaveAttribute("data-panel-active", "right");
    expect(screen.getByRole("heading", { name: "Phase 5 Workspace Demo" })).toBeInTheDocument();
    expect(screen.getByText("Inventory content")).toBeInTheDocument();
    expect(screen.getByText("Properties content")).toBeInTheDocument();
    expect(screen.getByText("Bottom content")).toBeInTheDocument();
    expect(screen.getByText("Main canvas")).toBeInTheDocument();
    expect(screen.getByText("Syncing")).toBeInTheDocument();
    expect(screen.getByText("Custom status")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "2D" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radio", { name: "3D" })).toHaveAttribute("aria-checked", "true");

    fireEvent.click(screen.getByRole("radio", { name: "2D" }));
    expect(onViewModeChange).toHaveBeenCalledWith("2d");

    const inventoryPanel = screen.getByRole("region", { name: "Inventory panel" });
    fireEvent.click(within(inventoryPanel).getByRole("button", { name: "Dock panel" }));
    expect(dock).toHaveBeenCalledWith("left");

    const propertiesPanel = screen.getByRole("region", { name: "Properties panel" });
    fireEvent.click(within(propertiesPanel).getByRole("button", { name: "Minimize panel" }));
    expect(toggleCollapse).toHaveBeenCalledWith("right");

    const outputPanel = screen.getByRole("region", { name: "Output panel" });
    fireEvent.click(within(outputPanel).getByRole("button", { name: "Close panel" }));
    expect(toggleCollapse).toHaveBeenCalledWith("bottom");

    fireEvent.click(within(propertiesPanel).getByRole("button", { name: "Undock panel" }));
    expect(undock).toHaveBeenCalledWith("right");
  });

  it("moves focus forward and backward across docked panels", () => {
    mockDockingSystem({
      panels: {
        left: { id: "left", state: "docked", width: 310, height: 0, x: 0, y: 0, zIndex: 55 },
        right: { id: "right", state: "docked", width: 290, height: 0, x: 0, y: 0, zIndex: 55 },
        bottom: { id: "bottom", state: "docked", width: 0, height: 200, x: 0, y: 0, zIndex: 55 },
      },
      focusedPanel: "left",
      viewportTier: "small",
    });

    const renderResult = render(
      <WorkspaceShell
        projectName="Phase 5 Workspace Demo"
        floors={[{ id: "floor-1", name: "Ground Floor" }]}
        activeFloorId="floor-1"
        leftPanel={<div>Inventory content</div>}
        rightPanel={<div>Properties content</div>}
      >
        <div>Main canvas</div>
      </WorkspaceShell>,
    );

    expect(screen.getAllByText("Ready")).toHaveLength(2);
    expect(screen.getByText("Mobile view")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Tab" });
    expect(setFocusedPanel).toHaveBeenCalledWith("right");

    mockDockingSystem({
      panels: {
        left: { id: "left", state: "docked", width: 310, height: 0, x: 0, y: 0, zIndex: 55 },
        right: { id: "right", state: "docked", width: 290, height: 0, x: 0, y: 0, zIndex: 55 },
        bottom: { id: "bottom", state: "docked", width: 0, height: 200, x: 0, y: 0, zIndex: 55 },
      },
      focusedPanel: "right",
      viewportTier: "small",
    });

    renderResult.rerender(
      <WorkspaceShell
        projectName="Phase 5 Workspace Demo"
        floors={[{ id: "floor-1", name: "Ground Floor" }]}
        activeFloorId="floor-1"
        leftPanel={<div>Inventory content</div>}
        rightPanel={<div>Properties content</div>}
      >
        <div>Main canvas</div>
      </WorkspaceShell>,
    );

    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(setFocusedPanel).toHaveBeenCalledWith("left");
  });

  it("auto-saves the docking layout after the debounce period", () => {
    vi.useFakeTimers();

    render(
      <WorkspaceShell
        projectName="Phase 5 Workspace Demo"
        floors={[{ id: "floor-1", name: "Ground Floor" }]}
        activeFloorId="floor-1"
        leftPanel={<div>Inventory content</div>}
      >
        <div>Main canvas</div>
      </WorkspaceShell>,
    );

    expect(saveLayout).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(saveLayout).toHaveBeenCalledTimes(1);
  });
});
