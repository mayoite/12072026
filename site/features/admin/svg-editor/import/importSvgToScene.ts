/**
 * Custom furniture SVG import — turn an uploaded/pasted `.svg` into editable
 * scene geometry the existing publish pipeline already understands.
 *
 * Why this exists: the catalog is bespoke furniture, not a fixed set of
 * parametric types. There is no code drawer per shape. An operator brings in a
 * real vector outline (from Illustrator, CAD, a vendor pack) and it becomes a
 * publishable catalog symbol — no engineer, no template.
 *
 * Authority path (all pre-existing, unchanged):
 *   import → sanitize (`sanitizeSvg`) → SvgSceneNode[] → SvgSceneDocument
 *     → serializeSceneToDefinition → compileSvgForPublish (re-sanitizes S1–S3)
 *
 * Every geometry element is mapped to a scene node. rect/circle/line keep their
 * native kinds; ellipse/polygon/polyline/path flatten to a `path` `d` (all now
 * in the supported authoring subset). The parser is pure and DOM-free so it runs
 * identically in the browser preview and in unit tests.
 *
 * This is a *client-safe validity gate*, not the security boundary: the server
 * re-sanitizes on publish (`svgServerSanitizer` / `compileSvgForPublish`). We
 * still run `sanitizeSvg` here so the operator sees unsafe input rejected before
 * they invest in naming and dimensions.
 */

import { sanitizeSvg } from "@/features/planner/catalog/svg/svgSanitizer";
import type {
  SvgSceneDocument,
  SvgSceneNode,
  SvgSceneViewBox,
} from "@/features/admin/svg-editor/scene/svgSceneDocument";
import { SCENE_MODEL_VERSION } from "@/features/admin/svg-editor/scene/svgSceneDocument";

export interface ImportSvgOptions {
  /** Slug/typeId for the imported symbol. Must match the descriptor id shape. */
  readonly slug: string;
  /** Optional SKU carried onto the descriptor metadata. */
  readonly sku?: string;
  /** Display name; defaults to a humanized slug. */
  readonly name?: string;
  /**
   * Real-world footprint in mm. Custom furniture is authored to size, so callers
   * usually supply this. Falls back to the viewBox extent (1 unit = 1 mm) so an
   * import is never dimensionless.
   */
  readonly physicalDimensionsMm?: {
    readonly width: number;
    readonly depth: number;
    readonly height: number;
  };
}

export type ImportSvgResult =
  | { readonly ok: true; readonly document: SvgSceneDocument; readonly nodeCount: number }
  | { readonly ok: false; readonly error: string; readonly issues?: readonly string[] };

/** Geometry element tags we lift out of an imported SVG. */
const GEOMETRY_TAGS = [
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polygon",
  "polyline",
] as const;

const SLUG_SHAPE = /^[a-z][a-z0-9-]{1,63}$/;

function humanizeSlug(slug: string): string {
  const words = slug.split("-").filter(Boolean);
  if (words.length === 0) return "Imported symbol";
  return words
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

/** Read one attribute from a raw element tag string. Quotes required in SVG. */
function attr(tag: string, name: string): string | undefined {
  const match = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i").exec(tag);
  if (!match) return undefined;
  return match[1] ?? match[2];
}

function num(tag: string, name: string, fallback = 0): number {
  const raw = attr(tag, name);
  if (raw === undefined) return fallback;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** Parse a `viewBox="minX minY width height"` string. */
function parseViewBox(svg: string): SvgSceneViewBox | undefined {
  const svgOpen = /<svg\b[^>]*>/i.exec(svg)?.[0];
  if (!svgOpen) return undefined;
  const raw = attr(svgOpen, "viewBox");
  if (raw) {
    const parts = raw.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n)) && parts[2] > 0 && parts[3] > 0) {
      return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
    }
  }
  // Fall back to width/height on the root when there is no viewBox.
  const width = num(svgOpen, "width", 0);
  const height = num(svgOpen, "height", 0);
  if (width > 0 && height > 0) return { x: 0, y: 0, width, height };
  return undefined;
}

/** Convert a `points="x,y x,y"` list into a path `d`. `close` adds a trailing Z. */
function pointsToPathD(points: string, close: boolean): string | undefined {
  const coords = points.trim().split(/[\s,]+/).map(Number).filter((n) => Number.isFinite(n));
  if (coords.length < 4 || coords.length % 2 !== 0) return undefined;
  const segments: string[] = [];
  for (let i = 0; i < coords.length; i += 2) {
    segments.push(`${i === 0 ? "M" : "L"}${coords[i]} ${coords[i + 1]}`);
  }
  return `${segments.join(" ")}${close ? " Z" : ""}`;
}

