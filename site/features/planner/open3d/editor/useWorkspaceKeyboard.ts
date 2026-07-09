"use client";

import { useEffect, useRef } from "react";
import type { PlannerTool } from "./canvasTool";
import { CANVAS_TOOL_SHORTCUTS } from "./canvasTool";

/** Lowercase letter → tool, inverted once from the authority map (W8 single source). */
const TOOL_BY_SHORTCUT_KEY: Record<string, PlannerTool> = Object.fromEntries(
  (Object.entries(CANVAS_TOOL_SHORTCUTS) as Array<[PlannerTool, string]>).map(
    ([tool, shortcut]) => [shortcut.toLowerCase(), tool],
  ),
) as Record<string, PlannerTool>;

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
  setTool: (tool: PlannerTool) => void;
  toggleView: () => void;
  openPalette: () => void;
  undo: () => void;
  redo: () => void;
  cancel: () => void;
  commit?: () => void;
  beginTemporaryPan?: () => void;
  endTemporaryPan?: () => void;
  deleteSelection?: () => void;
  enabled?: boolean;
}

export function useWorkspaceKeyboard(handlers: WorkspaceKeyboardHandlers): void {
  const { enabled = true } = handlers;
  const spacePanActive = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const mod = event.ctrlKey || event.metaKey;

      if (event.code === "Space" && !mod && !event.repeat) {
        event.preventDefault();
        spacePanActive.current = true;
        handlers.beginTemporaryPan?.();
        return;
      }

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

      if (event.key === "Escape") {
        event.preventDefault();
        handlers.cancel();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handlers.commit?.();
        return;
      }

      if ((event.key === "Delete" || event.key === "Backspace") && !mod) {
        event.preventDefault();
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

      if (mod && key === "z" && !event.shiftKey) {
        event.preventDefault();
        handlers.undo();
        return;
      }

      // Letter tool arming: authority map only (no second hard-coded table)
      if (!mod && !event.altKey) {
        const tool = TOOL_BY_SHORTCUT_KEY[key];
        if (tool !== undefined) {
          event.preventDefault();
          handlers.setTool(tool);
        }
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space" || !spacePanActive.current) return;
      event.preventDefault();
      spacePanActive.current = false;
      handlers.endTemporaryPan?.();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [enabled, handlers]);
}

export function toolFromShortcutKey(key: string): PlannerTool | null {
  return TOOL_BY_SHORTCUT_KEY[key.toLowerCase()] ?? null;
}
