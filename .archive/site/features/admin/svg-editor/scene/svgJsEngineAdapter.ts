/**
 * A4.0 / A4.1 — the SVG.js implementation of `SvgEngineAdapter`.
 *
 * This is the browser renderer that mounts *behind* the engine seam. The editor
 * authority remains `SvgSceneDocument`; this adapter only draws it and reports
 * pointer/viewport events back. It is client-only — never import it on the server
 * (the studio loads it via a dynamic import in the canvas component).
 */

import { SVG, type Svg, type Element as SvgElement } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import "@svgdotjs/svg.select.js";
import "@svgdotjs/svg.resize.js";

import { serializeSceneToDefinition } from "./svgSceneSerializer";
import type { SvgBlockDefinitionV1 } from "@/features/admin/svg-editor/svgBlockSchemas";
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
  element.addClass("svg-studio__node");
  return element;
}

function drawOriginAxes(root: Svg, viewBox: ViewBoxRect): void {
  // Draw horizontal axis line at y = 0
  if (0 >= viewBox.y && 0 <= viewBox.y + viewBox.height) {
    root.line(viewBox.x, 0, viewBox.x + viewBox.width, 0)
      .addClass("svg-studio-axis-line");
  }
  // Draw vertical axis line at x = 0
  if (0 >= viewBox.x && 0 <= viewBox.x + viewBox.width) {
    root.line(0, viewBox.y, 0, viewBox.y + viewBox.height)
      .addClass("svg-studio-axis-line");
  }
  // Center anchor point at (0,0)
  root.circle(6)
    .center(0, 0)
    .addClass("svg-studio-axis-center");
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
  let selectedId: string | null = null;
  let destroyed = false;

  const listeners: { [K in keyof SvgEngineEventMap]: Set<SvgEngineListener<K>> } = {
    "node:pointerdown": new Set(),
    "node:dblclick": new Set(),
    "node:change": new Set(),
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

  function repaint(document: SvgSceneDocument, activeId: string | null): void {
    draw.clear();

    // Render the coordinate pivot crosshairs at the bottom layer
    drawOriginAxes(draw, home);

    const elementsMap = new Map<string, SvgElement>();
    for (const sceneNode of document.nodes) {
      const element = drawNode(draw, sceneNode);
      if (element) {
        elementsMap.set(sceneNode.id, element);
      }
    }

    if (activeId) {
      const element = elementsMap.get(activeId);
      const nodeModel = document.nodes.find((n) => n.id === activeId);

      element?.addClass("svg-studio__node--selected");

      // Do not make locked or hidden nodes interactive
      if (element && nodeModel && !nodeModel.locked && !nodeModel.hidden) {
        // Paths are not easily editable using simple drag/resize; restrict to primitives
        if (nodeModel.kind !== "path") {
          element.select().resize().draggable();

          element.on("dragend", () => {
            let patch: Partial<SvgSceneNode> = {};
            if (nodeModel.kind === "rect" || nodeModel.kind === "text") {
              patch = { x: Number(element.x()), y: Number(element.y()) };
            } else if (nodeModel.kind === "circle") {
              patch = { cx: Number(element.cx()), cy: Number(element.cy()) };
            } else if (nodeModel.kind === "line") {
              patch = {
                x1: Number(element.attr("x1")),
                y1: Number(element.attr("y1")),
                x2: Number(element.attr("x2")),
                y2: Number(element.attr("y2")),
              };
            }
            for (const listener of listeners["node:change"]) {
              listener({ nodeId: activeId, patch });
            }
          });

          element.on("resizedone", () => {
            let patch: Partial<SvgSceneNode> = {};
            if (nodeModel.kind === "rect") {
              patch = {
                x: Number(element.x()),
                y: Number(element.y()),
                width: Number(element.width()),
                height: Number(element.height()),
              };
            } else if (nodeModel.kind === "circle") {
              patch = {
                cx: Number(element.cx()),
                cy: Number(element.cy()),
                r: Number(element.width()) / 2,
              };
            } else if (nodeModel.kind === "line") {
              patch = {
                x1: Number(element.attr("x1")),
                y1: Number(element.attr("y1")),
                x2: Number(element.attr("x2")),
                y2: Number(element.attr("y2")),
              };
            }
            for (const listener of listeners["node:change"]) {
              listener({ nodeId: activeId, patch });
            }
          });
        }
      }
    }
  }

  repaint(current, selectedId);

  return {
    render(document, nextSelectedId) {
      if (destroyed) return;
      const selectChanged = nextSelectedId !== selectedId;
      const docChanged = document !== current;
      if (!docChanged && !selectChanged) return;

      const viewChanged =
        document.viewBox.width !== home.width || document.viewBox.height !== home.height;
      current = document;
      selectedId = nextSelectedId !== undefined ? nextSelectedId : selectedId;

      if (viewChanged) {
        home.x = document.viewBox.x;
        home.y = document.viewBox.y;
        home.width = document.viewBox.width;
        home.height = document.viewBox.height;
      }
      repaint(document, selectedId);
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
      listeners["node:change"].clear();
      listeners["viewport:change"].clear();
      draw.remove();
    },
  };
}
