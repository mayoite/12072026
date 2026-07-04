import {
  FabricText,
  Group,
  Line,
  Path,
  PencilBrush,
  Point,
  Rect,
} from "fabric";
import type { Canvas as FabricCanvas, CanvasEvents, FabricObject, TPointerEventInfo } from "fabric";
import type { FabricDrawTool } from "../fabricDrawToolTypes";
import { DEFAULT_FABRIC_DRAW_COLOR } from "../fabricDrawToolTypes";
import { applyFabricTransformLocks } from "../fabricObjectUtils";
import {
  formatCanvasMeasureLabel,
  measureLabelPosition,
  snapMeasureEndPoint,
} from "../measureAnnotation";
import { clampCanvasPoint } from "@/features/planner/lib/canvasBounds";
import type { MeasurementUnit } from "@/features/planner/lib/measurements";
import { FURNISHINGS } from "../models/furnishings";
import { createFurniture } from "../lib/helpers";

const ANNOTATION_PREFIX = "DRAW:";
const MIN_DRAW_GESTURE_PX = 5;

type PlannerFabricObject = FabricObject & {
  evented?: boolean;
  hasBorders?: boolean;
  hasControls?: boolean;
  name?: string;
  selectable?: boolean;
  lockScalingX?: boolean;
  lockScalingY?: boolean;
  lockRotation?: boolean;
  subTargetCheck?: boolean;
};

function isShiftHeld(event: TPointerEventInfo): boolean {
  const native = event.e as MouseEvent | undefined;
  return native?.shiftKey === true;
}

function isProtectedObject(obj: PlannerFabricObject | null | undefined): boolean {
  const name = String(obj?.name ?? "");
  return (
    name === "CORNER" ||
    name.startsWith("WALL:") ||
    name.startsWith("DOOR") ||
    name.startsWith("WINDOW") ||
    name.startsWith("TABLE") ||
    name.startsWith("CHAIR")
  );
}

function isWallLine(obj: FabricObject): obj is Line {
  return obj instanceof Line && String((obj as PlannerFabricObject).name ?? "").startsWith("WALL:");
}

function nearestWallDistance(view: FabricCanvas, point: Point): number {
  let min = Number.POSITIVE_INFINITY;
  for (const obj of view.getObjects()) {
    if (!isWallLine(obj)) continue;
    const x1 = obj.x1 ?? 0;
    const y1 = obj.y1 ?? 0;
    const x2 = obj.x2 ?? 0;
    const y2 = obj.y2 ?? 0;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared > 0 ? ((point.x - x1) * dx + (point.y - y1) * dy) / lengthSquared : 0;
    const clampedT = Math.max(0, Math.min(1, t));
    const projX = x1 + clampedT * dx;
    const projY = y1 + clampedT * dy;
    const distance = Math.hypot(point.x - projX, point.y - projY);
    if (distance < min) min = distance;
  }
  return min;
}

