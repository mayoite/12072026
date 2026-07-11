"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  Open3dProject,
  Open3dPoint,
  Open3dWall,
  Open3dFloor,
} from "../model/types";
import { readThemeColor } from "../shared/readThemeColor";
import { createOpen3dHistory, type Open3dHistoryState } from "../store/history";
import {
  executePlannerCommand,
  type PlannerCommand,
} from "../lib/commands/plannerCommand";
import { createOpen3dProject } from "../model/project";
import type { Open3dProjectAction } from "../model/actions/projectActions";
import { newEntityId } from "@/features/planner/lib/newEntityId";

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

  // History is the single source of truth for the document. The command layer
  // (`executePlannerCommand`) is the sole write authority: every document
  // mutation, undo, and redo flows through it so history semantics and the
  // locked-item permission gate live in one place.
  const [history, setHistory] = useState<Open3dHistoryState>(() =>
    createOpen3dHistory(initialProjectState),
  );

  // Selection state (transient — never recorded in document history/undo).
  const [selection, setSelection] = useState<CanvasSelection>({
    type: "none",
    ids: [],
  });

  // Task 4 foundation: panels, search, loading, camera (3d transform), notifications
  // live in caller (OOPlannerWorkspace, PlannerCanvasStage, InventoryPanel, Three*).
  // Document undo/redo/replace ONLY mutate history.present (Open3dProject).
  // Transients are never passed to runCommand / executePlannerCommand.
  // GS: clean canonical doc vs transient ownership (no drift); follows benchmark anti-drift + clean state per Phase 1A.

  // Document is derived from history; the two can never drift.
  const project = history.present;

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

  // Single write seam: route a command through executePlannerCommand and commit
  // the resulting history. Uses a functional setState so rapid successive
  // commands always build on the latest history rather than a stale closure.
  const runCommand = useCallback((command: PlannerCommand) => {
    setHistory((current) => executePlannerCommand(current, command).history);
  }, []);

  // Dispatch a document action (locked-item gated by the command layer).
  const dispatch = useCallback(
    (action: Open3dProjectAction) => {
      runCommand({ type: "document.apply", action });
    },
    [runCommand],
  );

  // Undo the last recorded document command.
  const undo = useCallback(() => {
    runCommand({ type: "history.undo" });
  }, [runCommand]);

  // Redo the last undone document command.
  const redo = useCallback(() => {
    runCommand({ type: "history.redo" });
  }, [runCommand]);

  // Functional document update (canvas interactions like drawing walls).
  const updateProject = useCallback(
    (updater: (project: Open3dProject) => Open3dProject) => {
      runCommand({ type: "document.update", updater });
    },
    [runCommand],
  );

  const replaceProject = useCallback((next: Open3dProject) => {
    setHistory(createOpen3dHistory(next));
    setSelection({ type: "none", ids: [] });
  }, []);

  // Memoize context value for stable ref (prevents rerender storms in consumers per react-bp audit)
  const context = useMemo<WorkspaceCanvasContext>(
    () => ({
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
    }),
    [
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
    ],
  );
  return context;
}

/**
 * Dead production path (kept for unit coverage / possible reuse).
 * Live open3d wall drawing uses PlannerCanvasStage + addOpen3dWall / newEntityId —
 * not this hook. Only caller: workspaceShell.test.tsx.
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
          id: newEntityId(),
          start,
          end,
          thickness: 150, // default 150mm
          height: 2400, // default 2400mm
          color: readThemeColor("--text-body"),
        };
        return {
          ...project,
          floors: project.floors.map((f) =>
            f.id === floor.id ? { ...f, walls: [...f.walls, newWall] } : f,
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
