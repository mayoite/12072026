import { describe, expect, it, vi, afterEach } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import {
  toolFromShortcutKey,
  useWorkspaceKeyboard,
} from "@/features/planner/editor/useWorkspaceKeyboard";
import { CANVAS_TOOL_SHORTCUTS } from "@/features/planner/editor/canvasTool";

afterEach(() => cleanup());

function press(init: KeyboardEventInit): KeyboardEvent {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    ...init,
  });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
}

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
    press({ key: "w" });
    expect(setTool).toHaveBeenCalledWith("wall");
    expect(CANVAS_TOOL_SHORTCUTS.wall).toBe("W");
  });

  describe("P14 arrow-key furniture nudge (a11y non-drag alternative)", () => {
    it("nudges 100 mm default step on all four arrows", () => {
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

      expect(press({ key: "ArrowRight" }).defaultPrevented).toBe(true);
      expect(nudgeSelection).toHaveBeenLastCalledWith(100, 0);

      expect(press({ key: "ArrowLeft" }).defaultPrevented).toBe(true);
      expect(nudgeSelection).toHaveBeenLastCalledWith(-100, 0);

      expect(press({ key: "ArrowUp" }).defaultPrevented).toBe(true);
      expect(nudgeSelection).toHaveBeenLastCalledWith(0, -100);

      expect(press({ key: "ArrowDown" }).defaultPrevented).toBe(true);
      expect(nudgeSelection).toHaveBeenLastCalledWith(0, 100);

      expect(nudgeSelection).toHaveBeenCalledTimes(4);
    });

    it("uses fine 10 mm step with Shift on every axis", () => {
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

      press({ key: "ArrowRight", shiftKey: true });
      expect(nudgeSelection).toHaveBeenLastCalledWith(10, 0);
      press({ key: "ArrowLeft", shiftKey: true });
      expect(nudgeSelection).toHaveBeenLastCalledWith(-10, 0);
      press({ key: "ArrowUp", shiftKey: true });
      expect(nudgeSelection).toHaveBeenLastCalledWith(0, -10);
      press({ key: "ArrowDown", shiftKey: true });
      expect(nudgeSelection).toHaveBeenLastCalledWith(0, 10);
    });

    it("does not steal arrows while typing in an editable field", () => {
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

      const input = document.createElement("input");
      document.body.appendChild(input);
      act(() => {
        input.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "ArrowRight",
            bubbles: true,
            cancelable: true,
          }),
        );
      });
      expect(nudgeSelection).not.toHaveBeenCalled();
      input.remove();
    });

    it("does not steal arrows when focus is on a button control", () => {
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

      const button = document.createElement("button");
      button.type = "button";
      document.body.appendChild(button);
      act(() => {
        button.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "ArrowDown",
            bubbles: true,
            cancelable: true,
          }),
        );
      });
      expect(nudgeSelection).not.toHaveBeenCalled();
      button.remove();
    });

    it("ignores arrow nudge when Ctrl/Meta is held (not a pan shortcut)", () => {
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

      press({ key: "ArrowRight", ctrlKey: true });
      press({ key: "ArrowLeft", metaKey: true });
      expect(nudgeSelection).not.toHaveBeenCalled();
    });

    it("no-ops arrows when nudgeSelection is not wired", () => {
      renderHook(() =>
        useWorkspaceKeyboard({
          setTool: vi.fn(),
          toggleView: vi.fn(),
          openPalette: vi.fn(),
          undo: vi.fn(),
          redo: vi.fn(),
          cancel: vi.fn(),
        }),
      );
      // Must not throw when handler omitted.
      expect(() => press({ key: "ArrowRight" })).not.toThrow();
    });
  });
});
