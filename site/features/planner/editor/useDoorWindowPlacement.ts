"use client";

import { useCallback, useState } from "react";
import type { Open3dDoor, Open3dProject, Open3dWindow } from "@/features/planner/project/model/types";
import { removeDoor, removeWindow, updateDoor, updateWindow } from "@/features/planner/project/model/operations/pureActions";

export type DoorType = Open3dDoor["type"];
export type WindowType = Open3dWindow["type"];

export type PlacementMode = 
  | { mode: "select" }
  | { mode: "place-door"; doorType: DoorType }
  | { mode: "place-window"; windowType: WindowType }
  | { mode: "edit-door"; doorId: string }
  | { mode: "edit-window"; windowId: string };

export interface DoorWindowPlacementResult {
  /** The wall ID where the door/window was placed */
  wallId: string;
  /** Position along the wall (0-1 normalized) */
  position: number;
  /** Type of opening */
  type: DoorType | WindowType;
}

/**
 * Door/Window placement hook for the workspace canvas.
 * Provides state management and actions for placing and editing doors and windows on walls.
 */
export function useDoorWindowPlacement(project: Open3dProject | null) {
  const [placementMode, setPlacementMode] = useState<PlacementMode>({ mode: "select" });
  const [selectedWallId, setSelectedWallId] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);

  // Door types available for placement
  const doorTypes: DoorType[] = ["single", "double", "sliding", "pocket", "french"];

  // Window types available for placement
  const windowTypes: WindowType[] = ["standard", "fixed", "casement", "sliding", "bay"];

  // Start door placement mode
  const startDoorPlacement = useCallback((doorType: DoorType = "single") => {
    setPlacementMode({ mode: "place-door", doorType });
  }, []);

  // Start window placement mode
  const startWindowPlacement = useCallback((windowType: WindowType = "standard") => {
    setPlacementMode({ mode: "place-window", windowType });
  }, []);

  // Cancel placement mode
  const cancelPlacement = useCallback(() => {
    setPlacementMode({ mode: "select" });
    setSelectedWallId(null);
    setHoverPosition(null);
  }, []);

  // Handle wall click during placement mode
  const handleWallClick = useCallback(
    (wallId: string, clickPosition: number): DoorWindowPlacementResult | null => {
      if (!project) return null;

      if (placementMode.mode === "place-door") {
        // Note: addDoor/addWindow are pure (return result); call here was no-op seam (no reassignment), info returned for caller to apply. Removed dead call.
        return { wallId, position: clickPosition, type: placementMode.doorType };
      }

      if (placementMode.mode === "place-window") {
        return { wallId, position: clickPosition, type: placementMode.windowType };
      }

      return null;
    },
    [project, placementMode],
  );

  // Update hover position when moving over walls
  const handleWallHover = useCallback((wallId: string | null, position: number | null) => {
    setSelectedWallId(wallId);
    setHoverPosition(position);
  }, []);

  // Edit an existing door
  const editDoor = useCallback((doorId: string) => {
    setPlacementMode({ mode: "edit-door", doorId });
  }, []);

  // Edit an existing window
  const editWindow = useCallback((windowId: string) => {
    setPlacementMode({ mode: "edit-window", windowId });
  }, []);

  // Update door properties
  const updateDoorProperties = useCallback(
    (updatedProject: Open3dProject, doorId: string, updates: Partial<Open3dDoor>): Open3dProject => {
      const floor = updatedProject.floors.find((f) => f.id === updatedProject.activeFloorId);
      if (!floor?.doors.some((door) => door.id === doorId)) {
        return updatedProject;
      }
      return updateDoor(updatedProject, doorId, updates).project;
    },
    [],
  );

  // Update window properties
  const updateWindowProperties = useCallback(
    (updatedProject: Open3dProject, windowId: string, updates: Partial<Open3dWindow>): Open3dProject => {
      const floor = updatedProject.floors.find((f) => f.id === updatedProject.activeFloorId);
      if (!floor?.windows.some((window) => window.id === windowId)) {
        return updatedProject;
      }
      return updateWindow(updatedProject, windowId, updates).project;
    },
    [],
  );

  // Delete a door
  const deleteDoor = useCallback(
    (updatedProject: Open3dProject, doorId: string): Open3dProject => {
      return removeDoor(updatedProject, doorId).project;
    },
    [],
  );

  // Delete a window
  const deleteWindow = useCallback(
    (updatedProject: Open3dProject, windowId: string): Open3dProject => {
      return removeWindow(updatedProject, windowId).project;
    },
    [],
  );

  // Get doors on a specific wall
  const getDoorsOnWall = useCallback(
    (wallId: string): Open3dDoor[] => {
      if (!project) return [];
      const floor = project.floors.find((f) => f.id === project.activeFloorId);
      return floor?.doors.filter((d) => d.wallId === wallId) ?? [];
    },
    [project],
  );

  // Get windows on a specific wall
  const getWindowsOnWall = useCallback(
    (wallId: string): Open3dWindow[] => {
      if (!project) return [];
      const floor = project.floors.find((f) => f.id === project.activeFloorId);
      return floor?.windows.filter((w) => w.wallId === wallId) ?? [];
    },
    [project],
  );

  // Check if currently in placement mode
  const isPlacing = placementMode.mode === "place-door" || placementMode.mode === "place-window";
  const isEditing = placementMode.mode === "edit-door" || placementMode.mode === "edit-window";

  return {
    // State
    placementMode,
    selectedWallId,
    hoverPosition,
    isPlacing,
    isEditing,

    // Available types
    doorTypes,
    windowTypes,

    // Actions
    startDoorPlacement,
    startWindowPlacement,
    cancelPlacement,
    handleWallClick,
    handleWallHover,
    editDoor,
    editWindow,
    updateDoorProperties,
    updateWindowProperties,
    deleteDoor,
    deleteWindow,
    getDoorsOnWall,
    getWindowsOnWall,
  };
}