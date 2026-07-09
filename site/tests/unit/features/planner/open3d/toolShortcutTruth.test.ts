import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CANVAS_TOOL_LABELS,
  CANVAS_TOOL_SHORTCUTS,
  type PlannerTool,
} from "@/features/planner/open3d/editor/canvasTool";
import {
  toolFromShortcutKey,
  useWorkspaceKeyboard,
  type WorkspaceKeyboardHandlers,
} from "@/features/planner/open3d/editor/useWorkspaceKeyboard";

/** W8 product truth — must match authority maps; do not invent keys. */
const TOOL_SHORTCUT_TRUTH: Array<{ id: PlannerTool; key: string; label: string }> = [
  { id: "select", key: "V", label: "Select" },
  { id: "room", key: "R", label: "Room" },
  { id: "wall", key: "W", label: "Wall" },
  { id: "opening", key: "O", label: "Opening" },
  { id: "door", key: "D", label: "Door" },
  { id: "dimension", key: "M", label: "Dimension" },
  { id: "placement", key: "P", label: "Place" },
  { id: "pan", key: "H", label: "Pan" },
  { id: "window", key: "N", label: "Window" },
  { id: "text", key: "T", label: "Text" },
];

function makeHandlers(overrides: Partial<WorkspaceKeyboardHandlers> = {}): WorkspaceKeyboardHandlers {
  return {
    setTool: vi.fn(),
    toggleView: vi.fn(),
    openPalette: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    cancel: vi.fn(),
    commit: vi.fn(),
    beginTemporaryPan: vi.fn(),
    endTemporaryPan: vi.fn(),
    deleteSelection: vi.fn(),
    ...overrides,
  };
}

function press(init: KeyboardEventInit) {
  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init }));
  });
}

afterEach(() => {
  cleanup();
});

describe("tool shortcut truth (W8)", () => {
  it("authority maps match the product truth table for every tool id", () => {
    for (const row of TOOL_SHORTCUT_TRUTH) {
      expect(CANVAS_TOOL_SHORTCUTS[row.id]).toBe(row.key);
      expect(CANVAS_TOOL_LABELS[row.id]).toBe(row.label);
    }
  });

  it("toolFromShortcutKey resolves upper and lower case for every map letter", () => {
    for (const row of TOOL_SHORTCUT_TRUTH) {
      expect(toolFromShortcutKey(row.key)).toBe(row.id);
      expect(toolFromShortcutKey(row.key.toLowerCase())).toBe(row.id);
    }
  });

  it("shortcut letters are unique across CANVAS_TOOL_SHORTCUTS", () => {
    const letters = Object.values(CANVAS_TOOL_SHORTCUTS).map((k) => k.toUpperCase());
    expect(new Set(letters).size).toBe(letters.length);
  });

  it("live keydown arms setTool(id) for every map letter (D=door, M=dimension, N=window, T=text)", () => {
    for (const row of TOOL_SHORTCUT_TRUTH) {
      const handlers = makeHandlers();
      const { unmount } = renderHook(() => useWorkspaceKeyboard(handlers));

      press({ key: row.key.toLowerCase() });

      expect(handlers.setTool).toHaveBeenCalledTimes(1);
      expect(handlers.setTool).toHaveBeenCalledWith(row.id);

      unmount();
    }
  });

  it("does not arm tools while typing in an editable field", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const input = document.createElement("input");
    document.body.appendChild(input);
    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "d", cancelable: true }),
      );
    });
    expect(handlers.setTool).not.toHaveBeenCalled();
    input.remove();
  });

  it("does not arm tools when keyboard is disabled", () => {
    const handlers = makeHandlers({ enabled: false });
    renderHook(() => useWorkspaceKeyboard(handlers));

    press({ key: "m" });
    press({ key: "d" });
    expect(handlers.setTool).not.toHaveBeenCalled();
  });

  it("Opening tool uses O in CANVAS_TOOL_SHORTCUTS and resolves via toolFromShortcutKey", () => {
    expect(CANVAS_TOOL_SHORTCUTS.opening).toBe("O");
    expect(toolFromShortcutKey("O")).toBe("opening");
    expect(toolFromShortcutKey("o")).toBe("opening");

    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));
    press({ key: "o" });
    expect(handlers.setTool).toHaveBeenCalledTimes(1);
    expect(handlers.setTool).toHaveBeenCalledWith("opening");
  });

  it("Select tool label + shortcut form the accessible name contract Select (V)", () => {
    expect(CANVAS_TOOL_LABELS.select).toBe("Select");
    expect(CANVAS_TOOL_SHORTCUTS.select).toBe("V");
    // CanvasToolRail aria-label / title template: `${label} (${shortcut})`
    expect(`${CANVAS_TOOL_LABELS.select} (${CANVAS_TOOL_SHORTCUTS.select})`).toBe(
      "Select (V)",
    );
  });
});
