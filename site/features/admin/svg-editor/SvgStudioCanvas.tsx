"use client";

/**
 * A4.1 / A4.2 — the visual authoring canvas.
 *
 * Mounts the SVG.js engine (via the `SvgEngineAdapter` seam) into a real DOM
 * container and drives it from the `SvgSceneDocument` authority. All edits go
 * through the immutable document + named history, so undo/redo is universal.
 * The structured form remains the property inspector (A4.3); this is the main
 * geometry surface.
 *
 * Client-only: the SVG.js adapter is imported lazily on mount so nothing pulls
 * a DOM renderer into the server bundle.
 *
 * GS: semantic tokens only (var(--…)/currentColor) — no hex in components.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, MutableRefObject } from "react";
import {
  ArrowsOutSimple,
  ArrowUUpLeft,
  ArrowUUpRight,
  Circle,
  Eye,
  EyeSlash,
  LineSegment,
  Lock,
  LockOpen,
  Rectangle,
  StackMinus,
  StackPlus,
  TextT,
  Trash,
} from "@phosphor-icons/react";

import {
  addNode,
  findNode,
  removeNode,
  reorderNode,
  applySceneNodeGeometryPatch,
  replaceNode,
  type SvgSceneDocument,
  type SvgSceneNode,
} from "./scene/svgSceneDocument";
import { nudgeSceneNodePatch } from "./scene/nudgeSceneNode";
import { confirmDeleteLayer } from "./destructiveConfirmMessages";
import {
  canRedo,
  canUndo,
  commit,
  createHistory,
  redo,
  redoLabel,
  undo,
  undoLabel,
  type SvgSceneHistory,
} from "./scene/svgSceneHistory";
import type {
  SvgEngineAdapter,
  SvgEngineViewport,
} from "./scene/svgEngineAdapter";
import {
  STUDIO_DRAG_ACTIONS,
  STUDIO_NUDGE_STEP,
  STUDIO_NUDGE_STEP_FAST,
  STUDIO_ZOOM_MAX,
  STUDIO_ZOOM_MIN,
  STUDIO_ZOOM_STEP,
} from "./studioA11yContract";

/** Host-owned ADM-SVG-06 fields that the stage status must keep visible. */
export interface SvgStudioStageMeta {
  readonly identity: string;
  readonly footprint: string;
  readonly draft: string;
  readonly validation: string;
  readonly revision: string;
}

export interface SvgStudioCanvasProps {
  readonly initialDocument: SvgSceneDocument;
  /** Notified after every committed edit so the host can persist / preview. */
  readonly onDocumentChange?: (document: SvgSceneDocument) => void;
  /** Host reads the live scene at publish time (dynamic import cannot forward refs). */
  readonly documentGetterRef?: MutableRefObject<(() => SvgSceneDocument) | null>;
  /** Product identity, draft, validation, and revision for the stage status strip. */
  readonly stageMeta?: SvgStudioStageMeta;
}

function uniqueId(doc: SvgSceneDocument, base: string): string {
  let index = doc.nodes.length + 1;
  let candidate = `${base}-${index}`;
  while (findNode(doc, candidate)) {
    index += 1;
    candidate = `${base}-${index}`;
  }
  return candidate;
}

function centeredRect(doc: SvgSceneDocument): SvgSceneNode {
  const { viewBox } = doc;
  const width = viewBox.width / 4;
  const height = viewBox.height / 4;
  return {
    kind: "rect",
    id: uniqueId(doc, "rect"),
    name: "Rectangle",
    locked: false,
    hidden: false,
    style: { fillToken: "var(--color-surface-raised)", strokeToken: "currentColor", lineWeight: 2 },
    x: viewBox.x + (viewBox.width - width) / 2,
    y: viewBox.y + (viewBox.height - height) / 2,
    width,
    height,
  };
}

function centeredCircle(doc: SvgSceneDocument): SvgSceneNode {
  const { viewBox } = doc;
  return {
    kind: "circle",
    id: uniqueId(doc, "circle"),
    name: "Circle",
    locked: false,
    hidden: false,
    style: { fillToken: "var(--color-surface-raised)", strokeToken: "currentColor", lineWeight: 2 },
    cx: viewBox.x + viewBox.width / 2,
    cy: viewBox.y + viewBox.height / 2,
    r: Math.min(viewBox.width, viewBox.height) / 6,
  };
}

