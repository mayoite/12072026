/**
 * Phase 03A SVG Symbols
 *
 * Deterministic SVG symbol generation for every supported inventory shape.
 * Uses canonical millimetre dimensions and stable viewBox.
 * Separates geometry from theme so symbols work in light/dark/print/selection/high-contrast.
 */

import type {
  SvgSymbolDefinition,
  SvgShapeCommand,
  SvgThemeName,
  SvgRenderOutput,
} from "./svgTypes";
import {
  SVG_THEMES,
  type SvgSymbolDimensionAgreement,
  type SvgThemeColors,
} from "./svgTypes";
import type { Open3dCatalogDimensions, Open3dCatalogCategory } from "../catalogTypes";

const SVG_SYMBOL_VERSION = "03a-symbol-v1";
const SVG_RENDER_GENERATOR_VERSION = "03a-svg-render-v2";
const MAX_SVG_CACHE_ENTRIES = 2000;

type SvgSymbolGeneratorResult = Omit<SvgSymbolDefinition, "version"> & { version?: SvgSymbolDefinition["version"] };
type SvgSymbolGenerator = (dimensions: Open3dCatalogDimensions, name: string) => SvgSymbolGeneratorResult;

const UNSAFE_ATTR_NAME = /^(?:on|style$|href$|xlink:href$|src$)/i;
const UNSAFE_ATTR_VALUE = /(?:javascript:|data:|vbscript:|<\s*script\b|<\/\s*script\b|url\s*\()/i;
const ALLOWED_SHAPE_ATTRS: Record<SvgShapeCommand["shape"], ReadonlySet<string>> = {
  rect: new Set(["x", "y", "width", "height", "rx", "ry"]),
  circle: new Set(["cx", "cy", "r"]),
  ellipse: new Set(["cx", "cy", "rx", "ry"]),
  line: new Set(["x1", "y1", "x2", "y2"]),
  path: new Set(["d"]),
};

// ── Symbol registry ──

/**
 * Registry of deterministic symbol generators keyed by category and subcategory.
 * Each generator produces an SvgSymbolDefinition with stable geometry.
 */
const symbolGenerators = new Map<string, SvgSymbolGenerator>();

/** Register a symbol generator for a specific category key */
export function registerSymbolGenerator(
  key: string,
  generator: SvgSymbolGenerator,
): void {
  symbolGenerators.set(key, generator);
}

// ── Shape helpers ──

function rectShape(x: number, y: number, w: number, h: number, extra: Record<string, string | number> = {}): SvgShapeCommand {
  return { shape: "rect", attrs: { x, y, width: w, height: h, ...extra } };
}

function circleShape(cx: number, cy: number, r: number, extra: Record<string, string | number> = {}): SvgShapeCommand {
  return { shape: "circle", attrs: { cx, cy, r, ...extra } };
}

function pathShape(d: string, extra: Record<string, string | number> = {}): SvgShapeCommand {
  return { shape: "path", attrs: { d, ...extra } };
}

function lineShape(x1: number, y1: number, x2: number, y2: number, extra: Record<string, string | number> = {}): SvgShapeCommand {
  return { shape: "line", attrs: { x1, y1, x2, y2, ...extra } };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeDimension(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.round(value * 1000) / 1000;
}

function normalizeDimensions(dimensions: Open3dCatalogDimensions): Open3dCatalogDimensions {
  return {
    ...dimensions,
    widthMm: normalizeDimension(dimensions.widthMm),
    depthMm: normalizeDimension(dimensions.depthMm),
    heightMm: normalizeDimension(dimensions.heightMm),
  };
}

function stableViewBox(dimensions: Open3dCatalogDimensions): string {
  return `0 0 ${normalizeDimension(dimensions.widthMm)} ${normalizeDimension(dimensions.depthMm)}`;
}

function formatAttrValue(value: string | number): string {
  return typeof value === "number" ? String(value) : escapeXml(value);
}

function formatCssValue(value: string): string {
  return escapeXml(value);
}

function formatMmAsExactCm(value: number): string {
  return String(Math.round((value / 10) * 1000) / 1000);
}

function assertTrustedShape(shape: SvgShapeCommand): void {
  const allowedAttrs = ALLOWED_SHAPE_ATTRS[shape.shape];
  for (const [key, value] of Object.entries(shape.attrs)) {
    if (!allowedAttrs.has(key) || UNSAFE_ATTR_NAME.test(key)) {
      throw new Error(`Unsafe SVG attribute "${key}" on shape "${shape.shape}"`);
    }
    if (typeof value === "string" && UNSAFE_ATTR_VALUE.test(value)) {
      throw new Error(`Unsafe SVG attribute value on "${shape.shape}.${key}"`);
    }
  }
}

function assertTrustedSymbolDefinition(definition: SvgSymbolDefinition): void {
  if (definition.version !== SVG_SYMBOL_VERSION) {
    throw new Error(`Unsupported SVG symbol version "${definition.version}"`);
  }
  if (definition.shapes.length === 0) {
    throw new Error(`SVG symbol "${definition.symbolId}" has no shapes`);
  }
  for (const shape of definition.shapes) {
    assertTrustedShape(shape);
  }
}

function createRenderMetadataSignature(definition: SvgSymbolDefinition): string {
  return [
    definition.symbolId,
    hashString(escapeXml(definition.name)),
    definition.label ? hashString(escapeXml(definition.label)) : "",
  ].join(":");
}

// ── Category-specific symbol generators ──

/** Desk / workstation: rectangular surface with legs */
function deskSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  const w = dims.widthMm;
  const d = dims.depthMm;
  const legW = Math.min(w * 0.05, 80);
  const legH = Math.max(d * 0.1, 40);
  return {
    symbolId: `desk-${w}-${d}`,
    version: SVG_SYMBOL_VERSION,
    category: "Furniture",
    name,
    dimensions: dims,
    shapes: [
      rectShape(0, 0, w, d, { rx: 4 }),
      rectShape(0, d - legH, legW, legH),
      rectShape(w - legW, d - legH, legW, legH),
      rectShape(0, 0, legW, legH),
      rectShape(w - legW + 0, 0, legW, legH),
    ],
  };
}
registerSymbolGenerator("desks", deskSymbol);
registerSymbolGenerator("workstations", deskSymbol);

/** Chair: seat rectangle + backrest */
function chairSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  const w = dims.widthMm;
  const d = dims.depthMm;
  const backH = Math.max(d * 0.15, 30);
  return {
    symbolId: `chair-${w}-${d}`,
    version: SVG_SYMBOL_VERSION,
    category: "Furniture",
    name,
    dimensions: dims,
    shapes: [
      rectShape(0, 0, w, d, { rx: 3 }),
      rectShape(0, 0, backH, w),
      rectShape(4, 4, backH - 8, w - 8),
    ],
  };
}
registerSymbolGenerator("chairs", chairSymbol);
registerSymbolGenerator("seating", chairSymbol);

