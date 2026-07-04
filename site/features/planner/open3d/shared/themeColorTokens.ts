/**
 * Canonical planner theme token keys.
 * Resolved values live in theme.css only — never hardcode hex in TS modules.
 */

export const PLANNER_COLOR_TOKENS = {
  wallDefault: "--text-inverse-body",
  wallStroke: "--color-block-wall",
  dimensionLabel: "--text-muted",
  doorFill: "--color-accent",
  windowStroke: "--color-primary",
  furnitureDefault: "--color-block-desk",
  furnitureStroke: "--border-strong",
  titleText: "--text-heading",
  subtitleText: "--text-muted",
  exportBackground: "--surface-page",
  columnDefault: "--border-muted",
  textAnnotation: "--text-body",
  importWall: "--text-body",
} as const;

/** Distinct room-fill tokens for multi-room SVG/PNG export palettes. */
export const ROOM_FILL_TOKENS = [
  "--surface-accent-wash",
  "--surface-status-bad",
  "--surface-status-ok",
  "--surface-panel-soft",
  "--surface-soft",
  "--surface-muted",
  "--color-accent-soft",
] as const;

/** Fallback geometry swatches keyed by catalog category. */
export const FALLBACK_CATEGORY_TOKENS: Record<string, { fill: string; stroke: string }> = {
  Furniture: { fill: "--color-block-desk", stroke: "--text-strong" },
  Lighting: { fill: "--surface-accent-wash", stroke: "--color-primary" },
  Decor: { fill: "--surface-panel-soft", stroke: "--text-muted" },
  Outdoor: { fill: "--surface-status-ok", stroke: "--color-success" },
  "Bedding & Textiles": { fill: "--surface-soft", stroke: "--text-subtle" },
  "Storage & Organisation": { fill: "--surface-panel", stroke: "--border-muted" },
  "Kitchen & Dining": { fill: "--surface-status-bad", stroke: "--color-warning" },
  Symbols: { fill: "--surface-muted", stroke: "--text-strong" },
};

export const FALLBACK_DEFAULT_TOKENS = {
  fill: "--surface-status-bad",
  stroke: "--color-warning",
} as const;
