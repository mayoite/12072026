"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import { Button, ToggleButton } from "react-aria-components";

import type {
  ParametricPreview,
  ParametricProductCapabilities,
} from "@/features/planner/asset-engine/svg/parametric/productDrawer";

export type ParametricPlanCanvasProps = {
  readonly label: string;
  readonly capabilities: ParametricProductCapabilities;
  readonly preview: ParametricPreview | null;
  readonly selectedPartId: string | null;
  readonly onPartSelect: (partId: string) => void;
  readonly gridEnabled?: boolean;
  readonly onGridChange?: (enabled: boolean) => void;
};

type ViewBox = ParametricPreview["viewBox"];

export function ParametricPlanCanvas({
  label,
  capabilities,
  preview,
  selectedPartId,
  onPartSelect,
  gridEnabled,
  onGridChange,
}: ParametricPlanCanvasProps) {
  const [zoomPercent, setZoomPercent] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [localGridEnabled, setLocalGridEnabled] = useState(false);
  const effectiveGridEnabled = gridEnabled ?? localGridEnabled;
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const viewBox = useMemo<ViewBox | null>(() => {
    if (!preview) return null;
    const scale = 100 / zoomPercent;
    const width = preview.viewBox.width * scale;
    const height = preview.viewBox.height * scale;
    return {
      x: preview.viewBox.x + (preview.viewBox.width - width) / 2 + pan.x,
      y: preview.viewBox.y + (preview.viewBox.height - height) / 2 + pan.y,
      width,
      height,
    };
  }, [pan, preview, zoomPercent]);

  if (!preview || !viewBox) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-6" role="status">
        Fix field errors to preview {label}
      </div>
    );
  }

  const fit = () => {
    setZoomPercent(100);
    setPan({ x: 0, y: 0 });
  };
  const zoomBy = (amount: number) => {
    setZoomPercent((current) => Math.min(300, Math.max(30, current + amount)));
  };
  const pointerDown = (event: PointerEvent<SVGSVGElement>) => {
    dragRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const pointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const start = dragRef.current;
    if (!start) return;
    const xScale = viewBox.width / Math.max(event.currentTarget.clientWidth, 1);
    const yScale = viewBox.height / Math.max(event.currentTarget.clientHeight, 1);
    setPan((current) => ({
      x: current.x - (event.clientX - start.x) * xScale,
      y: current.y - (event.clientY - start.y) * yScale,
    }));
    dragRef.current = { x: event.clientX, y: event.clientY };
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label={`${label} canvas`}>
      <div className="flex flex-wrap items-center gap-2 border-b p-2">
        <Button className="parametric-plan-control" onPress={() => zoomBy(-10)}>
          Zoom out
        </Button>
        <Button className="parametric-plan-control" onPress={() => zoomBy(10)}>
          Zoom in
        </Button>
        <Button className="parametric-plan-control" onPress={fit}>
          Fit plan
        </Button>
        {capabilities.supportsGrid ? (
          <ToggleButton
            className="parametric-plan-control"
            isSelected={effectiveGridEnabled}
            onChange={(enabled) => {
              if (onGridChange) onGridChange(enabled);
              else setLocalGridEnabled(enabled);
            }}
          >
            Grid
          </ToggleButton>
        ) : null}
        <output data-testid="parametric-zoom-status" className="ml-auto text-sm">
          {zoomPercent}%
        </output>
      </div>
      <div className="parametric-plan-viewport">
        <svg
          className="parametric-plan-svg"
          data-testid="parametric-plan-svg"
          data-grid={String(effectiveGridEnabled)}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          aria-label={`${label} plan preview`}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
          onWheel={(event) => {
            event.preventDefault();
            zoomBy(event.deltaY < 0 ? 10 : -10);
          }}
        >
          {effectiveGridEnabled ? (
            <>
              <defs>
                <pattern
                  id="parametric-grid"
                  width="100"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <path className="parametric-plan-grid-path" d="M 100 0 L 0 0 0 100" />
                </pattern>
              </defs>
              <rect
                x={preview.viewBox.x}
                y={preview.viewBox.y}
                width={preview.viewBox.width}
                height={preview.viewBox.height}
                fill="url(#parametric-grid)"
                pointerEvents="none"
              />
            </>
          ) : null}
          {preview.parts.flatMap((part) =>
            part.paths.map((makerPath) => (
              <path
                key={`${part.id}:${makerPath.id}`}
                className="parametric-plan-part"
                data-testid={`parametric-part-${part.id}`}
                data-part-id={part.id}
                data-part-role={part.role}
                data-selected={selectedPartId === part.id ? "true" : undefined}
                id={makerPath.id}
                d={makerPath.d}
                fill={makerPath.fill}
                stroke={makerPath.stroke}
                strokeWidth={makerPath.strokeWidth}
                role={capabilities.selectableParts ? "button" : undefined}
                tabIndex={capabilities.selectableParts ? 0 : undefined}
                aria-label={capabilities.selectableParts ? `Select ${part.id}` : undefined}
                onClick={capabilities.selectableParts ? () => onPartSelect(part.id) : undefined}
                onKeyDown={(event) => {
                  if (!capabilities.selectableParts) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onPartSelect(part.id);
                  }
                }}
              />
            )),
          )}
        </svg>
      </div>
      {capabilities.measurable ? (
        <p data-testid="parametric-plan-measurements" className="border-t px-3 py-2 text-sm">
          {preview.widthMm} × {preview.depthMm} mm
        </p>
      ) : null}
    </section>
  );
}
