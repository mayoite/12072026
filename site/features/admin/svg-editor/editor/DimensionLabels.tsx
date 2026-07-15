"use client";

/**
 * DimensionLabels.tsx
 *
 * Renders absolutely-positioned HTML dimension labels directly over the
 * Excalidraw canvas for every selected element.
 *
 * Mounting:
 *   Place this component as a sibling inside the same position:relative
 *   wrapper that contains <Excalidraw>. It stretches over the entire
 *   canvas area via `position:absolute; inset:0` with pointer-events:none.
 *
 *   Do NOT use renderTopRightUI — that only renders in the top-right corner
 *   and cannot track arbitrary element positions.
 *
 *   Recommended wiring in ExcalidrawClient:
 *
 *     <div className="admin-svg-excalidraw-canvas">
 *       <Excalidraw excalidrawAPI={setAPI} ... />
 *       <DimensionLabels excalidrawAPI={api} unitSystem={unit} />
 *     </div>
 */

import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { UnitSystem, pixelsToDimensionString } from "./units";
import type { ExcalidrawAPI, ExcalidrawElement } from "./elementUtils";

// ─── Types ────────────────────────────────────────────────────────────────

export interface DimensionLabelsProps {
  readonly excalidrawAPI: ExcalidrawAPI | null;
  readonly unitSystem: UnitSystem;
}

interface Label {
  id: string;
  /** Canvas-relative X of the label anchor (centre-of-element). */
  screenX: number;
  /** Canvas-relative Y of the label anchor (centre-of-element). */
  screenY: number;
  /** One or two lines of text to display. */
  lines: string[];
}

interface DimensionLabelStyle extends CSSProperties {
  readonly "--label-x": string;
  readonly "--label-y": string;
}

// ─── Coordinate helpers ───────────────────────────────────────────────────

interface AppStateView {
  scrollX: number;
  scrollY: number;
  zoom: { value: number };
  selectedElementIds: Record<string, boolean>;
}

function toScreenX(canvasX: number, s: AppStateView): number {
  return (canvasX + s.scrollX) * s.zoom.value;
}

function toScreenY(canvasY: number, s: AppStateView): number {
  return (canvasY + s.scrollY) * s.zoom.value;
}

// ─── Geometry helpers ─────────────────────────────────────────────────────

/**
 * Euclidean length of a polyline described by Excalidraw's `points` array.
 * Points are relative to the element's own (x, y) origin.
 */
function polylinePixelLength(points: ReadonlyArray<readonly [number, number]>): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
}

/**
 * Midpoint of a polyline in *canvas* (absolute) coordinates.
 */
type DimensionLineElement = ExcalidrawElement & {
  readonly points?: ReadonlyArray<readonly [number, number]>;
  readonly customData?: {
    readonly heightPx?: number;
  };
};

function polylineMidpoint(el: DimensionLineElement): { x: number; y: number } {
  const pts: ReadonlyArray<readonly [number, number]> =
    el.points ?? [[0, 0], [el.width ?? 0, el.height ?? 0]];
  const first = pts[0];
  const last = pts[pts.length - 1];
  return {
    x: el.x + (first[0] + last[0]) / 2,
    y: el.y + (first[1] + last[1]) / 2,
  };
}

// ─── Label builder ────────────────────────────────────────────────────────

function buildLabel(
  el: DimensionLineElement,
  appState: AppStateView,
  unitSystem: UnitSystem
): Label | null {
  const type = el.type;

  // Optional 3-D height stored in element.customData.heightPx by convention
  const heightPx = el.customData?.heightPx;

  if (type === "line" || type === "arrow") {
    const pts: ReadonlyArray<readonly [number, number]> =
      el.points ?? [[0, 0], [el.width, el.height]];
    const lengthPx = polylinePixelLength(pts);
    const mid = polylineMidpoint(el);

    const lines: string[] = [
      `L: ${pixelsToDimensionString(lengthPx, unitSystem)}`,
    ];
    if (heightPx && heightPx > 0) {
      lines.push(`H: ${pixelsToDimensionString(heightPx, unitSystem)}`);
    }

    return {
      id: el.id,
      screenX: toScreenX(mid.x, appState),
      screenY: toScreenY(mid.y, appState),
      lines,
    };
  }

  if (type === "rectangle") {
    const midX = el.x + el.width / 2;
    const midY = el.y + el.height / 2;
    const wStr = pixelsToDimensionString(el.width, unitSystem);
    const hStr = pixelsToDimensionString(el.height, unitSystem);

    const lines: string[] = [`${wStr} × ${hStr}`];
    if (heightPx && heightPx > 0) {
      lines.push(`H: ${pixelsToDimensionString(heightPx, unitSystem)}`);
    }

    return {
      id: el.id,
      screenX: toScreenX(midX, appState),
      screenY: toScreenY(midY, appState),
      lines,
    };
  }

  return null;
}

// ─── Component ────────────────────────────────────────────────────────────

export function DimensionLabels({ excalidrawAPI, unitSystem }: DimensionLabelsProps) {
  const [labels, setLabels] = useState<Label[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!excalidrawAPI) {
      setLabels([]);
      return;
    }

    let running = true;

    const frame = () => {
      if (!running) return;

      const rawAppState = excalidrawAPI.getAppState() as unknown as AppStateView;
      const appState: AppStateView = {
        scrollX: rawAppState.scrollX ?? 0,
        scrollY: rawAppState.scrollY ?? 0,
        zoom: { value: rawAppState.zoom?.value ?? 1 },
        selectedElementIds: rawAppState.selectedElementIds ?? {},
      };

      const selected = appState.selectedElementIds;
      const hasSelection = Object.values(selected).some(Boolean);

      if (!hasSelection) {
        setLabels((prev) => (prev.length === 0 ? prev : []));
      } else {
        const elements = excalidrawAPI.getSceneElements();
        const next: Label[] = [];

        for (const el of elements) {
          if (el.type !== "rectangle" && el.type !== "line" && el.type !== "arrow") {
            continue;
          }
          if (!selected[el.id]) continue;

          const label = buildLabel(
            el as ExcalidrawElement & Record<string, unknown>,
            appState,
            unitSystem
          );
          if (label) next.push(label);
        }

        setLabels(next);
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      running = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [excalidrawAPI, unitSystem]);

  if (labels.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="admin-svg-dimension-labels"
    >
      {labels.map((label) => (
        <div
          key={label.id}
          className="admin-svg-dimension-label"
          style={
            {
              "--label-x": `${label.screenX}px`,
              "--label-y": `${label.screenY}px`,
            } satisfies DimensionLabelStyle
          }
        >
          {label.lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
