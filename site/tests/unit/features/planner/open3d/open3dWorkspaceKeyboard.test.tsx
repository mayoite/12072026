import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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
});
