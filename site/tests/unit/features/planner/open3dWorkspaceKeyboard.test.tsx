import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CANVAS_TOOL_SHORTCUTS,
  type PlannerTool,
} from "@/features/planner/editor/canvasTool";
import {
  toolFromShortcutKey,
  useWorkspaceKeyboard,
  type WorkspaceKeyboardHandlers,
} from "@/features/planner/editor/useWorkspaceKeyboard";

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

/** Handlers without optional callbacks — exercises optional-chaining no-op paths. */
function makeRequiredHandlers(): WorkspaceKeyboardHandlers {
  return {
    setTool: vi.fn(),
    toggleView: vi.fn(),
    openPalette: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    cancel: vi.fn(),
  };
}

function press(init: KeyboardEventInit) {
  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));
  });
}

function release(init: KeyboardEventInit) {
  act(() => {
    window.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, ...init }));
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

  it("undoes on Ctrl/Cmd+Z and redoes on Shift+Ctrl/Cmd+Z and Ctrl/Cmd+Y", () => {
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

    press({ key: "z", metaKey: true, shiftKey: true });
    expect(handlers.redo).toHaveBeenCalledTimes(3);
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
    const handlers = makeRequiredHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    expect(() => {
      press({ key: "Delete", cancelable: true });
      press({ key: "Backspace", cancelable: true });
    }).not.toThrow();
  });

  it("calls cancel on Escape and preventDefaults", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));
    const esc = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Escape",
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(esc);
    });
    expect(esc.defaultPrevented).toBe(true);
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

  it("toggles view on Ctrl/Cmd+Tab only — bare Tab is free for focus order", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const bareTab = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Tab",
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(bareTab);
    });
    expect(bareTab.defaultPrevented).toBe(false);
    expect(handlers.toggleView).not.toHaveBeenCalled();

    const ctrlTab = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Tab",
      ctrlKey: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(ctrlTab);
    });
    expect(ctrlTab.defaultPrevented).toBe(true);
    expect(handlers.toggleView).toHaveBeenCalledTimes(1);

    press({ key: "Tab", metaKey: true });
    expect(handlers.toggleView).toHaveBeenCalledTimes(2);

    press({ key: "Tab", shiftKey: true });
    press({ key: "Tab", ctrlKey: true, shiftKey: true });
    press({ key: "Tab", altKey: true });
    expect(handlers.toggleView).toHaveBeenCalledTimes(2);
  });

  it("does not steal Space/Enter/letter tools when focus is on a button", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const button = document.createElement("button");
    document.body.appendChild(button);
    act(() => {
      button.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: " ",
          code: "Space",
          cancelable: true,
        }),
      );
      button.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Enter",
          cancelable: true,
        }),
      );
      button.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "w",
          cancelable: true,
        }),
      );
    });
    expect(handlers.beginTemporaryPan).not.toHaveBeenCalled();
    expect(handlers.commit).not.toHaveBeenCalled();
    expect(handlers.setTool).not.toHaveBeenCalled();
    button.remove();
  });

  it("commits on Enter and preventDefaults; omits commit without throw", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const enter = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Enter",
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(enter);
    });
    expect(enter.defaultPrevented).toBe(true);
    expect(handlers.commit).toHaveBeenCalledTimes(1);

    const withoutCommit = makeRequiredHandlers();
    renderHook(() => useWorkspaceKeyboard(withoutCommit));
    expect(() => press({ key: "Enter", cancelable: true })).not.toThrow();
  });

  it("begins temporary pan on Space and ends on Space keyup with preventDefault", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const down = new KeyboardEvent("keydown", {
      bubbles: true,
      code: "Space",
      key: " ",
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(down);
    });
    expect(down.defaultPrevented).toBe(true);
    expect(handlers.beginTemporaryPan).toHaveBeenCalledTimes(1);

    const up = new KeyboardEvent("keyup", {
      bubbles: true,
      code: "Space",
      key: " ",
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(up);
    });
    expect(up.defaultPrevented).toBe(true);
    expect(handlers.endTemporaryPan).toHaveBeenCalledTimes(1);
  });

  it("does not begin temporary pan when Space has modifiers or is a repeat", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    press({ code: "Space", key: " ", ctrlKey: true });
    press({ code: "Space", key: " ", metaKey: true });
    press({ code: "Space", key: " ", repeat: true });
    expect(handlers.beginTemporaryPan).not.toHaveBeenCalled();
  });

  it("does not end temporary pan on non-Space keyup or when pan was never started", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    release({ code: "KeyA", cancelable: true });
    release({ code: "Space", cancelable: true });
    expect(handlers.endTemporaryPan).not.toHaveBeenCalled();
  });

  it("does not throw when temporary pan handlers are omitted", () => {
    const handlers = makeRequiredHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));
    expect(() => {
      press({ code: "Space", key: " ", cancelable: true });
      release({ code: "Space", key: " ", cancelable: true });
    }).not.toThrow();
  });

  it("ignores shortcuts in textarea, select, and contentEditable targets", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    for (const el of [
      document.createElement("textarea"),
      document.createElement("select"),
    ]) {
      document.body.appendChild(el);
      act(() => {
        el.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "Delete", cancelable: true }),
        );
      });
      el.remove();
    }

    const editable = document.createElement("div");
    editable.contentEditable = "true";
    document.body.appendChild(editable);
    act(() => {
      editable.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "Delete", cancelable: true }),
      );
    });
    editable.remove();

    expect(handlers.deleteSelection).not.toHaveBeenCalled();
  });

  it("toolFromShortcutKey returns null for unmapped keys and resolves mapped letters", () => {
    expect(toolFromShortcutKey("?")).toBeNull();
    expect(toolFromShortcutKey("1")).toBeNull();
    expect(toolFromShortcutKey("")).toBeNull();
    expect(toolFromShortcutKey("v")).toBe("select");
    expect(toolFromShortcutKey("V")).toBe("select");
  });

  it("does not arm tools for unmapped letter keys", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));
    press({ key: "q" });
    press({ key: "x" });
    expect(handlers.setTool).not.toHaveBeenCalled();
  });

  it("does not arm tools when Alt or Ctrl is held with a map letter", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));
    press({ key: "d", altKey: true });
    press({ key: "d", ctrlKey: true });
    expect(handlers.setTool).not.toHaveBeenCalled();
  });

  it("allows non-HTMLElement targets (window) to reach deleteSelection", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));
    // window is EventTarget but not HTMLElement — editable guard must not block.
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Delete",
          cancelable: true,
        }),
      );
    });
    expect(handlers.deleteSelection).toHaveBeenCalledTimes(1);
  });
});