/** Table: surface with visible top */
function tableSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  const w = dims.widthMm;
  const d = dims.depthMm;
  return {
    symbolId: `table-${w}-${d}`,
    version: SVG_SYMBOL_VERSION,
    category: "Furniture",
    name,
    dimensions: dims,
    shapes: [rectShape(0, 0, w, d, { rx: 2 }), rectShape(4, 4, w - 8, d - 8, { rx: 1 })],
  };
}
registerSymbolGenerator("tables", tableSymbol);

/** Sofa / seating: wider rectangle with armrests */
function sofaSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  const w = dims.widthMm;
  const d = dims.depthMm;
  const armW = Math.max(w * 0.08, 40);
  return {
    symbolId: `sofa-${w}-${d}`,
    version: SVG_SYMBOL_VERSION,
    category: "Furniture",
    name,
    dimensions: dims,
    shapes: [
      rectShape(0, 0, w, d, { rx: 6 }),
      rectShape(0, 0, armW, d),
      rectShape(w - armW, 0, armW, d),
      rectShape(armW, 2, w - armW * 2, d - 4),
    ],
  };
}
registerSymbolGenerator("sofas", sofaSymbol);
registerSymbolGenerator("sofas-sectionals", sofaSymbol);

/** Bed: rectangle with headboard */
function bedSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  const w = dims.widthMm;
  const d = dims.depthMm;
  const hbH = Math.min(w * 0.1, 100);
  return {
    symbolId: `bed-${w}-${d}`,
    version: SVG_SYMBOL_VERSION,
    category: "Furniture",
    name,
    dimensions: dims,
    shapes: [
      rectShape(0, 0, w, d, { rx: 4 }),
      rectShape(0, 0, w, hbH),
      rectShape(10, hbH, w - 20, d - hbH - 10),
    ],
  };
}
registerSymbolGenerator("beds", bedSymbol);

