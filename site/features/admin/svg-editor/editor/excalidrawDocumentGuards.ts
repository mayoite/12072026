/**
 * Detect empty / placeholder Excalidraw SVG exports.
 * An untouched canvas exports a 20×20 white background and must not pass as a Planner symbol.
 */

export function countActiveExcalidrawElements(elements: unknown): number {
  if (!Array.isArray(elements)) return 0;
  let count = 0;
  for (const el of elements) {
    if (!el || typeof el !== "object") continue;
    const candidate = el as { isDeleted?: unknown; type?: unknown };
    if (candidate.isDeleted === true) continue;
    if (typeof candidate.type !== "string") continue;
    if (candidate.type === "selection") continue;
    count += 1;
  }
  return count;
}

/** True when SVG is missing, non-SVG, or the blank Excalidraw welcome export. */
export function isBlankExcalidrawSvg(svg: string): boolean {
  const trimmed = svg.trim();
  if (!trimmed.startsWith("<svg")) return true;

  const viewBoxMatch = /viewBox\s*=\s*"([^"]+)"/i.exec(trimmed);
  const viewBox = viewBoxMatch?.[1]?.trim() ?? "";
  if (viewBox === "0 0 20 20") {
    const shapeTags = trimmed.match(
      /<(?:path|polyline|polygon|ellipse|circle|text|image|line)\b/gi,
    );
    if (!shapeTags || shapeTags.length === 0) {
      const rects = trimmed.match(/<rect\b/gi);
      if (!rects || rects.length <= 1) return true;
    }
  }

  return false;
}
