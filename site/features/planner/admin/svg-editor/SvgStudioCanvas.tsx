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
import type { MutableRefObject } from "react";
import {
  ArrowsOutSimple,
  ArrowUUpLeft,
  ArrowUUpRight,
  Circle,
  Eye,
  EyeSlash,
  Lock,
  LockOpen,
  Rectangle,
  StackMinus,
  StackPlus,
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

  const deleteSelected = useCallback(() => {
    if (!selected) return;
    const confirmed = window.confirm(
      `Delete “${selected.name}” from this draft? You can undo this action until the editor is closed.`,
    );
    if (!confirmed) return;
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

  const zoomToFit = useCallback(() => adapterRef.current?.zoomToFit(), []);
  const resetViewport = useCallback(() => adapterRef.current?.resetViewport(), []);

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

  // Layer tree paints top-first (topmost z last in the document array).
  const layers = useMemo(() => [...document.nodes].reverse(), [document.nodes]);

  return (
    <section
      className="svg-studio"
      aria-label="Visual SVG authoring canvas"
      data-testid="admin-svg-studio"
      data-supported-kinds="rect,circle"
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
        <button type="button" onClick={zoomToFit} title="Zoom to fit" aria-label="Zoom to fit">
          <ArrowsOutSimple size={16} aria-hidden /> Fit
        </button>
        <button type="button" onClick={resetViewport} title="Reset viewport" aria-label="Reset viewport">
          Reset
        </button>
      </div>

      <div
        className="svg-studio__status"
        aria-label="Canvas status"
        data-testid="admin-stage-status"
      >
        {stageMeta ? (
          <>
            <span data-testid="admin-status-identity">{stageMeta.identity}</span>
            <span data-testid="admin-status-footprint">{stageMeta.footprint}</span>
          </>
        ) : null}
        <span data-testid="admin-status-viewbox">
          View box {document.viewBox.width} × {document.viewBox.height}
        </span>
        <span data-testid="admin-status-zoom">
          Zoom {Math.round(viewport.zoom * 100)}%
        </span>
        <span data-testid="admin-status-selection">
          {selected ? `Selected: ${selected.name}` : "No selection"}
        </span>
        {stageMeta ? (
          <>
            <span data-testid="admin-status-draft">{stageMeta.draft}</span>
            <span data-testid="admin-status-validation">{stageMeta.validation}</span>
            <span data-testid="admin-status-revision">{stageMeta.revision}</span>
          </>
        ) : null}
        <span data-testid="admin-status-layers">{document.nodes.length} layers</span>
      </div>

      <div className="svg-studio__body">
        <div
          ref={mountRef}
          className="svg-studio__stage"
          role="application"
          aria-label="SVG canvas"
          data-region="stage"
          data-testid="admin-studio-region-stage"
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
                  <label>
                    X
                    <input
                      type="number"
                      defaultValue={selected.x}
                      key={`${selected.id}-x-${selected.x}`}
                      onBlur={(event) =>
                        patchSelectedNumber("x", `Set ${selected.name} X`, event.target.value, (v) => ({
                          x: v,
                        }))
                      }
                    />
                  </label>
                  <label>
                    Y
                    <input
                      type="number"
                      defaultValue={selected.y}
                      key={`${selected.id}-y-${selected.y}`}
                      onBlur={(event) =>
                        patchSelectedNumber("y", `Set ${selected.name} Y`, event.target.value, (v) => ({
                          y: v,
                        }))
                      }
                    />
                  </label>
                  <label>
                    W
                    <input
                      type="number"
                      min={1}
                      defaultValue={selected.width}
                      key={`${selected.id}-w-${selected.width}`}
                      onBlur={(event) =>
                        patchSelectedNumber("width", `Set ${selected.name} width`, event.target.value, (v) => ({
                          width: Math.max(1, v),
                        }))
                      }
                    />
                  </label>
                  <label>
                    H
                    <input
                      type="number"
                      min={1}
                      defaultValue={selected.height}
                      key={`${selected.id}-h-${selected.height}`}
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
                  <label>
                    CX
                    <input
                      type="number"
                      defaultValue={selected.cx}
                      key={`${selected.id}-cx-${selected.cx}`}
                      onBlur={(event) =>
                        patchSelectedNumber("cx", `Set ${selected.name} CX`, event.target.value, (v) => ({
                          cx: v,
                        }))
                      }
                    />
                  </label>
                  <label>
                    CY
                    <input
                      type="number"
                      defaultValue={selected.cy}
                      key={`${selected.id}-cy-${selected.cy}`}
                      onBlur={(event) =>
                        patchSelectedNumber("cy", `Set ${selected.name} CY`, event.target.value, (v) => ({
                          cy: v,
                        }))
                      }
                    />
                  </label>
                  <label>
                    R
                    <input
                      type="number"
                      min={1}
                      defaultValue={selected.r}
                      key={`${selected.id}-r-${selected.r}`}
                      onBlur={(event) =>
                        patchSelectedNumber("r", `Set ${selected.name} radius`, event.target.value, (v) => ({
                          r: Math.max(1, v),
                        }))
                      }
                    />
                  </label>
                </div>
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
