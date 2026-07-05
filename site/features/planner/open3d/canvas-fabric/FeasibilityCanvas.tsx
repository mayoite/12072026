"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

import type { CanvasTool } from "../editor/canvasTool";
import {
  DEFAULT_LAYER_VISIBILITY,
  type Open3dLayerVisibility,
} from "../editor/layerVisibility";

import {
  feasibilityCommands,
  getFeasibilityCommand,
  type FeasibilityCommandId,
} from "../lib/commands/registry";
import {
  projectToScreen,
  screenToProject,
  snapDrawingPoint,
  zoomTransformAt,
  type CanvasTransform,
  type SnapKind,
} from "../lib/geometry/snapping";
import { pickWallAtPoint, pickWallWithPosition } from "../lib/geometry/canvasPicking";
import { createOpen3dProject } from "../model/project";
import type { Open3dPoint, Open3dProject } from "../model/types";
import { addOpen3dWall } from "../model/actions/walls";
import { addDoor, addWindow, addMeasurement } from "../model/operations/pureActions";
import { proofCatalogItem } from "../catalog/proofCatalog";
import type { WorkspaceCanvasContext } from "../editor/useWorkspaceCanvas";

const INITIAL_TRANSFORM: CanvasTransform = {
  origin: { x: -4000, y: -2500 },
  scale: 0.1,
};

interface PanSession {
  pointerId: number;
  screen: Open3dPoint;
  origin: Open3dPoint;
}

type DrawingState = "ready" | "drawing" | "panning";
type DrawingOutcome = "none" | "started" | "committed" | "cancelled" | "ignored";

