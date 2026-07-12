/**
 * A4.0 / A4.1 — the SVG.js implementation of `SvgEngineAdapter`.
 *
 * This is the browser renderer that mounts *behind* the engine seam. The editor
 * authority remains `SvgSceneDocument`; this adapter only draws it and reports
 * pointer/viewport events back. It is client-only — never import it on the server
 * (the studio loads it via a dynamic import in the canvas component).
 *
 * Spike record (A4.0): @svgdotjs/svg.js core is MIT, ESM, ships types, and mounts
 * cleanly under happy-dom + Next. Its companion `svg.panzoom.js` plugin, however,
 * is a global-scoped IIFE that references `window.SVG` at eval time and throws
 * outside a browser global — so we do NOT depend on it. Pan/zoom is implemented
 * directly on the SVG viewBox here: fewer dependencies, no global coupling, and
 * unit-testable in the DOM environment.
 */

import { SVG, type Svg, type Element as SvgElement } from "@svgdotjs/svg.js";

import { serializeSceneToDefinition } from "./svgSceneSerializer";
import type { SvgBlockDefinitionV1 } from "@/features/planner/admin/svg-editor/svgBlockSchemas";
import type { SvgSceneDocument, SvgSceneNode } from "./svgSceneDocument";
import type {
  SvgEngineAdapter,
  SvgEngineEventMap,
  SvgEngineListener,
  SvgEngineViewport,
} from "./svgEngineAdapter";

const NODE_ATTR = "data-scene-node";
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 40;
const WHEEL_ZOOM_STEP = 1.0015; // per wheel delta unit

interface ViewBoxRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function applyStyle(element: SvgElement, node: SvgSceneNode): void {
  const { style } = node;
  // Tokens are semantic CSS vars / currentColor — never raw hex (anti-copy law).
  if (style.fillToken !== undefined) element.attr("fill", style.fillToken);
  if (style.strokeToken !== undefined) element.attr("stroke", style.strokeToken);
  if (style.opacity !== undefined) element.attr("opacity", style.opacity);
  if (style.lineWeight !== undefined) element.attr("stroke-width", style.lineWeight);
}

function drawNode(root: Svg, node: SvgSceneNode): SvgElement | null {
  if (node.hidden) return null;
  let element: SvgElement;
  switch (node.kind) {
    case "rect":
      element = root.rect(node.width, node.height).move(node.x, node.y);
      break;
    case "circle":
      element = root.circle(node.r * 2).center(node.cx, node.cy);
      break;
    case "line":
      element = root.line(node.x1, node.y1, node.x2, node.y2).attr("stroke", "currentColor");
      break;
    case "path":
      element = root.path(node.d);
      break;
    case "text":
      element = root.text(node.text).move(node.x, node.y);
      break;
  }
  applyStyle(element, node);
  element.attr(NODE_ATTR, node.id);
  return element;
}

export interface SvgJsAdapterOptions {
  /** Enable wheel-to-zoom + drag-to-pan on the empty canvas. Default true. */
  readonly panZoom?: boolean;
}

/**
 * Mount an SVG.js renderer into `container` and return the engine adapter.
 * Call `destroy()` (or unmount the React canvas) to release DOM + listeners.
 */