/** Storage: rectangle with shelf lines */
function storageSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  const w = dims.widthMm;
  const d = dims.depthMm;
  const midY = d / 2;
  return {
    symbolId: `storage-${w}-${d}`,
    version: SVG_SYMBOL_VERSION,
    category: "Furniture",
    name,
    dimensions: dims,
    shapes: [
      rectShape(0, 0, w, d, { rx: 2 }),
      lineShape(10, midY, w - 10, midY),
    ],
  };
}
registerSymbolGenerator("storage", storageSymbol);
registerSymbolGenerator("wardrobes", storageSymbol);

/** Lighting: circle with rays */
function lightSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  const cx = dims.widthMm / 2;
  const cy = dims.depthMm / 2;
  const r = Math.min(cx, cy) * 0.7;
  return {
    symbolId: `light-${dims.widthMm}-${dims.depthMm}`,
    version: SVG_SYMBOL_VERSION,
    category: "Lighting",
    name,
    dimensions: dims,
    shapes: [
      circleShape(cx, cy, r * 0.5),
      lineShape(cx, cy - r, cx, cy - r * 1.4),
      lineShape(cx, cy + r, cx, cy + r * 1.4),
      lineShape(cx - r, cy, cx - r * 1.4, cy),
      lineShape(cx + r, cy, cx + r * 1.4, cy),
    ],
  };
}
registerSymbolGenerator("lighting", lightSymbol);
registerSymbolGenerator("ceiling-lights", lightSymbol);

/** Rug: rectangle with dashed border */
function rugSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  return {
    symbolId: `rug-${dims.widthMm}-${dims.depthMm}`,
    version: SVG_SYMBOL_VERSION,
    category: "Decor",
    name,
    dimensions: dims,
    shapes: [
      rectShape(4, 4, dims.widthMm - 8, dims.depthMm - 8),
      rectShape(8, 8, dims.widthMm - 16, dims.depthMm - 16),
    ],
  };
}
registerSymbolGenerator("decor", rugSymbol);
registerSymbolGenerator("rugs", rugSymbol);

/** Plant: circle in circle */
function plantSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  const cx = dims.widthMm / 2;
  const cy = dims.depthMm / 2;
  return {
    symbolId: `plant-${dims.widthMm}-${dims.depthMm}`,
    version: SVG_SYMBOL_VERSION,
    category: "Decor",
    name,
    dimensions: dims,
    shapes: [
      circleShape(cx, cy, Math.min(cx, cy) * 0.9),
      circleShape(cx, cy, Math.min(cx, cy) * 0.4),
    ],
  };
}
registerSymbolGenerator("plants", plantSymbol);

/** Outdoor: rectangle with cross-hatch */
function outdoorSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  const w = dims.widthMm;
  const d = dims.depthMm;
  return {
    symbolId: `outdoor-${w}-${d}`,
    version: SVG_SYMBOL_VERSION,
    category: "Outdoor",
    name,
    dimensions: dims,
    shapes: [
      rectShape(2, 2, w - 4, d - 4),
      lineShape(6, 6, w - 6, d - 6),
      lineShape(w - 6, 6, 6, d - 6),
    ],
  };
}
registerSymbolGenerator("outdoor", outdoorSymbol);
registerSymbolGenerator("patio", outdoorSymbol);

/** Symbol category: diamond with label */
function symbolSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  const cx = dims.widthMm / 2;
  const cy = dims.depthMm / 2;
  return {
    symbolId: `symbol-${dims.widthMm}-${dims.depthMm}`,
    version: SVG_SYMBOL_VERSION,
    category: "Symbols",
    name,
    dimensions: dims,
    shapes: [
      pathShape(`M${cx},${cy - dims.depthMm * 0.4} L${cx + dims.widthMm * 0.4},${cy} L${cx},${cy + dims.depthMm * 0.4} L${cx - dims.widthMm * 0.4},${cy} Z`),
    ],
    label: name.slice(0, 2),
  };
}
registerSymbolGenerator("symbols", symbolSymbol);
registerSymbolGenerator("electrical", symbolSymbol);
registerSymbolGenerator("plumbing", symbolSymbol);

