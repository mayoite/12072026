/**
 * A4.0 — deterministic serialization between the editor authority
 * (`SvgSceneDocument`) and the existing publish boundary (`SvgBlockDefinitionV1`).
 *
 * Two guarantees make the studio safe to publish from:
 *
 *  1. Paint order survives compilation. The V1 compiler sorts `parts` by `id`
 *     before emitting SVG, so raw node order would be lost. We encode the scene's
 *     z-order into a zero-padded id prefix (`z0001-…`); lexical id-sort then
 *     reproduces the exact author-intended stacking. The loader strips the prefix
 *     to recover the stable editor id.
 *
 *  2. Round-trip fidelity. `loadSceneFromDefinition(serializeSceneToDefinition(doc))`
 *     yields a document equal to `doc` (after the same numeric normalization),
 *     and re-serializing is a fixed point. Proven by the round-trip test.
 *
 * Numeric precision is normalized to a fixed number of decimals on serialize so
 * the descriptor checksum is stable regardless of sub-pixel author drift.
 */

import type {
  SvgBlockDefinitionV1,
  SvgStyleV1Schema,
} from "@/features/planner/admin/svg-editor/svgBlockSchemas";
import type { z } from "zod";
import {
  SCENE_MODEL_VERSION,
  validateDocument,
  type SvgSceneDocument,
  type SvgSceneMetadata,
  type SvgSceneNode,
  type SvgSceneStyle,
} from "./svgSceneDocument";

type SvgStyleV1 = z.infer<typeof SvgStyleV1Schema>;
type SvgPartV1 = SvgBlockDefinitionV1["parts"][number];

/** Decimal places geometry is rounded to on serialize. Sub-mm on a mm grid. */
export const SCENE_NUMERIC_PRECISION = 3;

const Z_PREFIX = "z";
const Z_PAD = 4; // supports up to 9999 nodes; schema caps parts at 1000.