function centeredLine(doc: SvgSceneDocument): SvgSceneNode {
  const { viewBox } = doc;
  const inset = Math.min(viewBox.width, viewBox.height) * 0.2;
  return {
    kind: "line",
    id: uniqueId(doc, "line"),
    name: "Line",
    locked: false,
    hidden: false,
    style: { strokeToken: "currentColor", lineWeight: 2 },
    x1: viewBox.x + inset,
    y1: viewBox.y + inset,
    x2: viewBox.x + viewBox.width - inset,
    y2: viewBox.y + viewBox.height - inset,
  };
}

function centeredText(doc: SvgSceneDocument): SvgSceneNode {
  const { viewBox } = doc;
  return {
    kind: "text",
    id: uniqueId(doc, "text"),
    name: "Text",
    locked: false,
    hidden: false,
    style: { fillToken: "currentColor" },
    x: viewBox.x + viewBox.width / 4,
    y: viewBox.y + viewBox.height / 2,
    text: "Text",
  };
}

export function SvgStudioCanvas({
  initialDocument,
  onDocumentChange,
  documentGetterRef,
  stageMeta,
}: SvgStudioCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const adapterRef = useRef<SvgEngineAdapter | null>(null);
  const [history, setHistory] = useState<SvgSceneHistory>(() => createHistory(initialDocument, "Open"));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<SvgEngineViewport>({
    panX: 0,
    panY: 0,
    zoom: 1,
  });

  const document = history.present.document;
  const documentRef = useRef(document);

  useEffect(() => {
    documentRef.current = document;
  }, [document]);

  useEffect(() => {
    if (!documentGetterRef) return;
    documentGetterRef.current = () => documentRef.current;
    return () => {
      documentGetterRef.current = null;
    };
  }, [documentGetterRef]);

  const apply = useCallback((label: string, next: SvgSceneDocument) => {
    setHistory((current) => commit(current, label, next));
  }, []);

  // Mount the SVG.js engine once, lazily (client-only import).
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let offPointer: (() => void) | undefined;
    let offChange: (() => void) | undefined;
    let offViewport: (() => void) | undefined;

    void import("./scene/svgJsEngineAdapter").then(({ createSvgJsEngineAdapter }) => {
      if (disposed || !mountRef.current) return;
      const adapter = createSvgJsEngineAdapter(mountRef.current, initialDocument);
      adapterRef.current = adapter;
      offPointer = adapter.on("node:pointerdown", (event) => {
        setSelectedId(event.nodeId);
      });
      offChange = adapter.on("node:change", (event) => {
        // ADM-SVG-07: drag/resize uses the same document patch authority as inspector numbers.
        const latestDoc = documentRef.current;
        const updated = applySceneNodeGeometryPatch(
          latestDoc,
          event.nodeId,
          event.patch as Partial<SvgSceneNode>,
        );
        apply(`Transform ${findNode(latestDoc, event.nodeId)?.name || "shape"}`, updated);
      });
      setViewport(adapter.getViewport());
      offViewport = adapter.on("viewport:change", setViewport);
    });

    return () => {
      disposed = true;
      offPointer?.();
      offChange?.();
      offViewport?.();
      adapterRef.current?.destroy();
      adapterRef.current = null;
    };
    // initialDocument identity is the mount seed; edits flow via `render` below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push every committed document to the engine.
  useEffect(() => {
    adapterRef.current?.render(document, selectedId);
  }, [document, selectedId]);

  // Notify host after commit — never call parent setState inside a setHistory updater.
  const skipInitialDocumentSyncRef = useRef(true);
  useEffect(() => {
    if (skipInitialDocumentSyncRef.current) {
      skipInitialDocumentSyncRef.current = false;
      return;
    }
    onDocumentChange?.(document);
  }, [document, onDocumentChange]);

  const selected = selectedId ? findNode(document, selectedId) : undefined;

  const handleUndo = useCallback(() => {
    setHistory((h) => undo(h));
  }, []);

  const handleRedo = useCallback(() => {
    setHistory((h) => redo(h));
  }, []);

  const addRect = useCallback(() => {
    const node = centeredRect(document);
    apply(`Add ${node.name}`, addNode(document, node));
    setSelectedId(node.id);
  }, [document, apply]);

  const addCircle = useCallback(() => {
    const node = centeredCircle(document);
    apply(`Add ${node.name}`, addNode(document, node));
    setSelectedId(node.id);
  }, [document, apply]);

  const addLine = useCallback(() => {
    const node = centeredLine(document);
    apply(`Add ${node.name}`, addNode(document, node));
    setSelectedId(node.id);
  }, [document, apply]);

  const addText = useCallback(() => {
    const node = centeredText(document);
    apply(`Add ${node.name}`, addNode(document, node));
    setSelectedId(node.id);
  }, [document, apply]);

  const deleteSelected = useCallback(() => {
    if (!selected) return;
    // ADM-SVG-11: name draft-only impact before delete.
    if (!window.confirm(confirmDeleteLayer(selected.name))) return;
    apply(`Delete ${selected.name}`, removeNode(document, selected.id));
    setSelectedId(null);
  }, [document, apply, selected]);

  const bringToFront = useCallback(() => {
    if (!selected) return;
    apply(`Bring ${selected.name} to front`, reorderNode(document, selected.id, document.nodes.length - 1));
  }, [document, apply, selected]);

  const sendToBack = useCallback(() => {
    if (!selected) return;
    apply(`Send ${selected.name} to back`, reorderNode(document, selected.id, 0));
  }, [document, apply, selected]);

  const toggleHidden = useCallback(
    (node: SvgSceneNode) => {
      apply(
        `${node.hidden ? "Show" : "Hide"} ${node.name}`,
        replaceNode(document, node.id, (n) => ({ ...n, hidden: !n.hidden })),
      );
    },
    [document, apply],
  );

  const toggleLocked = useCallback(
    (node: SvgSceneNode) => {
      apply(
        `${node.locked ? "Unlock" : "Lock"} ${node.name}`,
        replaceNode(document, node.id, (n) => ({ ...n, locked: !n.locked })),
      );
    },
    [document, apply],
  );

  const zoomToFit = useCallback(() => {
    adapterRef.current?.zoomToFit();
    const next = adapterRef.current?.getViewport();
    if (next) setViewport(next);
  }, []);
  const resetViewport = useCallback(() => {
    adapterRef.current?.resetViewport();
    const next = adapterRef.current?.getViewport();
    if (next) setViewport(next);
  }, []);

  const zoomBy = useCallback((factor: number) => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    const current = adapter.getViewport();
    const zoom = Math.min(
      STUDIO_ZOOM_MAX,
      Math.max(STUDIO_ZOOM_MIN, current.zoom * factor),
    );
    adapter.setViewport({ zoom });
    setViewport(adapter.getViewport());
  }, []);

  const zoomIn = useCallback(() => zoomBy(STUDIO_ZOOM_STEP), [zoomBy]);
  const zoomOut = useCallback(() => zoomBy(1 / STUDIO_ZOOM_STEP), [zoomBy]);

  const patchSelected = useCallback(
    (label: string, patch: Partial<SvgSceneNode>) => {
      if (!selectedId) return;
      // ADM-SVG-07: numeric inspector geometry uses the same patch authority as drag/resize.
      apply(label, applySceneNodeGeometryPatch(document, selectedId, patch));
    },
    [apply, document, selectedId],
  );

  const patchSelectedNumber = useCallback(
    (field: string, label: string, raw: string, assign: (value: number) => Partial<SvgSceneNode>) => {
      const value = Number(raw);
      if (!Number.isFinite(value)) return;
      patchSelected(label, assign(value));
    },
    [patchSelected],
  );

  /** ADM-A11Y-02/03 — keyboard on the stage: nudge, delete, undo/redo, escape. */
  const handleStageKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const key = event.key;
      const mod = event.ctrlKey || event.metaKey;

      if (mod && key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
        return;
      }
      if (mod && (key.toLowerCase() === "y" || (key.toLowerCase() === "z" && event.shiftKey))) {
        event.preventDefault();
        handleRedo();
        return;
      }
      if (key === "Escape") {
        event.preventDefault();
        setSelectedId(null);
        return;
      }
      if ((key === "Delete" || key === "Backspace") && selected) {
        event.preventDefault();
        deleteSelected();
        return;
      }

      if (!selected || selected.locked) return;
      const arrows: Record<string, { dx: number; dy: number }> = {
        ArrowLeft: { dx: -1, dy: 0 },
        ArrowRight: { dx: 1, dy: 0 },
        ArrowUp: { dx: 0, dy: -1 },
        ArrowDown: { dx: 0, dy: 1 },
      };
      const dir = arrows[key];
      if (!dir) return;
      event.preventDefault();
      const step = event.shiftKey ? STUDIO_NUDGE_STEP_FAST : STUDIO_NUDGE_STEP;
      const patch = nudgeSceneNodePatch(selected, dir.dx * step, dir.dy * step);
      if (!patch) return;
      apply(
        `Nudge ${selected.name}`,
        applySceneNodeGeometryPatch(document, selected.id, patch),
      );
    },
    [selected, document, apply, handleUndo, handleRedo, deleteSelected],
  );

  // Layer tree paints top-first (topmost z last in the document array).
  const layers = useMemo(() => [...document.nodes].reverse(), [document.nodes]);

  return (
    <section
      className="svg-studio"
      aria-label="Visual SVG authoring canvas"
      data-testid="admin-svg-studio"
      data-supported-kinds="rect,circle,line,text"
      data-drag-actions={STUDIO_DRAG_ACTIONS.join(",")}
    >
      <div
        className="svg-studio__toolbar"
        role="toolbar"
        aria-label="Canvas tools"
        data-region="command"
        data-testid="admin-studio-region-command"
      >
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo(history)}
          title={undoLabel(history) ? `Undo: ${undoLabel(history)}` : "Nothing to undo"}
          aria-label={undoLabel(history) ? `Undo: ${undoLabel(history)}` : "Undo unavailable"}
        >
          <ArrowUUpLeft size={16} aria-hidden /> Undo
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={!canRedo(history)}
          title={redoLabel(history) ? `Redo: ${redoLabel(history)}` : "Nothing to redo"}
          aria-label={redoLabel(history) ? `Redo: ${redoLabel(history)}` : "Redo unavailable"}
        >
          <ArrowUUpRight size={16} aria-hidden /> Redo
        </button>
        <span className="svg-studio__sep" aria-hidden />
        <button type="button" onClick={addRect} title="Add rectangle" aria-label="Add rectangle">
          <Rectangle size={16} aria-hidden /> Rect
        </button>
        <button type="button" onClick={addCircle} title="Add circle" aria-label="Add circle">
          <Circle size={16} aria-hidden /> Circle
        </button>
        <button type="button" onClick={addLine} title="Add line" aria-label="Add line">
          <LineSegment size={16} aria-hidden /> Line
        </button>
        <button type="button" onClick={addText} title="Add text" aria-label="Add text">
          <TextT size={16} aria-hidden /> Text
        </button>
        <span className="svg-studio__sep" aria-hidden />
        <button type="button" onClick={bringToFront} disabled={!selected} title="Bring to front" aria-label="Bring to front">
          <StackPlus size={16} aria-hidden />
        </button>
        <button type="button" onClick={sendToBack} disabled={!selected} title="Send to back" aria-label="Send to back">
          <StackMinus size={16} aria-hidden />
        </button>
        <button type="button" onClick={deleteSelected} disabled={!selected} title="Delete selected" aria-label="Delete selected">
          <Trash size={16} aria-hidden />
        </button>
        <span className="svg-studio__sep" aria-hidden />
        <button
          type="button"
          onClick={zoomOut}
          title="Zoom out"
          aria-label="Zoom out"
          data-testid="admin-studio-zoom-out"
          data-non-drag-for="zoom"
        >
          −
        </button>
        <button
          type="button"
          onClick={zoomIn}
          title="Zoom in"
          aria-label="Zoom in"
          data-testid="admin-studio-zoom-in"
          data-non-drag-for="zoom"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomToFit}
          title="Zoom to fit"
          aria-label="Zoom to fit"
          data-testid="admin-studio-zoom-fit"
          data-non-drag-for="pan,zoom"
        >
          <ArrowsOutSimple size={16} aria-hidden /> Fit
        </button>
        <button
          type="button"
          onClick={resetViewport}
          title="Reset viewport"
          aria-label="Reset viewport"
          data-testid="admin-studio-zoom-reset"
          data-non-drag-for="pan,zoom"
        >
          Reset
        </button>
      </div>

      <p
        className="svg-studio__a11y-hint"
        data-testid="admin-studio-nudge-hint"
        id="admin-studio-keyboard-help"
      >
        Keyboard: Tab tools and layers. Focus the canvas, then Arrow keys nudge
        the selection (Shift = 10×). Numbers in Inspector set exact geometry
        without dragging. Delete removes the selection. Ctrl+Z / Ctrl+Y undo and
        redo.
      </p>

      {/* ADM-SVG-06: always show all eight status fields (host fills stageMeta). */}
      <div
        className="svg-studio__status"
        aria-label="Canvas status"
        aria-live="polite"
        aria-atomic="false"
        data-testid="admin-stage-status"
        data-adm-svg-06-fields="identity,footprint,viewbox,zoom,selection,draft,validation,revision"
      >
        <span data-testid="admin-status-identity">
          {stageMeta?.identity ?? "Identity —"}
        </span>
        <span data-testid="admin-status-footprint">
          {stageMeta?.footprint ?? "Footprint —"}
        </span>
        <span data-testid="admin-status-viewbox">
          View box {document.viewBox.width} × {document.viewBox.height}
        </span>
        <span data-testid="admin-status-zoom">
          Zoom {Math.round(viewport.zoom * 100)}%
        </span>
        <span data-testid="admin-status-selection">
          {selected ? `Selected: ${selected.name}` : "No selection"}
        </span>
        <span data-testid="admin-status-draft">
          {stageMeta?.draft ?? "Draft —"}
        </span>
        <span data-testid="admin-status-validation">
          {stageMeta?.validation ?? "Validation —"}
        </span>
        <span data-testid="admin-status-revision">
          {stageMeta?.revision ?? "Revision —"}
        </span>
        <span data-testid="admin-status-layers">{document.nodes.length} layers</span>
      </div>

      <div className="svg-studio__body">
        <div
          ref={mountRef}
          className="svg-studio__stage"
          role="application"
          aria-label="SVG canvas"
          aria-describedby="admin-studio-keyboard-help"
          aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Delete Escape Control+Z Control+Y"
          tabIndex={0}
          onKeyDown={handleStageKeyDown}
          data-region="stage"
          data-testid="admin-studio-region-stage"
          data-non-drag-for="move,resize,pan,zoom"
        />

        <aside
          className="svg-studio__layers"
          aria-label="Layers"
          data-region="layers"
          data-testid="admin-studio-region-layers"
        >
          <h3 className="svg-studio__layers-title">Layers</h3>
          <ul className="svg-studio__layer-list">
            {layers.map((node) => (
              <li key={node.id} className={node.id === selectedId ? "is-selected" : undefined}>
                <button type="button" className="svg-studio__layer-name" onClick={() => setSelectedId(node.id)}>
                  {node.name} <span className="svg-studio__layer-kind">{node.kind}</span>
                </button>
                <button type="button" aria-label={node.hidden ? `Show ${node.name}` : `Hide ${node.name}`} onClick={() => toggleHidden(node)}>
                  {node.hidden ? <EyeSlash size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
                </button>
                <button type="button" aria-label={node.locked ? `Unlock ${node.name}` : `Lock ${node.name}`} onClick={() => toggleLocked(node)}>
                  {node.locked ? <Lock size={14} aria-hidden /> : <LockOpen size={14} aria-hidden />}
                </button>
              </li>
            ))}
            {layers.length === 0 && <li className="svg-studio__empty">No shapes yet — add a rectangle to begin.</li>}
          </ul>

          <div
            className="svg-studio__inspector"
            aria-label="Node inspector"
            data-testid="admin-studio-region-properties"
            data-region="properties"
            data-studio-region="properties"
          >
            <h3 className="svg-studio__layers-title">Inspector</h3>
            {!selected ? (
              <p className="svg-studio__empty" data-testid="svg-studio-inspector-empty">
                Select a layer to edit properties.
              </p>
            ) : (
              <>
              <p className="svg-studio__inspector-meta">
                <code>{selected.id}</code> · {selected.kind}
              </p>
              <label className="svg-studio__inspector-fill">
                Layer name
                <input
                  type="text"
                  value={selected.name}
                  onChange={(event) =>
                    patchSelected(`Rename ${selected.name}`, {
                      name: event.target.value,
                    })
                  }
                />
              </label>
              {selected.kind === "rect" ? (
                <div className="svg-studio__inspector-grid">
                  <label htmlFor={`studio-geom-${selected.id}-x`}>
                    X
                    <input
                      id={`studio-geom-${selected.id}-x`}
                      type="number"
                      defaultValue={selected.x}
                      key={`${selected.id}-x-${selected.x}`}
                      data-testid="admin-studio-geom-x"
                      data-non-drag-for="move"
                      aria-label={`${selected.name} X`}
                      onBlur={(event) =>
                        patchSelectedNumber("x", `Set ${selected.name} X`, event.target.value, (v) => ({
                          x: v,
                        }))
                      }
                    />
                  </label>
                  <label htmlFor={`studio-geom-${selected.id}-y`}>
                    Y
                    <input
                      id={`studio-geom-${selected.id}-y`}
                      type="number"
                      defaultValue={selected.y}
                      key={`${selected.id}-y-${selected.y}`}
                      data-testid="admin-studio-geom-y"
                      data-non-drag-for="move"
                      aria-label={`${selected.name} Y`}
                      onBlur={(event) =>
                        patchSelectedNumber("y", `Set ${selected.name} Y`, event.target.value, (v) => ({
                          y: v,
                        }))
                      }
                    />
                  </label>
                  <label htmlFor={`studio-geom-${selected.id}-w`}>
                    W
                    <input
                      id={`studio-geom-${selected.id}-w`}
                      type="number"
                      min={1}
                      defaultValue={selected.width}
                      key={`${selected.id}-w-${selected.width}`}
                      data-testid="admin-studio-geom-w"
                      data-non-drag-for="resize"
                      aria-label={`${selected.name} width`}
                      onBlur={(event) =>
                        patchSelectedNumber("width", `Set ${selected.name} width`, event.target.value, (v) => ({
                          width: Math.max(1, v),
                        }))
                      }
                    />
                  </label>
                  <label htmlFor={`studio-geom-${selected.id}-h`}>
                    H
                    <input
                      id={`studio-geom-${selected.id}-h`}
                      type="number"
                      min={1}
                      defaultValue={selected.height}
                      key={`${selected.id}-h-${selected.height}`}
                      data-testid="admin-studio-geom-h"
                      data-non-drag-for="resize"
                      aria-label={`${selected.name} height`}
                      onBlur={(event) =>
                        patchSelectedNumber("height", `Set ${selected.name} height`, event.target.value, (v) => ({
                          height: Math.max(1, v),
                        }))
                      }
                    />
                  </label>
                </div>
              ) : null}
              {selected.kind === "circle" ? (
                <div className="svg-studio__inspector-grid">
                  <label htmlFor={`studio-geom-${selected.id}-cx`}>
                    CX
                    <input
                      id={`studio-geom-${selected.id}-cx`}
                      type="number"
                      defaultValue={selected.cx}
                      key={`${selected.id}-cx-${selected.cx}`}
                      data-testid="admin-studio-geom-cx"
                      data-non-drag-for="move"
                      aria-label={`${selected.name} center X`}
                      onBlur={(event) =>
                        patchSelectedNumber("cx", `Set ${selected.name} CX`, event.target.value, (v) => ({
                          cx: v,
                        }))
                      }
                    />
                  </label>
                  <label htmlFor={`studio-geom-${selected.id}-cy`}>
                    CY
                    <input
                      id={`studio-geom-${selected.id}-cy`}
                      type="number"
                      defaultValue={selected.cy}
                      key={`${selected.id}-cy-${selected.cy}`}
                      data-testid="admin-studio-geom-cy"
                      data-non-drag-for="move"
                      aria-label={`${selected.name} center Y`}
                      onBlur={(event) =>
                        patchSelectedNumber("cy", `Set ${selected.name} CY`, event.target.value, (v) => ({
                          cy: v,
                        }))
                      }
                    />
                  </label>
                  <label htmlFor={`studio-geom-${selected.id}-r`}>
                    R
                    <input
                      id={`studio-geom-${selected.id}-r`}
                      type="number"
                      min={1}
                      defaultValue={selected.r}
                      key={`${selected.id}-r-${selected.r}`}
                      data-testid="admin-studio-geom-r"
                      data-non-drag-for="resize"
                      aria-label={`${selected.name} radius`}
                      onBlur={(event) =>
                        patchSelectedNumber("r", `Set ${selected.name} radius`, event.target.value, (v) => ({
                          r: Math.max(1, v),
                        }))
                      }
                    />
                  </label>
                </div>
              ) : null}
              {selected.kind === "line" ? (
                <div className="svg-studio__inspector-grid">
                  <label htmlFor={`studio-geom-${selected.id}-x1`}>
                    X1
                    <input
                      id={`studio-geom-${selected.id}-x1`}
                      type="number"
                      defaultValue={selected.x1}
                      key={`${selected.id}-x1-${selected.x1}`}
                      data-testid="admin-studio-geom-x1"
                      data-non-drag-for="move"
                      aria-label={`${selected.name} X1`}
                      onBlur={(event) =>
                        patchSelectedNumber("x1", `Set ${selected.name} X1`, event.target.value, (v) => ({
                          x1: v,
                        }))
                      }
                    />
                  </label>
                  <label htmlFor={`studio-geom-${selected.id}-y1`}>
                    Y1
                    <input
                      id={`studio-geom-${selected.id}-y1`}
                      type="number"
                      defaultValue={selected.y1}
                      key={`${selected.id}-y1-${selected.y1}`}
                      data-testid="admin-studio-geom-y1"
                      data-non-drag-for="move"
                      aria-label={`${selected.name} Y1`}
                      onBlur={(event) =>
                        patchSelectedNumber("y1", `Set ${selected.name} Y1`, event.target.value, (v) => ({
                          y1: v,
                        }))
                      }
                    />
                  </label>
                  <label htmlFor={`studio-geom-${selected.id}-x2`}>
                    X2
                    <input
                      id={`studio-geom-${selected.id}-x2`}
                      type="number"
                      defaultValue={selected.x2}
                      key={`${selected.id}-x2-${selected.x2}`}
                      data-testid="admin-studio-geom-x2"
                      data-non-drag-for="move"
                      aria-label={`${selected.name} X2`}
                      onBlur={(event) =>
                        patchSelectedNumber("x2", `Set ${selected.name} X2`, event.target.value, (v) => ({
                          x2: v,
                        }))
                      }
                    />
                  </label>
                  <label htmlFor={`studio-geom-${selected.id}-y2`}>
                    Y2
                    <input
                      id={`studio-geom-${selected.id}-y2`}
                      type="number"
                      defaultValue={selected.y2}
                      key={`${selected.id}-y2-${selected.y2}`}
                      data-testid="admin-studio-geom-y2"
                      data-non-drag-for="move"
                      aria-label={`${selected.name} Y2`}
                      onBlur={(event) =>
                        patchSelectedNumber("y2", `Set ${selected.name} Y2`, event.target.value, (v) => ({
                          y2: v,
                        }))
                      }
                    />
                  </label>
                </div>
              ) : null}
              {selected.kind === "text" ? (
                <>
                <div className="svg-studio__inspector-grid">
                  <label htmlFor={`studio-geom-${selected.id}-x`}>
                    X
                    <input
                      id={`studio-geom-${selected.id}-x`}
                      type="number"
                      defaultValue={selected.x}
                      key={`${selected.id}-x-${selected.x}`}
                      data-testid="admin-studio-geom-x"
                      data-non-drag-for="move"
                      aria-label={`${selected.name} X`}
                      onBlur={(event) =>
                        patchSelectedNumber("x", `Set ${selected.name} X`, event.target.value, (v) => ({
                          x: v,
                        }))
                      }
                    />
                  </label>
                  <label htmlFor={`studio-geom-${selected.id}-y`}>
                    Y
                    <input
                      id={`studio-geom-${selected.id}-y`}
                      type="number"
                      defaultValue={selected.y}
                      key={`${selected.id}-y-${selected.y}`}
                      data-testid="admin-studio-geom-y"
                      data-non-drag-for="move"
                      aria-label={`${selected.name} Y`}
                      onBlur={(event) =>
                        patchSelectedNumber("y", `Set ${selected.name} Y`, event.target.value, (v) => ({
                          y: v,
                        }))
                      }
                    />
                  </label>
                </div>
                <label className="svg-studio__inspector-fill">
                  Text content
                  <input
                    type="text"
                    defaultValue={selected.text}
                    key={`${selected.id}-text-${selected.text}`}
                    data-testid="admin-studio-geom-text"
                    aria-label={`${selected.name} text content`}
                    onBlur={(event) =>
                      patchSelected(`Set ${selected.name} text`, {
                        text: event.target.value,
                      })
                    }
                  />
                </label>
                </>
              ) : null}
              <label className="svg-studio__inspector-fill">
                Fill token
                <input
                  type="text"
                  defaultValue={selected.style.fillToken ?? ""}
                  key={`${selected.id}-fill-${selected.style.fillToken ?? ""}`}
                  onBlur={(event) =>
                    patchSelected(`Set ${selected.name} fill`, {
                      style: { ...selected.style, fillToken: event.target.value },
                    })
                  }
                />
              </label>
              </>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
