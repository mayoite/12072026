import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { WorkspaceShell } from "@/features/planner/open3d/editor/WorkspaceShell";
import { TopBar } from "@/features/planner/open3d/editor/TopBar";
import { PanelContainer } from "@/features/planner/open3d/editor/PanelContainer";
import { InventoryPanel } from "@/features/planner/open3d/editor/InventoryPanel";
import { PropertiesPanel } from "@/features/planner/open3d/editor/PropertiesPanel";
import {
  useWorkspaceCanvas,
  useCanvasDrawing,
} from "@/features/planner/open3d/editor/useWorkspaceCanvas";
import { useDockingSystem } from "@/features/planner/open3d/editor/useDockingSystem";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import type { Open3dWall } from "@/features/planner/open3d/model/types";

describe("useWorkspaceCanvas", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("creates a project, dispatches actions, and supports undo/redo", () => {
    const { result } = renderHook(() => useWorkspaceCanvas({ projectName: "Canvas Test" }));

    expect(result.current.project.name).toBe("Canvas Test");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.selection).toEqual({ type: "none", ids: [] });

    const wall: Open3dWall = {
      id: "wall-test",
      start: { x: 0, y: 0 },
      end: { x: 2000, y: 0 },
      thickness: 120,
      height: 2400,
      color: "#333",
    };

    act(() => {
      result.current.dispatch({ type: "add", collection: "walls", entity: wall });
    });

    expect(result.current.activeFloor.walls).toHaveLength(1);
    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.undo();
    });
    expect(result.current.activeFloor.walls).toHaveLength(0);
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.redo();
    });
    expect(result.current.activeFloor.walls).toHaveLength(1);
  });

  it("updates selection and applies direct project updates", () => {
    const initial = createOpen3dProject({ name: "Direct Update" });
    const { result } = renderHook(() => useWorkspaceCanvas({ initialProject: initial }));

    act(() => {
      result.current.setSelection({ type: "wall", ids: ["missing"] });
    });
    expect(result.current.selection.type).toBe("wall");

    act(() => {
      result.current.updateProject((project) => ({
        ...project,
        name: "Renamed",
      }));
    });
    expect(result.current.project.name).toBe("Renamed");
    expect(result.current.canUndo).toBe(true);
  });
});

describe("useCanvasDrawing", () => {
  beforeEach(() => {
    document.documentElement.style.setProperty("--text-body", "#1a1a1a");
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.documentElement.style.removeProperty("--text-body");
  });

  it("draws a wall when the segment exceeds the minimum length", () => {
    vi.stubGlobal("crypto", { randomUUID: () => "drawn-wall-id" });
    const { result } = renderHook(() => useCanvasDrawing());

    act(() => {
      result.current.startDrawing({ x: 0, y: 0 });
    });
    act(() => {
      result.current.updateDrawing({ x: 500, y: 0 });
    });
    act(() => {
      result.current.commitDrawing();
    });

    expect(result.current.activeFloor.walls).toHaveLength(1);
    expect(result.current.drawingPoint).toBeNull();

    act(() => {
      result.current.startDrawing({ x: 0, y: 0 });
    });
    act(() => {
      result.current.updateDrawing({ x: 2, y: 0 });
    });
    act(() => {
      result.current.commitDrawing();
    });
    expect(result.current.activeFloor.walls).toHaveLength(1);

    act(() => {
      result.current.startDrawing({ x: 0, y: 0 });
    });
    act(() => {
      result.current.cancelDrawing();
    });
    expect(result.current.drawingPoint).toBeNull();
  });
});

describe("useDockingSystem", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("docks, undocks, collapses, moves, resizes, and persists layout", () => {
    const { result } = renderHook(() => useDockingSystem());

    expect(result.current.panels.left.state).toBe("docked");
    expect(result.current.viewportTier).toBeDefined();

    act(() => {
      result.current.undock("left");
    });
    expect(result.current.panels.left.state).toBe("floating");

    act(() => {
      result.current.move("left", 120, 80);
      result.current.resize("left", 360, 420);
    });
    expect(result.current.panels.left.x).toBe(120);

    act(() => {
      result.current.dock("left");
      result.current.toggleCollapse("left");
    });
    expect(result.current.panels.left.state).toBe("collapsed");

    act(() => {
      result.current.toggleCollapse("left");
      result.current.setActivePanel("right");
      result.current.setFocusedPanel("bottom");
      result.current.saveLayout();
    });

    const stored = localStorage.getItem("open3d-workspace-docking");
    expect(stored).toBeTruthy();

    act(() => {
      result.current.reset();
      result.current.restoreLayout();
    });
  });

  it("restores layout from localStorage on mount", () => {
    localStorage.setItem(
      "open3d-workspace-docking",
      JSON.stringify({
        left: { id: "left", state: "floating", width: 400, height: 300, x: 50, y: 50, zIndex: 100 },
      }),
    );

    const { result } = renderHook(() => useDockingSystem());
    expect(result.current.panels.left.state).toBe("floating");
    expect(result.current.panels.left.width).toBe(400);
  });
});