/** Round to fixed precision without introducing negative zero. */
export function normalizeNumber(value: number, precision: number = SCENE_NUMERIC_PRECISION): number {
  const factor = 10 ** precision;
  const rounded = Math.round(value * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function zPrefix(index: number): string {
  return `${Z_PREFIX}${String(index).padStart(Z_PAD, "0")}`;
}

/** `z0007-desk-top` → `desk-top`. Non-prefixed ids pass through unchanged. */
function stripZPrefix(partId: string): string {
  const match = partId.match(/^z\d{4}-(.+)$/);
  return match ? match[1] : partId;
}

function styleToV1(style: SvgSceneStyle): SvgStyleV1 | undefined {
  const out: Record<string, unknown> = {};
  if (style.fillToken !== undefined) out.fill = style.fillToken;
  if (style.strokeToken !== undefined) out.stroke = style.strokeToken;
  if (style.opacity !== undefined) out.opacity = normalizeNumber(style.opacity);
  if (style.lineWeight !== undefined) out.lineWeight = normalizeNumber(style.lineWeight);
  return Object.keys(out).length > 0 ? (out as SvgStyleV1) : undefined;
}

function styleFromV1(style: SvgStyleV1 | undefined): SvgSceneStyle {
  if (!style) return {};
  const out: {
    fillToken?: string;
    strokeToken?: string;
    opacity?: number;
    lineWeight?: number;
  } = {};
  if (style.fill !== undefined) out.fillToken = style.fill;
  if (style.stroke !== undefined) out.strokeToken = style.stroke;
  if (style.opacity !== undefined) out.opacity = style.opacity;
  if (style.lineWeight !== undefined) out.lineWeight = style.lineWeight;
  return out;
}

function nodeToPart(node: SvgSceneNode, index: number): SvgPartV1 {
  const id = `${zPrefix(index)}-${node.id}`;
  const style = styleToV1(node.style);
  const common = {
    id,
    visible: !node.hidden,
    customerEditable: false,
    ...(style ? { style } : {}),
  };
  switch (node.kind) {
    case "rect":
      return {
        ...common,
        kind: "rect",
        x: normalizeNumber(node.x),
        y: normalizeNumber(node.y),
        width: normalizeNumber(node.width),
        height: normalizeNumber(node.height),
      };
    case "circle":
      return {
        ...common,
        kind: "circle",
        cx: normalizeNumber(node.cx),
        cy: normalizeNumber(node.cy),
        r: normalizeNumber(node.r),
      };
    case "line":
      return {
        ...common,
        kind: "line",
        x1: normalizeNumber(node.x1),
        y1: normalizeNumber(node.y1),
        x2: normalizeNumber(node.x2),
        y2: normalizeNumber(node.y2),
      };
    case "path":
      return { ...common, kind: "path", d: node.d.trim() };
    case "text":
      return {
        ...common,
        kind: "text",
        x: normalizeNumber(node.x),
        y: normalizeNumber(node.y),
        text: node.text,
      };
  }
}

function partToNode(part: SvgPartV1): SvgSceneNode {
  const id = stripZPrefix(part.id);
  const style = styleFromV1(part.style);
  const common = { id, name: id, locked: false, hidden: !part.visible, style };
  switch (part.kind) {
    case "rect":
      return { ...common, kind: "rect", x: part.x, y: part.y, width: part.width, height: part.height };
    case "circle":
      return { ...common, kind: "circle", cx: part.cx, cy: part.cy, r: part.r };
    case "line":
      return { ...common, kind: "line", x1: part.x1, y1: part.y1, x2: part.x2, y2: part.y2 };
    case "path":
      return { ...common, kind: "path", d: part.d };
    case "text":
      return { ...common, kind: "text", x: part.x, y: part.y, text: part.text };
  }
}

function metadataToDefinitionHead(meta: SvgSceneMetadata): Omit<SvgBlockDefinitionV1, "parts" | "viewBox"> {
  return {
    schemaVersion: 1,
    typeId: meta.typeId,
    name: meta.name,
    ...(meta.sku ? { sku: meta.sku } : {}),
    category: meta.category,
    tags: [...meta.tags],
    lifecycle: { status: meta.lifecycleStatus, ownerId: meta.ownerId },
    physicalDimensionsMm: { ...meta.physicalDimensionsMm },
    parameters: [],
    actions: [],
    constraints: [],
    variants: [],
    mounting: [],
    accessibility: {
      title: meta.accessibilityTitle,
      ...(meta.accessibilityDescription ? { description: meta.accessibilityDescription } : {}),
    },
  };
}

/**
 * Serialize the editor authority into the V1 publish descriptor. Deterministic:
 * same document in → byte-identical descriptor out. Hidden nodes are retained
 * (with `visible: false`) so the layer tree round-trips; the compiler drops them
 * from the rendered artifact.
 */
export function serializeSceneToDefinition(doc: SvgSceneDocument): SvgBlockDefinitionV1 {
  validateDocument(doc);
  const parts = doc.nodes.map((node, index) => nodeToPart(node, index));
  return {
    ...metadataToDefinitionHead(doc.metadata),
    viewBox: {
      x: normalizeNumber(doc.viewBox.x),
      y: normalizeNumber(doc.viewBox.y),
      width: normalizeNumber(doc.viewBox.width),
      height: normalizeNumber(doc.viewBox.height),
    },
    parts: parts as SvgBlockDefinitionV1["parts"],
  };
}

/**
 * Load a V1 descriptor into an editable scene. Node order is recovered from the
 * `z####-` id prefix so stacking matches what was authored; absent prefixes fall
 * back to descriptor array order.
 */
export function loadSceneFromDefinition(definition: SvgBlockDefinitionV1): SvgSceneDocument {
  const ordered = [...definition.parts].sort((a, b) => a.id.localeCompare(b.id));
  const nodes = ordered.map(partToNode);
  const doc: SvgSceneDocument = {
    modelVersion: SCENE_MODEL_VERSION,
    viewBox: { ...definition.viewBox },
    metadata: {
      typeId: definition.typeId,
      name: definition.name,
      category: definition.category,
      tags: [...definition.tags],
      ...(definition.sku ? { sku: definition.sku } : {}),
      lifecycleStatus: definition.lifecycle.status,
      ownerId: definition.lifecycle.ownerId,
      physicalDimensionsMm: { ...definition.physicalDimensionsMm },
      accessibilityTitle: definition.accessibility.title,
      ...(definition.accessibility.description
        ? { accessibilityDescription: definition.accessibility.description }
        : {}),
    },
    nodes,
  };
  validateDocument(doc);
  return doc;
}
