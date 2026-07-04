"use client";

import { useEffect } from "react";

import type { FabricDrawTool } from "@/features/planner/canvas-fabric/fabricDrawToolTypes";
import { usePlannerStore } from "@/features/planner/store/plannerStore";

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
      const commandKey = event.metaKey || event.ctrlKey;

      if (commandKey) {
        if (key === "z" && event.shiftKey) {
          event.preventDefault();
          fabricCanvas.redo();
          return;
        }
        if (key === "z") {
          event.preventDefault();
          fabricCanvas.undo();
          return;
        }
        if (key === "c") {
          event.preventDefault();
          fabricCanvas.copy();
          return;
        }
        if (key === "v") {
          event.preventDefault();
          fabricCanvas.paste();
          return;
        }
        if (key === "=" || key === "+") {
          event.preventDefault();
          fabricCanvas.zoomIn();
          return;
        }
        if (key === "-") {
          event.preventDefault();
          fabricCanvas.zoomOut();
          return;
        }
        if (key === "a") {
          event.preventDefault();
          fabricCanvas.selectAll?.();
          return;
        }
      }

      if (event.altKey || commandKey || event.shiftKey) return;

      switch (key) {
        case "v":
          event.preventDefault();
          setTool(fabricCanvas, "select");
          break;
        case "h":
          event.preventDefault();
          setTool(fabricCanvas, "pan");
          break;
        case "r":
          event.preventDefault();
          setTool(fabricCanvas, "room");
          break;
        case "escape":
          event.preventDefault();
          setTool(fabricCanvas, "select");
          fabricCanvas.closeContextMenu?.();
          onEscape?.();
          break;
        case "delete":
        case "backspace":
          event.preventDefault();
          fabricCanvas.deleteSelection();
          break;
        case "0":
          event.preventDefault();
          fabricCanvas.fitToContent();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fabricCanvas, onEscape]);
}
