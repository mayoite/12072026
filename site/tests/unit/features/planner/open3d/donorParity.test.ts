import { describe, expect, it, vi } from "vitest";

import {
  buildPaletteCommands,
  filterPaletteCommands,
  runPaletteCommand,
} from "@/features/planner/open3d/lib/commands/paletteCommands";
import {
  DEFAULT_LAYER_VISIBILITY,
  summarizeFloorLayers,
  toggleLayerVisibility,
} from "@/features/planner/open3d/editor/layerVisibility";
import { toolFromShortcutKey } from "@/features/planner/open3d/editor/useWorkspaceKeyboard";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import { addOpen3dWall } from "@/features/planner/open3d/model/actions/walls";

describe("donor parity — command palette", () => {
  it("builds searchable palette commands with donor tool shortcuts", () => {
    const handlers = {
      setTool: vi.fn(),
      toggleView: vi.fn(),
      openPalette: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      cancel: vi.fn(),
      zoomReset: vi.fn(),
    };
    const commands = buildPaletteCommands(handlers);
    expect(commands.some((command) => command.id === "tool-wall" && command.shortcut === "W")).toBe(
      true,
    );
    expect(commands.some((command) => command.id === "nav-toggle-view" && command.shortcut === "Tab")).toBe(
      true,
    );
    expect(filterPaletteCommands(commands, "wall").some((command) => command.id === "tool-wall")).toBe(
      true,
    );
  });

  it("dispatches palette actions through handlers", () => {
    const handlers = {
      setTool: vi.fn(),
      toggleView: vi.fn(),
      openPalette: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      cancel: vi.fn(),
      zoomReset: vi.fn(),
    };
    expect(runPaletteCommand("tool-door", handlers)).toBe(true);
    expect(handlers.setTool).toHaveBeenCalledWith("door");
    expect(runPaletteCommand("nav-toggle-view", handlers)).toBe(true);
    expect(handlers.toggleView).toHaveBeenCalled();
  });
});

describe("donor parity — layers panel state", () => {
  it("summarizes floor layers and toggles visibility", () => {
    const project = addOpen3dWall(
      createOpen3dProject({ idFactory: () => "floor-1" }),
      { start: { x: 0, y: 0 }, end: { x: 1000, y: 0 } },
      () => "wall-1",
    );
    const floor = project.floors[0];
    const summary = summarizeFloorLayers(floor);
    expect(summary.find((entry) => entry.key === "walls")?.count).toBe(1);
    const hidden = toggleLayerVisibility(DEFAULT_LAYER_VISIBILITY, "walls");
    expect(hidden.walls).toBe(false);
  });
});

describe("donor parity — keyboard shortcuts", () => {
  it("maps donor shortcut keys to canvas tools", () => {
    expect(toolFromShortcutKey("v")).toBe("select");
    expect(toolFromShortcutKey("W")).toBe("wall");
    expect(toolFromShortcutKey("d")).toBe("door");
    expect(toolFromShortcutKey("h")).toBe("pan");
  });
});
