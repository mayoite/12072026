"use client";

/**
 * Live 2-D planner stage (Fabric.js). Sole production plan canvas.
 * Live host mounts this as `PlannerCanvasStage` via `features/planner/canvas`. Build tools/walls here.
 */


import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { Canvas, Line, type FabricObject, type ModifiedEvent, type TPointerEventInfo } from "fabric";

import { runtimeToolFor, type PlannerTool } from "@/features/planner/editor/canvasTool";
import type { PlannerLayerVisibility } from "@/features/planner/editor/layerVisibility";
import type { WorkspaceCanvasContext } from "@/features/planner/editor/useWorkspaceCanvas";
import {
  projectToScreen,
  buildSegmentSnapTargets,
  screenToProject,
  snapDrawingPoint,
  zoomTransformAt,
  type CanvasTransform,
  type SnapKind,
} from "@/features/planner/lib/geometry/snapping";
import {
  PLANNER_STAGE_GRID_MM,
  plannerGridOverlayStyle,
} from "./fabricStageGridOverlay";
import { createPlannerProject } from "@/features/planner/model/project";
import type { PlannerFloor, PlannerPoint, PlannerWall } from "@/features/planner/model/types";
import type { PlannerDisplayUnit } from "@/features/planner/model/types";
import {
  formatAngleDisplay,
  formatLengthInput,
  formatLengthDisplay,
  parseLengthInput,
} from "@/features/planner/model/units";
import { resolvePaintColor } from "@/features/planner/shared/readThemeColor";
import { PLANNER_COLOR_TOKENS } from "@/features/planner/shared/themeColorTokens";
import type {
  CanvasStatusSnapshot,
  PlannerCanvasStageHandle,
} from "./canvasStageTypes";
import {
  DEFAULT_FABRIC_STAGE_TRANSFORM,
  fabricPoseToDocumentUpdate,
  furnitureToFabricPose,
  readFurnitureEntityId,
  writeFurnitureEntityId,
  type FurnitureDocumentPoseUpdate,
} from "./furnitureFabricMapper";
import {
  selectionFromFabricTarget,
  writeCanvasEntityType,
  type FabricCanvasEntityType,
} from "./fabricSelection";
import { createFabricFurnitureSymbol } from "./fabricBlock2D";
import {
  exactWallEndPoint,
  shouldCommitWallSegment,
  wallSegmentAngleDegrees,
  wallSegmentLengthMm,
} from "./wallDrawGeometry";
import { installPlannerFabricExtensions } from "./installPlannerFabricExtensions";
import {
  clearWallSnapMarker,
  createWallSnapMarkerHandle,
  syncWallSnapMarker,
} from "./wallSnapMarker";
import {
  defaultOpeningWidthMm,
  openingLineEndpointsMm,
  resolveOpeningPlacementAtPoint,
  type OpeningPlacementRejectReason,
} from "@/features/planner/lib/geometry/openingPlacement";
import styles from "./plannerFabricStage.module.css";

type CanvasEntityType = FabricCanvasEntityType;

function openingKindFromTool(tool: string): "door" | "window" {
  return tool === "window" ? "window" : "door";
}

export type PlannerFabricStageProps = {
  activeTool?: PlannerTool;
  layerVisibility?: PlannerLayerVisibility;
  workspaceCanvas?: WorkspaceCanvasContext;
  activeFloor?: PlannerFloor;
  pendingCatalogPlacement?: boolean;
  placementItemLabel?: string | null;
  gridEnabled?: boolean;
  snapEnabled?: boolean;
  gridMm?: number;
  onPlaceAtPoint?: (point: PlannerPoint) => void;
  onWallDrawn?: (
    start: PlannerPoint,
    end: PlannerPoint,
    input?: { thicknessMm?: number },
  ) => void;
  /** kind restored: door vs window (opening tool defaults to door). */
  onOpeningPlaced?: (wallId: string, position: number, kind: "door" | "window") => void;
  onOpeningRejected?: (reason: OpeningPlacementRejectReason) => void;
  onSelectionChange?: (selection: { type: CanvasEntityType; id: string } | null) => void;
  onStatusChange?: (status: CanvasStatusSnapshot) => void;
  onFurnitureModified?: (update: FurnitureDocumentPoseUpdate) => void;
  displayUnit?: PlannerDisplayUnit;
};

type PanSession = {
  pointerId: number;
  screen: PlannerPoint;
  origin: PlannerPoint;
};