describe("TopBar", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("fires view, unit, export, and import callbacks and shows save status", () => {
    const onViewModeChange = vi.fn();
    const onFloorChange = vi.fn();
    const onDisplayUnitChange = vi.fn();
    const onSave = vi.fn();
    const onExport = vi.fn();
    const onImport = vi.fn();

    render(
      <TopBar
        projectName="Demo Plan"
        isModified
        viewMode="2d"
        floors={[
          { id: "f1", name: "Ground" },
          { id: "f2", name: "Level 1" },
        ]}
        activeFloorId="f1"
        displayUnit="cm"
        onViewModeChange={onViewModeChange}
        onFloorChange={onFloorChange}
        onDisplayUnitChange={onDisplayUnitChange}
        onSave={onSave}
        onExport={onExport}
        onImport={onImport}
      />,
    );

    expect(screen.getByRole("heading", { name: "Demo Plan" })).toBeInTheDocument();
    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "3D" }));
    expect(onViewModeChange).toHaveBeenCalledWith("3d");

    fireEvent.click(screen.getByLabelText("Display unit: cm"));
    fireEvent.click(screen.getByRole("option", { name: "m" }));
    expect(onDisplayUnitChange).toHaveBeenCalledWith("m");

    fireEvent.click(screen.getByRole("button", { name: /Import/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Import from file/i }));
    expect(onImport).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Export as JSON/i }));
    expect(onExport).toHaveBeenCalled();

    expect(screen.getByText(/Modified/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});

describe("PanelContainer", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("handles dock, undock, minimize, close, resize, and focus", () => {
    const onDock = vi.fn();
    const onUndock = vi.fn();
    const onClose = vi.fn();
    const onMinimize = vi.fn();
    const onMove = vi.fn();
    const onResize = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    const { rerender } = render(
      <PanelContainer
        id="left"
        title="Inventory"
        state="floating"
        width={320}
        height={400}
        x={40}
        y={60}
        zIndex={90}
        isOpen
        onDock={onDock}
        onUndock={onUndock}
        onClose={onClose}
        onMinimize={onMinimize}
        onMove={onMove}
        onResize={onResize}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <p>Panel body</p>
      </PanelContainer>,
    );

    const panel = screen.getByRole("region", { name: "Inventory panel" });
    expect(within(panel).getByText("Panel body")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Dock panel"));
    fireEvent.click(screen.getByLabelText("Minimize panel"));
    fireEvent.click(screen.getByLabelText("Close panel"));
    expect(onDock).toHaveBeenCalled();
    expect(onMinimize).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();

    fireEvent.focus(panel);
    fireEvent.blur(panel);
    expect(onFocus).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();

    rerender(
      <PanelContainer
        id="left"
        title="Inventory"
        state="docked"
        width={320}
        height={400}
        x={40}
        y={60}
        zIndex={90}
        isOpen
        onDock={onDock}
        onUndock={onUndock}
        onClose={onClose}
        onMinimize={onMinimize}
        onMove={onMove}
        onResize={onResize}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <p>Panel body</p>
      </PanelContainer>,
    );
    fireEvent.click(screen.getByLabelText("Undock panel"));
    expect(onUndock).toHaveBeenCalled();
  });
});

describe("InventoryPanel", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("searches sample inventory and selects an item", async () => {
    const onItemSelect = vi.fn();
    const onSearch = vi.fn();

    render(<InventoryPanel onItemSelect={onItemSelect} onSearch={onSearch} />);

    const itemOption = await screen.findByRole("option", {
      name: /Executive Standing Desk, 1\.6m/i,
    });
    fireEvent.click(itemOption);
    expect(onItemSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "sample-desk-1" }),
      null,
    );

    const search = screen.getByLabelText("Search inventory");
    fireEvent.change(search, { target: { value: "desk" } });
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith("desk");
    });

    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(search).toHaveValue("");
  });
});

describe("PropertiesPanel", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("shows empty state and wall properties for a selection", () => {
    const { rerender } = render(<PropertiesPanel selectedEntity={null} />);
    expect(screen.getByText(/No selection/i)).toBeInTheDocument();

    rerender(
      <PropertiesPanel
        selectedEntity={{
          collection: "walls",
          id: "wall-1",
          entity: {
            id: "wall-1",
            start: { x: 0, y: 0 },
            end: { x: 3000, y: 0 },
            thickness: 120,
            height: 2400,
            color: "#222",
          },
        }}
        displayUnit="m"
        callbacks={{
          onUpdateEntity: vi.fn(),
          onDeleteEntity: vi.fn(),
        }}
      />,
    );

    expect(screen.getByText("Wall", { selector: "span" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Thickness/i)).toBeInTheDocument();
  });
});

describe("WorkspaceShell", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1400 });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders panels, status bar, and toolbar actions", async () => {
    const onViewModeChange = vi.fn();
    const onSave = vi.fn();
    const onExport = vi.fn();
    const onImport = vi.fn();

    render(
      <WorkspaceShell
        projectName="Shell Demo"
        isModified
        isSynced={false}
        floors={[{ id: "f1", name: "Ground" }]}
        activeFloorId="f1"
        leftPanel={<div>Left content</div>}
        rightPanel={<div>Right content</div>}
        bottomPanel={<div>Bottom content</div>}
        onViewModeChange={onViewModeChange}
        onSave={onSave}
        onExport={onExport}
        onImport={onImport}
        statusLeft={<span>Custom status</span>}
        statusRight={<span>Custom right</span>}
      >
        <div>Canvas area</div>
      </WorkspaceShell>,
    );

    expect(screen.getByText("Shell Demo")).toBeInTheDocument();
    expect(screen.getByText("Left content")).toBeInTheDocument();
    expect(screen.getByText("Canvas area")).toBeInTheDocument();
    expect(screen.getByText("Custom status")).toBeInTheDocument();

    const viewModeGroup = screen.getAllByRole("radiogroup", { name: "View mode" })[0];
    fireEvent.click(within(viewModeGroup).getByRole("radio", { name: "3D" }));
    expect(onViewModeChange).toHaveBeenCalledWith("3d");

    expect(screen.getByText(/Modified/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: "Tab" });
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    });
  });
});
