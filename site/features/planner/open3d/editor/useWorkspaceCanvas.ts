"use client";

import { useCallback, useMemo, useState } from "react";
import type { Open3dProject, Open3dPoint, Open3dWall, Open3dFloor } from "../model/types";
import { readThemeColor } from "../shared/readThemeColor";
import {
  createOpen3dHistory,
  dispatchOpen3dAction,
  undoOpen3dAction,
  redoOpen3dAction,
  type Open3dHistoryState,
} from "../store/history";
import { createOpen3dProject } from "../model/project";
import type { Open3dProjectAction } from "../model/actions/projectActions";

export interface CanvasSelection {
  type: "wall" | "door" | "window" | "furniture" | "room" | "none";
  ids: string[];
}

export type PlannerSelection = CanvasSelection;

export interface WorkspaceCanvasContext {
  /** Current project state */
  project: Open3dProject;
  /** Active floor from project */
  activeFloor: Open3dFloor;
  /** History state for undo/redo */
  history: Open3dHistoryState;
  /** Current selection */
  selection: CanvasSelection;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Dispatch an action to modify the project */
  dispatch: (action: Open3dProjectAction) => void;
  /** Undo the last action */
  undo: () => void;
  /** Redo the last undone action */
  redo: () => void;
  /** Set selection */
  setSelection: (selection: CanvasSelection) => void;
  /** Update project directly (for canvas interactions) */
  updateProject: (updater: (project: Open3dProject) => Open3dProject) => void;
  /** Replace document and reset history (restore/autosave load) */
  replaceProject: (project: Open3dProject) => void;
}

export interface UseWorkspaceCanvasOptions {
  /** Initial project name */
  projectName?: string;
  /** Initial project (if provided, takes precedence over projectName) */
  initialProject?: Open3dProject;
  /** Maximum history entries */
  maxHistory?: number;
}

const DEFAULT_PROJECT_NAME = "Untitled Project";

export function useWorkspaceCanvas(
  options: UseWorkspaceCanvasOptions = {},
): WorkspaceCanvasContext {
  const { projectName = DEFAULT_PROJECT_NAME, initialProject } = options;

  // Create initial project if not provided
  const initialProjectState = useMemo(() => {
    if (initialProject) {
      return initialProject;
    }
    return createOpen3dProject({ name: projectName });
  }, [initialProject, projectName]);

  // Project state
  const [project, setProject] = useState<Open3dProject>(initialProjectState);

  // History state
  const [history, setHistory] = useState<Open3dHistoryState>(() =>
    createOpen3dHistory(initialProjectState),
  );

  // Selection state
  const [selection, setSelection] = useState<CanvasSelection>({ type: "none", ids: [] });

  // Get active floor
  const activeFloor = useMemo(() => {
    return (
      project.floors.find((floor) => floor.id === project.activeFloorId) ??
      project.floors[0]
    );
  }, [project]);

  // Can undo/redo
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // Dispatch action - updates project and history
  const dispatch = useCallback(
    (action: Open3dProjectAction) => {
      const nextHistory = dispatchOpen3dAction(history, action);
      if (nextHistory !== history) {
        setHistory(nextHistory);
        setProject(nextHistory.present);
      }
    },
    [history],
  );

  // Undo action
  const undo = useCallback(() => {
    const nextHistory = undoOpen3dAction(history);
    if (nextHistory !== history) {
      setHistory(nextHistory);
      setProject(nextHistory.present);
    }
  }, [history]);

  // Redo action
  const redo = useCallback(() => {
    const nextHistory = redoOpen3dAction(history);
    if (nextHistory !== history) {
      setHistory(nextHistory);
      setProject(nextHistory.present);
    }
  }, [history]);

  // Update project directly (for canvas interactions like drawing walls)
  const updateProject = useCallback(
    (updater: (project: Open3dProject) => Open3dProject) => {
      setProject((current) => {
        const updated = updater(current);
        if (updated === current) return current;
        const stamped =
          updated.updatedAt === current.updatedAt
            ? { ...updated, updatedAt: new Date().toISOString() }
            : updated;
        setHistory((h) => ({
          past: [...h.past, h.present],
          present: stamped,
          future: [],
          dragStart: null,
        }));
        return stamped;
      });
    },
    [],
  );

  const replaceProject = useCallback((next: Open3dProject) => {
    setProject(next);
    setHistory(createOpen3dHistory(next));
    setSelection({ type: "none", ids: [] });
  }, []);

  return {
    project,
    activeFloor,
    history,
    selection,
    canUndo,
    canRedo,
    dispatch,
    undo,
    redo,
    setSelection,
    updateProject,
    replaceProject,
  };
}

/**
 * Hook for canvas that needs wall drawing capabilities.
 * This combines the workspace canvas context with canvas-specific state.
 */
export function useCanvasDrawing(initialProject?: Open3dProject) {
  const canvas = useWorkspaceCanvas({
    initialProject,
    projectName: initialProject?.name ?? "Feasibility project",
  });

  // Drawing-specific state
  const [drawingPoint, setDrawingPoint] = useState<{
    start: Open3dPoint;
    current: Open3dPoint;
  } | null>(null);

  // Add a wall to the project
  const addWall = useCallback(
    (start: Open3dPoint, end: Open3dPoint) => {
      canvas.updateProject((project) => {
        const floor = project.floors[0];
        const newWall: Open3dWall = {
          id: crypto.randomUUID(),
          start,
          end,
          thickness: 150, // default 150mm
          height: 2400, // default 2400mm
          color: readThemeColor("--text-body"),
        };
        return {
          ...project,
          floors: project.floors.map((f) =>
            f.id === floor.id
              ? { ...f, walls: [...f.walls, newWall] }
              : f,
          ),
        };
      });
    },
    [canvas],
  );

  // Start drawing a wall
  const startDrawing = useCallback((point: Open3dPoint) => {
    setDrawingPoint({ start: point, current: point });
  }, []);

  // Update drawing preview
  const updateDrawing = useCallback((point: Open3dPoint) => {
    setDrawingPoint((prev) => (prev ? { ...prev, current: point } : null));
  }, []);

  // Commit the drawing
  const commitDrawing = useCallback(() => {
    if (drawingPoint) {
      const dx = drawingPoint.current.x - drawingPoint.start.x;
      const dy = drawingPoint.current.y - drawingPoint.start.y;
      const length = Math.hypot(dx, dy);
      if (length > 10) {
        // Minimum 10mm to create a wall
        addWall(drawingPoint.start, drawingPoint.current);
      }
      setDrawingPoint(null);
    }
  }, [drawingPoint, addWall]);

  // Cancel drawing
  const cancelDrawing = useCallback(() => {
    setDrawingPoint(null);
  }, []);

  return {
    ...canvas,
    drawingPoint,
    startDrawing,
    updateDrawing,
    commitDrawing,
    cancelDrawing,
  };
}
