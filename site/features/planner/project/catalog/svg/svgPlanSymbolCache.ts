/**
 * S7 — load published `/svg-catalog/*.svg` (or any same-origin SVG URL) for plan canvas draw.
 * Cache by URL; failed loads remember null so we fall back to Block2D.
 */

type CacheEntry = HTMLImageElement | null | "loading";

const cache = new Map<string, CacheEntry>();
const waiters = new Map<string, Array<() => void>>();

function notify(url: string): void {
  const list = waiters.get(url);
  if (!list) return;
  waiters.delete(url);
  for (const fn of list) fn();
}

function isLoadedImage(entry: CacheEntry | undefined): entry is HTMLImageElement {
  // Prefer duck-type over instanceof — unit FakeImage and some environments
  // do not satisfy `instanceof HTMLImageElement` even when drawImage-ready.
  return (
    entry !== null &&
    entry !== undefined &&
    entry !== "loading" &&
    typeof (entry as HTMLImageElement).src === "string"
  );
}

/** True when URL looks like a plan-catalog SVG asset. */
export function isPublishedSvgPlanUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  const path = url.split("?")[0]?.split("#")[0] ?? "";
  return path.toLowerCase().endsWith(".svg");
}

/**
 * Get a loaded image for plan draw, or null if missing/failed.
 * Kick off load when needed; caller should request a re-draw after load.
 */
export function getSvgPlanImage(
  url: string,
  onLoaded?: () => void,
): HTMLImageElement | null {
  const existing = cache.get(url);
  if (isLoadedImage(existing)) return existing;
  if (existing === null) return null;

  if (onLoaded) {
    const list = waiters.get(url) ?? [];
    list.push(onLoaded);
    waiters.set(url, list);
  }

  if (existing === "loading") return null;

  cache.set(url, "loading");
  if (typeof Image === "undefined") {
    cache.set(url, null);
    notify(url);
    return null;
  }

  const img = new Image();
  img.decoding = "async";
  // Same-origin public SVG; avoid tainting when possible.
  img.onload = () => {
    cache.set(url, img);
    notify(url);
  };
  img.onerror = () => {
    cache.set(url, null);
    notify(url);
  };
  img.src = url;
  return null;
}

/** Draw SVG image into furniture footprint (mm space, top-left origin). */
export function drawSvgPlanSymbol(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  widthMm: number,
  depthMm: number,
): void {
  const w = Math.max(1, widthMm);
  const d = Math.max(1, depthMm);
  ctx.save();
  // Centered footprint: caller already translates to furniture center + scale.
  // Image maps into [-w/2,-d/2]..[w/2,d/2] via drawImage after translate.
  ctx.drawImage(img, -w / 2, -d / 2, w, d);
  ctx.restore();
}

/** Test helper — clear cache between unit runs. */
export function clearSvgPlanSymbolCacheForTests(): void {
  cache.clear();
  waiters.clear();
}
