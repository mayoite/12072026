"use client";

import { useCallback, useState } from "react";
import type {
  Open3dAnnotation,
  Open3dColumn,
  Open3dGuide,
  Open3dMeasurement,
  Open3dPoint,
  Open3dProject,
  Open3dRoom,
  Open3dStair,
} from "../model/types";
import {
  addStair,
  addColumn,
  addMeasurement,
  addAnnotation,
  addGuide,
  updateRoom,
  removeStair,
  removeColumn,
  removeMeasurement,
  removeAnnotation,
  removeGuide,
} from "../model/operations/pureActions";

export type RoomElementMode =
  | { mode: "select" }
  | { mode: "place-stair" }
  | { mode: "place-column" }
  | { mode: "place-measurement" }
  | { mode: "place-annotation" }
  | { mode: "place-guide" }
  | { mode: "place-text" }
  | { mode: "edit-room"; roomId: string };

/**
 * Room elements hook for the workspace canvas.
 * Provides state management and actions for rooms, labels, measurements,
 * annotations, stairs, columns, guides, and layers.
 */
export function useRoomElements(project: Open3dProject | null) {
  const [elementMode, setElementMode] = useState<RoomElementMode>({ mode: "select" });
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Room categories
  const roomCategories: Open3dRoom["roomType"][] = ["indoor", "outdoor", "garage", "utility"];

  // Stair types
  const stairTypes = ["straight", "l-shaped", "u-shaped", "spiral"] as const;

  // Column shapes
  const columnShapes = ["square", "round", "rectangular"] as const;

  // Guide types
  const guideTypes = ["horizontal", "vertical", "angle"] as const;

  // ─── Room actions ───

  // Start room editing mode
  const startRoomEdit = useCallback((roomId: string) => {
    setElementMode({ mode: "edit-room", roomId });
    setSelectedElementId(roomId);
  }, []);

  // Update room properties
  const updateRoomProperties = useCallback(
    (updatedProject: Open3dProject, roomId: string, updates: Partial<Open3dRoom>): Open3dProject => {
      return updateRoom(updatedProject, roomId, updates).project;
    },
    [],
  );

  // Delete room - manually filter since no removeRoom action exists
  const deleteRoom = useCallback(
    (updatedProject: Open3dProject, roomId: string): Open3dProject => {
      const p = { ...updatedProject };
      const floorIndex = p.floors.findIndex((f) => f.id === p.activeFloorId);
      if (floorIndex >= 0) {
        p.floors = [...p.floors];
        p.floors[floorIndex] = {
          ...p.floors[floorIndex],
          rooms: p.floors[floorIndex].rooms.filter((r) => r.id !== roomId),
        };
      }
      return p;
    },
    [],
  );

  // Get room by ID
  const getRoomById = useCallback(
    (roomId: string): Open3dRoom | undefined => {
      if (!project) return undefined;
      const floor = project.floors.find((f) => f.id === project.activeFloorId);
      return floor?.rooms.find((r) => r.id === roomId);
    },
    [project],
  );

  // Get all rooms
  const getAllRooms = useCallback((): Open3dRoom[] => {
    if (!project) return [];
    const floor = project.floors.find((f) => f.id === project.activeFloorId);
    return floor?.rooms ?? [];
  }, [project]);

  // Calculate room area
  const calculateRoomArea = useCallback((room: Open3dRoom): number => {
    return room.area ?? 0;
  }, []);

  // ─── Stair actions ───

  const startStairPlacement = useCallback(() => {
    setElementMode({ mode: "place-stair" });
  }, []);

  const placeStair = useCallback(
    (updatedProject: Open3dProject, position: Open3dPoint): Open3dProject => {
      return addStair(updatedProject, position).project;
    },
    [],
  );

  const deleteStair = useCallback(
    (updatedProject: Open3dProject, stairId: string): Open3dProject => {
      return removeStair(updatedProject, stairId).project;
    },
    [],
  );

  // Get all stairs
  const getAllStairs = useCallback((): Open3dStair[] => {
    if (!project) return [];
    const floor = project.floors.find((f) => f.id === project.activeFloorId);
    return floor?.stairs ?? [];
  }, [project]);

  // ─── Column actions ───

  const startColumnPlacement = useCallback(() => {
    setElementMode({ mode: "place-column" });
  }, []);

  const placeColumn = useCallback(
    (updatedProject: Open3dProject, position: Open3dPoint, shape: "square" | "round" = "square"): Open3dProject => {
      return addColumn(updatedProject, position, shape).project;
    },
    [],
  );

  const deleteColumn = useCallback(
    (updatedProject: Open3dProject, columnId: string): Open3dProject => {
      return removeColumn(updatedProject, columnId).project;
    },
    [],
  );

  // Get all columns
  const getAllColumns = useCallback((): Open3dColumn[] => {
    if (!project) return [];
    const floor = project.floors.find((f) => f.id === project.activeFloorId);
    return floor?.columns ?? [];
  }, [project]);

  // ─── Measurement actions ───

  const startMeasurementPlacement = useCallback(() => {
    setElementMode({ mode: "place-measurement" });
  }, []);

  const placeMeasurement = useCallback(
    (updatedProject: Open3dProject, x1: number, y1: number, x2: number, y2: number): Open3dProject => {
      return addMeasurement(updatedProject, x1, y1, x2, y2).project;
    },
    [],
  );

  const deleteMeasurement = useCallback(
    (updatedProject: Open3dProject, measurementId: string): Open3dProject => {
      return removeMeasurement(updatedProject, measurementId).project;
    },
    [],
  );

  // Get all measurements
  const getAllMeasurements = useCallback((): Open3dMeasurement[] => {
    if (!project) return [];
    const floor = project.floors.find((f) => f.id === project.activeFloorId);
    return floor?.measurements ?? [];
  }, [project]);

  // ─── Annotation actions ───

  const startAnnotationPlacement = useCallback(() => {
    setElementMode({ mode: "place-annotation" });
  }, []);

  const startTextAnnotation = useCallback(() => {
    setElementMode({ mode: "place-text" });
  }, []);

  const placeAnnotation = useCallback(
    (updatedProject: Open3dProject, x1: number, y1: number, x2: number, y2: number, label?: string): Open3dProject => {
      return addAnnotation(updatedProject, x1, y1, x2, y2, 400, label).project;
    },
    [],
  );

  const deleteAnnotation = useCallback(
    (updatedProject: Open3dProject, annotationId: string): Open3dProject => {
      return removeAnnotation(updatedProject, annotationId).project;
    },
    [],
  );

  // Get all annotations
  const getAllAnnotations = useCallback((): Open3dAnnotation[] => {
    if (!project) return [];
    const floor = project.floors.find((f) => f.id === project.activeFloorId);
    return floor?.annotations ?? [];
  }, [project]);

  // ─── Guide actions ───

  const startGuidePlacement = useCallback(() => {
    setElementMode({ mode: "place-guide" });
  }, []);

  const placeGuide = useCallback(
    (updatedProject: Open3dProject, position: number, orientation: "horizontal" | "vertical" = "horizontal"): Open3dProject => {
      return addGuide(updatedProject, orientation, position).project;
    },
    [],
  );

  const deleteGuide = useCallback(
    (updatedProject: Open3dProject, guideId: string): Open3dProject => {
      return removeGuide(updatedProject, guideId).project;
    },
    [],
  );

  // Get all guides
  const getAllGuides = useCallback((): Open3dGuide[] => {
    if (!project) return [];
    const floor = project.floors.find((f) => f.id === project.activeFloorId);
    return floor?.guides ?? [];
  }, [project]);

  // ─── Selection ───

  const selectElement = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId);
  }, []);

  // ─── Mode exit ───

  const cancelMode = useCallback(() => {
    setElementMode({ mode: "select" });
    setSelectedElementId(null);
  }, []);

  // Check if in placement mode
  const isPlacing =
    elementMode.mode !== "select" && elementMode.mode !== "edit-room";
  const isEditing = elementMode.mode === "edit-room";

  return {
    // State
    elementMode,
    selectedElementId,
    isPlacing,
    isEditing,

    // Options
    roomCategories,
    stairTypes,
    columnShapes,
    guideTypes,

    // Room actions
    startRoomEdit,
    updateRoomProperties,
    deleteRoom,
    getRoomById,
    getAllRooms,
    calculateRoomArea,

    // Stair actions
    startStairPlacement,
    placeStair,
    deleteStair,
    getAllStairs,

    // Column actions
    startColumnPlacement,
    placeColumn,
    deleteColumn,
    getAllColumns,

    // Measurement actions
    startMeasurementPlacement,
    placeMeasurement,
    deleteMeasurement,
    getAllMeasurements,

    // Annotation actions
    startAnnotationPlacement,
    startTextAnnotation,
    placeAnnotation,
    deleteAnnotation,
    getAllAnnotations,

    // Guide actions
    startGuidePlacement,
    placeGuide,
    deleteGuide,
    getAllGuides,

    // Selection
    selectElement,

    // Exit
    cancelMode,
  };
}