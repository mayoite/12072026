/**
 * Phase 03A SVG Fallback
 *
 * Visible fallback SVG geometry when a specialized symbol cannot be generated.
 * Uses diagonal cross-hatch pattern for visibility and accessible label.
 */

import type { SvgRenderOutput, SvgThemeName } from "./svgTypes";
import { SVG_THEMES } from "./svgTypes";
import type { PlannerCatalogDimensions } from "../catalogTypes";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatMmAsExactCm(value: number): string {
  return String(Math.round((value / 10) * 1000) / 1000);
}

/**
 * Generate a visible fallback SVG for missing/broken symbols.
 * Cross-hatched rectangle with accessible label and red border.
 */
export function generateFallbackSvg(
  dimensions: PlannerCatalogDimensions,
  name: string,
  reason: string,
  theme: SvgThemeName = "light",
): SvgRenderOutput {
  const colors = SVG_THEMES.fallback;
  const w = dimensions.widthMm;
  const d = dimensions.depthMm;
  const viewBox = `0 0 ${w} ${d}`;
  const escapedName = escapeXml(name);
  const escapedReason = escapeXml(reason);

  const svg = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${formatMmAsExactCm(w)}cm" height="${formatMmAsExactCm(d)}cm" role="img" aria-label="Missing symbol: ${escapedName} (${escapedReason})">`,
    `  <title>Missing: ${escapedName}</title>`,
    `  <desc>${escapedReason}</desc>`,
    `  <rect x="2" y="2" width="${w - 4}" height="${d - 4}" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="${colors.strokeWidth}px" opacity="${colors.opacity}" />`,
    `  <line x1="4" y1="4" x2="${w - 4}" y2="${d - 4}" stroke="${colors.stroke}" stroke-width="1px" opacity="0.8" />`,
    `  <line x1="${w - 4}" y1="4" x2="4" y2="${d - 4}" stroke="${colors.stroke}" stroke-width="1px" opacity="0.8" />`,
    `  <text x="${w / 2}" y="${d / 2}" dominant-baseline="middle" text-anchor="middle" font-size="${Math.min(w, d) * 0.1}px" fill="${colors.textFill}" opacity="0.9">?</text>`,
    `</svg>`,
  ].join("\n");

  return {
    svg,
    viewBox,
    widthMm: w,
    heightMm: d,
    theme: "fallback",
    generatedAt: 0,
    contentHash: `fallback-${w}-${d}-${theme}`,
  };
}
