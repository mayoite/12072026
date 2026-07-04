/**
 * Phase 03A SVG Types
 *
 * Typed SVG symbol contract with canonical mm dimensions, stable viewBox,
 * theme separation, and geometry type definitions for every inventory shape.
 */

import type { Open3dCatalogDimensions, Open3dCatalogCategory } from "../catalogTypes";

// ── SVG symbol geometry ──

/** Primitive shapes used to compose SVG symbols */
export type SvgShapeType =
  | "rect"
  | "circle"
  | "ellipse"
  | "line"
  | "path";

export interface SvgShapeCommand {
  shape: SvgShapeType;
  /** Attributes specific to this shape (x, y, width, height, r, cx, cy, d, etc.) */
  attrs: Record<string, string | number>;
}

/** A composed symbol built from multiple primitives */
export interface SvgSymbolDefinition {
  /** Contract version for deterministic cache/export compatibility */
  version: "03a-symbol-v1";
  /** Unique symbol ID (stable across versions) */
  symbolId: string;
  /** Catalog category this symbol represents */
  category: Open3dCatalogCategory;
  /** Display name for accessibility */
  name: string;
  /** Canonical dimensions in mm (for viewBox calculation) */
  dimensions: Open3dCatalogDimensions;
  /** Composed shape commands */
  shapes: SvgShapeCommand[];
  /** Optional label/text overlay */
  label?: string;
}

export interface SvgSymbolDimensionAgreement {
  viewBox: string;
  preview: { widthMm: number; depthMm: number };
  canvas: { widthMm: number; depthMm: number };
  export: { widthMm: number; depthMm: number };
  agrees: boolean;
}

// ── SVG theme contract ──

export interface SvgThemeColors {
  mode: "css-vars" | "literal";
  color: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  textFill: string;
  opacity: number;
}

export type SvgThemeName = "light" | "dark" | "print" | "selected" | "high-contrast" | "fallback";

/** Theme-aware color palette for all supported themes */
export const SVG_THEMES: Record<SvgThemeName, SvgThemeColors> = {
  light: {
    mode: "css-vars",
    color: "var(--svg-theme-light-color, var(--color-text, var(--text-strong)))",
    fill: "var(--svg-theme-light-fill, var(--color-surface-raised, var(--surface-panel)))",
    stroke: "currentColor",
    strokeWidth: 1.5,
    textFill: "currentColor",
    opacity: 1,
  },
  dark: {
    mode: "css-vars",
    color: "var(--svg-theme-dark-color, var(--text-inverse-body, var(--color-text, var(--text-strong))))",
    fill: "var(--svg-theme-dark-fill, var(--surface-canvas-panel, var(--surface-panel)))",
    stroke: "currentColor",
    strokeWidth: 1.5,
    textFill: "currentColor",
    opacity: 1,
  },
  print: {
    mode: "css-vars",
    color: "var(--svg-theme-print-color, currentColor)",
    fill: "var(--svg-theme-print-fill, var(--color-paper, var(--surface-page)))",
    stroke: "currentColor",
    strokeWidth: 1,
    textFill: "currentColor",
    opacity: 1,
  },
  selected: {
    mode: "css-vars",
    color: "var(--svg-theme-selected-color, var(--color-blueprint-strong, var(--color-primary-hover)))",
    fill: "var(--svg-theme-selected-fill, var(--color-blueprint-soft, var(--surface-accent-wash)))",
    stroke: "currentColor",
    strokeWidth: 2,
    textFill: "currentColor",
    opacity: 1,
  },
  "high-contrast": {
    mode: "css-vars",
    color: "var(--svg-theme-high-contrast-color, var(--surface-inverse, var(--color-text, var(--text-strong))))",
    fill: "var(--svg-theme-high-contrast-fill, var(--color-surface, var(--surface-page)))",
    stroke: "currentColor",
    strokeWidth: 2,
    textFill: "currentColor",
    opacity: 1,
  },
  fallback: {
    mode: "css-vars",
    color: "var(--svg-theme-fallback-color, var(--color-danger, var(--color-primary)))",
    fill: "var(--svg-theme-fallback-fill, var(--color-warning-soft, var(--surface-status-bad)))",
    stroke: "currentColor",
    strokeWidth: 2,
    textFill: "currentColor",
    opacity: 0.7,
  },
};

// ── SVG render output ──

export interface SvgRenderOutput {
  /** Complete SVG markup string */
  svg: string;
  /** Stable viewBox based on canonical dimensions */
  viewBox: string;
  /** Symbol width in mm */
  widthMm: number;
  /** Symbol height in mm */
  heightMm: number;
  /** Theme used for this render */
  theme: SvgThemeName;
  /** Deterministic generation marker for cache/debugging */
  generatedAt: number;
  /** Content hash for cache key (deterministic) */
  contentHash: string;
}

// ── Category-specific shape palettes ──

/** Shape colors by category for deterministic SVG rendering */
export const CATEGORY_SHAPE_COLORS: Record<string, { fill: string; stroke: string }> = {
  Furniture: {
    fill: "var(--svg-category-furniture-fill, var(--color-block-desk, var(--color-primary)))",
    stroke: "var(--svg-category-furniture-stroke, var(--color-text, var(--text-strong)))",
  },
  Lighting: {
    fill: "var(--svg-category-lighting-fill, var(--color-accent-soft, var(--surface-accent-wash)))",
    stroke: "var(--svg-category-lighting-stroke, var(--color-accent, var(--color-primary)))",
  },
  Decor: {
    fill: "var(--svg-category-decor-fill, var(--surface-panel-soft, var(--surface-soft)))",
    stroke: "var(--svg-category-decor-stroke, var(--color-text-muted, var(--text-muted)))",
  },
  Outdoor: {
    fill: "var(--svg-category-outdoor-fill, var(--color-success-soft, var(--surface-status-ok)))",
    stroke: "var(--svg-category-outdoor-stroke, var(--color-success, var(--color-primary)))",
  },
  "Bedding & Textiles": {
    fill: "var(--svg-category-bedding-fill, var(--surface-soft, var(--surface-panel-soft)))",
    stroke: "var(--svg-category-bedding-stroke, var(--color-text-subtle, var(--text-subtle)))",
  },
  "Storage & Organisation": {
    fill: "var(--svg-category-storage-fill, var(--color-surface-raised, var(--surface-panel)))",
    stroke: "var(--svg-category-storage-stroke, var(--color-border-strong, var(--border-muted)))",
  },
  "Kitchen & Dining": {
    fill: "var(--svg-category-kitchen-fill, var(--color-warning-soft, var(--surface-status-bad)))",
    stroke: "var(--svg-category-kitchen-stroke, var(--color-warning, var(--color-accent)))",
  },
  Symbols: {
    fill: "var(--svg-category-symbols-fill, var(--color-surface-sunken, var(--surface-muted)))",
    stroke: "var(--svg-category-symbols-stroke, var(--color-text, var(--text-strong)))",
  },
};
