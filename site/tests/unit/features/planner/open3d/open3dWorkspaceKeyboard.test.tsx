import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CANVAS_TOOL_SHORTCUTS,
  type PlannerTool,
} from "@/features/planner/open3d/editor/canvasTool";
import {
  useWorkspaceKeyboard,
  type WorkspaceKeyboardHandlers,
} from "@/features/planner/open3d/editor/useWorkspaceKeyboard";

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
    window.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));
  });
}

afterEach(() => {
  cleanup();
});

describe("useWorkspaceKeyboard shortcuts", () => {
  it("opens the command palette on Ctrl+K and Cmd+K", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    press({ key: "k", ctrlKey: true });
    press({ key: "K", metaKey: true });

    expect(handlers.openPalette).toHaveBeenCalledTimes(2);
  });

  it("undoes on Ctrl/Cmd+Z and redoes on Shift+Ctrl/Cmd+Z", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    press({ key: "z", ctrlKey: true });
    expect(handlers.undo).toHaveBeenCalledTimes(1);
    expect(handlers.redo).not.toHaveBeenCalled();

    press({ key: "z", ctrlKey: true, shiftKey: true });
    expect(handlers.redo).toHaveBeenCalledTimes(1);
    expect(handlers.undo).toHaveBeenCalledTimes(1);

    press({ key: "y", metaKey: true });
    expect(handlers.redo).toHaveBeenCalledTimes(2);
  });

  it("ignores shortcuts when typing in an editable field", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const input = document.createElement("input");
    document.body.appendChild(input);
    act(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "k", ctrlKey: true }));
    });
    expect(handlers.openPalette).not.toHaveBeenCalled();
    input.remove();
  });

  it("does not bind when disabled", () => {
    const handlers = makeHandlers({ enabled: false });
    renderHook(() => useWorkspaceKeyboard(handlers));

    press({ key: "k", ctrlKey: true });
    expect(handlers.openPalette).not.toHaveBeenCalled();
  });

  it("calls deleteSelection on Delete and Backspace and preventDefaults", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const del = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Delete",
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(del);
    });
    expect(del.defaultPrevented).toBe(true);
    expect(handlers.deleteSelection).toHaveBeenCalledTimes(1);

    const bs = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Backspace",
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(bs);
    });
    expect(bs.defaultPrevented).toBe(true);
    expect(handlers.deleteSelection).toHaveBeenCalledTimes(2);
  });

  it("does not call deleteSelection on Ctrl+Backspace or Cmd+Backspace", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const ctrlBs = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Backspace",
      ctrlKey: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(ctrlBs);
    });
    expect(handlers.deleteSelection).not.toHaveBeenCalled();
    expect(ctrlBs.defaultPrevented).toBe(false);

    const metaBs = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Backspace",
      metaKey: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(metaBs);
    });
    expect(handlers.deleteSelection).not.toHaveBeenCalled();
    expect(metaBs.defaultPrevented).toBe(false);
  });

  it("does not call deleteSelection when Delete is pressed in an input", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const input = document.createElement("input");
    document.body.appendChild(input);
    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Delete",
          cancelable: true,
        }),
      );
    });
    expect(handlers.deleteSelection).not.toHaveBeenCalled();
    input.remove();
  });

  it("does not throw when deleteSelection handler is omitted", () => {
    const handlers = makeHandlers();
    // Explicit omit (not a stub) — optional chaining path.
    const { deleteSelection: _omit, ...withoutDelete } = handlers;
    void _omit;
    renderHook(() => useWorkspaceKeyboard(withoutDelete));

    expect(() => {
      press({ key: "Delete", cancelable: true });
      press({ key: "Backspace", cancelable: true });
    }).not.toThrow();
  });

  it("calls cancel on Escape", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));
    press({ key: "Escape" });
    expect(handlers.cancel).toHaveBeenCalledTimes(1);
  });

  it("arms tools from CANVAS_TOOL_SHORTCUTS on live keydown (D=door, M=dimension, N=window, T=text)", () => {
    const critical: Array<{ key: string; id: PlannerTool }> = [
      { key: "d", id: "door" },
      { key: "m", id: "dimension" },
      { key: "n", id: "window" },
      { key: "t", id: "text" },
    ];

    for (const { key, id } of critical) {
      expect(CANVAS_TOOL_SHORTCUTS[id].toLowerCase()).toBe(key);
      const handlers = makeHandlers();
      const { unmount } = renderHook(() => useWorkspaceKeyboard(handlers));
      press({ key });
      expect(handlers.setTool).toHaveBeenCalledTimes(1);
      expect(handlers.setTool).toHaveBeenCalledWith(id);
      unmount();
    }

    // Full map matrix so the hook suite alone catches letter drift
    for (const [id, shortcut] of Object.entries(CANVAS_TOOL_SHORTCUTS) as Array<
      [PlannerTool, string]
    >) {
      const handlers = makeHandlers();
      const { unmount } = renderHook(() => useWorkspaceKeyboard(handlers));
      press({ key: shortcut.toLowerCase() });
      expect(handlers.setTool).toHaveBeenCalledWith(id);
      unmount();
    }
  });

  it("Opening tool shortcut O arms setTool(opening) from the map (case-insensitive)", () => {
    expect(CANVAS_TOOL_SHORTCUTS.opening).toBe("O");

    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    press({ key: "O" });
    expect(handlers.setTool).toHaveBeenCalledTimes(1);
    expect(handlers.setTool).toHaveBeenCalledWith("opening");
  });
});
