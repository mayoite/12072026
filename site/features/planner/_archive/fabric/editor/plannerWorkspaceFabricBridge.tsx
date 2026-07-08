"use client";

import { useCallback, useEffect } from "react";
import { usePlannerUIStore } from "@/features/planner/store/plannerUIStore";
import { PlannerToolFabricSync } from "@/features/planner/editor/PlannerToolFabricSync";
import {
  FabricCanvasWorkspace,
  RoomPresetsOnOpen,
  useFloorplan,
} from "@/features/planner/canvas-fabric";

function isEditableKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT"
    || target.tagName === "TEXTAREA"
    || target.tagName === "SELECT"
    || target.isContentEditable
  );
}

/** Syncs Fabric grid state to the UI store and registers the G hotkey. */
export function FabricGridBridge() {
  const { gridEnabled, toggleGrid } = useFloorplan();

  useEffect(() => {
    usePlannerUIStore.getState().setShowGrid(gridEnabled);
  }, [gridEnabled]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "g" || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableKeyboardTarget(event.target)) return;
      const shell = document.querySelector(".pw-shell");
      const activeViewMode = shell?.querySelector("[data-view-mode]")?.getAttribute("data-view-mode");
      if (activeViewMode === "3d") return;
      event.preventDefault();
      toggleGrid();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleGrid]);

  return null;
}

export function Fabric2DWith3DSync({
  viewMode,
}: {
  viewMode: "2d" | "3d" | "split";
}) {
  const { refitCanvas } = useFloorplan();
  const refitCanvasSoon = useCallback(() => {
    const timer = window.setTimeout(() => refitCanvas(), 80);
    return () => window.clearTimeout(timer);
  }, [refitCanvas]);

  useEffect(() => {
    if (viewMode === "2d") return;
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 80);
    return () => window.clearTimeout(timer);
  }, [viewMode]);

  useEffect(() => {
    if (viewMode !== "2d") return;
    return refitCanvasSoon();
  }, [refitCanvasSoon, viewMode]);

  return (
    <div className="fabric-canvas-host">
      <PlannerToolFabricSync />
      <RoomPresetsOnOpen />
      <FabricCanvasWorkspace />
    </div>
  );
}
