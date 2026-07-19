"use client";

/**
 * Interactive furniture canvas (client-only — fabric touches `window`).
 *
 * One surface, two ways to get geometry in:
 *   - DRAW: pencil / rectangle / circle tools produce fabric objects.
 *   - IMPORT: drop or paste an `.svg`; `loadSVGFromString` turns it into
 *     editable fabric objects.
 *
 * On every change the canvas serializes to an SVG string via `toSVG()` and hands
 * it up through `onSvgChange`. The parent funnels that string through
 * `importSvgToScene` → scene → form, so DRAW and IMPORT share one publish path
 * and neither is a decorative sketch.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, Circle, PencilBrush, Rect, loadSVGFromString, util } from "fabric";

export type CanvasTool = "select" | "draw" | "rect" | "circle";

export interface FabricFurnitureCanvasProps {
  /** Logical canvas size in px (also the imported-SVG fit target). */
  readonly width: number;
  readonly height: number;
  /** Called (debounced by the parent, not here) with the latest SVG markup. */
  readonly onSvgChange: (svg: string) => void;
  /** Current active tool. */
  readonly tool: CanvasTool;
  /** SVG markup to load into the canvas (import / paste). Empty clears nothing. */
  readonly importSvg?: string;
}

const STROKE = "#1f2933";
const FILL = "rgba(31,41,51,0.08)";

export function FabricFurnitureCanvas({
  width,
  height,
  onSvgChange,
  tool,
  importSvg,
}: FabricFurnitureCanvasProps) {
  const elRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const onSvgChangeRef = useRef(onSvgChange);
  onSvgChangeRef.current = onSvgChange;
  const [ready, setReady] = useState(false);

  const emit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSvgChangeRef.current(canvas.toSVG());
  }, []);

  // Init once.
  useEffect(() => {
    if (!elRef.current) return;
    const canvas = new Canvas(elRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });
    canvasRef.current = canvas;
    setReady(true);

    const onMutate = () => emit();
    canvas.on("object:added", onMutate);
    canvas.on("object:modified", onMutate);
    canvas.on("object:removed", onMutate);
    canvas.on("path:created", onMutate);

    return () => {
      canvas.off();
      void canvas.dispose();
      canvasRef.current = null;
      setReady(false);
    };
    // Mount-only: width/height changes are handled by a separate effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep canvas dimensions in sync.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setDimensions({ width, height });
    canvas.renderAll();
  }, [width, height]);

  // Tool → canvas mode.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const drawing = tool === "draw";
    canvas.isDrawingMode = drawing;
    canvas.selection = tool === "select";
    if (drawing) {
      const brush = new PencilBrush(canvas);
      brush.color = STROKE;
      brush.width = 3;
      canvas.freeDrawingBrush = brush;
    }
  }, [tool, ready]);

  // Click-to-place for rect / circle tools.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (tool !== "rect" && tool !== "circle") return;

    const handler = (opt: { scenePoint?: { x: number; y: number } }) => {
      const p = opt.scenePoint;
      if (!p) return;
      const shape =
        tool === "rect"
          ? new Rect({
              left: p.x,
              top: p.y,
              width: 160,
              height: 100,
              fill: FILL,
              stroke: STROKE,
              strokeWidth: 2,
            })
          : new Circle({
              left: p.x,
              top: p.y,
              radius: 60,
              fill: FILL,
              stroke: STROKE,
              strokeWidth: 2,
            });
      canvas.add(shape);
      canvas.setActiveObject(shape);
    };
    canvas.on("mouse:down", handler);
    return () => {
      canvas.off("mouse:down", handler);
    };
  }, [tool]);

  // Load imported / pasted SVG into the canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !importSvg || importSvg.trim() === "") return;
    let cancelled = false;
    void loadSVGFromString(importSvg).then((result) => {
      if (cancelled || !canvasRef.current) return;
      const objects = result.objects.filter(
        (o): o is NonNullable<typeof o> => o !== null,
      );
      if (objects.length === 0) return;
      canvas.remove(...canvas.getObjects());
      const grouped = util.groupSVGElements(objects, result.options);
      // Fit the import to the canvas so it is visible regardless of source size.
      const obj = grouped as unknown as {
        scaleToWidth: (w: number) => void;
        set: (o: Record<string, unknown>) => void;
      };
      obj.scaleToWidth(width * 0.9);
      obj.set({ left: width * 0.05, top: height * 0.05 });
      canvas.add(grouped as Parameters<typeof canvas.add>[0]);
      canvas.renderAll();
      emit();
    });
    return () => {
      cancelled = true;
    };
  }, [importSvg, width, height, emit]);

  return <canvas ref={elRef} data-testid="fabric-furniture-canvas" />;
}
