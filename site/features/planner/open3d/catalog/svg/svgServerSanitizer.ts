import "server-only";

import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { optimize } from "svgo";

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
      FORBID_TAGS: ["script", "style", "foreignObject", "filter", "image"],
      FORBID_ATTR: ["style"],
    });
    if (purifier.removed.length > 0) {
      throw new Error("SVG sanitization rejected or changed unsafe markup");
    }
    return optimize(sanitized, {
      multipass: false,
      plugins: [
        { name: "preset-default", params: { overrides: { cleanupIds: false, removeViewBox: false } } },
        "sortAttrs",
      ],
    }).data.trim();
  } finally {
    window.close();
  }
}
