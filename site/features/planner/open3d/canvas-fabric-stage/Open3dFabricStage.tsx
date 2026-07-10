"use client";

/**
 * Live 2-D planner stage (Fabric.js). Sole production plan canvas — no FeasibilityCanvas fallback.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { Canvas, Line, Rect, type FabricObject, type ModifiedEvent, type TPointerEventInfo } from "fabric";

import type { PlannerTool } from "../editor/canvasTool";
import type { Open3dLayerVisibility } from "../editor/layerVisibility";
import type { WorkspaceCanvasContext } from "../editor/useWorkspaceCanvas";
import {
  projectToScreen,
  screenToProject,
  zoomTransformAt,
  type CanvasTransform,
  type SnapKind,
} from "../lib/geometry/snapping";
import { createOpen3dProject } from "../model/project";
import type { Open3dFloor, Open3dPoint } from "../model/types";
import { resolvePaintColor } from "../shared/readThemeColor";
import { PLANNER_COLOR_TOKENS } from "../shared/themeColorTokens";
import type {
  CanvasStatusSnapshot,
  Open3dCanvasStageHandle,
} from "./canvasStageTypes";
import {
  DEFAULT_FABRIC_STAGE_TRANSFORM,
  fabricPoseToDocumentUpdate,
  furnitureToFabricPose,
  readFurnitureEntityId,
  writeFurnitureEntityId,
  type FurnitureDocumentPoseUpdate,
} from "./furnitureFabricMapper";
import styles from "./open3dFabricStage.module.css";

export type Open3dFabricStageProps = {
  activeTool?: PlannerTool;
  layerVisibility?: Open3dLayerVisibility;
  workspaceCanvas?: WorkspaceCanvasContext;
  activeFloor?: Open3dFloor;
  pendingCatalogPlacement?: boolean;
  placementItemLabel?: string | null;
  onPlaceAtPoint?: (point: Open3dPoint) => void;
  onStatusChange?: (status: CanvasStatusSnapshot) => void;
  onFurnitureModified?: (update: FurnitureDocumentPoseUpdate) => void;
};

type PanSession = {
  pointerId: number;
  screen: Open3dPoint;
  origin: Open3dPoint;
};

function hostPoint(host: HTMLElement, clientX: number, clientY: number): Open3dPoint {
  const rect = host.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function resolveStageColor(token: string, fallback: string): string {
  try {
    return resolvePaintColor(undefined, token);
  } catch {
    return fallback;
  }
}

export const Open3dFabricStage = forwardRef<Open3dCanvasStageHandle, Open3dFabricStageProps>(
  function Open3dFabricStage(
    {
      activeTool = "select",
      layerVisibility,
      workspaceCanvas,
      activeFloor,
      pendingCatalogPlacement = false,
      placementItemLabel = null,
      onPlaceAtPoint,
      onStatusChange,
      onFurnitureModified,
    },
    ref,
  ) {
    const hostRef = useRef<HTMLDivElement>(null);
    const lowerCanvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);
    const [transform, setTransform] = useState<CanvasTransform>(DEFAULT_FABRIC_STAGE_TRANSFORM);
    const transformRef = useRef(transform);
    const activeToolRef = useRef(activeTool);
    const rebuildingRef = useRef(false);
    const panSessionRef = useRef<PanSession | null>(null);
    const onModifiedRef = useRef(onFurnitureModified);
    const onPlaceRef = useRef(onPlaceAtPoint);
    const pendingPlaceRef = useRef(pendingCatalogPlacement);

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
      pendingPlaceRef.current = pendingCatalogPlacement;
    }, [pendingCatalogPlacement]);

    const emitStatus = useCallback(
      (nextTransform: CanvasTransform, tool: PlannerTool) => {
        onStatusChange?.({
          snapKind: "none" as SnapKind,
          activeTool: tool,
          drawingState: "ready",
          wallCount: activeFloor?.walls.length ?? 0,
          previewLengthMm: null,
          zoomPercent: Math.round(nextTransform.scale * 1000),
          transform: nextTransform,
        });
      },
      [activeFloor?.walls.length, onStatusChange],
    );

    useEffect(() => {
      emitStatus(transform, activeTool);
    }, [activeTool, emitStatus, transform]);

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
        cancel: () => {},
        commit: () => {},
        resetZoom: () => setTransform(DEFAULT_FABRIC_STAGE_TRANSFORM),
        fitToView: () => setTransform(DEFAULT_FABRIC_STAGE_TRANSFORM),
        setTool: () => {},
        getProject: () => workspaceCanvas?.project ?? createOpen3dProject(),
      }),
      [workspaceCanvas],
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
        backgroundColor: resolveStageColor(
          PLANNER_COLOR_TOKENS.exportBackground,
          "#f8fafc",
        ),
      });
      fabricRef.current = canvas;

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

      const handlePointerDown = (opt: TPointerEventInfo) => {
        const hostEl = hostRef.current;
        const nativeEvent = opt.e as PointerEvent | undefined;
        if (!hostEl || !nativeEvent) return;
        const tool = activeToolRef.current;

        if (pendingPlaceRef.current && onPlaceRef.current) {
          const pt = hostPoint(hostEl, nativeEvent.clientX, nativeEvent.clientY);
          onPlaceRef.current(screenToProject(pt, transformRef.current));
          return;
        }

        if (tool === "pan") {
          panSessionRef.current = {
            pointerId: nativeEvent.pointerId ?? 1,
            screen: hostPoint(hostEl, nativeEvent.clientX, nativeEvent.clientY),
            origin: { ...transformRef.current.origin },
          };
        }
      };

      const handlePointerMove = (opt: TPointerEventInfo) => {
        const session = panSessionRef.current;
        const hostEl = hostRef.current;
        const nativeEvent = opt.e as PointerEvent | undefined;
        if (!session || !hostEl || !nativeEvent) return;
        const screen = hostPoint(hostEl, nativeEvent.clientX, nativeEvent.clientY);
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

      const handlePointerUp = () => {
        panSessionRef.current = null;
      };

      canvas.on("object:modified", handleModified);
      canvas.on("mouse:down", handlePointerDown);
      canvas.on("mouse:move", handlePointerMove);
      canvas.on("mouse:up", handlePointerUp);

      const resize = () => {
        const rect = host.getBoundingClientRect();
        canvas.setDimensions({
          width: Math.max(1, Math.floor(rect.width)),
          height: Math.max(1, Math.floor(rect.height)),
        });
        canvas.requestRenderAll();
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(host);

      return () => {
        canvas.off("object:modified", handleModified);
        canvas.off("mouse:down", handlePointerDown);
        canvas.off("mouse:move", handlePointerMove);
        canvas.off("mouse:up", handlePointerUp);
        observer.disconnect();
        canvas.dispose();
        fabricRef.current = null;
      };
    }, []);

    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas || !activeFloor) return;

      rebuildingRef.current = true;
      canvas.clear();
      canvas.backgroundColor = resolveStageColor(
        PLANNER_COLOR_TOKENS.exportBackground,
        "#f8fafc",
      );

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
            selectable: false,
            evented: false,
            objectCaching: false,
          });
          canvas.add(line);
        }
      }

      if (showFurniture) {
        for (const item of activeFloor.furniture) {
          const pose = furnitureToFabricPose(item, transform);
          const rect = new Rect({
            left: pose.left,
            top: pose.top,
            width: pose.width,
            height: pose.height,
            angle: pose.angle,
            originX: "center",
            originY: "center",
            fill: resolveStageColor(
              PLANNER_COLOR_TOKENS.furnitureDefault,
              "#334155",
            ),
            opacity: 0.85,
            stroke: resolveStageColor(
              PLANNER_COLOR_TOKENS.furnitureStroke,
              "#94a3b8",
            ),
            strokeWidth: 1,
            selectable: interactive && !pose.locked,
            evented: interactive && !pose.locked,
            hasControls: interactive && !pose.locked,
            hasBorders: interactive && !pose.locked,
            lockScalingX: true,
            lockScalingY: true,
            lockSkewingX: true,
            lockSkewingY: true,
            objectCaching: false,
          });
          writeFurnitureEntityId(rect, pose.entityId);
          canvas.add(rect);
        }
      }

      canvas.selection = false;
      canvas.skipTargetFind = !interactive;
      canvas.requestRenderAll();
      rebuildingRef.current = false;
    }, [activeFloor, activeTool, layerVisibility, transform]);

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

    return (
      <div
        ref={hostRef}
        className={`${styles.root} ${cursorClass}`}
        data-testid="open3d-fabric-stage"
        onWheel={handleWheel}
        aria-label={
          pendingCatalogPlacement && placementItemLabel
            ? `Click to place ${placementItemLabel}`
            : "Office plan canvas"
        }
      >
        <canvas ref={lowerCanvasRef} className={styles.canvasHost} />
      </div>
    );
  },
);

Open3dFabricStage.displayName = "Open3dFabricStage";
