import { describe, expect, it, vi, afterEach } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import {
  toolFromShortcutKey,
  useWorkspaceKeyboard,
} from "@/features/planner/editor/useWorkspaceKeyboard";
import { CANVAS_TOOL_SHORTCUTS } from "@/features/planner/editor/canvasTool";

afterEach(() => cleanup());

describe("useWorkspaceKeyboard", () => {
  it("toolFromShortcutKey resolves authority map", () => {
    expect(toolFromShortcutKey("w")).toBe("wall");
    expect(toolFromShortcutKey("W")).toBe("wall");
    expect(toolFromShortcutKey("v")).toBe("select");
  });

  it("keydown arms setTool for wall shortcut", () => {
    const setTool = vi.fn();
    renderHook(() =>
      useWorkspaceKeyboard({
        setTool,
        toggleView: vi.fn(),
        openPalette: vi.fn(),
        undo: vi.fn(),
        redo: vi.fn(),
        cancel: vi.fn(),
      }),
    );
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "w", bubbles: true, cancelable: true }),
      );
    });
    expect(setTool).toHaveBeenCalledWith("wall");
    expect(CANVAS_TOOL_SHORTCUTS.wall).toBe("W");
  });

  it("nudgeSelection fires on arrow keys with fine shift step", () => {
    const nudgeSelection = vi.fn();
    renderHook(() =>
      useWorkspaceKeyboard({
        setTool: vi.fn(),
        toggleView: vi.fn(),
        openPalette: vi.fn(),
        undo: vi.fn(),
        redo: vi.fn(),
        cancel: vi.fn(),
        nudgeSelection,
      }),
    );
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          bubbles: true,
          cancelable: true,
        }),
      );
    });
    expect(nudgeSelection).toHaveBeenCalledWith(100, 0);
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowUp",
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    });
    expect(nudgeSelection).toHaveBeenCalledWith(0, -10);
  });
});