/** Ellipse → path via two arc halves (cx±rx). */
function ellipseToPathD(cx: number, cy: number, rx: number, ry: number): string {
  return (
    `M${cx - rx} ${cy} ` +
    `a${rx} ${ry} 0 1 0 ${rx * 2} 0 ` +
    `a${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`
  );
}

const IMPORT_STYLE = {
  fillToken: "var(--color-surface-raised)",
  strokeToken: "currentColor",
  lineWeight: 2,
} as const;

/**
 * Map one geometry tag to a scene node. rect/circle/line keep native kinds;
 * everything else flattens to a `path`. Returns undefined for degenerate shapes.
 */
function tagToNode(tagName: string, tag: string, id: string, index: number): SvgSceneNode | undefined {
  const common = {
    id,
    name: `${humanizeSlug(tagName)} ${index + 1}`,
    locked: false,
    hidden: false,
    style: { ...IMPORT_STYLE },
  };
  switch (tagName) {
    case "rect": {
      const width = num(tag, "width");
      const height = num(tag, "height");
      if (width <= 0 || height <= 0) return undefined;
      return { ...common, kind: "rect", x: num(tag, "x"), y: num(tag, "y"), width, height };
    }
    case "circle": {
      const r = num(tag, "r");
      if (r <= 0) return undefined;
      return { ...common, kind: "circle", cx: num(tag, "cx"), cy: num(tag, "cy"), r };
    }
    case "line":
      return {
        ...common,
        kind: "line",
        x1: num(tag, "x1"),
        y1: num(tag, "y1"),
        x2: num(tag, "x2"),
        y2: num(tag, "y2"),
      };
    case "ellipse": {
      const rx = num(tag, "rx");
      const ry = num(tag, "ry");
      if (rx <= 0 || ry <= 0) return undefined;
      return { ...common, kind: "path", d: ellipseToPathD(num(tag, "cx"), num(tag, "cy"), rx, ry) };
    }
    case "polygon":
    case "polyline": {
      const points = attr(tag, "points");
      if (!points) return undefined;
      const d = pointsToPathD(points, tagName === "polygon");
      if (!d) return undefined;
      return { ...common, kind: "path", d };
    }
    case "path": {
      const d = attr(tag, "d")?.trim();
      if (!d) return undefined;
      return { ...common, kind: "path", d };
    }
    default:
      return undefined;
  }
}

/** Extract geometry nodes in document order (paint order preserved). */
function extractNodes(svg: string): SvgSceneNode[] {
  const nodes: SvgSceneNode[] = [];
  // One pass over every self-closing or open tag of a geometry element, in order.
  const tagPattern = new RegExp(`<(${GEOMETRY_TAGS.join("|")})\\b[^>]*?/?>`, "gi");
  let counter = 0;
  for (const match of svg.matchAll(tagPattern)) {
    const tagName = match[1].toLowerCase();
    const node = tagToNode(tagName, match[0], `import-${counter + 1}`, counter);
    if (node) {
      nodes.push(node);
      counter += 1;
    }
  }
  return nodes;
}

/**
 * Parse an imported SVG string into an editable scene document.
 * Fail-closed: unsafe markup, no root, or no usable geometry → `ok: false`.
 */
export function importSvgToScene(svg: string, options: ImportSvgOptions): ImportSvgResult {
  if (!SLUG_SHAPE.test(options.slug)) {
    return {
      ok: false,
      error: `Invalid slug "${options.slug}" — use lowercase letters, digits, and hyphens (2–64 chars).`,
    };
  }

  const sanitized = sanitizeSvg(svg);
  if (!sanitized.safe) {
    return { ok: false, error: "SVG rejected by sanitizer", issues: sanitized.issues };
  }

  const viewBox = parseViewBox(sanitized.sanitized);
  if (!viewBox) {
    return {
      ok: false,
      error: "Could not read a viewBox or width/height from the SVG root.",
    };
  }

  const nodes = extractNodes(sanitized.sanitized);
  if (nodes.length === 0) {
    return {
      ok: false,
      error: "No supported geometry found (path, rect, circle, ellipse, line, polygon, polyline).",
    };
  }

  const dims =
    options.physicalDimensionsMm ??
    { width: viewBox.width, depth: viewBox.height, height: viewBox.height };

  const document: SvgSceneDocument = {
    modelVersion: SCENE_MODEL_VERSION,
    viewBox,
    metadata: {
      typeId: options.slug,
      name: options.name?.trim() || humanizeSlug(options.slug),
      category: "furniture",
      tags: ["imported"],
      ...(options.sku ? { sku: options.sku } : {}),
      lifecycleStatus: "draft",
      ownerId: "admin",
      physicalDimensionsMm: dims,
      accessibilityTitle: `${options.name?.trim() || humanizeSlug(options.slug)} symbol`,
    },
    nodes,
  };

  return { ok: true, document, nodeCount: nodes.length };
}