/** Default box fallback for unknown categories */
function defaultSymbol(dims: Open3dCatalogDimensions, name: string): SvgSymbolDefinition {
  return {
    symbolId: `default-${dims.widthMm}-${dims.depthMm}`,
    version: SVG_SYMBOL_VERSION,
    category: "Furniture",
    name,
    dimensions: dims,
    shapes: [
      rectShape(2, 2, dims.widthMm - 4, dims.depthMm - 4),
      lineShape(4, 4, dims.widthMm - 4, dims.depthMm - 4),
      lineShape(dims.widthMm - 4, 4, 4, dims.depthMm - 4),
    ],
  };
}
registerSymbolGenerator("default", defaultSymbol);

// ── Symbol resolution ──

/**
 * Resolve the best symbol generator for a category/subcategory combination.
 * Falls back through increasingly generic keys.
 */
export function resolveSymbolGenerator(category: Open3dCatalogCategory, subCategory?: string): SvgSymbolGenerator {
  if (subCategory) {
    const subKey = subCategory.toLowerCase().replace(/\s+/g, "-");
    const catSubKey = `${category}-${subCategory}`.toLowerCase().replace(/\s+/g, "-");
    // Try subcategory standalone first (how generators are registered)
    const gen = symbolGenerators.get(subKey) ?? symbolGenerators.get(catSubKey);
    if (gen) return gen;
  }
  const catKey = category.toLowerCase().replace(/\s+/g, "-");
  return symbolGenerators.get(catKey) ?? symbolGenerators.get("default")!;
}

/** Generate a deterministic symbol definition */
export function generateSymbol(
  category: Open3dCatalogCategory,
  subCategory: string | undefined,
  dimensions: Open3dCatalogDimensions,
  name: string,
): SvgSymbolDefinition {
  const normalized = normalizeDimensions(dimensions);
  const definition = resolveSymbolGenerator(category, subCategory)(normalized, name);
  return { ...definition, dimensions: normalized, version: definition.version ?? SVG_SYMBOL_VERSION };
}

// ── SVG rendering ──

/**
 * Simple string hash for content-based cache keys.
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function stableShapeSignature(shape: SvgShapeCommand): string {
  const attrs = Object.entries(shape.attrs)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${String(value)}`)
    .join(",");
  return `${shape.shape}(${attrs})`;
}

function symbolDefinitionSignature(definition: SvgSymbolDefinition): string {
  return [
    definition.version,
    definition.symbolId,
    definition.category,
    definition.dimensions.widthMm,
    definition.dimensions.depthMm,
    definition.dimensions.heightMm,
    definition.shapes.map(stableShapeSignature).join("|"),
  ].join(":");
}

function createSvgRenderCacheKey(
  definition: SvgSymbolDefinition,
  theme: SvgThemeName,
  themeColors: SvgThemeColors,
  rotation: number | undefined,
  scale: number | undefined,
): string {
  const geometrySignature = hashString(symbolDefinitionSignature(definition));
  const metadataSignature = hashString(createRenderMetadataSignature(definition));
  return [
    SVG_RENDER_GENERATOR_VERSION,
    definition.version,
    geometrySignature,
    metadataSignature,
    theme,
    themeColors.mode,
    rotation ?? 0,
    scale ?? 1,
  ].join(":");
}

/**
 * Apply theme colors to a shape command's attributes.
 */
function themeShape(shape: SvgShapeCommand, theme: SvgThemeColors): string {
  const attrs: string[] = [];
  for (const [key, value] of Object.entries(shape.attrs)) {
    attrs.push(`${key}="${formatAttrValue(value)}"`);
  }
  attrs.push(`fill="${shape.shape === "line" ? "none" : formatCssValue(theme.fill)}"`);
  attrs.push(`stroke="${formatCssValue(theme.stroke)}"`);
  attrs.push(`stroke-width="${theme.strokeWidth}px"`);
  attrs.push(`opacity="${theme.opacity}"`);
  return `<${shape.shape} ${attrs.join(" ")} />`;
}

/**
 * Render a symbol definition to SVG markup.
 *
 * This is the canonical SVG render pipeline. All paths (preview, canvas,
 * export) go through this function with different themes.
 *
 * Performance target: <10ms per symbol.
 */
