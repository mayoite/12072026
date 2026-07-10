/**
 * Defensive themeTokens defaults for admin SVG editor / Puck adapters.
 *
 * Live seed descriptors always include:
 *   currentColor → "currentColor"
 *   --fill-primary → "var(--color-surface-raised)"
 *
 * Partial stubs (new block, corrupt load, Puck defaultProps) may omit the map.
 * Reading `.currentColor` / `['--fill-primary']` on undefined crashed the edit
 * page; callers must use `safeThemeTokens` instead of raw access.
 *
 * Semantic CSS vars only — no #hex (BlockDescriptorThemeTokensSchema / §02-CAT-07).
 */

import type { BlockDescriptor } from "@/features/planner/open3d/catalog/svg/svgTypes";

export type ThemeTokensMap = BlockDescriptor["themeTokens"];

/** Canonical minimal token map matching seed-block-descriptors + catalog fixtures. */
export const DEFAULT_THEME_TOKENS: ThemeTokensMap = Object.freeze({
  currentColor: "currentColor",
  "--fill-primary": "var(--color-surface-raised)",
}) as ThemeTokensMap;

/**
 * Return a plain themeTokens object safe for key access and Puck props.
 * - undefined/null/non-object → full defaults
 * - partial map → merge defaults under provided keys (provided wins)
 */
export function safeThemeTokens(
  tokens: ThemeTokensMap | Record<string, string | undefined> | null | undefined,
): ThemeTokensMap {
  if (tokens == null || typeof tokens !== "object" || Array.isArray(tokens)) {
    return { ...DEFAULT_THEME_TOKENS };
  }
  const out: Record<string, string> = { ...DEFAULT_THEME_TOKENS };
  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === "string" && value.length > 0) {
      out[key] = value;
    }
  }
  return out as ThemeTokensMap;
}
