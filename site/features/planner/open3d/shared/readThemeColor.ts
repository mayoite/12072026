import {
  FALLBACK_CATEGORY_TOKENS,
  FALLBACK_DEFAULT_TOKENS,
  PLANNER_COLOR_TOKENS,
} from "./themeColorTokens";

export function normalizeTokenName(variableName: string): string {
  return variableName.startsWith("--") ? variableName : `--${variableName}`;
}

/**
 * Read a canonical theme color from document root CSS variables.
 * Used when a canvas/WebGL API needs a resolved color string.
 */
export function readThemeColor(variableName: string): string {
  const name = normalizeTokenName(variableName);
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!value) {
    throw new Error(`Missing theme token: ${name}`);
  }
  return value;
}

/** SSR-safe CSS var() reference for model persistence (no hex literals). */
export function themeColorRef(variableName: string): string {
  return `var(${normalizeTokenName(variableName)})`;
}

function extractPrimaryToken(value: string): string | null {
  const match = value.match(/var\(\s*(--[^,\s)]+)/);
  return match?.[1] ?? null;
}

/**
 * Resolve a stored paint color: explicit user hex/rgb passes through;
 * var(--token) and bare token keys resolve from theme.css at runtime.
 */
export function resolvePaintColor(color: string | undefined, fallbackToken: string): string {
  if (!color) {
    return readThemeColor(fallbackToken);
  }
  if (color.startsWith("--")) {
    return readThemeColor(color);
  }
  const token = extractPrimaryToken(color);
  if (token) {
    return readThemeColor(token);
  }
  return color;
}

export interface ExportPaintColors {
  wallStroke: string;
  dimensionLabel: string;
  doorFill: string;
  windowStroke: string;
  furnitureDefault: string;
  furnitureStroke: string;
  titleText: string;
  subtitleText: string;
  background: string;
}

/** Resolve all export/canvas paint colors from theme.css (browser only). */
export function readExportPaintColors(): ExportPaintColors {
  return {
    wallStroke: readThemeColor(PLANNER_COLOR_TOKENS.wallStroke),
    dimensionLabel: readThemeColor(PLANNER_COLOR_TOKENS.dimensionLabel),
    doorFill: readThemeColor(PLANNER_COLOR_TOKENS.doorFill),
    windowStroke: readThemeColor(PLANNER_COLOR_TOKENS.windowStroke),
    furnitureDefault: readThemeColor(PLANNER_COLOR_TOKENS.furnitureDefault),
    furnitureStroke: readThemeColor(PLANNER_COLOR_TOKENS.furnitureStroke),
    titleText: readThemeColor(PLANNER_COLOR_TOKENS.titleText),
    subtitleText: readThemeColor(PLANNER_COLOR_TOKENS.subtitleText),
    background: readThemeColor(PLANNER_COLOR_TOKENS.exportBackground),
  };
}

export interface FallbackPaintColors {
  fill: string;
  stroke: string;
}

/** Resolve fallback swatch colors for a catalog category (browser) or var refs (SSR). */
export function readFallbackPaintColors(category: string): FallbackPaintColors {
  const tokens = FALLBACK_CATEGORY_TOKENS[category] ?? FALLBACK_DEFAULT_TOKENS;
  if (typeof document === "undefined" || typeof getComputedStyle !== "function") {
    return {
      fill: themeColorRef(tokens.fill),
      stroke: themeColorRef(tokens.stroke),
    };
  }
  return {
    fill: readThemeColor(tokens.fill),
    stroke: readThemeColor(tokens.stroke),
  };
}

/**
 * Three theme adapter for semantic colors (task 3).
 * Returns CSS var ref or resolved string safe for THREE.Color.
 * Never hardcodes hex here; caller falls back to token.
 * GS cite: BP-07 three + r3f only (Phase 09 but applied); anti-copy only site/app/css/ semantic tokens per 00-benchmark-summary.md + benchmark five-product (Planner 5D 2D↔3D).
 */
export function readThreeThemeColor(token: string, fallback: string = "#ffffff"): string {
  if (typeof document === "undefined") {
    return `var(${normalizeTokenName(token)}, ${fallback})`;
  }
  try {
    return readThemeColor(token);
  } catch {
    return fallback;
  }
}
