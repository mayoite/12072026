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
import type { SvgEngineAdapter } from "./scene/svgEngineAdapter";

export interface SvgStudioCanvasProps {
  readonly initialDocument: SvgSceneDocument;
  /** Notified after every committed edit so the host can persist / preview. */
  readonly onDocumentChange?: (document: SvgSceneDocument) => void;
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

export function SvgStudioCanvas({ initialDocument, onDocumentChange }: SvgStudioCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const adapterRef = useRef<SvgEngineAdapter | null>(null);
  const [history, setHistory] = useState<SvgSceneHistory>(() => createHistory(initialDocument, "Open"));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const document = history.present.document;
  const documentRef = useRef(document);
  documentRef.current = document;

  // Mount the SVG.js engine once, lazily (client-only import).
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let offPointer: (() => void) | undefined;
    let offChange: (() => void) | undefined;

    void import("./scene/svgJsEngineAdapter").then(({ createSvgJsEngineAdapter }) => {
      if (disposed || !mountRef.current) return;
      const adapter = createSvgJsEngineAdapter(mountRef.current, initialDocument);
      adapterRef.current = adapter;
      offPointer = adapter.on("node:pointerdown", (event) => {
        setSelectedId(event.nodeId);
      });
      offChange = adapter.on("node:change", (event) => {
        const latestDoc = documentRef.current;
        const updated = replaceNode(latestDoc, event.nodeId, (node) => ({
          ...node,
          ...event.patch,
        } as SvgSceneNode));
        apply(`Transform ${findNode(latestDoc, event.nodeId)?.name || "shape"}`, updated);
      });
    });

    return () => {
      disposed = true;
      offPointer?.();
      offChange?.();
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

  const apply = useCallback(
    (label: string, next: SvgSceneDocument) => {
      setHistory((current) => {
        const committed = commit(current, label, next);
        if (committed !== current) onDocumentChange?.(next);
        return committed;
      });
    },
    [onDocumentChange],
  );

  const selected = selectedId ? findNode(document, selectedId) : undefined;

  const handleUndo = useCallback(() => {
    setHistory((h) => {
      const next = undo(h);
      if (next !== h) onDocumentChange?.(next.present.document);
      return next;
    });
  }, [onDocumentChange]);

  const handleRedo = useCallback(() => {
    setHistory((h) => {
      const next = redo(h);
      if (next !== h) onDocumentChange?.(next.present.document);
      return next;
    });
  }, [onDocumentChange]);

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

  // Layer tree paints top-first (topmost z last in the document array).
  const layers = useMemo(() => [...document.nodes].reverse(), [document.nodes]);

  return (
    <section className="svg-studio" aria-label="Visual SVG authoring canvas">
      <div className="svg-studio__toolbar" role="toolbar" aria-label="Canvas tools">
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

      <div className="svg-studio__body">
        <div ref={mountRef} className="svg-studio__stage" role="application" aria-label="SVG canvas" />

        <aside className="svg-studio__layers" aria-label="Layers">
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
        </aside>
      </div>
    </section>
  );
}