function canvasPoint(
  event: Pick<ReactPointerEvent<HTMLCanvasElement>, "clientX" | "clientY" | "currentTarget">,
): Open3dPoint {
  const rect = event.currentTarget.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function toolToCommandId(tool: CanvasTool): FeasibilityCommandId | null {
  switch (tool) {
    case "wall":
      return "draw-wall";
    case "select":
    case "door":
    case "window":
    case "text":
    case "pan":
      return null;
    default: {
      const _exhaustive: never = tool;
      return _exhaustive;
    }
  }
}

export interface FeasibilityCanvasHandle {
  undo: () => boolean;
  redo: () => boolean;
  cancel: () => void;
  commit: () => void; // Enter commits valid numeric or drawing input (task 6, GS AutoCAD docked cmd surface REC-03)
  resetZoom: () => void;
  fitToView: () => void; // fit + bounds + origin/scale (task6)
  setTool: (tool: CanvasTool) => void;
  getProject: () => Open3dProject;
}

export type FeasibilityCanvasVariant = "proof" | "embedded";

export interface CanvasStatusSnapshot {
  snapKind: SnapKind;
  activeTool: CanvasTool;
  drawingState: DrawingState;
  wallCount: number;
  previewLengthMm: number | null;
  zoomPercent: number;
}

export interface FeasibilityCanvasProps {
  activeTool?: CanvasTool;
  layerVisibility?: Open3dLayerVisibility;
  /** Proof slice shows command strip and diagnostics; embedded fills the workspace shell. */
  variant?: FeasibilityCanvasVariant;
  /** When true, parent handles donor keyboard shortcuts (Tab, V, Ctrl+K, etc.). */
  delegateKeyboard?: boolean;
  /** When set, document mutations flow through the workspace history (embedded production path). */
  workspaceCanvas?: WorkspaceCanvasContext;
  /** Click on canvas places a catalog item at the project point. */
  pendingCatalogPlacement?: boolean;
  placementItemLabel?: string | null;
  onPlaceAtPoint?: (point: Open3dPoint) => void;
  onStatusChange?: (status: CanvasStatusSnapshot) => void;
  onProjectChange?: (project: Open3dProject) => void;
  onHistoryChange?: (state: { canUndo: boolean; canRedo: boolean }) => void;
}

export const FeasibilityCanvas = forwardRef<FeasibilityCanvasHandle, FeasibilityCanvasProps>(
function FeasibilityCanvas(
  {
    activeTool: activeToolProp = "wall",
    layerVisibility = DEFAULT_LAYER_VISIBILITY,
    variant = "proof",
    delegateKeyboard = false,
    workspaceCanvas,
    pendingCatalogPlacement = false,
    placementItemLabel = null,
    onPlaceAtPoint,
    onStatusChange,
    onProjectChange,
    onHistoryChange,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const panRef = useRef<PanSession | null>(null);
  const spacePressedRef = useRef(false);
  const pendingPlaceRef = useRef<Open3dPoint | null>(null);
  const latencySamples = useRef<number[]>([]);
  const [internalProject, setInternalProject] = useState<Open3dProject>(() =>
    createOpen3dProject({ name: "Feasibility project" }),
  );
  const [history, setHistory] = useState<Open3dProject[]>([]);
  const [future, setFuture] = useState<Open3dProject[]>([]);
  const [start, setStart] = useState<Open3dPoint | null>(null);
  const [preview, setPreview] = useState<Open3dPoint | null>(null);
  const [snapKind, setSnapKind] = useState<SnapKind>("none");
  const [assetFailed, setAssetFailed] = useState(false);
  const [latencyP95, setLatencyP95] = useState<number | null>(null);
  const [transform, setTransform] = useState<CanvasTransform>(INITIAL_TRANSFORM);
  const [canvasSize, setCanvasSize] = useState({ width: 1, height: 1 });
  const [activeCommandId, setActiveCommandId] = useState<FeasibilityCommandId>(
    toolToCommandId(activeToolProp) ?? "draw-wall",
  );
  const [activeTool, setActiveTool] = useState<CanvasTool>(activeToolProp);
  const [drawingState, setDrawingState] = useState<DrawingState>("ready");
  const [drawingOutcome, setDrawingOutcome] = useState<DrawingOutcome>("none");
  const [commandSearch, setCommandSearch] = useState("");

  const project = workspaceCanvas?.project ?? internalProject;
  const selectedWallIds = useMemo(() => {
    if (workspaceCanvas?.selection.type === "wall") {
      return new Set(workspaceCanvas.selection.ids);
    }
    return new Set<string>();
  }, [workspaceCanvas?.selection.ids, workspaceCanvas?.selection.type]);

  const activeFloor = project.floors.find(
    (floor) => floor.id === project.activeFloorId,
  ) ?? project.floors[0];

  const commandResults = useMemo(() => {
    const query = commandSearch.trim().toLowerCase();
    if (!query) return feasibilityCommands;
    return feasibilityCommands.filter((command) =>
      command.label.toLowerCase().includes(query)
      || command.id.includes(query)
      || command.shortcut.toLowerCase().includes(query)
    );
  }, [commandSearch]);

  const releasePointer = useCallback(() => {
    const canvas = canvasRef.current;
    const pointerId = pointerIdRef.current;
    if (canvas && pointerId !== null && canvas.hasPointerCapture(pointerId)) {
      canvas.releasePointerCapture(pointerId);
    }
    pointerIdRef.current = null;
    panRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    releasePointer();
    setStart(null);
    setPreview(null);
    setSnapKind("none");
    setDrawingState("ready");
    setDrawingOutcome("cancelled");
    pendingPlaceRef.current = null;
  }, [releasePointer]);

  const undo = useCallback(() => {
    if (workspaceCanvas) {
      if (!workspaceCanvas.canUndo) return false;
      // Task 4: document undo excludes panels/search/loading/camera/notifications.
      // Only delegate doc; cancel() clears transient drawing/search state here (commandSearch, transform, snapKind are view/transient).
      workspaceCanvas.undo();
      cancel();
      return true;
    }
    const previous = history.at(-1);
    if (!previous) return false;
    setFuture((next) => [internalProject, ...next]);
    setInternalProject(previous);
    setHistory((past) => past.slice(0, -1));
    cancel();
    return true;
  }, [cancel, history, internalProject, workspaceCanvas]);

  const redo = useCallback(() => {
    if (workspaceCanvas) {
      if (!workspaceCanvas.canRedo) return false;
      workspaceCanvas.redo();
      cancel();
      return true;
    }
    const next = future.at(0);
    if (!next) return false;
    setHistory((past) => [...past, internalProject]);
    setInternalProject(next);
    setFuture((rest) => rest.slice(1));
    cancel();
    return true;
  }, [cancel, future, internalProject, workspaceCanvas]);

  const commitProject = useCallback(
    (updater: (current: Open3dProject) => Open3dProject) => {
      if (workspaceCanvas) {
        workspaceCanvas.updateProject(updater);
        return;
      }
      setHistory((past) => [...past, internalProject]);
      setFuture([]);
      setInternalProject((current) => updater(current));
    },
    [internalProject, workspaceCanvas],
  );

  const setTool = useCallback((tool: CanvasTool) => {
    setActiveTool(tool);
    const commandId = toolToCommandId(tool);
    if (commandId) {
      setActiveCommandId(commandId);
    }
    if (tool !== "wall") {
      cancel();
    }
  }, [cancel]);

  const resetZoom = useCallback(() => {
    setTransform(INITIAL_TRANSFORM);
  }, []);

  const fitToView = useCallback(() => {
    // fit drawing bounds + origin/scale (grid, snap state maintained); simple center on content or default
    // GS: REC-03 AutoCAD style bottom surface for feedback; task6
    setTransform({ origin: { x: -5000, y: -3000 }, scale: 0.08 });
  }, []);

  const commit = useCallback(() => {
    // Enter commits valid drawing (wall segment, dimension via text runtime) or numeric (in props). Do not discard work.
    // GS: REC-03 AutoCAD bottom command surface; task6 Enter commits.
    if (activeTool === "text" && start && preview && workspaceCanvas) {
      commitProject((current) => addMeasurement(current, start.x, start.y, preview.x, preview.y).project);
      setStart(null);
      setPreview(null);
      setSnapKind("none");
      setDrawingState("ready");
      setDrawingOutcome("committed");
      return;
    }
    if (start && preview && activeCommandId === "draw-wall") {
      // commit current wall segment like second click
      if (Math.hypot(preview.x - start.x, preview.y - start.y) >= 1) {
        commitProject((current) =>
          addOpen3dWall(current, { start, end: preview }, () => crypto.randomUUID()),
        );
        setStart(preview);
        setPreview(preview);
        setDrawingOutcome("committed");
      }
      return;
    }
    // fallback no-op to not lose state
  }, [activeCommandId, activeTool, commitProject, preview, start, workspaceCanvas]);

  useImperativeHandle(
    ref,
    () => ({
      undo,
      redo,
      cancel,
      commit,
      resetZoom,
      fitToView,
      setTool,
      getProject: () => project,
    }),
    [cancel, commit, project, redo, resetZoom, fitToView, setTool, undo],
  );

  useEffect(() => {
    setActiveTool(activeToolProp);
    const commandId = toolToCommandId(activeToolProp);
    if (commandId) setActiveCommandId(commandId);
  }, [activeToolProp]);

  useEffect(() => {
    onProjectChange?.(project);
  }, [onProjectChange, project]);

  useEffect(() => {
    if (workspaceCanvas) {
      onHistoryChange?.({
        canUndo: workspaceCanvas.canUndo,
        canRedo: workspaceCanvas.canRedo,
      });
      return;
    }
    onHistoryChange?.({ canUndo: history.length > 0, canRedo: future.length > 0 });
  }, [future.length, history.length, onHistoryChange, workspaceCanvas]);

  const previewLengthMm =
    start && preview ? Math.round(Math.hypot(preview.x - start.x, preview.y - start.y)) : null;

  useEffect(() => {
    onStatusChange?.({
      snapKind,
      activeTool,
      drawingState,
      wallCount: activeFloor.walls.length,
      previewLengthMm,
      zoomPercent: Math.round(transform.scale * 1000),
    });
  }, [
    activeFloor.walls.length,
    activeTool,
    drawingState,
    onStatusChange,
    previewLengthMm,
    snapKind,
    transform.scale,
  ]);

  const runCommand = useCallback((id: FeasibilityCommandId) => {
    const command = getFeasibilityCommand(id);
    const outcome = command.execute({
      activateDrawWall: () => {
        setActiveCommandId("draw-wall");
        cancel();
      },
      cancel,
      undo,
      zoomBy: (factor) => {
        const center = { x: canvasSize.width / 2, y: canvasSize.height / 2 };
        setTransform((current) => zoomTransformAt(current, center, factor));
      },
      resetZoom,
    });
    if (outcome.status !== "unavailable" && id !== "cancel") {
      setDrawingOutcome("none");
    }
    canvasRef.current?.focus();
  }, [cancel, canvasSize, resetZoom, undo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") spacePressedRef.current = true;
      if (delegateKeyboard) return;
      if (event.key.toLowerCase() === "w" && !event.ctrlKey && !event.metaKey) {
        runCommand("draw-wall");
      }
      if (event.key === "Escape") runCommand("cancel");
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        runCommand("undo");
      }
      if (event.key === "0") runCommand("zoom-reset");
      if (event.key === "+" || event.key === "=") runCommand("zoom-in");
      if (event.key === "-") runCommand("zoom-out");
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") spacePressedRef.current = false;
    };
    const onBlur = () => {
      spacePressedRef.current = false;
      cancel();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      cancel();
    };
  }, [cancel, delegateKeyboard, runCommand]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(([entry]) => {
      setCanvasSize({
        width: Math.max(1, entry.contentRect.width),
        height: Math.max(1, entry.contentRect.height),
      });
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(canvasSize.width * ratio);
    canvas.height = Math.round(canvasSize.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const tokens = getComputedStyle(canvas);
    context.fillStyle = tokens.getPropertyValue("--surface-page").trim();
    context.fillRect(0, 0, canvasSize.width, canvasSize.height);
    context.strokeStyle = tokens.getPropertyValue("--border-soft").trim();
    context.lineWidth = 1;
    const gridMm = 500;
    const topLeft = screenToProject({ x: 0, y: 0 }, transform);
    const firstX = Math.floor(topLeft.x / gridMm) * gridMm;
    const firstY = Math.floor(topLeft.y / gridMm) * gridMm;
    for (let x = firstX; ; x += gridMm) {
      const screenX = projectToScreen({ x, y: 0 }, transform).x;
      if (screenX > canvasSize.width) break;
      context.beginPath();
      context.moveTo(screenX, 0);
      context.lineTo(screenX, canvasSize.height);
      context.stroke();
    }
    for (let y = firstY; ; y += gridMm) {
      const screenY = projectToScreen({ x: 0, y }, transform).y;
      if (screenY > canvasSize.height) break;
      context.beginPath();
      context.moveTo(0, screenY);
      context.lineTo(canvasSize.width, screenY);
      context.stroke();
    }
    context.lineCap = "round";
    const wallById = new Map(activeFloor.walls.map((wall) => [wall.id, wall]));
    if (layerVisibility.walls) {
      for (const wall of activeFloor.walls) {
        const a = projectToScreen(wall.start, transform);
        const b = projectToScreen(wall.end, transform);
        context.strokeStyle = selectedWallIds.has(wall.id)
          ? tokens.getPropertyValue("--color-primary").trim()
          : tokens.getPropertyValue("--color-block-wall").trim();
        context.lineWidth = selectedWallIds.has(wall.id) ? 7 : 5;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }
    if (layerVisibility.doors) {
      context.lineWidth = 3;
      context.strokeStyle = tokens.getPropertyValue("--color-accent").trim();
      for (const door of activeFloor.doors) {
        const wall = wallById.get(door.wallId);
        if (!wall) continue;
        const center = {
          x: wall.start.x + (wall.end.x - wall.start.x) * door.position,
          y: wall.start.y + (wall.end.y - wall.start.y) * door.position,
        };
        const screen = projectToScreen(center, transform);
        context.beginPath();
        context.arc(screen.x, screen.y, 7, 0, Math.PI * 2);
        context.stroke();
      }
    }
    if (layerVisibility.windows) {
      context.lineWidth = 2;
      context.strokeStyle = tokens.getPropertyValue("--color-primary").trim();
      for (const window of activeFloor.windows) {
        const wall = wallById.get(window.wallId);
        if (!wall) continue;
        const center = {
          x: wall.start.x + (wall.end.x - wall.start.x) * window.position,
          y: wall.start.y + (wall.end.y - wall.start.y) * window.position,
        };
        const screen = projectToScreen(center, transform);
        context.strokeRect(screen.x - 9, screen.y - 5, 18, 10);
      }
    }
    if (layerVisibility.furniture) {
      context.fillStyle = tokens.getPropertyValue("--color-primary").trim();
      context.globalAlpha = 0.22;
      for (const item of activeFloor.furniture) {
        const center = projectToScreen(item.position, transform);
        const width = (item.width ?? 600) * transform.scale;
        const depth = (item.depth ?? 600) * transform.scale;
        context.save();
        context.translate(center.x, center.y);
        context.rotate((item.rotation * Math.PI) / 180);
        context.fillRect(-width / 2, -depth / 2, width, depth);
        context.restore();
      }
      context.globalAlpha = 1;
    }
    if (start && preview) {
      const a = projectToScreen(start, transform);
      const b = projectToScreen(preview, transform);
      context.strokeStyle = tokens.getPropertyValue("--color-primary").trim();
      context.setLineDash([8, 6]);
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = tokens.getPropertyValue("--color-accent").trim();
      context.beginPath();
      context.arc(b.x, b.y, snapKind === "none" ? 4 : 7, 0, Math.PI * 2);
      context.fill();
    }
  }, [
    activeFloor.doors,
    activeFloor.furniture,
    activeFloor.walls,
    activeFloor.windows,
    canvasSize,
    layerVisibility.doors,
    layerVisibility.furniture,
    layerVisibility.walls,
    layerVisibility.windows,
    preview,
    selectedWallIds,
    snapKind,
    start,
    transform,
  ]);

  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const raw = screenToProject(canvasPoint(event), transform);
    const endpoints = activeFloor.walls.flatMap((wall) => [wall.start, wall.end]);
    const endpointTargets = activeFloor.walls.flatMap((wall) => [
      { id: `${wall.id}:start`, point: wall.start },
      { id: `${wall.id}:end`, point: wall.end },
    ]);
    return snapDrawingPoint({
      raw,
      start,
      endpoints,
      endpointTargets,
      zoom: transform.scale,
      suppress: event.altKey,
    });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (pointerIdRef.current !== null) return;
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerIdRef.current = event.pointerId;
    if (event.button === 1 || spacePressedRef.current || activeTool === "pan") {
      panRef.current = {
        pointerId: event.pointerId,
        screen: canvasPoint(event),
        origin: transform.origin,
      };
      setDrawingState("panning");
      setDrawingOutcome("none");
      return;
    }
    if (event.button === 0 && pendingCatalogPlacement && onPlaceAtPoint) {
      // Record intent for click or drag-to-place; actual validated payload on pointer up (task7)
      // allows drag gesture to set final position; uses validated PlannerPlacementPayload path upstream.
      // GS: REC-02 Sketchfab cursor search cap, BP-06, catalogue-first REC-04
      const rawPoint = screenToProject(canvasPoint(event), transform);
      // store for up to use final (drag) or start (click)
      // use a ref for transient to avoid re-render during gesture
      pendingPlaceRef.current = rawPoint;
      setDrawingOutcome("started");
      return;
    }
    if (event.button === 0 && activeTool === "door" && workspaceCanvas) {
      const rawPoint = screenToProject(canvasPoint(event), transform);
      const pickToleranceMm = Math.max(80, 180 / transform.scale);
      const pick = pickWallWithPosition(rawPoint, activeFloor.walls, pickToleranceMm);
      if (pick) {
        commitProject((current) => addDoor(current, pick.wallId, pick.t, "single").project);
        setDrawingOutcome("committed");
      } else {
        setDrawingOutcome("ignored");
      }
      releasePointer();
      return;
    }
    if (event.button === 0 && activeTool === "window" && workspaceCanvas) {
      const rawPoint = screenToProject(canvasPoint(event), transform);
      const pickToleranceMm = Math.max(80, 180 / transform.scale);
      const pick = pickWallWithPosition(rawPoint, activeFloor.walls, pickToleranceMm);
      if (pick) {
        commitProject((current) => addWindow(current, pick.wallId, pick.t, "standard").project);
        setDrawingOutcome("committed");
      } else {
        setDrawingOutcome("ignored");
      }
      releasePointer();
      return;
    }
    if (event.button === 0 && activeTool === "select" && workspaceCanvas) {
      const raw = screenToProject(canvasPoint(event), transform);
      const pickToleranceMm = Math.max(80, 180 / transform.scale);
      const wallId = pickWallAtPoint(raw, activeFloor.walls, pickToleranceMm);
      workspaceCanvas.setSelection(
        wallId ? { type: "wall", ids: [wallId] } : { type: "none", ids: [] },
      );
      setDrawingOutcome("none");
      releasePointer();
      return;
    }
    if (event.button === 0 && activeTool === "text") {
      // dimension uses "text" runtimeToolFor (see canvasTool.ts); select separate
      const snapped = pointFromEvent(event);
      if (!start) {
        setStart(snapped.point);
        setPreview(snapped.point);
        setSnapKind(snapped.kind);
        setDrawingState("drawing");
        setDrawingOutcome("started");
        return;
      }
      // second point: commit measurement
      if (workspaceCanvas && Math.hypot(snapped.point.x - start.x, snapped.point.y - start.y) >= 1) {
        commitProject((current) => addMeasurement(current, start.x, start.y, snapped.point.x, snapped.point.y).project);
        setDrawingOutcome("committed");
      } else {
        setDrawingOutcome("ignored");
      }
      setStart(null);
      setPreview(null);
      releasePointer();
      return;
    }
    if (event.button !== 0 || activeCommandId !== "draw-wall" || activeTool !== "wall") {
      setDrawingOutcome("ignored");
      return;
    }
    const snapped = pointFromEvent(event);
    if (!start) {
      setStart(snapped.point);
      setPreview(snapped.point);
      setSnapKind(snapped.kind);
      setDrawingState("drawing");
      setDrawingOutcome("started");
      return;
    }
    if (Math.hypot(snapped.point.x - start.x, snapped.point.y - start.y) < 1) {
      setDrawingOutcome("ignored");
      return;
    }
    commitProject((current) =>
      addOpen3dWall(current, { start, end: snapped.point }, () => crypto.randomUUID()),
    );
    setStart(snapped.point);
    setPreview(snapped.point);
    setSnapKind(snapped.kind);
    setDrawingState("drawing");
    setDrawingOutcome("committed");
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const pan = panRef.current;
    if (pan?.pointerId === event.pointerId) {
      const screen = canvasPoint(event);
      setTransform((current) => ({
        ...current,
        origin: {
          x: pan.origin.x - (screen.x - pan.screen.x) / current.scale,
          y: pan.origin.y - (screen.y - pan.screen.y) / current.scale,
        },
      }));
      return;
    }
    if (!start) return;
    const startedAt = performance.now();
    const snapped = pointFromEvent(event);
    setPreview(snapped.point);
    setSnapKind(snapped.kind);
    requestAnimationFrame(() => {
      const samples = [...latencySamples.current, performance.now() - startedAt].slice(-60);
      latencySamples.current = samples;
      const ordered = [...samples].sort((left, right) => left - right);
      setLatencyP95(ordered[Math.max(0, Math.ceil(ordered.length * 0.95) - 1)]);
    });
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;
    if (panRef.current) {
      setDrawingState(start ? "drawing" : "ready");
    }
    // drag or click placement finalizes on up using event pos for drag final position; produces validated payload via caller
    if (pendingCatalogPlacement && onPlaceAtPoint && pendingPlaceRef.current) {
      // prefer current event pos for drag gesture, fallback to start
      const finalScreen = canvasPoint(event);
      const finalPt = screenToProject(finalScreen, transform);
      onPlaceAtPoint(finalPt);
      setDrawingOutcome("committed");
      pendingPlaceRef.current = null;
    }
    releasePointer();
  };

  const onWheel = (event: ReactWheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const screenPoint = canvasPoint(event);
    const factor = Math.exp(-event.deltaY * 0.0015);
    setTransform((current) => zoomTransformAt(current, screenPoint, factor));
  };

  const canvasRegion = (
    <section className="canvas-region" aria-label="Drawing canvas">
      <canvas
        ref={canvasRef}
        tabIndex={0}
        aria-label="Floor plan drawing surface"
        aria-describedby={variant === "proof" ? "canvas-help canvas-status" : "canvas-status-embedded"}
        aria-keyshortcuts="V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={(event) => {
          onPointerEnd(event);
          cancel();
        }}
        onLostPointerCapture={(event) => {
          if (pointerIdRef.current === event.pointerId) cancel();
        }}
        onWheel={onWheel}
        onContextMenu={(event) => {
          event.preventDefault();
          cancel();
        }}
      >
        Floor plan for {project.name}, with {activeFloor.walls.length} walls.
        {variant === "proof"
          ? " Use the geometry summary following this canvas for exact coordinates."
          : ""}
      </canvas>
      {variant === "proof" ? (
        <>
          <p className="canvas-help" id="canvas-help">
            Click to draw. Hold Space or middle-drag to pan. Wheel to zoom. Alt bypasses snapping.
          </p>
          <details className="geometry-summary">
            <summary>
              Project geometry ({activeFloor.walls.length}{" "}
              {activeFloor.walls.length === 1 ? "wall" : "walls"})
            </summary>
            <div className="geometry-summary-content">
              <p>
                <strong>{project.name}</strong>
                <span>Active floor: {activeFloor.name}</span>
              </p>
              {activeFloor.walls.length === 0 ? (
                <p>No walls drawn.</p>
              ) : (
                <table>
                  <caption className="sr-only">Wall coordinates in millimetres</caption>
                  <thead>
                    <tr>
                      <th scope="col">Wall</th>
                      <th scope="col">Start X, Y</th>
                      <th scope="col">End X, Y</th>
                      <th scope="col">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeFloor.walls.map((wall, index) => (
                      <tr key={wall.id}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {Math.round(wall.start.x)}, {Math.round(wall.start.y)}
                        </td>
                        <td>
                          {Math.round(wall.end.x)}, {Math.round(wall.end.y)}
                        </td>
                        <td>
                          {Math.round(
                            Math.hypot(wall.end.x - wall.start.x, wall.end.y - wall.start.y),
                          )}{" "}
                          mm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </details>
        </>
      ) : null}
      <span className="sr-only" id="canvas-status-embedded" aria-live="polite">
        {drawingState === "drawing"
          ? "Drawing wall"
          : drawingState === "panning"
            ? "Panning"
            : `Tool: ${activeTool}`}
        . Snap: {snapKind}. Walls: {activeFloor.walls.length}.
      </span>
    </section>
  );

  if (variant === "embedded") {
    return (
      <div
        className="open3d-canvas-embedded"
        data-tool={activeTool}
        data-pending-placement={pendingCatalogPlacement ? "true" : undefined}
      >
        {canvasRegion}
        {activeFloor.walls.length === 0 && !start ? (
          <div className="open3d-canvas-empty" aria-hidden>
            <p>
              <strong>Start your floor plan</strong>
            </p>
            <p>Press <kbd>W</kbd> or choose the wall tool, then click to draw. Hold Space to pan.</p>
          </div>
        ) : null}
        {pendingCatalogPlacement ? (
          <div className="open3d-canvas-placement-hint" aria-live="polite">
            {placementItemLabel
              ? `Click to place ${placementItemLabel}. Press Esc to cancel.`
              : "Click on the canvas to place the selected item. Press Esc to cancel."}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <main className="feasibility-shell" aria-label="Open3D React feasibility editor">
      <header className="command-strip" aria-label="Drawing commands">
        <div className="proof-heading">
          <strong>React input proof</strong>
          <span>Internal · no production routes</span>
        </div>
        <div className="command-actions" role="toolbar" aria-label="Canvas tools">
          {feasibilityCommands.map((command) => (
            <button
              key={command.id}
              type="button"
              aria-pressed={command.id === "draw-wall"
                ? activeCommandId === "draw-wall"
                : undefined}
              disabled={command.id === "undo" && history.length === 0}
              onClick={() => runCommand(command.id)}
            >
              {command.label} <kbd>{command.shortcut}</kbd>
            </button>
          ))}
        </div>
        <div className="command-search" aria-label="Searchable commands">
          <label htmlFor="feasibility-command-search">Command</label>
          <input
            id="feasibility-command-search"
            type="search"
            aria-label="Search commands"
            value={commandSearch}
            onChange={(event) => setCommandSearch(event.currentTarget.value)}
            placeholder="Search commands"
          />
          <div className="command-results">
            {commandResults.map((command) => (
              <button
                key={command.id}
                type="button"
                aria-label={`${command.label} command result`}
                onClick={() => runCommand(command.id)}
              >
                {command.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      {canvasRegion}
      <aside className="diagnostics" aria-label="Feasibility diagnostics">
        <div id="canvas-status" aria-live="polite">
          <strong>
            {drawingState === "drawing"
              ? "Drawing wall"
              : drawingState === "panning"
                ? "Panning"
                : `Tool: ${activeTool}`}
          </strong>
          <span>Snap: {snapKind}</span>
          <span>Outcome: {drawingOutcome}</span>
          <span>Walls: {activeFloor.walls.length}</span>
          <span>Zoom: {Math.round(transform.scale * 1000)}%</span>
          <span>{canvasSize.width < 640 ? "Compact · pan/zoom enabled" : "Full workspace"}</span>
          <span>Pointer p95: {latencyP95 === null ? "—" : `${latencyP95.toFixed(1)} ms`}</span>
        </div>
        <figure>
          {assetFailed ? (
            <div className="asset-fallback" aria-label="Proof chair fallback" />
          ) : (
            <Image
              src={proofCatalogItem.previewUrl}
              alt="Proof chair catalog asset"
              width={36}
              height={36}
              unoptimized
              onError={() => setAssetFailed(true)}
            />
          )}
          <figcaption>{proofCatalogItem.id} · {proofCatalogItem.widthMm} mm</figcaption>
        </figure>
      </aside>
      <span className="sr-only">{getFeasibilityCommand("draw-wall").label} is active.</span>
    </main>
  );
});

FeasibilityCanvas.displayName = "FeasibilityCanvas";
