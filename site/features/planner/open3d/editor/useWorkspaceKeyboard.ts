"use client";

import { useEffect } from "react";
import type { CanvasTool } from "./canvasTool";
import { CANVAS_TOOL_SHORTCUTS } from "./canvasTool";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT"
    || tag === "TEXTAREA"
    || tag === "SELECT"
    || target.isContentEditable
  );
}

export interface WorkspaceKeyboardHandlers {
  setTool: (tool: CanvasTool) => void;
  toggleView: () => void;
  openPalette: () => void;
  undo: () => void;
  redo: () => void;
  cancel: () => void;
  deleteSelection?: () => void;
  enabled?: boolean;
}

export function useWorkspaceKeyboard(handlers: WorkspaceKeyboardHandlers): void {
  const { enabled = true } = handlers;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const mod = event.ctrlKey || event.metaKey;

      if (mod && key === "k") {
        event.preventDefault();
        handlers.openPalette();
        return;
      }

      if (event.key === "Tab" && !event.shiftKey && !mod && !event.altKey) {
        event.preventDefault();
        handlers.toggleView();
        return;
      }

      if (key === "v" && !mod) {
        event.preventDefault();
        handlers.setTool("select");
        return;
      }

      if (key === "w" && !mod) {
        event.preventDefault();
        handlers.setTool("wall");
        return;
      }

      if (key === "d" && !mod) {
        event.preventDefault();
        handlers.setTool("door");
        return;
      }

      if ((key === "t" || key === "n") && !mod) {
        event.preventDefault();
        handlers.setTool(key === "n" ? "text" : "window");
        return;
      }

      if (key === "h" && !mod) {
        event.preventDefault();
        handlers.setTool("pan");
        return;
      }

      if (event.key === "Escape") {
        handlers.cancel();
        return;
      }

      if ((event.key === "Delete" || event.key === "Backspace") && !mod) {
        handlers.deleteSelection?.();
        return;
      }

      if (mod && key === "z" && event.shiftKey) {
        event.preventDefault();
        handlers.redo();
        return;
      }

      if (mod && key === "y") {
        event.preventDefault();
        handlers.redo();
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, handlers]);
}

export function toolFromShortcutKey(key: string): CanvasTool | null {
  const normalized = key.toUpperCase();
  const entries = Object.entries(CANVAS_TOOL_SHORTCUTS) as Array<[CanvasTool, string]>;
  const match = entries.find(([, shortcut]) => shortcut.toUpperCase() === normalized);
  return match?.[0] ?? null;
}