function hostPoint(host: HTMLElement, clientX: number, clientY: number): PlannerPoint {
  const rect = host.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function snapProjectPoint(input: {
  raw: PlannerPoint;
  start: PlannerPoint | null;
  walls: ReadonlyArray<PlannerWall>;
  transform: CanvasTransform;
  snapEnabled: boolean;
  gridMm: number;
  orthogonal?: boolean;
}): { point: PlannerPoint; kind: SnapKind } {
  if (!input.snapEnabled) {
    return { point: input.raw, kind: "none" };
  }
  const snapped = snapDrawingPoint({
    raw: input.raw,
    start: input.start,
    endpoints: [],
    endpointTargets: buildSegmentSnapTargets(input.walls, input.raw, input.start),
    zoom: input.transform.scale,
    suppress: false,
    gridMm: input.gridMm,
    angleIncrementDegrees: input.orthogonal ? 90 : 45,
  });
  return { point: snapped.point, kind: snapped.kind };
}

/**
 * Theme token → paint string for walls/background.
 * Literal hex/rgb pass through so furniture multiprim contrast is not destroyed.
 */
const STAGE_BG_FALLBACK = "#f8fafc";

function resolveStageColor(token: string, fallback: string): string {
  if (!token) return fallback;
  if (/^#([0-9a-f]{3,8})$/i.test(token) || /^(rgb|hsl)a?\(/i.test(token)) {
    return token;
  }
  try {
    // resolvePaintColor(color, fallbackToken): pass var/token as color when present.
    if (token.startsWith("--") || token.startsWith("var(")) {
      return resolvePaintColor(token, fallback);
    }
    // Bare PLANNER_COLOR_TOKENS keys historically went through fallbackToken path.
    return resolvePaintColor(undefined, token);
  } catch {
    return fallback;
  }
}

function stageBackgroundPaint(): string {
  return resolveStageColor(
    PLANNER_COLOR_TOKENS.exportBackground,
    STAGE_BG_FALLBACK,
  );
}

/** Grid overlay sits under Fabric; canvas must stay transparent when grid is on. */
function fabricBackgroundPaint(gridEnabled: boolean): string {
  // Fabric treats the string "transparent" inconsistently across clears —
  // rgba keeps the lower canvas see-through so the CSS grid shows.
  return gridEnabled ? "rgba(0,0,0,0)" : stageBackgroundPaint();
}

export const PlannerFabricStage = forwardRef<PlannerCanvasStageHandle, PlannerFabricStageProps>(
  function PlannerFabricStage(
    {
      activeTool = "select",
      layerVisibility,
      workspaceCanvas,
      activeFloor,
      pendingCatalogPlacement = false,
      placementItemLabel = null,
      gridEnabled = true,
      snapEnabled = true,
      gridMm = PLANNER_STAGE_GRID_MM,
      onPlaceAtPoint,
      onWallDrawn,
      onOpeningPlaced,
      onOpeningRejected,
      onSelectionChange,
      onStatusChange,
      onFurnitureModified,
      displayUnit = "mm",
    },
    ref,
  ) {
    const hostRef = useRef<HTMLDivElement>(null);
    const lowerCanvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);
    const [transform, setTransform] = useState<CanvasTransform>(DEFAULT_FABRIC_STAGE_TRANSFORM);
    const [svgPaintEpoch, setSvgPaintEpoch] = useState(0);
    const [wallReadout, setWallReadout] = useState<{
      x: number;
      y: number;
      lengthMm: number;
      angleDegrees: number;
      snapKind: SnapKind;
    } | null>(null);
    const [exactLength, setExactLength] = useState("");
    const [exactAngle, setExactAngle] = useState("0");
    const [exactThickness, setExactThickness] = useState(() =>
      formatLengthInput(150, displayUnit),
    );
    const [exactError, setExactError] = useState<string | null>(null);
    const transformRef = useRef(transform);
    const activeToolRef = useRef(activeTool);
    const rebuildingRef = useRef(false);
    const panSessionRef = useRef<PanSession | null>(null);
    const onModifiedRef = useRef(onFurnitureModified);
    const onPlaceRef = useRef(onPlaceAtPoint);
    const onWallDrawnRef = useRef(onWallDrawn);
    const onOpeningPlacedRef = useRef(onOpeningPlaced);
    const onOpeningRejectedRef = useRef(onOpeningRejected);
    const onSelectionRef = useRef(onSelectionChange);
    const onStatusChangeRef = useRef(onStatusChange);
    const pendingPlaceRef = useRef(pendingCatalogPlacement);
    const activeFloorRef = useRef(activeFloor);
    const gridEnabledRef = useRef(gridEnabled);
    const snapEnabledRef = useRef(snapEnabled);
    const gridMmRef = useRef(gridMm);
    const displayUnitRef = useRef(displayUnit);
    const exactThicknessRef = useRef(exactThickness);
    const wallDrawRef = useRef<{ start: PlannerPoint; pointerId: number } | null>(null);
    const previewLineRef = useRef<Line | null>(null);
    const openingPreviewLineRef = useRef<Line | null>(null);
    const snapMarkerHandleRef = useRef(createWallSnapMarkerHandle());

    const clearWallSession = useCallback(() => {
      wallDrawRef.current = null;
      setWallReadout(null);
      setExactError(null);
      const canvas = fabricRef.current;
      clearWallSnapMarker(canvas, snapMarkerHandleRef.current);
      const preview = previewLineRef.current;
      if (preview) {
        canvas?.remove(preview);
        previewLineRef.current = null;
      }
      canvas?.requestRenderAll();
    }, []);

    /** Form submit and workspace Enter share this path (typed length/angle/thickness). */
    const commitExactWallValues = useCallback((): boolean => {
      const session = wallDrawRef.current;
      if (!session) return false;
      const lengthMm = parseLengthInput(exactLength, displayUnit);
      const thicknessMm = parseLengthInput(exactThickness, displayUnit);
      const angleDegrees = Number(exactAngle);
      if (
        lengthMm === null ||
        lengthMm < 10 ||
        thicknessMm === null ||
        thicknessMm < 50 ||
        thicknessMm > 1000 ||
        !Number.isFinite(angleDegrees)
      ) {
        setExactError("Enter a wall length, angle, and thickness between 50–1000 mm.");
        return false;
      }
      const end = exactWallEndPoint(session.start, lengthMm, angleDegrees);
      onWallDrawnRef.current?.(session.start, end, { thicknessMm });
      // Continue the chain from the committed endpoint (Escape still cancels).
      wallDrawRef.current = { start: end, pointerId: session.pointerId };
      const canvas = fabricRef.current;
      const preview = previewLineRef.current;
      if (canvas && preview) {
        const endScreen = projectToScreen(end, transformRef.current);
        preview.set({
          x1: endScreen.x,
          y1: endScreen.y,
          x2: endScreen.x,
          y2: endScreen.y,
        });
        preview.setCoords();
        clearWallSnapMarker(canvas, snapMarkerHandleRef.current);
        canvas.requestRenderAll();
      }
      setExactLength("");
      setExactError(null);
      setWallReadout(null);
      emitStatusRef.current(transformRef.current, "wall");
      return true;
    }, [displayUnit, exactAngle, exactLength, exactThickness]);

    const commitExactWall = useCallback(
      (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        commitExactWallValues();
      },
      [commitExactWallValues],
    );

    useEffect(() => {
      setExactThickness(formatLengthInput(150, displayUnit));
    }, [displayUnit]);

    useEffect(() => {
      transformRef.current = transform;
    }, [transform]);

    useEffect(() => {
      activeToolRef.current = activeTool;
    }, [activeTool]);

    useEffect(() => {
      onModifiedRef.current = onFurnitureModified;
    }, [onFurnitureModified]);

    useEffect(() => {
      onPlaceRef.current = onPlaceAtPoint;
    }, [onPlaceAtPoint]);

    useEffect(() => {
      onWallDrawnRef.current = onWallDrawn;
    }, [onWallDrawn]);

    useEffect(() => {
      onOpeningPlacedRef.current = onOpeningPlaced;
    }, [onOpeningPlaced]);

    useEffect(() => {
      onOpeningRejectedRef.current = onOpeningRejected;
    }, [onOpeningRejected]);

    useEffect(() => {
      activeFloorRef.current = activeFloor;
    }, [activeFloor]);

    useEffect(() => {
      onSelectionRef.current = onSelectionChange;
    }, [onSelectionChange]);

    useEffect(() => {
      onStatusChangeRef.current = onStatusChange;
    }, [onStatusChange]);

    useEffect(() => {
      pendingPlaceRef.current = pendingCatalogPlacement;
    }, [pendingCatalogPlacement]);

    useEffect(() => {
      gridEnabledRef.current = gridEnabled;
    }, [gridEnabled]);

    useEffect(() => {
      snapEnabledRef.current = snapEnabled;
    }, [snapEnabled]);

    useEffect(() => {
      gridMmRef.current = gridMm;
    }, [gridMm]);

    useEffect(() => {
      displayUnitRef.current = displayUnit;
    }, [displayUnit]);

    useEffect(() => {
      exactThicknessRef.current = exactThickness;
    }, [exactThickness]);

    useEffect(() => {
      const tool = runtimeToolFor(activeTool);
      if (tool !== "door" && tool !== "window" && tool !== "opening") {
        const canvas = fabricRef.current;
        const preview = openingPreviewLineRef.current;
        if (canvas && preview) {
          canvas.remove(preview);
          openingPreviewLineRef.current = null;
          canvas.requestRenderAll();
        }
      }
    }, [activeTool]);

    const emitStatus = useCallback(
      (nextTransform: CanvasTransform, tool: PlannerTool) => {
        onStatusChangeRef.current?.({
          snapKind: "none" as SnapKind,
          activeTool: tool,
          drawingState: "ready",
          wallCount: activeFloorRef.current?.walls.length ?? 0,
          previewLengthMm: null,
          zoomPercent: Math.round(nextTransform.scale * 1000),
          transform: nextTransform,
        });
      },
      [],
    );
    const emitStatusRef = useRef(emitStatus);
    emitStatusRef.current = emitStatus;

    useEffect(() => {
      emitStatus(transform, activeTool);
    }, [activeTool, emitStatus, transform, activeFloor?.walls.length]);

    useImperativeHandle(
      ref,
      () => ({
        undo: () => {
          if (!workspaceCanvas?.canUndo) return false;
          workspaceCanvas.undo();
          return true;
        },
        redo: () => {
          if (!workspaceCanvas?.canRedo) return false;
          workspaceCanvas.redo();
          return true;
        },
        cancel: () => {
          clearWallSession();
        },
        commit: () => {
          // Enter matches the draw form: typed length/angle/thickness (fields track the pointer).
          if (!wallDrawRef.current || !previewLineRef.current) return;
          commitExactWallValues();
        },
        resetZoom: () => setTransform(DEFAULT_FABRIC_STAGE_TRANSFORM),
        fitToView: () => setTransform(DEFAULT_FABRIC_STAGE_TRANSFORM),
        setTool: () => {},
        getProject: () => workspaceCanvas?.project ?? createPlannerProject(),
        focusOnPoint: (xMm: number, yMm: number) => {
          const host = hostRef.current;
          if (!host) return;
          const width = host.clientWidth;
          const height = host.clientHeight;
          setTransform((current) => ({
            ...current,
            origin: {
              x: xMm - width / 2 / current.scale,
              y: yMm - height / 2 / current.scale,
            },
          }));
        },
      }),
      [clearWallSession, commitExactWallValues, workspaceCanvas],
    );

    useEffect(() => {
      const lower = lowerCanvasRef.current;
      const host = hostRef.current;
      if (!lower || !host) return;

      const canvas = new Canvas(lower, {
        selection: false,
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        skipTargetFind: false,
        enableRetinaScaling: true,
        // Prefer pointer events so Playwright/Chromium drag gestures do not
        // enter HTML5 drag mode mid wall stroke.
        enablePointerEvents: true,
        // Fabric 7 defaults fire middle/right clicks; wall tools are left-only.
        fireRightClick: false,
        fireMiddleClick: false,
        stopContextMenu: true,
        backgroundColor: fabricBackgroundPaint(gridEnabledRef.current),
      });
      fabricRef.current = canvas;
      const fabricExtensions = installPlannerFabricExtensions(canvas);
      // Scene-aware E2E helpers (firstFurnitureCenter) read this hook.
      (
        window as unknown as { __plannerFabricView?: Canvas }
      ).__plannerFabricView = canvas;

      // Fabric marks upper canvas draggable=true; long wall drags then fire
      // native dragstart and drop mouseup — wall never commits. Kill that path.
      const upperEl = canvas.upperCanvasEl;
      if (upperEl) {
        upperEl.draggable = false;
        upperEl.setAttribute("draggable", "false");
      }
      const blockDragStart = (event: Event) => {
        event.preventDefault();
      };
      upperEl?.addEventListener("dragstart", blockDragStart);

      const clearOpeningPreview = () => {
        const preview = openingPreviewLineRef.current;
        if (preview) {
          canvas.remove(preview);
          openingPreviewLineRef.current = null;
          canvas.requestRenderAll();
        }
      };

      const syncOpeningPreview = (clientX: number, clientY: number) => {
        const uiTool = activeToolRef.current;
        const tool = runtimeToolFor(uiTool);
        if (tool !== "door" && tool !== "window" && tool !== "opening") {
          clearOpeningPreview();
          return;
        }
        const floor = activeFloorRef.current;
        if (!floor || floor.walls.length === 0) {
          clearOpeningPreview();
          return;
        }
        const screen = hostPoint(host, clientX, clientY);
        const projectPoint = screenToProject(screen, transformRef.current);
        const kind = openingKindFromTool(tool);
        const widthMm = defaultOpeningWidthMm(kind);
        const resolved = resolveOpeningPlacementAtPoint(
          projectPoint,
          floor.walls,
          widthMm,
          floor.doors,
          floor.windows,
        );
        if ("rejected" in resolved) {
          clearOpeningPreview();
          return;
        }
        const wall = floor.walls.find((item) => item.id === resolved.wallId);
        if (!wall) {
          clearOpeningPreview();
          return;
        }
        const endpoints = openingLineEndpointsMm(wall, resolved.position, widthMm);
        const startScreen = projectToScreen(endpoints.start, transformRef.current);
        const endScreen = projectToScreen(endpoints.end, transformRef.current);
        const strokeToken =
          kind === "window"
            ? PLANNER_COLOR_TOKENS.windowStroke
            : PLANNER_COLOR_TOKENS.doorFill;
        const stroke = resolveStageColor(
          strokeToken,
          kind === "window" ? "#0369a1" : "#b45309",
        );
        let preview = openingPreviewLineRef.current;
        if (!preview) {
          preview = new Line([startScreen.x, startScreen.y, endScreen.x, endScreen.y], {
            stroke,
            strokeWidth: 5,
            selectable: false,
            evented: false,
            objectCaching: false,
            opacity: 0.65,
          });
          canvas.add(preview);
          openingPreviewLineRef.current = preview;
        } else {
          preview.set({
            x1: startScreen.x,
            y1: startScreen.y,
            x2: endScreen.x,
            y2: endScreen.y,
            stroke,
          });
          preview.setCoords();
        }
        canvas.requestRenderAll();
      };

      const clearWallPreview = () => {
        const preview = previewLineRef.current;
        if (preview) {
          canvas.remove(preview);
          previewLineRef.current = null;
        }
        clearWallSnapMarker(canvas, snapMarkerHandleRef.current);
        wallDrawRef.current = null;
        setWallReadout(null);
        canvas.requestRenderAll();
      };

      const commitWallAt = (clientX: number, clientY: number, orthogonal = false) => {
        const wallSession = wallDrawRef.current;
        const preview = previewLineRef.current;
        if (!wallSession) return;
        const screen = hostPoint(host, clientX, clientY);
        const rawEnd = screenToProject(screen, transformRef.current);
        const floor = activeFloorRef.current;
        const snappedEnd = snapProjectPoint({
          raw: rawEnd,
          start: wallSession.start,
          walls: floor?.walls ?? [],
          transform: transformRef.current,
          snapEnabled: snapEnabledRef.current,
          gridMm: gridMmRef.current,
          orthogonal,
        });
        const end = snappedEnd.point;
        if (shouldCommitWallSegment(wallSession.start, end)) {
          const thicknessMm =
            parseLengthInput(exactThicknessRef.current, displayUnitRef.current) ?? 150;
          onWallDrawnRef.current?.(wallSession.start, end, { thicknessMm });
          const endScreen = projectToScreen(end, transformRef.current);
          wallDrawRef.current = { start: end, pointerId: wallSession.pointerId };
          if (preview) {
            preview.set({
              x1: endScreen.x,
              y1: endScreen.y,
              x2: endScreen.x,
              y2: endScreen.y,
            });
            preview.setCoords();
          }
          setWallReadout(null);
          canvas.requestRenderAll();
          emitStatusRef.current(transformRef.current, "wall");
        }
      };

      const startWallAt = (clientX: number, clientY: number, pointerId: number) => {
        const screen = hostPoint(host, clientX, clientY);
        const rawStart = screenToProject(screen, transformRef.current);
        const floor = activeFloorRef.current;
        const snappedStart = snapProjectPoint({
          raw: rawStart,
          start: null,
          walls: floor?.walls ?? [],
          transform: transformRef.current,
          snapEnabled: snapEnabledRef.current,
          gridMm: gridMmRef.current,
        });
        const start = snappedStart.point;
        const startScreen = projectToScreen(start, transformRef.current);
        // Drop any prior preview (stale session / double-down).
        if (previewLineRef.current) {
          canvas.remove(previewLineRef.current);
          previewLineRef.current = null;
        }
        const preview = new Line(
          [startScreen.x, startScreen.y, startScreen.x, startScreen.y],
          {
            stroke: resolveStageColor(PLANNER_COLOR_TOKENS.wallStroke, "#64748b"),
            strokeWidth: 5,
            selectable: false,
            evented: false,
            objectCaching: false,
          },
        );
        canvas.add(preview);
        previewLineRef.current = preview;
        wallDrawRef.current = { start, pointerId };
        setExactLength(formatLengthInput(0, displayUnitRef.current));
        setExactAngle("0");
        setExactError(null);
        setWallReadout({
          x: startScreen.x,
          y: startScreen.y,
          lengthMm: 0,
          angleDegrees: 0,
          snapKind: snappedStart.kind,
        });
        syncWallSnapMarker({
          canvas,
          handle: snapMarkerHandleRef.current,
          screen: startScreen,
          kind: snappedStart.kind,
          stroke: resolveStageColor(PLANNER_COLOR_TOKENS.alignGuide, "#2563eb"),
        });
        emitStatusRef.current(transformRef.current, "wall");
      };

      const updateWallAt = (clientX: number, clientY: number, orthogonal = false) => {
        const wallSession = wallDrawRef.current;
        const preview = previewLineRef.current;
        if (!wallSession || !preview) return;
        const screen = hostPoint(host, clientX, clientY);
        const rawEnd = screenToProject(screen, transformRef.current);
        const floor = activeFloorRef.current;
        const snappedEnd = snapProjectPoint({
          raw: rawEnd,
          start: wallSession.start,
          walls: floor?.walls ?? [],
          transform: transformRef.current,
          snapEnabled: snapEnabledRef.current,
          gridMm: gridMmRef.current,
          orthogonal,
        });
        const end = snappedEnd.point;
        const endScreen = projectToScreen(end, transformRef.current);
        preview.set({ x2: endScreen.x, y2: endScreen.y });
        syncWallSnapMarker({
          canvas,
          handle: snapMarkerHandleRef.current,
          screen: endScreen,
          kind: snappedEnd.kind,
          stroke: resolveStageColor(PLANNER_COLOR_TOKENS.alignGuide, "#2563eb"),
        });
        setWallReadout({
          x: endScreen.x,
          y: endScreen.y,
          lengthMm: wallSegmentLengthMm(wallSession.start, end),
          angleDegrees:
            (Math.atan2(end.y - wallSession.start.y, end.x - wallSession.start.x) * 180) /
            Math.PI,
          snapKind: snappedEnd.kind,
        });
        setExactLength(
          formatLengthInput(
            wallSegmentLengthMm(wallSession.start, end),
            displayUnitRef.current,
          ),
        );
        setExactAngle(
          String(Number(wallSegmentAngleDegrees(wallSession.start, end).toFixed(1))),
        );
        onStatusChangeRef.current?.({
          snapKind: snappedEnd.kind,
          activeTool: "wall",
          drawingState: "drawing",
          wallCount: activeFloorRef.current?.walls.length ?? 0,
          previewLengthMm: Math.round(wallSegmentLengthMm(wallSession.start, end)),
          zoomPercent: Math.round(transformRef.current.scale * 1000),
          transform: transformRef.current,
        });
        canvas.requestRenderAll();
      };

      const handleModified = (event: ModifiedEvent) => {
        if (rebuildingRef.current) return;
        const target = event.target as FabricObject | undefined;
        if (!target) return;
        const entityId = readFurnitureEntityId(target);
        if (!entityId) return;
        const update = fabricPoseToDocumentUpdate(
          {
            entityId,
            left: target.left ?? 0,
            top: target.top ?? 0,
            angle: target.angle ?? 0,
          },
          transformRef.current,
        );
        onModifiedRef.current?.(update);
      };

      /**
       * Geometry tools (wall/place/opening/pan) run on the host in capture phase
       * so Fabric's upper-canvas draggable / findTarget cannot swallow the stroke.
       * Select still uses Fabric mouse:down for object hit-testing.
       * Accept PointerEvent | MouseEvent — Playwright mouse API is reliable in both.
       */
      const pointerIdOf = (event: PointerEvent | MouseEvent): number => {
        if ("pointerId" in event && typeof event.pointerId === "number") {
          return event.pointerId;
        }
        return 1;
      };

      const handleHostPointerDown = (event: PointerEvent | MouseEvent) => {
        if (event.button !== 0) return;
        if (
          event.target instanceof Element &&
          event.target.closest("[data-wall-input]")
        ) {
          return;
        }
        const uiTool = activeToolRef.current;
        const tool = runtimeToolFor(uiTool);
        const pointerId = pointerIdOf(event);

        if (pendingPlaceRef.current && onPlaceRef.current) {
          event.preventDefault();
          const pt = hostPoint(host, event.clientX, event.clientY);
          onPlaceRef.current(screenToProject(pt, transformRef.current));
          return;
        }

        if (tool === "wall") {
          event.preventDefault();
          event.stopPropagation();
          if (wallDrawRef.current) {
            updateWallAt(event.clientX, event.clientY, event.shiftKey);
            commitWallAt(event.clientX, event.clientY, event.shiftKey);
            return;
          }
          startWallAt(event.clientX, event.clientY, pointerId);
          if ("pointerId" in event) {
            try {
              host.setPointerCapture(event.pointerId);
            } catch {
              // Capture is best-effort; window-level up still commits.
            }
          }
          return;
        }

        if (tool === "door" || tool === "window" || tool === "opening") {
          const floor = activeFloorRef.current;
          if (!floor || !onOpeningPlacedRef.current) return;
          event.preventDefault();
          event.stopPropagation();
          const screen = hostPoint(host, event.clientX, event.clientY);
          const kind = openingKindFromTool(tool);
          const widthMm = defaultOpeningWidthMm(kind);
          const resolved = resolveOpeningPlacementAtPoint(
            screenToProject(screen, transformRef.current),
            floor.walls,
            widthMm,
            floor.doors,
            floor.windows,
          );
          if ("rejected" in resolved) {
            onOpeningRejectedRef.current?.(resolved.reason);
            clearOpeningPreview();
            return;
          }
          onOpeningPlacedRef.current(resolved.wallId, resolved.position, kind);
          clearOpeningPreview();
          return;
        }

        if (tool === "pan") {
          event.preventDefault();
          event.stopPropagation();
          panSessionRef.current = {
            pointerId,
            screen: hostPoint(host, event.clientX, event.clientY),
            origin: { ...transformRef.current.origin },
          };
          if ("pointerId" in event) {
            try {
              host.setPointerCapture(event.pointerId);
            } catch {
              // ignore
            }
          }
        }
      };

      const handleHostPointerMove = (event: PointerEvent | MouseEvent) => {
        if (wallDrawRef.current) {
          updateWallAt(event.clientX, event.clientY, event.shiftKey);
          return;
        }
        const uiTool = activeToolRef.current;
        const tool = runtimeToolFor(uiTool);
        if (tool === "door" || tool === "window" || tool === "opening") {
          syncOpeningPreview(event.clientX, event.clientY);
          return;
        }
        clearOpeningPreview();
        const session = panSessionRef.current;
        if (!session || session.pointerId !== pointerIdOf(event)) return;
        const screen = hostPoint(host, event.clientX, event.clientY);
        const dx = screen.x - session.screen.x;
        const dy = screen.y - session.screen.y;
        setTransform((current) => ({
          ...current,
          origin: {
            x: session.origin.x - dx / current.scale,
            y: session.origin.y - dy / current.scale,
          },
        }));
      };

      const handleHostPointerUp = (event: PointerEvent | MouseEvent) => {
        if (
          event.target instanceof Element &&
          event.target.closest("[data-wall-input]")
        ) {
          return;
        }
        if (wallDrawRef.current) {
          commitWallAt(event.clientX, event.clientY, event.shiftKey);
          if ("pointerId" in event) {
            try {
              if (host.hasPointerCapture(event.pointerId)) {
                host.releasePointerCapture(event.pointerId);
              }
            } catch {
              // ignore
            }
          }
          return;
        }
        if (panSessionRef.current?.pointerId === pointerIdOf(event)) {
          panSessionRef.current = null;
          if ("pointerId" in event) {
            try {
              if (host.hasPointerCapture(event.pointerId)) {
                host.releasePointerCapture(event.pointerId);
              }
            } catch {
              // ignore
            }
          }
        }
      };

      // Window backup: if pointerup is lost on the host (HTML5 drag residual),
      // still commit any open wall session from the last known client point.
      const handleWindowPointerUp = (event: PointerEvent | MouseEvent) => {
        if (
          event.target instanceof Element &&
          event.target.closest("[data-wall-input]")
        ) {
          return;
        }
        if (!wallDrawRef.current) return;
        commitWallAt(event.clientX, event.clientY, event.shiftKey);
      };

      const handleFabricSelectDown = (opt: TPointerEventInfo) => {
        const uiTool = activeToolRef.current;
        const tool = runtimeToolFor(uiTool);
        if (tool !== "select") return;
        if (pendingPlaceRef.current) return;
        const nativeEvent = opt.e as PointerEvent | MouseEvent | undefined;
        if (!nativeEvent) return;
        const hit =
          (opt.target as FabricObject | undefined) ??
          canvas.findTarget(nativeEvent);
        const next = selectionFromFabricTarget(
          hit as Parameters<typeof selectionFromFabricTarget>[0],
        );
        onSelectionRef.current?.(next);
      };

      const handleSelection = () => {
        const target = canvas.getActiveObject();
        const next = selectionFromFabricTarget(target);
        if (next) onSelectionRef.current?.(next);
      };

      const handleSelectionCleared = () => onSelectionRef.current?.(null);

      canvas.on("object:modified", handleModified);
      canvas.on("mouse:down", handleFabricSelectDown);
      canvas.on("selection:created", handleSelection);
      canvas.on("selection:updated", handleSelection);
      canvas.on("selection:cleared", handleSelectionCleared);

      // Capture phase: wall/pan/place before Fabric upper-canvas handlers.
      const captureOpts: AddEventListenerOptions = { capture: true };
      host.addEventListener("pointerdown", handleHostPointerDown, captureOpts);
      host.addEventListener("pointermove", handleHostPointerMove, captureOpts);
      host.addEventListener("pointerup", handleHostPointerUp, captureOpts);
      host.addEventListener("pointercancel", handleHostPointerUp, captureOpts);
      // Mouse fallback for engines that only synthesize mouse events (Playwright CDP).
      host.addEventListener("mousedown", handleHostPointerDown, captureOpts);
      host.addEventListener("mousemove", handleHostPointerMove, captureOpts);
      host.addEventListener("mouseup", handleHostPointerUp, captureOpts);
      window.addEventListener("pointerup", handleWindowPointerUp);
      window.addEventListener("mouseup", handleWindowPointerUp);

      const resize = () => {
        // Prefer layout box (client*) over getBoundingClientRect so a blown
        // scroll height cannot pin Fabric to multi-viewport canvas sizes.
        const region =
          host.closest(".canvas") ??
          host.closest(".open3d-canvas-with-rail");
        const regionH =
          region instanceof HTMLElement ? region.clientHeight : 0;
        const regionW =
          region instanceof HTMLElement ? region.clientWidth : 0;
        const w = Math.max(
          1,
          Math.floor(
            host.clientWidth ||
              regionW ||
              host.getBoundingClientRect().width,
          ),
        );
        let h = Math.max(
          1,
          Math.floor(
            host.clientHeight ||
              regionH ||
              host.getBoundingClientRect().height,
          ),
        );
        if (regionH > 0) {
          h = Math.min(h, regionH);
        }
        // Hard cap: never paint a stage taller than the window (select hit-tests).
        const maxH = Math.max(240, Math.floor(window.innerHeight));
        h = Math.min(h, maxH);
        if (canvas.width === w && canvas.height === h) return;
        canvas.setDimensions({ width: w, height: h });
        canvas.requestRenderAll();
      };
      resize();
      const observer = new ResizeObserver(() => {
        resize();
      });
      observer.observe(host);
      const canvasRegion = host.closest(".canvas");
      if (canvasRegion instanceof HTMLElement) {
        observer.observe(canvasRegion);
      }
      const railRegion = host.closest(".open3d-canvas-with-rail");
      if (railRegion instanceof HTMLElement && railRegion !== canvasRegion) {
        observer.observe(railRegion);
      }

      return () => {
        canvas.off("object:modified", handleModified);
        canvas.off("mouse:down", handleFabricSelectDown);
        canvas.off("selection:created", handleSelection);
        canvas.off("selection:updated", handleSelection);
        canvas.off("selection:cleared", handleSelectionCleared);
        host.removeEventListener("pointerdown", handleHostPointerDown, captureOpts);
        host.removeEventListener("pointermove", handleHostPointerMove, captureOpts);
        host.removeEventListener("pointerup", handleHostPointerUp, captureOpts);
        host.removeEventListener("pointercancel", handleHostPointerUp, captureOpts);
        host.removeEventListener("mousedown", handleHostPointerDown, captureOpts);
        host.removeEventListener("mousemove", handleHostPointerMove, captureOpts);
        host.removeEventListener("mouseup", handleHostPointerUp, captureOpts);
        window.removeEventListener("pointerup", handleWindowPointerUp);
        window.removeEventListener("mouseup", handleWindowPointerUp);
        upperEl?.removeEventListener("dragstart", blockDragStart);
        clearWallPreview();
        clearOpeningPreview();
        fabricExtensions.dispose();
        observer.disconnect();
        canvas.dispose();
        fabricRef.current = null;
        const w = window as unknown as { __plannerFabricView?: Canvas };
        if (w.__plannerFabricView === canvas) {
          delete w.__plannerFabricView;
        }
      };
      // Mount once — scene rebuild + refs handle document/tool updates.
      // Do not recreate Fabric when wall count changes (that aborted draws).
    }, []);

    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas || !activeFloor) return;

      rebuildingRef.current = true;
      // Preserve in-progress wall preview across document rebuilds so a live
      // stroke is not wiped mid-drag (HTML5 drag residual / status re-render).
      const livePreview = previewLineRef.current;
      canvas.clear();
      // clear() drops the snap glyph; drop the stale handle so the next move recreates it.
      snapMarkerHandleRef.current.marker = null;
      snapMarkerHandleRef.current.kind = "none";
      canvas.backgroundColor = fabricBackgroundPaint(gridEnabledRef.current);

      const showWalls = layerVisibility?.walls !== false;
      const showFurniture = layerVisibility?.furniture !== false;
      const interactive = activeTool === "select";

      if (showWalls) {
        const wallStroke = resolveStageColor(
          PLANNER_COLOR_TOKENS.wallStroke,
          "#64748b",
        );
        for (const wall of activeFloor.walls) {
          const a = projectToScreen(wall.start, transform);
          const b = projectToScreen(wall.end, transform);
          const line = new Line([a.x, a.y, b.x, b.y], {
            stroke: wallStroke,
            strokeWidth: 5,
            evented: activeTool === "select",
            selectable: activeTool === "select",
            objectCaching: false,
          });
          writeCanvasEntityType(line, "wall");
          writeFurnitureEntityId(line, wall.id);
          canvas.add(line);
        }
      }

      if (showFurniture) {
        for (const item of activeFloor.furniture) {
          const pose = furnitureToFabricPose(item, transform);
          const symbol = createFabricFurnitureSymbol(
            item,
            pose,
            {
              interactive,
              resolveColor: resolveStageColor,
            },
            () => setSvgPaintEpoch((epoch) => epoch + 1),
          );
          writeCanvasEntityType(symbol, "furniture");
          writeFurnitureEntityId(symbol, pose.entityId);
          canvas.add(symbol);
        }
      }

      for (const door of activeFloor.doors) {
        const wall = activeFloor.walls.find((item) => item.id === door.wallId);
        if (!wall) continue;
        const wallLength = Math.hypot(
          wall.end.x - wall.start.x,
          wall.end.y - wall.start.y,
        );
        if (wallLength === 0) continue;
        const unit = {
          x: (wall.end.x - wall.start.x) / wallLength,
          y: (wall.end.y - wall.start.y) / wallLength,
        };
        const point = {
          x: wall.start.x + (wall.end.x - wall.start.x) * door.position,
          y: wall.start.y + (wall.end.y - wall.start.y) * door.position,
        };
        const halfWidth = door.width / 2;
        const start = projectToScreen(
          { x: point.x - unit.x * halfWidth, y: point.y - unit.y * halfWidth },
          transform,
        );
        const end = projectToScreen(
          { x: point.x + unit.x * halfWidth, y: point.y + unit.y * halfWidth },
          transform,
        );
        const marker = new Line([start.x, start.y, end.x, end.y], {
          stroke: resolveStageColor(PLANNER_COLOR_TOKENS.doorFill, "#b45309"),
          strokeWidth: 7,
          selectable: interactive,
          evented: interactive,
          objectCaching: false,
        });
        writeCanvasEntityType(marker, "door");
        writeFurnitureEntityId(marker, door.id);
        canvas.add(marker);
      }

      for (const window of activeFloor.windows) {
        const wall = activeFloor.walls.find((item) => item.id === window.wallId);
        if (!wall) continue;
        const wallLength = Math.hypot(
          wall.end.x - wall.start.x,
          wall.end.y - wall.start.y,
        );
        if (wallLength === 0) continue;
        const unit = {
          x: (wall.end.x - wall.start.x) / wallLength,
          y: (wall.end.y - wall.start.y) / wallLength,
        };
        const point = {
          x: wall.start.x + (wall.end.x - wall.start.x) * window.position,
          y: wall.start.y + (wall.end.y - wall.start.y) * window.position,
        };
        const halfWidth = window.width / 2;
        const start = projectToScreen(
          { x: point.x - unit.x * halfWidth, y: point.y - unit.y * halfWidth },
          transform,
        );
        const end = projectToScreen(
          { x: point.x + unit.x * halfWidth, y: point.y + unit.y * halfWidth },
          transform,
        );
        const marker = new Line([start.x, start.y, end.x, end.y], {
          stroke: resolveStageColor(PLANNER_COLOR_TOKENS.windowStroke, "#0369a1"),
          strokeWidth: 7,
          selectable: interactive,
          evented: interactive,
          objectCaching: false,
        });
        writeCanvasEntityType(marker, "window");
        writeFurnitureEntityId(marker, window.id);
        canvas.add(marker);
      }

      if (livePreview && wallDrawRef.current) {
        canvas.add(livePreview);
        previewLineRef.current = livePreview;
      } else {
        previewLineRef.current = null;
      }

      canvas.selection = false;
      canvas.skipTargetFind = !interactive;
      canvas.requestRenderAll();
      rebuildingRef.current = false;
    }, [activeFloor, activeTool, layerVisibility, transform, svgPaintEpoch]);

    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      canvas.backgroundColor = fabricBackgroundPaint(gridEnabled);
      canvas.requestRenderAll();
    }, [gridEnabled]);

    const handleWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      const host = hostRef.current;
      if (!host) return;
      const pt = hostPoint(host, event.clientX, event.clientY);
      setTransform((current) =>
        zoomTransformAt(current, pt, event.deltaY > 0 ? 0.9 : 1.1),
      );
    }, []);

    const cursorClass =
      pendingCatalogPlacement || activeTool === "placement"
        ? styles.cursorPlacement
        : activeTool === "pan"
          ? styles.cursorPan
          : styles.cursorDefault;

    const gridOverlayStyle = plannerGridOverlayStyle(transform, gridMm);

    return (
      <div
        ref={hostRef}
        className={`open3d-canvas-embedded ${styles.root} ${gridEnabled ? styles.rootWithGrid : ""} ${cursorClass}`}
        data-testid="planner-fabric-stage"
        data-grid-enabled={gridEnabled ? "true" : "false"}
        data-snap-enabled={snapEnabled ? "true" : "false"}
        role="application"
        onWheel={handleWheel}
        aria-label={
          pendingCatalogPlacement && placementItemLabel
            ? `Click to place ${placementItemLabel}`
            : "Office plan canvas"
        }
      >
        {gridEnabled ? (
          <div
            className={styles.gridOverlay}
            style={gridOverlayStyle}
            aria-hidden
            data-testid="planner-grid-overlay"
          />
        ) : null}
        <canvas ref={lowerCanvasRef} className={styles.canvasHost} />
        {wallReadout ? (
          <form
            className={styles.wallReadout}
            style={{ left: wallReadout.x, top: wallReadout.y }}
            data-snap-kind={wallReadout.snapKind}
            data-wall-input="true"
            aria-label="Exact wall input"
            onSubmit={commitExactWall}
          >
            <label>
              <span>Length</span>
              <input
                value={exactLength}
                onChange={(event) => setExactLength(event.target.value)}
                aria-label={`Wall length (${displayUnit})`}
                inputMode="decimal"
              />
            </label>
            <label>
              <span>Angle</span>
              <input
                value={exactAngle}
                onChange={(event) => setExactAngle(event.target.value)}
                aria-label="Wall angle (degrees)"
                inputMode="decimal"
              />
            </label>
            <label>
              <span>Wall</span>
              <input
                value={exactThickness}
                onChange={(event) => setExactThickness(event.target.value)}
                aria-label={`Wall thickness (${displayUnit})`}
                inputMode="decimal"
              />
            </label>
            <button type="submit">Commit</button>
            {wallReadout.snapKind !== "none" ? (
              <span>Snap: {wallReadout.snapKind}</span>
            ) : null}
            <span className={styles.wallReadoutLive} aria-live="polite">
              {formatLengthDisplay(wallReadout.lengthMm, displayUnit)} ·{" "}
              {formatAngleDisplay(wallReadout.angleDegrees)}
            </span>
            {exactError ? <span className={styles.wallReadoutError} role="alert">{exactError}</span> : null}
          </form>
        ) : null}
      </div>
    );
  },
);

PlannerFabricStage.displayName = "PlannerFabricStage";
