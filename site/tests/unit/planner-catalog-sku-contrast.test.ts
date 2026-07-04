/**
 * Regression: `.pw-catalog-card-sku` must keep a WCAG AA contrast on white.
 *
 * History (Failures.md, 2026-06-25 post-merge `release:gate`):
 *   - axe-core flagged the SKU label at var(--text-subtle) on var(--color-white-50) (ratio 4.34, needs 4.5)
 *   - root cause: `color: var(--text-muted)` resolved to a value blended from
 *     `:root` and `html.dark` under planner `color-scheme: light dark` in
 *     headless Chromium during the brief window before WorkspaceThemeProvider's
 *     useEffect strips the `dark` class
 *   - fix: pin a hardcoded light-mode hex on both `.pw-catalog-card-sku` rules
 *     so the color is immune to `--text-muted` resolution
 *
 * This test locks the fix without needing a browser. If a future refactor
 * reintroduces `var(--text-muted)` (or any token that could blend to a
 * sub-4.5:1 color) on this selector, this test fails first.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const REPO_SITE_ROOT = path.resolve(__dirname, "..", "..");

const CSS_FILES = [
  "app/css/core/planner/planner-typography.css",
  "app/css/core/planner/planner-catalog.css",
] as const;

/** Parse the body of every `<selector>{...}` block that targets `.pw-catalog-card-sku`. */
function extractSkuRuleBodies(css: string): string[] {
  const bodies: string[] = [];
  // Match any selector list that contains `.pw-catalog-card-sku` followed by `{...}`.
  const ruleRegex = /([^{}]*\.pw-catalog-card-sku[^{}]*)\{([^}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = ruleRegex.exec(css)) !== null) {
    bodies.push(match[2]);
  }
  return bodies;
}

/** Extract the last `color: <value>;` declaration from a rule body. */
function lastColorDeclaration(body: string): string | null {
  const matches = body.match(/(?:^|;|\s)color\s*:\s*([^;}]+?)\s*(?:;|$)/g);
  if (!matches || matches.length === 0) return null;
  const last = matches[matches.length - 1];
  const value = last.match(/color\s*:\s*([^;}]+?)\s*(?:;|$)/);
  return value ? value[1].trim() : null;
}

/** Compute WCAG relative luminance for an sRGB color in 0..1 components. */
function relativeLuminance(r: number, g: number, b: number): number {
  const channel = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Parse `#rgb` or `#rrggbb` into 0..1 sRGB triplet. */
function parseHex(hex: string): [number, number, number] {
  const clean = hex.trim().replace(/^#/, "");
  const expanded =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    throw new Error(`Not a hex color: ${hex}`);
  }
  const r = parseInt(expanded.slice(0, 2), 16) / 255;
  const g = parseInt(expanded.slice(2, 4), 16) / 255;
  const b = parseInt(expanded.slice(4, 6), 16) / 255;
  return [r, g, b];
}

/** WCAG contrast ratio between two sRGB colors. */
function contrastRatio(fg: [number, number, number], bg: [number, number, number]): number {
  const lf = relativeLuminance(...fg);
  const lb = relativeLuminance(...bg);
  const [lighter, darker] = lf > lb ? [lf, lb] : [lb, lf];
  return (lighter + 0.05) / (darker + 0.05);
}

describe(".pw-catalog-card-sku contrast (regression for Failures.md 2026-06-25)", () => {
  for (const relPath of CSS_FILES) {
    describe(relPath, () => {
      const css = readFileSync(path.join(REPO_SITE_ROOT, relPath), "utf8");
      const bodies = extractSkuRuleBodies(css);

      it("declares at least one .pw-catalog-card-sku rule", () => {
        expect(bodies.length).toBeGreaterThan(0);
      });

      it("does not use var(--text-muted) for color (cascade is unsafe under color-scheme: light dark)", () => {
        for (const body of bodies) {
          const color = lastColorDeclaration(body);
          // Every SKU rule must declare a color (so a downstream cascade can't fall back to inherited).
          expect(color, "no color declaration in .pw-catalog-card-sku rule").not.toBeNull();
          expect(color).not.toMatch(/var\(\s*--text-muted\s*\)/i);
          expect(color).not.toMatch(/var\(\s*--text-subtle\s*\)/i);
        }
      });

      it("uses a hardcoded hex that passes WCAG AA (>=4.5:1) on var(--color-white-50)", () => {
        const white: [number, number, number] = [1, 1, 1];
        for (const body of bodies) {
          const color = lastColorDeclaration(body);
          expect(color).not.toBeNull();
          // Must be a literal hex (immune to cascade / light-dark blending).
          expect(color, `expected hex color, got ${color}`).toMatch(/^#[0-9a-fA-F]{3,6}$/);
          const ratio = contrastRatio(parseHex(color as string), white);
          expect(
            ratio,
            `WCAG AA fail: ${color} on var(--color-white-50) = ${ratio.toFixed(2)}:1 (need >=4.5)`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      });
    });
  }
});
