import "server-only";

import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { optimize } from "svgo";
import { createRequire } from "node:module";

// GS: BP-03 Option A locked pipeline order; REC-05 (no json render); anti-copy (semantic only).
// SVGO config locked here + svgo.config.cjs ; integration test asserts usage.
const requireCjs = createRequire(import.meta.url);
const lockedSvgoConfig = requireCjs("../../../../../scripts/generate-svg/svgo.config.cjs");

const ALLOWED_TAGS = ["svg", "title", "desc", "g", "defs", "symbol", "use", "path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "text"];
const ALLOWED_ATTR = ["xmlns", "viewBox", "id", "role", "aria-labelledby", "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry", "width", "height", "d", "points", "fill", "stroke", "stroke-width", "opacity", "href"];

export function sanitizeAndOptimizeSvg(svg: string): string {
  const window = new JSDOM("").window;
  try {
    const purifier = createDOMPurify(window);
    const sanitized = purifier.sanitize(svg, {
      USE_PROFILES: { svg: true, svgFilters: false },
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ADD_ATTR: ["role"],
      FORBID_TAGS: ["script", "style", "foreignObject", "filter", "image"],
      FORBID_ATTR: ["style"],
    });
    const unsafeRemoval = purifier.removed.some((removal) => {
      if ("attribute" in removal) return true;
      if ("element" in removal) {
        return removal.element.nodeName.toLowerCase() !== "body";
      }
      return true;
    });
    if (unsafeRemoval) {
      throw new Error("SVG sanitization rejected or changed unsafe markup");
    }
    // Use locked config (from generate-svg/svgo.config.cjs) for single authority.
    return optimize(sanitized, lockedSvgoConfig).data.trim();
  } finally {
    window.close();
  }
}
