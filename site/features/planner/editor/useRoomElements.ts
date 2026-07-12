"use client";

import { useCallback, useState } from "react";
import type {
  PlannerAnnotation,
  PlannerColumn,
  PlannerGuide,
  PlannerMeasurement,
  PlannerPoint,
  PlannerProject,
  PlannerRoom,
  PlannerStair,
} from "@/features/planner/project/model/types";
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
} from "@/features/planner/project/model/operations/pureActions";

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
export function useRoomElements(project: PlannerProject | null) {
  const [elementMode, setElementMode] = useState<RoomElementMode>({ mode: "select" });
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Room categories
  const roomCategories: PlannerRoom["roomType"][] = ["indoor", "outdoor", "garage", "utility"];

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
    (updatedProject: PlannerProject, roomId: string, updates: Partial<PlannerRoom>): PlannerProject => {
      return updateRoom(updatedProject, roomId, updates).project;
    },
    [],
  );

  // Delete room - manually filter since no removeRoom action exists
  const deleteRoom = useCallback(
    (updatedProject: PlannerProject, roomId: string): PlannerProject => {
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
    (roomId: string): PlannerRoom | undefined => {
      if (!project) return undefined;
      const floor = project.floors.find((f) => f.id === project.activeFloorId);
      return floor?.rooms.find((r) => r.id === roomId);
    },
    [project],
  );

  // Get all rooms
  const getAllRooms = useCallback((): PlannerRoom[] => {
    if (!project) return [];
    const floor = project.floors.find((f) => f.id === project.activeFloorId);
    return floor?.rooms ?? [];
  }, [project]);

  // Calculate room area
  const calculateRoomArea = useCallback((room: PlannerRoom): number => {
    return room.area ?? 0;
  }, []);

  // ─── Stair actions ───

  const startStairPlacement = useCallback(() => {
    setElementMode({ mode: "place-stair" });
  }, []);

  const placeStair = useCallback(
    (updatedProject: PlannerProject, position: PlannerPoint): PlannerProject => {
      return addStair(updatedProject, position).project;
    },
    [],
  );

  const deleteStair = useCallback(
    (updatedProject: PlannerProject, stairId: string): PlannerProject => {
      return removeStair(updatedProject, stairId).project;
    },
    [],
  );

  // Get all stairs
  const getAllStairs = useCallback((): PlannerStair[] => {
    if (!project) return [];
    const floor = project.floors.find((f) => f.id === project.activeFloorId);
    return floor?.stairs ?? [];
  }, [project]);

  // ─── Column actions ───

  const startColumnPlacement = useCallback(() => {
    setElementMode({ mode: "place-column" });
  }, []);

  const placeColumn = useCallback(
    (updatedProject: PlannerProject, position: PlannerPoint, shape: "square" | "round" = "square"): PlannerProject => {
      return addColumn(updatedProject, position, shape).project;
    },
    [],
  );

  const deleteColumn = useCallback(
    (updatedProject: PlannerProject, columnId: string): PlannerProject => {
      return removeColumn(updatedProject, columnId).project;
    },
    [],
  );

  // Get all columns
  const getAllColumns = useCallback((): PlannerColumn[] => {
    if (!project) return [];
    const floor = project.floors.find((f) => f.id === project.activeFloorId);
    return floor?.columns ?? [];
  }, [project]);

  // ─── Measurement actions ───

  const startMeasurementPlacement = useCallback(() => {
    setElementMode({ mode: "place-measurement" });
  }, []);

  const placeMeasurement = useCallback(
    (updatedProject: PlannerProject, x1: number, y1: number, x2: number, y2: number): PlannerProject => {
      return addMeasurement(updatedProject, x1, y1, x2, y2).project;
    },
    [],
  );

  const deleteMeasurement = useCallback(
    (updatedProject: PlannerProject, measurementId: string): PlannerProject => {
      return removeMeasurement(updatedProject, measurementId).project;
    },
    [],
  );

  // Get all measurements
  const getAllMeasurements = useCallback((): PlannerMeasurement[] => {
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
    (updatedProject: PlannerProject, x1: number, y1: number, x2: number, y2: number, label?: string): PlannerProject => {
      return addAnnotation(updatedProject, x1, y1, x2, y2, 400, label).project;
    },
    [],
  );

  const deleteAnnotation = useCallback(
    (updatedProject: PlannerProject, annotationId: string): PlannerProject => {
      return removeAnnotation(updatedProject, annotationId).project;
    },
    [],
  );

  // Get all annotations
  const getAllAnnotations = useCallback((): PlannerAnnotation[] => {
    if (!project) return [];
    const floor = project.floors.find((f) => f.id === project.activeFloorId);
    return floor?.annotations ?? [];
  }, [project]);

  // ─── Guide actions ───

  const startGuidePlacement = useCallback(() => {
    setElementMode({ mode: "place-guide" });
  }, []);

  const placeGuide = useCallback(
    (updatedProject: PlannerProject, position: number, orientation: "horizontal" | "vertical" = "horizontal"): PlannerProject => {
      return addGuide(updatedProject, orientation, position).project;
    },
    [],
  );

  const deleteGuide = useCallback(
    (updatedProject: PlannerProject, guideId: string): PlannerProject => {
      return removeGuide(updatedProject, guideId).project;
    },
    [],
  );

  // Get all guides
  const getAllGuides = useCallback((): PlannerGuide[] => {
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