export function wireFabricDrawTools(options: {
  getView: () => FabricCanvas | undefined;
  getScenePointer: (e: TPointerEventInfo) => Point | null;
  getDrawTool: () => FabricDrawTool;
  getDrawColor: () => string;
  getDrawFillColor: () => string;
  roomEditActive: () => boolean;
  spacePanActive?: () => boolean;
  clampViewport?: () => void;
  saveState: () => void;
  getMeasurementUnit?: () => MeasurementUnit;
}) {
  let activeTool: FabricDrawTool = "select";
  let activeColor: string = DEFAULT_FABRIC_DRAW_COLOR;
  let drawStart: Point | null = null;
  let previewObject: PlannerFabricObject | null = null;
  let curvePoints: Point[] = [];
  let panning = false;
  let lastPanScreen: Point | null = null;

  const getView = () => options.getView();

  function isPanGesture(tool: FabricDrawTool, event: TPointerEventInfo): boolean {
    if (tool === "pan") return true;
    const native = event.e as MouseEvent | undefined;
    if (native?.button === 1) return true;
    return options.spacePanActive?.() === true;
  }

  function clearPreview() {
    const view = getView();
    if (previewObject && view) {
      view.remove(previewObject);
      previewObject = null;
      view.requestRenderAll();
    }
  }

  function resetDraft() {
    drawStart = null;
    curvePoints = [];
    clearPreview();
  }

  function applyCanvasMode() {
    const view = getView();
    if (!view) return;

    const tool = options.getDrawTool();
    const color = options.getDrawColor();
    activeTool = tool;
    activeColor = color;

    if (options.roomEditActive() || tool === "select") {
      view.isDrawingMode = false;
      view.selection = true;
      view.defaultCursor = options.spacePanActive?.() ? "grab" : "default";
      resetDraft();
      return;
    }

    if (tool === "pan") {
      view.isDrawingMode = false;
      view.selection = false;
      view.defaultCursor = "grab";
      view.hoverCursor = "grab";
      resetDraft();
      return;
    }

    if (tool === "pen") {
      view.selection = false;
      view.isDrawingMode = true;
      if (!view.freeDrawingBrush) {
        view.freeDrawingBrush = new PencilBrush(view);
      }
      view.freeDrawingBrush.color = color;
      view.freeDrawingBrush.width = 2;
      resetDraft();
      return;
    }

    view.isDrawingMode = false;
    view.selection = tool === "eraser";
    view.defaultCursor = tool === "eraser" ? "not-allowed" : "crosshair";
    resetDraft();
  }

  function setDrawTool(tool: FabricDrawTool) {
    activeTool = tool;
    applyCanvasMode();
  }

  function setDrawColor(color: string) {
    activeColor = color;
    applyCanvasMode();
  }

  function setDrawFillColor(_color: string) {
    applyCanvasMode();
  }

  function commitAnnotation(obj: PlannerFabricObject) {
    const view = getView();
    if (!view || !obj) return;

    if (activeTool === "wall") {
      obj.name = `WALL:${Date.now()}`;
    } else {
      obj.name = `${ANNOTATION_PREFIX}${activeTool}`;
    }
    obj.selectable = true;
    obj.evented = true;
    obj.hasControls = true;
    obj.hasBorders = true;
    applyFabricTransformLocks(obj);
    view.add(obj);
    view.setActiveObject(obj);
    view.requestRenderAll();
    options.saveState();
  }

  function addMeasureAnnotation(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ) {
    const view = getView();
    if (!view) return;

    const distance = Math.hypot(endX - startX, endY - startY);
    const originLeft = Math.min(startX, endX);
    const originTop = Math.min(startY, endY);
    const relX1 = startX - originLeft;
    const relY1 = startY - originTop;
    const relX2 = endX - originLeft;
    const relY2 = endY - originTop;
    const labelPos = measureLabelPosition(relX1, relY1, relX2, relY2);

    const line = new Line([relX1, relY1, relX2, relY2], {
      stroke: activeColor,
      strokeWidth: 2,
      strokeDashArray: [6, 4],
      fill: "",
      selectable: false,
      evented: false,
    });
    const label = new FabricText(formatCanvasMeasureLabel(distance, options.getMeasurementUnit?.() ?? "mm"), {
      left: labelPos.x,
      top: labelPos.y,
      fontSize: 11,
      fontFamily: "Arial, sans-serif",
      fill: activeColor,
      backgroundColor: "var(--overlay-panel-88)",
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
    });
    const group = new Group([line, label], {
      left: originLeft,
      top: originTop,
      subTargetCheck: false,
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
    }) as PlannerFabricObject;
    group.name = `${ANNOTATION_PREFIX}measure`;
    applyFabricTransformLocks(group);
    view.add(group);
    view.setActiveObject(group);
    view.requestRenderAll();
    options.saveState();
  }

  function clampPoint(point: Point): Point {
    const clamped = clampCanvasPoint({ x: point.x, y: point.y });
    return new Point(clamped.x, clamped.y);
  }

  function finalizeLine(end: Point, asMeasure = false, shiftKey = false) {
    if (!drawStart) return;
    const start = clampPoint(drawStart);
    const snapped = snapMeasureEndPoint(start.x, start.y, end.x, end.y, asMeasure && shiftKey);
    const endPoint = clampPoint(new Point(snapped.x, snapped.y));
    if (Math.hypot(endPoint.x - start.x, endPoint.y - start.y) < MIN_DRAW_GESTURE_PX) {
      resetDraft();
      return;
    }
    if (asMeasure) {
      addMeasureAnnotation(start.x, start.y, endPoint.x, endPoint.y);
      resetDraft();
      return;
    }
    const line = new Line([start.x, start.y, endPoint.x, endPoint.y], {
      stroke: activeColor,
      strokeWidth: 2,
      fill: "",
    });
    commitAnnotation(line);
    resetDraft();
  }

  function finalizeRectangle(end: Point) {
    if (!drawStart) return;
    const start = clampPoint(drawStart);
    const endPoint = clampPoint(end);
    const left = Math.min(start.x, endPoint.x);
    const top = Math.min(start.y, endPoint.y);
    const width = Math.abs(endPoint.x - start.x);
    const height = Math.abs(endPoint.y - start.y);
    if (width < MIN_DRAW_GESTURE_PX || height < MIN_DRAW_GESTURE_PX) {
      resetDraft();
      return;
    }

    const fill = options.getDrawFillColor();
    const rect = new Rect({
      left,
      top,
      width,
      height,
      fill: fill === "transparent" ? "transparent" : fill,
      stroke: activeColor,
      strokeWidth: 2,
    });
    rect.set('originX', 'left');
    rect.set('originY', 'top');
    commitAnnotation(rect);
    resetDraft();
  }

  function finalizeCurve() {
    if (curvePoints.length < 3) {
      resetDraft();
      return;
    }
    const [start, control, end] = curvePoints;
    const path = new Path(`M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`, {
      fill: "",
      stroke: activeColor,
      strokeWidth: 2,
    });
    commitAnnotation(path);
    resetDraft();
  }

  const view = getView();
  if (!view) {
    return { setDrawTool, setDrawColor, applyCanvasMode, dispose: () => {} };
  }

  view.on("path:created", (event: CanvasEvents["path:created"]) => {
    const path = event.path as PlannerFabricObject | undefined;
    if (!path || options.getDrawTool() !== "pen") return;
    path.name = `${ANNOTATION_PREFIX}pen`;
    path.stroke = options.getDrawColor();
    options.saveState();
  });

  view.on("mouse:down", (event: CanvasEvents["mouse:down"]) => {
    const tool = options.getDrawTool();
    if (options.roomEditActive()) return;

    if (isPanGesture(tool, event)) {
      const native = event.e as MouseEvent;
      panning = true;
      lastPanScreen = new Point(native.clientX, native.clientY);
      const viewRef = getView();
      if (viewRef) {
        viewRef.defaultCursor = "grabbing";
      }
      return;
    }

    if (tool === "select" || tool === "pen") return;

    const pointer = options.getScenePointer(event);
    if (!pointer) return;

    if (tool === "eraser") {
      const target = (event.target as PlannerFabricObject | undefined) ?? null;
      if (target && !isProtectedObject(target)) {
        view.remove(target);
        view.discardActiveObject();
        view.requestRenderAll();
        options.saveState();
      }
      return;
    }

    if (tool === "curve") {
      curvePoints.push(new Point(pointer.x, pointer.y));
      if (curvePoints.length === 3) {
        finalizeCurve();
      }
      return;
    }

    if (tool === "door" || tool === "window") {
      const kind = tool === "door" ? "DOOR" : "WINDOW";
      const item = tool === "door" ? FURNISHINGS.doors[0] : FURNISHINGS.windows[0];
      if (!item) return;
      const placed = clampPoint(new Point(pointer.x, pointer.y));
      // Match existing floorplan behavior: opening must be near a wall.
      if (nearestWallDistance(view, placed) > 20) return;
      const group = createFurniture(kind, item) as PlannerFabricObject & {
        left?: number;
        top?: number;
      };
      group.left = placed.x;
      group.top = placed.y;
      group.selectable = true;
      group.evented = true;
      view.add(group);
      view.setActiveObject(group);
      view.requestRenderAll();
      options.saveState();
      return;
    }

    drawStart = clampPoint(new Point(pointer.x, pointer.y));
  });

  view.on("mouse:move", (event: CanvasEvents["mouse:move"]) => {
    if (panning && lastPanScreen) {
      const native = event.e as MouseEvent;
      const viewRef = getView();
      if (viewRef) {
        const dx = native.clientX - lastPanScreen.x;
        const dy = native.clientY - lastPanScreen.y;
        viewRef.relativePan(new Point(dx, dy));
        lastPanScreen = new Point(native.clientX, native.clientY);
        options.clampViewport?.();
      }
      return;
    }

    const tool = options.getDrawTool();
    if (!drawStart || options.roomEditActive()) return;
    if (tool !== "line" && tool !== "measure" && tool !== "rectangle" && tool !== "wall") return;

    const pointer = options.getScenePointer(event);
    if (!pointer) return;

    clearPreview();

    const shiftKey = tool === "measure" ? isShiftHeld(event) : false;
    let endX = pointer.x;
    let endY = pointer.y;
    if (tool === "measure") {
      const snapped = snapMeasureEndPoint(drawStart.x, drawStart.y, pointer.x, pointer.y, shiftKey);
      endX = snapped.x;
      endY = snapped.y;
    }

    if (tool === "line" || tool === "measure" || tool === "wall") {
      previewObject = new Line([drawStart.x, drawStart.y, endX, endY], {
        stroke: activeColor,
        strokeWidth: 2,
        strokeDashArray: tool === "measure" ? [6, 4] : undefined,
        selectable: false,
        evented: false,
      });
    } else if (tool === "rectangle") {
      const left = Math.min(drawStart.x, pointer.x);
      const top = Math.min(drawStart.y, pointer.y);
      const fillColor = options.getDrawFillColor();
      previewObject = new Rect({
        left,
        top,
        width: Math.abs(pointer.x - drawStart.x),
        height: Math.abs(pointer.y - drawStart.y),
        fill: fillColor === "transparent" ? "var(--overlay-inverse-06)" : fillColor,
        stroke: activeColor,
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
    }

    if (previewObject) {
      view.add(previewObject);
      view.requestRenderAll();
    }
  });

  view.on("mouse:up", (event: CanvasEvents["mouse:up"]) => {
    if (panning) {
      panning = false;
      lastPanScreen = null;
      applyCanvasMode();
      return;
    }

    const tool = options.getDrawTool();
    if (!drawStart || options.roomEditActive()) return;
    if (tool !== "line" && tool !== "measure" && tool !== "rectangle" && tool !== "wall") return;

    const pointer = options.getScenePointer(event);
    if (!pointer) return;

    clearPreview();

    if (tool === "line" || tool === "wall") {
      finalizeLine(pointer, false, isShiftHeld(event));
    } else if (tool === "measure") {
      finalizeLine(pointer, true, isShiftHeld(event));
    } else if (tool === "rectangle") {
      finalizeRectangle(pointer);
    }
  });

  applyCanvasMode();

  return {
    setDrawTool,
    setDrawColor,
    setDrawFillColor,
    applyCanvasMode,
    dispose: () => {
      resetDraft();
    },
  };
}
