"use client";

import { useEffect, useRef } from "react";
import type { PlannerTool } from "./canvasTool";
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

      if (key === "v" && !mod) {
        event.preventDefault();
        handlers.setTool("select");
        return;
      }

      if (key === "r" && !mod) {
        event.preventDefault();
        handlers.setTool("room");
        return;
      }

      if (key === "w" && !mod) {
        event.preventDefault();
        handlers.setTool("wall");
        return;
      }

      if (key === "o" && !mod) {
        event.preventDefault();
        handlers.setTool("opening");
        return;
      }

      if (key === "d" && !mod) {
        event.preventDefault();
        handlers.setTool("dimension");
        return;
      }

      if (key === "p" && !mod) {
        event.preventDefault();
        handlers.setTool("placement");
        return;
      }

      if (key === "h" && !mod) {
        event.preventDefault();
        handlers.setTool("pan");
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
  const normalized = key.toUpperCase();
  const entries = Object.entries(CANVAS_TOOL_SHORTCUTS) as Array<[PlannerTool, string]>;
  const match = entries.find(([, shortcut]) => shortcut.toUpperCase() === normalized);
  return match?.[0] ?? null;
}
