"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  UnitSystem,
  metersToPixels,
  pixelsToMeters,
  feetInchesToPixels,
  pixelsToFeetInches,
} from "./units";
import type { ExcalidrawAPI } from "./elementUtils";

// Local alias kept for backwards compat within this file
type UnitMode = UnitSystem;

interface MetricDims {
  widthM: string;
  heightM: string;
}

interface ImperialDims {
  widthFt: string;
  widthIn: string;
  heightFt: string;
  heightIn: string;
}

function parseFloat2(v: string): number {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

/**
 * DimensionPanel
 *
 * Sits above the Excalidraw canvas. When a single rectangle element is selected
 * it reads its pixel width/height, converts to the chosen unit, allows editing,
 * and on Apply / Enter calls excalidrawAPI.updateScene() to push the change back.
 */
export function DimensionPanel({
  excalidrawAPI,
}: {
  readonly excalidrawAPI: ExcalidrawAPI | null;
}) {
  const [unit, setUnit] = useState<UnitMode>("metric");
  const [metric, setMetric] = useState<MetricDims>({ widthM: "", heightM: "" });
  const [imperial, setImperial] = useState<ImperialDims>({
    widthFt: "",
    widthIn: "",
    heightFt: "",
    heightIn: "",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(true);

  // ── Sync from Excalidraw selection ──────────────────────────────────────
  const syncFromAPI = useCallback(() => {
    if (!excalidrawAPI) return;

    const appState = excalidrawAPI.getAppState();
    const elements = excalidrawAPI.getSceneElements() ?? [];
    const ids: Record<string, boolean> = appState.selectedElementIds ?? {};
    const selectedIds = Object.keys(ids).filter((id) => ids[id]);

    if (selectedIds.length !== 1) {
      setDisabled(true);
      setSelectedId(null);
      return;
    }

    const el = elements.find((e) => e.id === selectedIds[0]);
    if (!el || el.type !== "rectangle") {
      setDisabled(true);
      setSelectedId(null);
      return;
    }

    setDisabled(false);
    setSelectedId(el.id);

    // Populate inputs from the element's current pixel dimensions
    if (unit === "metric") {
      setMetric({
        widthM: pixelsToMeters(el.width).toFixed(3),
        heightM: pixelsToMeters(el.height).toFixed(3),
      });
    } else {
      const w = pixelsToFeetInches(el.width);
      const h = pixelsToFeetInches(el.height);
      setImperial({
        widthFt: String(w.feet),
        widthIn: w.inches.toFixed(2),
        heightFt: String(h.feet),
        heightIn: h.inches.toFixed(2),
      });
    }
  }, [excalidrawAPI, unit]);

  // Poll every 250 ms — lightweight enough, avoids needing an onChange prop
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    pollRef.current = setInterval(syncFromAPI, 250);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [syncFromAPI]);

  // Re-populate inputs when unit mode changes
  useEffect(() => {
    syncFromAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  // ── Apply ────────────────────────────────────────────────────────────────
  const handleApply = useCallback(() => {
    if (!excalidrawAPI || !selectedId || disabled) return;

    const elements = excalidrawAPI.getSceneElements() ?? [];
    const el = elements.find((e) => e.id === selectedId);
    if (!el) return;

    const newWidth =
      unit === "metric"
        ? metersToPixels(parseFloat2(metric.widthM))
        : feetInchesToPixels(parseFloat2(imperial.widthFt), parseFloat2(imperial.widthIn));

    const newHeight =
      unit === "metric"
        ? metersToPixels(parseFloat2(metric.heightM))
        : feetInchesToPixels(
            parseFloat2(imperial.heightFt),
            parseFloat2(imperial.heightIn)
          );

    if (newWidth <= 0 || newHeight <= 0) return;

    excalidrawAPI.updateScene({
      elements: elements.map((e) =>
        e.id === selectedId
          ? {
              ...e,
              width: newWidth,
              height: newHeight,
              // x, y, angle unchanged
            }
          : e
      ),
    });
  }, [excalidrawAPI, selectedId, disabled, unit, metric, imperial]);

  // Enter key in any input triggers apply
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleApply();
    },
    [handleApply]
  );

  return (
    <div className="admin-svg-dimension-panel" onKeyDown={onKeyDown}>
      <div className="admin-svg-dimension-panel__unit-toggle">
        <button
          className="admin-svg-dimension-panel__toggle"
          onClick={() => setUnit("metric")}
          type="button"
          aria-pressed={unit === "metric"}
        >
          Meters (m)
        </button>
        <button
          className="admin-svg-dimension-panel__toggle"
          onClick={() => setUnit("imperial")}
          type="button"
          aria-pressed={unit === "imperial"}
        >
          Feet/Inches (ft/in)
        </button>
      </div>

      <span className="admin-svg-dimension-panel__separator">|</span>

      <label className="admin-svg-dimension-panel__field" data-disabled={disabled}>
        W:
        {unit === "metric" ? (
          <input
            className="admin-svg-dimension-panel__input"
            type="number"
            step="0.001"
            min="0"
            disabled={disabled}
            value={metric.widthM}
            onChange={(e) => setMetric((p) => ({ ...p, widthM: e.target.value }))}
            aria-label="Width in meters"
          />
        ) : (
          <>
            <input
              className="admin-svg-dimension-panel__input admin-svg-dimension-panel__input--small"
              type="number"
              step="1"
              min="0"
              disabled={disabled}
              value={imperial.widthFt}
              onChange={(e) => setImperial((p) => ({ ...p, widthFt: e.target.value }))}
              aria-label="Width feet"
            />
            <span>ft</span>
            <input
              className="admin-svg-dimension-panel__input admin-svg-dimension-panel__input--small"
              type="number"
              step="0.1"
              min="0"
              disabled={disabled}
              value={imperial.widthIn}
              onChange={(e) => setImperial((p) => ({ ...p, widthIn: e.target.value }))}
              aria-label="Width inches"
            />
            <span>in</span>
          </>
        )}
        {unit === "metric" && <span>m</span>}
      </label>

      <span className="admin-svg-dimension-panel__separator">x</span>

      <label className="admin-svg-dimension-panel__field" data-disabled={disabled}>
        H:
        {unit === "metric" ? (
          <input
            className="admin-svg-dimension-panel__input"
            type="number"
            step="0.001"
            min="0"
            disabled={disabled}
            value={metric.heightM}
            onChange={(e) => setMetric((p) => ({ ...p, heightM: e.target.value }))}
            aria-label="Height in meters"
          />
        ) : (
          <>
            <input
              className="admin-svg-dimension-panel__input admin-svg-dimension-panel__input--small"
              type="number"
              step="1"
              min="0"
              disabled={disabled}
              value={imperial.heightFt}
              onChange={(e) => setImperial((p) => ({ ...p, heightFt: e.target.value }))}
              aria-label="Height feet"
            />
            <span>ft</span>
            <input
              className="admin-svg-dimension-panel__input admin-svg-dimension-panel__input--small"
              type="number"
              step="0.1"
              min="0"
              disabled={disabled}
              value={imperial.heightIn}
              onChange={(e) => setImperial((p) => ({ ...p, heightIn: e.target.value }))}
              aria-label="Height inches"
            />
            <span>in</span>
          </>
        )}
        {unit === "metric" && <span>m</span>}
      </label>

      <button
        className="admin-svg-dimension-panel__apply"
        disabled={disabled}
        onClick={handleApply}
        type="button"
        aria-label="Apply dimensions to selected rectangle"
      >
        Apply
      </button>

      {disabled && (
        <span className="admin-svg-dimension-panel__hint">
          Select a rectangle to set dimensions
        </span>
      )}
    </div>
  );
}
