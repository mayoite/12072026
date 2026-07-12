"use client";

import { useEffect } from "react";

import { usePlannerStore } from "@/features/planner/store/plannerStore";

/** Local tool names — archive fabricDrawToolTypes removed with _archive. */
export type FabricDrawTool = "select" | "pan" | "rectangle" | "line" | "text" | string;

export interface KeyboardShortcutCanvas {
  setDrawTool: (tool: FabricDrawTool) => void;
  deleteSelection: () => void;
  undo: () => void;
  redo: () => void;
  copy: () => void;
  paste: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToContent: () => number;
  closeContextMenu?: () => void;
  selectAll?: () => void;
}

export interface KeyboardShortcutOptions {
  onEscape?: () => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  );
}

function setTool(canvas: KeyboardShortcutCanvas, plannerTool: "select" | "pan" | "room") {
  const fabricTool: FabricDrawTool = plannerTool === "room" ? "rectangle" : plannerTool;
  usePlannerStore.getState().setTool(plannerTool);
  canvas.setDrawTool(fabricTool);
}

export function useKeyboardShortcuts(
  fabricCanvas: KeyboardShortcutCanvas | null,
  options: KeyboardShortcutOptions = {},
) {
  const { onEscape } = options;

  useEffect(() => {
    if (!fabricCanvas) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const mod = event.metaKey || event.ctrlKey;

      if (key === "escape") {
        onEscape?.();
        fabricCanvas.closeContextMenu?.();
        return;
      }

      if (mod && key === "z" && !event.shiftKey) {
        event.preventDefault();
        fabricCanvas.undo();
        return;
      }
      if (mod && (key === "y" || (key === "z" && event.shiftKey))) {
        event.preventDefault();
        fabricCanvas.redo();
        return;
      }
      if (mod && key === "c") {
        event.preventDefault();
        fabricCanvas.copy();
        return;
      }
      if (mod && key === "v") {
        event.preventDefault();
        fabricCanvas.paste();
        return;
      }
      if (mod && key === "a") {
        event.preventDefault();
        fabricCanvas.selectAll?.();
        return;
      }

      if (key === "v") setTool(fabricCanvas, "select");
      if (key === "h") setTool(fabricCanvas, "pan");
      if (key === "delete" || key === "backspace") {
        event.preventDefault();
        fabricCanvas.deleteSelection();
      }
      if (key === "=" || key === "+") fabricCanvas.zoomIn();
      if (key === "-") fabricCanvas.zoomOut();
      if (key === "0") fabricCanvas.fitToContent();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fabricCanvas, onEscape]);
}
