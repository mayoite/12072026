import {
  createBlockColorResolver,
  resolveSvgForRaster,
  type BlockColorResolver,
} from "@/lib/catalog/resolveBlockColors";

/** Theme fallbacks when stylesheet rules are unreadable (SVG attrs need concrete colors). */
const PLANNER_CANVAS_TOKEN_FALLBACKS = `
  --surface-page: var(--color-white-100);
  --surface-panel: var(--color-white-50);
  --surface-soft: var(--color-ecru-100);
  --text-body: var(--text-body);
  --text-muted: var(--text-subtle);
  --text-inverse: var(--color-white-50);
  --color-accent: var(--color-ecru-500);
  --color-primary: var(--text-body);
  --color-accent-soft: var(--color-ecru-200);
  --color-danger: #dc2626;
  --color-bronze-600: #8b6914;
`;

let plannerCanvasColorResolver: BlockColorResolver | null = null;

/** Collect loaded stylesheet rules so export can resolve live theme tokens. */
export function collectPlannerExportCss(): string {
  if (typeof document === "undefined") return "";

  const chunks: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        chunks.push(rule.cssText);
      }
    } catch {
      // Cross-origin stylesheets are not readable.
    }
  }
  return chunks.join("\n");
}

/** Resolve planner + block CSS variables to concrete colors for vector export. */
export function createPlannerSvgColorResolver(css = collectPlannerExportCss()): BlockColorResolver {
  return createBlockColorResolver(`${PLANNER_CANVAS_TOKEN_FALLBACKS}\n${css}`);
}

/** Cached resolver for live canvas SVG (CSS vars do not paint reliably on <svg> attrs). */
export function getPlannerCanvasColorResolver(): BlockColorResolver {
  if (!plannerCanvasColorResolver) {
    plannerCanvasColorResolver = createPlannerSvgColorResolver();
  }
  return plannerCanvasColorResolver;
}

export function resetPlannerCanvasColorResolver(): void {
  plannerCanvasColorResolver = null;
}

/** Inline any remaining CSS variables / color-mix for standalone SVG files. */
export function finalizePlannerExportSvg(svg: string, css = collectPlannerExportCss()): string {
  return resolveSvgForRaster(svg, css);
}