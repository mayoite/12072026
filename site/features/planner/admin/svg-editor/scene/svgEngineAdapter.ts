/**
 * A4.0 — the engine adapter seam.
 *
 * The editor authority is `SvgSceneDocument`. A renderer (SVG.js in the browser)
 * mounts *behind* this interface and is fed documents; it never becomes the
 * source of truth. This keeps the model testable without a DOM, keeps the studio
 * SSR-safe (no renderer imported on the server), and lets the engine be swapped
 * if the SVG.js spike is later rejected — exactly the "engine adapter owns mount,
 * destroy, events, viewport, and serialization" requirement of A4.0.
 *
 * `createHeadlessEngineAdapter` is the reference implementation: it satisfies the
 * whole contract with no DOM, so the seam is exercised by unit tests today. The
 * SVG.js adapter (`svgJsEngineAdapter.ts`) implements the same interface.
 */

import { serializeSceneToDefinition } from "./svgSceneSerializer";
import type { SvgBlockDefinitionV1 } from "@/features/planner/admin/svg-editor/svgBlockSchemas";
import type { SvgSceneDocument, SvgSceneViewBox } from "./svgSceneDocument";

export interface SvgEngineViewport {
  /** Pan offset in scene units. */
  readonly panX: number;
  readonly panY: number;
  /** Zoom factor; 1 = actual size. */
  readonly zoom: number;
}

export interface SvgEnginePointerEvent {
  /** Node id under the pointer, or `null` for empty canvas. */
  readonly nodeId: string | null;
  /** Pointer position in scene coordinates. */
  readonly sceneX: number;
  readonly sceneY: number;
  readonly shiftKey: boolean;
}

export interface SvgEngineNodeChangeEvent {
  readonly nodeId: string;
  readonly patch: Partial<SvgSceneNode>;
}

export interface SvgEngineEventMap {
  readonly "node:pointerdown": SvgEnginePointerEvent;
  readonly "node:dblclick": SvgEnginePointerEvent;
  readonly "node:change": SvgEngineNodeChangeEvent;
  readonly "viewport:change": SvgEngineViewport;
}

export type SvgEngineListener<K extends keyof SvgEngineEventMap> = (
  payload: SvgEngineEventMap[K],
) => void;

export interface SvgEngineAdapter {
  /** Push a new document to render. Idempotent for an unchanged reference. */
  render(document: SvgSceneDocument, selectedId?: string | null): void;
  /** Current viewport. */
  getViewport(): SvgEngineViewport;
  /** Set pan/zoom. */
  setViewport(viewport: Partial<SvgEngineViewport>): void;
  /** Fit the whole artboard into the mounted element. */
  zoomToFit(): void;
  /** Reset pan to origin and zoom to 1. */
  resetViewport(): void;
  /** Serialize the current document to the V1 publish descriptor. */
  serialize(): SvgBlockDefinitionV1;
  /** Subscribe to an engine event. Returns an unsubscribe function. */
  on<K extends keyof SvgEngineEventMap>(event: K, listener: SvgEngineListener<K>): () => void;
  /** Tear down all renderer resources and listeners. Safe to call twice. */
  destroy(): void;
}

const IDENTITY_VIEWPORT: SvgEngineViewport = { panX: 0, panY: 0, zoom: 1 };

function fitViewport(viewBox: SvgSceneViewBox, element?: { width: number; height: number }): SvgEngineViewport {
  if (!element || element.width <= 0 || element.height <= 0) return IDENTITY_VIEWPORT;
  const zoom = Math.min(element.width / viewBox.width, element.height / viewBox.height);
  return { panX: viewBox.x, panY: viewBox.y, zoom };
}

/**
 * DOM-free adapter that implements the full contract in memory. Used by tests and
 * as a safe SSR stand-in; the browser studio swaps in the SVG.js adapter.
 */
export function createHeadlessEngineAdapter(
  initial: SvgSceneDocument,
  bounds?: { width: number; height: number },
): SvgEngineAdapter {
  let current = initial;
  let viewport: SvgEngineViewport = IDENTITY_VIEWPORT;
  let destroyed = false;
  const listeners: { [K in keyof SvgEngineEventMap]: Set<SvgEngineListener<K>> } = {
    "node:pointerdown": new Set(),
    "node:dblclick": new Set(),
    "node:change": new Set(),
    "viewport:change": new Set(),
  };

  function assertLive(): void {
    if (destroyed) throw new Error("engine adapter used after destroy()");
  }

  function emitViewport(): void {
    for (const listener of listeners["viewport:change"]) listener(viewport);
  }

  return {
    render(document) {
      assertLive();
      current = document;
    },
    getViewport() {
      return viewport;
    },
    setViewport(next) {
      assertLive();
      viewport = { ...viewport, ...next };
      emitViewport();
    },
    zoomToFit() {
      assertLive();
      viewport = fitViewport(current.viewBox, bounds);
      emitViewport();
    },
    resetViewport() {
      assertLive();
      viewport = IDENTITY_VIEWPORT;
      emitViewport();
    },
    serialize() {
      return serializeSceneToDefinition(current);
    },
    on(event, listener) {
      listeners[event].add(listener);
      return () => {
        listeners[event].delete(listener);
      };
    },
    destroy() {
      destroyed = true;
      listeners["node:pointerdown"].clear();
      listeners["node:dblclick"].clear();
      listeners["node:change"].clear();
      listeners["viewport:change"].clear();
    },
  };
}
