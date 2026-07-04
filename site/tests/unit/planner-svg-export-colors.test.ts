import { describe, expect, it } from "vitest";

import {
  createPlannerSvgColorResolver,
  finalizePlannerExportSvg,
} from "@/features/planner/lib/plannerSvgExportColors";

const THEME_CSS = `
  :root {
    --color-white-50: var(--color-white-50);
    --color-bronze-400: var(--color-ecru-700);
    --color-bronze-600: var(--color-bronze-600);
    --color-dark-midnight-blue-500: var(--text-body);
    --surface-page: var(--color-white-50);
    --text-body: var(--color-dark-midnight-blue-500);
    --text-muted: var(--text-muted);
    --color-accent: var(--color-bronze-400);
    --block-surface: var(--color-ecru-300);
  }
`;

describe("planner SVG export colors", () => {
  it("resolves planner theme tokens for shape export", () => {
    const resolve = createPlannerSvgColorResolver(THEME_CSS);
    expect(resolve("var(--surface-page)")).toBe("var(--color-white-50)");
    expect(resolve("var(--color-accent)")).toBe("var(--color-ecru-700)");
    expect(resolve("var(--block-surface)")).toBe("var(--color-ecru-300)");
  });

  it("finalizes exported svg without css variables", () => {
    const svg =
      '<svg><path fill="var(--surface-page)" stroke="var(--color-accent)"/><rect fill="color-mix(in srgb, white 50%, black)"/></svg>';
    const resolved = finalizePlannerExportSvg(svg, THEME_CSS);
    expect(resolved).toContain('fill="var(--color-white-50)"');
    expect(resolved).toContain('stroke="var(--color-ecru-700)"');
    expect(resolved).not.toContain("var(--surface-page)");
    expect(resolved).not.toContain("var(--color-accent)");
    expect(resolved).not.toContain("color-mix");
  });
});