export function createSvgJsEngineAdapter(
  container: HTMLElement,
  initial: SvgSceneDocument,
  options: SvgJsAdapterOptions = {},
): SvgEngineAdapter {
  const draw = SVG().addTo(container).size("100%", "100%") as Svg;
  const home: ViewBoxRect = { ...initial.viewBox };
  draw.viewbox(home.x, home.y, home.width, home.height);

  let current = initial;
  let destroyed = false;
  const listeners: { [K in keyof SvgEngineEventMap]: Set<SvgEngineListener<K>> } = {
    "node:pointerdown": new Set(),
    "node:dblclick": new Set(),
    "viewport:change": new Set(),
  };

  function box(): ViewBoxRect {
    const b = draw.viewbox();
    return { x: b.x, y: b.y, width: b.width, height: b.height };
  }

  function setBox(next: ViewBoxRect): void {
    draw.viewbox(next.x, next.y, next.width, next.height);
    emitViewport();
  }

  function readViewport(): SvgEngineViewport {
    const b = box();
    const zoom = b.width > 0 ? home.width / b.width : 1;
    return { panX: b.x, panY: b.y, zoom };
  }

  function emitViewport(): void {
    for (const listener of listeners["viewport:change"]) listener(readViewport());
  }

  function nodeIdFromEvent(target: EventTarget | null): string | null {
    if (!(target instanceof globalThis.Element)) return null;
    const owner = target.closest(`[${NODE_ATTR}]`);
    return owner?.getAttribute(NODE_ATTR) ?? null;
  }

  function toScenePoint(event: MouseEvent): { x: number; y: number } {
    const point = draw.point(event.clientX, event.clientY);
    return { x: point.x, y: point.y };
  }

  // --- interaction state ---
  let panning: { originX: number; originY: number; startBox: ViewBoxRect } | null = null;

  function onPointerDown(event: Event): void {
    if (!(event instanceof MouseEvent)) return;
    const { x, y } = toScenePoint(event);
    const nodeId = nodeIdFromEvent(event.target);
    for (const listener of listeners["node:pointerdown"]) {
      listener({ nodeId, sceneX: x, sceneY: y, shiftKey: event.shiftKey });
    }
    // Drag on empty canvas (or middle button) pans.
    if (options.panZoom !== false && (nodeId === null || event.button === 1)) {
      panning = { originX: event.clientX, originY: event.clientY, startBox: box() };
    }
  }

  function onPointerMove(event: Event): void {
    if (!panning || !(event instanceof MouseEvent)) return;
    const rect = container.getBoundingClientRect();
    if (rect.width === 0) return;
    const scenePerPx = panning.startBox.width / rect.width;
    const dx = (event.clientX - panning.originX) * scenePerPx;
    const dy = (event.clientY - panning.originY) * scenePerPx;
    setBox({ ...panning.startBox, x: panning.startBox.x - dx, y: panning.startBox.y - dy });
  }

  function onPointerUp(): void {
    panning = null;
  }

  function onDblClick(event: Event): void {
    if (!(event instanceof MouseEvent)) return;
    const { x, y } = toScenePoint(event);
    for (const listener of listeners["node:dblclick"]) {
      listener({ nodeId: nodeIdFromEvent(event.target), sceneX: x, sceneY: y, shiftKey: event.shiftKey });
    }
  }

  function onWheel(event: Event): void {
    if (options.panZoom === false || !(event instanceof WheelEvent)) return;
    event.preventDefault();
    const b = box();
    const currentZoom = home.width / b.width;
    const factor = WHEEL_ZOOM_STEP ** -event.deltaY;
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom * factor));
    if (nextZoom === currentZoom) return;
    // Zoom toward the cursor: keep the scene point under the pointer fixed.
    const focus = toScenePoint(event);
    const nextWidth = home.width / nextZoom;
    const nextHeight = home.height / nextZoom;
    const ratioX = (focus.x - b.x) / b.width;
    const ratioY = (focus.y - b.y) / b.height;
    setBox({ x: focus.x - ratioX * nextWidth, y: focus.y - ratioY * nextHeight, width: nextWidth, height: nextHeight });
  }

  const node = draw.node;
  node.addEventListener("pointerdown", onPointerDown);
  node.addEventListener("dblclick", onDblClick);
  node.addEventListener("wheel", onWheel, { passive: false });
  globalThis.addEventListener?.("pointermove", onPointerMove);
  globalThis.addEventListener?.("pointerup", onPointerUp);

  function repaint(document: SvgSceneDocument): void {
    draw.clear();
    for (const sceneNode of document.nodes) drawNode(draw, sceneNode);
  }

  repaint(current);

  return {
    render(document) {
      if (destroyed || document === current) return;
      const viewChanged =
        document.viewBox.width !== home.width || document.viewBox.height !== home.height;
      current = document;
      if (viewChanged) {
        home.x = document.viewBox.x;
        home.y = document.viewBox.y;
        home.width = document.viewBox.width;
        home.height = document.viewBox.height;
      }
      repaint(document);
    },
    getViewport() {
      return readViewport();
    },
    setViewport(next) {
      if (destroyed) throw new Error("engine adapter used after destroy()");
      const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next.zoom ?? readViewport().zoom));
      const b = box();
      setBox({
        x: next.panX ?? b.x,
        y: next.panY ?? b.y,
        width: home.width / zoom,
        height: home.height / zoom,
      });
    },
    zoomToFit() {
      if (destroyed) throw new Error("engine adapter used after destroy()");
      setBox({ ...home });
    },
    resetViewport() {
      if (destroyed) throw new Error("engine adapter used after destroy()");
      setBox({ ...home });
    },
    serialize(): SvgBlockDefinitionV1 {
      return serializeSceneToDefinition(current);
    },
    on(event, listener) {
      listeners[event].add(listener);
      return () => {
        listeners[event].delete(listener);
      };
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      node.removeEventListener("pointerdown", onPointerDown);
      node.removeEventListener("dblclick", onDblClick);
      node.removeEventListener("wheel", onWheel);
      globalThis.removeEventListener?.("pointermove", onPointerMove);
      globalThis.removeEventListener?.("pointerup", onPointerUp);
      listeners["node:pointerdown"].clear();
      listeners["node:dblclick"].clear();
      listeners["viewport:change"].clear();
      draw.remove();
    },
  };
}
