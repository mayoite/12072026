/**
 * A4.0 — engine foundation.
 *
 * `SvgSceneDocument` is the single editor authority for the no-code SVG studio.
 * It is engine-independent: SVG.js (or any renderer) mounts *behind* the
 * `SvgEngineAdapter` seam and never becomes the source of truth. The document
 * serializes deterministically into the existing `SvgBlockDefinitionV1` publish
 * boundary (see `svgSceneSerializer.ts`) — the compiler and descriptor contract
 * are unchanged.
 *
 * Design invariants (A4.0):
 *  - Deterministic IDs: node identity is stable across edits; z-order is carried
 *    by array position, not by id.
 *  - Deterministic ordering: `nodes[0]` paints first (bottom); `nodes[n-1]` paints
 *    last (top). The serializer encodes this order so it survives the compiler's
 *    id-sort.
 *  - Deterministic numeric precision: geometry is authored freely but normalized
 *    on serialize; the document keeps author values.
 *  - No hidden JSON: the document *is* the model the inspector and canvas edit.
 */

/** Fill / stroke reference a theme token id, never a raw hex value. */
export interface SvgSceneStyle {
  readonly fillToken?: string;
  readonly strokeToken?: string;
  readonly opacity?: number;
  readonly lineWeight?: number;
}

interface SvgSceneNodeCommon {
  /** Stable editor identity. Survives reorder, restyle, and rename. */
  readonly id: string;
  /** Human label shown in the layer tree. */
  readonly name: string;
  /** Layer-tree lock: blocks selection/transform in the canvas. */
  readonly locked: boolean;
  /** Layer-tree visibility. Hidden nodes are omitted from the compiled artifact. */
  readonly hidden: boolean;
  readonly style: SvgSceneStyle;
}