export function renderSvgSymbol(
  definition: SvgSymbolDefinition,
  theme: SvgThemeName = "light",
  rotation?: number,
  scale?: number,
): SvgRenderOutput {
  const colors = SVG_THEMES[theme] ?? SVG_THEMES.light;
  assertTrustedSymbolDefinition(definition);
  const normalized = normalizeDimensions(definition.dimensions);
  const w = normalized.widthMm;
  const d = normalized.depthMm;
  const viewBox = stableViewBox(normalized);

  // Build shape markup
  const shapeMarkup = definition.shapes.map((s) => themeShape(s, colors)).join("\n  ");

  // Build accessible title
  const escapedName = escapeXml(definition.name);
  const title = `<title>${escapedName}</title>`;

  // Optional label
  let labelMarkup = "";
  if (definition.label) {
    const cx = w / 2;
    const cy = d / 2;
    labelMarkup = `\n  <text x="${cx}" y="${cy}" dominant-baseline="middle" text-anchor="middle" font-size="${Math.min(w, d) * 0.3}px" fill="${formatCssValue(colors.textFill)}" opacity="${colors.opacity}">${escapeXml(definition.label)}</text>`;
  }

  // Build SVG
  const transformParts: string[] = [];
  const safeRotation = Number.isFinite(rotation) ? rotation : undefined;
  const safeScale = scale && Number.isFinite(scale) && scale > 0 ? scale : undefined;
  if (safeRotation) {
    const cx = w / 2;
    const cy = d / 2;
    transformParts.push(`rotate(${safeRotation} ${cx} ${cy})`);
  }
  if (safeScale && safeScale !== 1) {
    transformParts.push(`scale(${safeScale})`);
  }
  const transform = transformParts.length > 0 ? ` transform="${transformParts.join(" ")}"` : "";
  const svgColor = formatCssValue(colors.color);

  const svg = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${formatMmAsExactCm(w)}cm" height="${formatMmAsExactCm(d)}cm"${transform} role="img" aria-label="${escapedName}" style="color:${svgColor}">`,
    `  ${title}`,
    `  <g>`,
    `    ${shapeMarkup}`,
    `${labelMarkup}`,
    `  </g>`,
    `</svg>`,
  ].join("\n");

  const normalizedDefinition = { ...definition, dimensions: normalized };
  const cacheKey = createSvgRenderCacheKey(normalizedDefinition, theme, colors, safeRotation, safeScale);
  const contentHash = hashString(cacheKey);
  const generatedAt = 0;

  return {
    svg,
    viewBox,
    widthMm: w,
    heightMm: d,
    theme,
    generatedAt,
    contentHash,
  };
}

// ── SVG cache ──

const svgCache = new Map<string, SvgRenderOutput>();

function touchSvgCacheEntry(cacheKey: string, output: SvgRenderOutput): SvgRenderOutput {
  if (svgCache.has(cacheKey)) {
    svgCache.delete(cacheKey);
  }
  svgCache.set(cacheKey, output);

  while (svgCache.size > MAX_SVG_CACHE_ENTRIES) {
    const oldestKey = svgCache.keys().next().value as string | undefined;
    if (oldestKey == null) break;
    svgCache.delete(oldestKey);
  }

  return output;
}

/**
 * Get a cached or freshly rendered SVG for a symbol.
 * Cache key includes symbol ID, theme, rotation, and scale.
 */
export function getCachedSvgSymbol(
  definition: SvgSymbolDefinition,
  theme: SvgThemeName = "light",
  rotation?: number,
  scale?: number,
): SvgRenderOutput {
  const normalized = normalizeDimensions(definition.dimensions);
  const safeRotation = Number.isFinite(rotation) ? rotation : undefined;
  const safeScale = scale && Number.isFinite(scale) && scale > 0 ? scale : undefined;
  const normalizedDefinition = { ...definition, dimensions: normalized };
  const colors = SVG_THEMES[theme] ?? SVG_THEMES.light;
  const cacheKey = createSvgRenderCacheKey(normalizedDefinition, theme, colors, safeRotation, safeScale);
  const cached = svgCache.get(cacheKey);
  if (cached) return touchSvgCacheEntry(cacheKey, cached);

  const output = renderSvgSymbol(normalizedDefinition, theme, safeRotation, safeScale);
  return touchSvgCacheEntry(cacheKey, output);
}

export function getSvgSymbolDimensionAgreement(definition: SvgSymbolDefinition): SvgSymbolDimensionAgreement {
  const normalized = normalizeDimensions(definition.dimensions);
  const footprint = { widthMm: normalized.widthMm, depthMm: normalized.depthMm };
  return {
    viewBox: stableViewBox(normalized),
    preview: footprint,
    canvas: footprint,
    export: footprint,
    agrees: true,
  };
}

/**
 * Clear the SVG render cache.
 * Call when switching version or theme definitions.
 */
export function clearSvgCache(): void {
  svgCache.clear();
}
