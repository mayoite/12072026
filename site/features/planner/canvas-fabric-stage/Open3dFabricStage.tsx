"use client";

/**
 * Live 2-D planner stage (Fabric.js). Sole production plan canvas.
 * Mounted as `PlannerCanvasStage` from `open3d/canvas-stage`. Build tools/walls here from scratch.
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
import { Canvas, Line, type FabricObject, type ModifiedEvent, type TPointerEventInfo } from "fabric";

import type { PlannerTool } from "@/features/planner/open3d/editor/canvasTool";
import type { Open3dLayerVisibility } from "@/features/planner/open3d/editor/layerVisibility";
import type { WorkspaceCanvasContext } from "@/features/planner/open3d/editor/useWorkspaceCanvas";
import {
  projectToScreen,
  screenToProject,
  zoomTransformAt,
  type CanvasTransform,
  type SnapKind,
} from "@/features/planner/open3d/lib/geometry/snapping";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import type { Open3dFloor, Open3dPoint, Open3dWall } from "@/features/planner/open3d/model/types";
import { resolvePaintColor } from "@/features/planner/open3d/shared/readThemeColor";
import { PLANNER_COLOR_TOKENS } from "@/features/planner/open3d/shared/themeColorTokens";
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
import {
  selectionFromFabricTarget,
  writeCanvasEntityType,
  type FabricCanvasEntityType,
} from "./fabricSelection";
import { createFabricFurnitureBlock } from "./fabricBlock2D";
import styles from "./open3dFabricStage.module.css";

type CanvasEntityType = FabricCanvasEntityType;

function nearestWall(
  point: Open3dPoint,
  walls: ReadonlyArray<Open3dWall>,
): { wallId: string; position: number; distance: number } | null {
  let best: { wallId: string; position: number; distance: number } | null = null;
  for (const wall of walls) {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared <= 0) continue;
    const raw = ((point.x - wall.start.x) * dx + (point.y - wall.start.y) * dy) / lengthSquared;
    const position = Math.min(1, Math.max(0, raw));
    const nearest = { x: wall.start.x + dx * position, y: wall.start.y + dy * position };
    const distance = Math.hypot(point.x - nearest.x, point.y - nearest.y);
    if (!best || distance < best.distance) best = { wallId: wall.id, position, distance };
  }
  return best;
}

export type Open3dFabricStageProps = {
  activeTool?: PlannerTool;
  layerVisibility?: Open3dLayerVisibility;
  workspaceCanvas?: WorkspaceCanvasContext;
  activeFloor?: Open3dFloor;
  pendingCatalogPlacement?: boolean;
  placementItemLabel?: string | null;
  onPlaceAtPoint?: (point: Open3dPoint) => void;
  onWallDrawn?: (start: Open3dPoint, end: Open3dPoint) => void;
  onOpeningPlaced?: (wallId: string, position: number) => void;
  onSelectionChange?: (selection: { type: CanvasEntityType; id: string } | null) => void;
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
      onWallDrawn,
      onOpeningPlaced,
      onSelectionChange,
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
    const onWallDrawnRef = useRef(onWallDrawn);
    const onOpeningPlacedRef = useRef(onOpeningPlaced);
    const onSelectionRef = useRef(onSelectionChange);
    const pendingPlaceRef = useRef(pendingCatalogPlacement);
    const activeFloorRef = useRef(activeFloor);
    const wallDrawRef = useRef<{ start: Open3dPoint; pointerId: number } | null>(null);
    const previewLineRef = useRef<Line | null>(null);

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
      activeFloorRef.current = activeFloor;
    }, [activeFloor]);

    useEffect(() => {
      onSelectionRef.current = onSelectionChange;
    }, [onSelectionChange]);

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
        cancel: () => {
          wallDrawRef.current = null;
          const preview = previewLineRef.current;
          if (preview) {
            fabricRef.current?.remove(preview);
            previewLineRef.current = null;
            fabricRef.current?.requestRenderAll();
          }
        },
        commit: () => {
          const session = wallDrawRef.current;
          const canvas = fabricRef.current;
          const preview = previewLineRef.current;
          if (!session || !canvas || !preview) return;
          const end = screenToProject(
            { x: preview.x2 ?? 0, y: preview.y2 ?? 0 },
            transformRef.current,
          );
          if (Math.hypot(end.x - session.start.x, end.y - session.start.y) >= 10) {
            onWallDrawnRef.current?.(session.start, end);
          }
          wallDrawRef.current = null;
          canvas.remove(preview);
          previewLineRef.current = null;
          canvas.requestRenderAll();
        },
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
      // Scene-aware E2E helpers (firstFurnitureCenter) read this hook.
      (
        window as unknown as { __plannerFabricView?: Canvas }
      ).__plannerFabricView = canvas;

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

        if (tool === "wall") {
          const screen = hostPoint(hostEl, nativeEvent.clientX, nativeEvent.clientY);
          const start = screenToProject(screen, transformRef.current);
          const preview = new Line([screen.x, screen.y, screen.x, screen.y], {
            stroke: resolveStageColor(PLANNER_COLOR_TOKENS.wallStroke, "#64748b"),
            strokeWidth: 5,
            selectable: false,
            evented: false,
            objectCaching: false,
          });
          canvas.add(preview);
          previewLineRef.current = preview;
          wallDrawRef.current = { start, pointerId: nativeEvent.pointerId ?? 1 };
          emitStatus(transformRef.current, tool);
          return;
        }

        if (tool === "opening" || tool === "door") {
          const floor = activeFloorRef.current;
          if (!floor || !onOpeningPlacedRef.current) return;
          const screen = hostPoint(hostEl, nativeEvent.clientX, nativeEvent.clientY);
          const hit = nearestWall(screenToProject(screen, transformRef.current), floor.walls);
          if (hit && hit.distance <= 240) {
            onOpeningPlacedRef.current(hit.wallId, hit.position);
          }
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
        const hostEl = hostRef.current;
        const nativeEvent = opt.e as PointerEvent | undefined;
        if (!hostEl || !nativeEvent) return;
        const screen = hostPoint(hostEl, nativeEvent.clientX, nativeEvent.clientY);

        const wallSession = wallDrawRef.current;
        const preview = previewLineRef.current;
        if (wallSession && preview && wallSession.pointerId === (nativeEvent.pointerId ?? 1)) {
          preview.set({ x2: screen.x, y2: screen.y });
          const end = screenToProject(screen, transformRef.current);
          onStatusChange?.({
            snapKind: "none",
            activeTool: "wall",
            drawingState: "drawing",
            wallCount: activeFloor?.walls.length ?? 0,
            previewLengthMm: Math.round(Math.hypot(end.x - wallSession.start.x, end.y - wallSession.start.y)),
            zoomPercent: Math.round(transformRef.current.scale * 1000),
            transform: transformRef.current,
          });
          canvas.requestRenderAll();
          return;
        }

        const session = panSessionRef.current;
        if (!session) return;
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

      const handlePointerUp = (opt: TPointerEventInfo) => {
        const nativeEvent = opt.e as PointerEvent | undefined;
        const wallSession = wallDrawRef.current;
        const preview = previewLineRef.current;
        if (wallSession && preview && nativeEvent) {
          const hostEl = hostRef.current;
          if (hostEl && wallSession.pointerId === (nativeEvent.pointerId ?? 1)) {
            const screen = hostPoint(hostEl, nativeEvent.clientX, nativeEvent.clientY);
            const end = screenToProject(screen, transformRef.current);
            if (Math.hypot(end.x - wallSession.start.x, end.y - wallSession.start.y) >= 10) {
              onWallDrawnRef.current?.(wallSession.start, end);
            }
            wallDrawRef.current = null;
            canvas.remove(preview);
            previewLineRef.current = null;
            canvas.requestRenderAll();
            emitStatus(transformRef.current, "wall");
            return;
          }
        }
        panSessionRef.current = null;
      };

      const handleSelection = () => {
        const target = canvas.getActiveObject();
        const next = selectionFromFabricTarget(target);
        if (next) onSelectionRef.current?.(next);
      };

      const handleSelectionCleared = () => onSelectionRef.current?.(null);

      canvas.on("object:modified", handleModified);
      canvas.on("mouse:down", handlePointerDown);
      canvas.on("mouse:move", handlePointerMove);
      canvas.on("mouse:up", handlePointerUp);
      canvas.on("selection:created", handleSelection);
      canvas.on("selection:updated", handleSelection);
      canvas.on("selection:cleared", handleSelectionCleared);

      const resize = () => {
        const rect = host.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width));
        const h = Math.max(1, Math.floor(rect.height));
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

      return () => {
        canvas.off("object:modified", handleModified);
        canvas.off("mouse:down", handlePointerDown);
        canvas.off("mouse:move", handlePointerMove);
        canvas.off("mouse:up", handlePointerUp);
        canvas.off("selection:created", handleSelection);
        canvas.off("selection:updated", handleSelection);
        canvas.off("selection:cleared", handleSelectionCleared);
        observer.disconnect();
        canvas.dispose();
        fabricRef.current = null;
        const w = window as unknown as { __plannerFabricView?: Canvas };
        if (w.__plannerFabricView === canvas) {
          delete w.__plannerFabricView;
        }
      };
    }, [activeFloor?.walls.length, emitStatus, onStatusChange]);

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
          const symbol = createFabricFurnitureBlock(item, pose, {
            interactive,
            resolveColor: resolveStageColor,
          });
          writeCanvasEntityType(symbol, "furniture");
          writeFurnitureEntityId(symbol, pose.entityId);
          canvas.add(symbol);
        }
      }

      for (const door of activeFloor.doors) {
        const wall = activeFloor.walls.find((item) => item.id === door.wallId);
        if (!wall) continue;
        const point = {
          x: wall.start.x + (wall.end.x - wall.start.x) * door.position,
          y: wall.start.y + (wall.end.y - wall.start.y) * door.position,
        };
        const screen = projectToScreen(point, transform);
        const marker = new Line([screen.x - 8, screen.y - 8, screen.x + 8, screen.y + 8], {
          stroke: "#b45309",
          strokeWidth: 3,
          selectable: false,
          evented: false,
          objectCaching: false,
        });
        canvas.add(marker);
      }

      for (const window of activeFloor.windows) {
        const wall = activeFloor.walls.find((item) => item.id === window.wallId);
        if (!wall) continue;
        const point = {
          x: wall.start.x + (wall.end.x - wall.start.x) * window.position,
          y: wall.start.y + (wall.end.y - wall.start.y) * window.position,
        };
        const screen = projectToScreen(point, transform);
        const marker = new Line([screen.x - 8, screen.y + 8, screen.x + 8, screen.y - 8], {
          stroke: "#0369a1",
          strokeWidth: 3,
          selectable: false,
          evented: false,
          objectCaching: false,
        });
        canvas.add(marker);
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