export interface SvgSceneRectNode extends SvgSceneNodeCommon {
  readonly kind: "rect";
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface SvgSceneCircleNode extends SvgSceneNodeCommon {
  readonly kind: "circle";
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
}

export interface SvgSceneLineNode extends SvgSceneNodeCommon {
  readonly kind: "line";
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

export interface SvgScenePathNode extends SvgSceneNodeCommon {
  readonly kind: "path";
  readonly d: string;
}

export interface SvgSceneTextNode extends SvgSceneNodeCommon {
  readonly kind: "text";
  readonly x: number;
  readonly y: number;
  readonly text: string;
}

export type SvgSceneNode =
  | SvgSceneRectNode
  | SvgSceneCircleNode
  | SvgSceneLineNode
  | SvgScenePathNode
  | SvgSceneTextNode;

export type SvgSceneNodeKind = SvgSceneNode["kind"];

export interface SvgSceneViewBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Descriptor metadata carried through the editor unchanged. These fields map 1:1
 * to `SvgBlockDefinitionV1` and are surfaced by the property inspector (A4.3),
 * not the geometry canvas. Kept opaque here so the model layer stays free of the
 * inspector's concerns; the serializer owns the mapping.
 */
export interface SvgSceneMetadata {
  readonly typeId: string;
  readonly name: string;
  readonly category: string;
  readonly tags: readonly string[];
  readonly sku?: string;
  readonly lifecycleStatus: "draft" | "review" | "published" | "deprecated" | "archived";
  readonly ownerId: string;
  readonly physicalDimensionsMm: { readonly width: number; readonly depth: number; readonly height: number };
  readonly accessibilityTitle: string;
  readonly accessibilityDescription?: string;
}

export interface SvgSceneDocument {
  /** Bumped by the compat layer if the in-memory shape ever changes. */
  readonly modelVersion: 1;
  readonly viewBox: SvgSceneViewBox;
  readonly metadata: SvgSceneMetadata;
  /** Paint order: index 0 = bottom, last = top. */
  readonly nodes: readonly SvgSceneNode[];
}

export const SCENE_MODEL_VERSION = 1 as const;

/** Longest edge, in scene units, a geometry value may reach. Guards runaway input. */
export const SCENE_MAX_EXTENT = 100_000;

const isFiniteNumber = (value: number): boolean => Number.isFinite(value);

function assertFinite(value: number, field: string): number {
  if (!isFiniteNumber(value)) {
    throw new RangeError(`scene geometry field "${field}" must be finite; received ${value}`);
  }
  if (Math.abs(value) > SCENE_MAX_EXTENT) {
    throw new RangeError(`scene geometry field "${field}" exceeds ±${SCENE_MAX_EXTENT}; received ${value}`);
  }
  return value;
}

/** Find a node by stable id, or `undefined`. */
export function findNode(doc: SvgSceneDocument, id: string): SvgSceneNode | undefined {
  return doc.nodes.find((node) => node.id === id);
}

export function nodeIndex(doc: SvgSceneDocument, id: string): number {
  return doc.nodes.findIndex((node) => node.id === id);
}

/** Replace a single node by id, returning a new document (immutable update). */
export function replaceNode(
  doc: SvgSceneDocument,
  id: string,
  update: (node: SvgSceneNode) => SvgSceneNode,
): SvgSceneDocument {
  let touched = false;
  const nodes = doc.nodes.map((node) => {
    if (node.id !== id) return node;
    touched = true;
    const next = update(node);
    if (next.id !== id) {
      throw new Error(`replaceNode must not change node id (${id} → ${next.id})`);
    }
    if (next.kind !== node.kind) {
      throw new Error(`replaceNode must not change node kind (${node.kind} → ${next.kind})`);
    }
    validateNodeGeometry(next);
    return next;
  });
  if (!touched) return doc;
  return { ...doc, nodes };
}

/** Append a node on top of the stack. */
export function addNode(doc: SvgSceneDocument, node: SvgSceneNode): SvgSceneDocument {
  if (findNode(doc, node.id)) {
    throw new Error(`duplicate node id "${node.id}"`);
  }
  validateNodeGeometry(node);
  return { ...doc, nodes: [...doc.nodes, node] };
}

/** Remove a node by id. No-op if absent. */
export function removeNode(doc: SvgSceneDocument, id: string): SvgSceneDocument {
  const nodes = doc.nodes.filter((node) => node.id !== id);
  if (nodes.length === doc.nodes.length) return doc;
  return { ...doc, nodes };
}

/**
 * Move a node to an absolute z-index (0 = bottom). Clamps to bounds. This is the
 * primitive behind "bring forward / send backward / to front / to back".
 */
export function reorderNode(doc: SvgSceneDocument, id: string, toIndex: number): SvgSceneDocument {
  const from = nodeIndex(doc, id);
  if (from < 0) return doc;
  const clamped = Math.max(0, Math.min(doc.nodes.length - 1, Math.trunc(toIndex)));
  if (clamped === from) return doc;
  const nodes = [...doc.nodes];
  const [moved] = nodes.splice(from, 1);
  nodes.splice(clamped, 0, moved);
  return { ...doc, nodes };
}

function validateNodeGeometry(node: SvgSceneNode): void {
  switch (node.kind) {
    case "rect":
      assertFinite(node.x, "x");
      assertFinite(node.y, "y");
      if (node.width <= 0) throw new RangeError(`rect "${node.id}" width must be positive`);
      if (node.height <= 0) throw new RangeError(`rect "${node.id}" height must be positive`);
      assertFinite(node.width, "width");
      assertFinite(node.height, "height");
      return;
    case "circle":
      assertFinite(node.cx, "cx");
      assertFinite(node.cy, "cy");
      if (node.r <= 0) throw new RangeError(`circle "${node.id}" r must be positive`);
      assertFinite(node.r, "r");
      return;
    case "line":
      assertFinite(node.x1, "x1");
      assertFinite(node.y1, "y1");
      assertFinite(node.x2, "x2");
      assertFinite(node.y2, "y2");
      return;
    case "path":
      if (node.d.trim().length === 0) throw new RangeError(`path "${node.id}" d must be non-empty`);
      return;
    case "text":
      assertFinite(node.x, "x");
      assertFinite(node.y, "y");
      return;
  }
}

/** Validate the whole document up front (used on load and before serialize). */
export function validateDocument(doc: SvgSceneDocument): void {
  if (doc.viewBox.width <= 0 || doc.viewBox.height <= 0) {
    throw new RangeError("viewBox width/height must be positive");
  }
  const seen = new Set<string>();
  for (const node of doc.nodes) {
    if (seen.has(node.id)) throw new Error(`duplicate node id "${node.id}"`);
    seen.add(node.id);
    validateNodeGeometry(node);
  }
}
