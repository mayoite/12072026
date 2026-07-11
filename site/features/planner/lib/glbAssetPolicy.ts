/**
 * GLB asset policy — system-generated only.
 * Designer static/hand-authored GLB is not a product path (removed as "exception").
 *
 * Allowed:
 * - empty / unset
 * - URLs under catalog-assets/generated/ (extrude / modular export upload)
 * - blob: previews before upload completes
 *
 * Rejected:
 * - arbitrary CDN/designer GLB URLs used as the primary product 3D
 */

export const GENERATED_GLB_PATH_MARKER = "catalog-assets/generated/";

/** Pathname only (strip query/hash) so marker cannot be spoofed via `?catalog-assets/generated/`. */
function urlPathnameOnly(url: string): string {
  const noHash = url.split("#")[0] ?? url;
  return noHash.split("?")[0] ?? noHash;
}

/**
 * True for blob: previews or URLs whose **path** contains catalog-assets/generated/.
 * Query/hash-only embeds of the marker are rejected.
 */
export function isSystemGeneratedGlbUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("blob:")) return true;
  const path = urlPathnameOnly(trimmed);
  return (
    path.startsWith(GENERATED_GLB_PATH_MARKER) ||
    path.includes(`/${GENERATED_GLB_PATH_MARKER}`)
  );
}

/**
 * Returns null if ok; otherwise a human-readable rejection reason.
 */
export function rejectDesignerStaticGlbUrl(
  url: string | null | undefined,
): string | null {
  if (url === null || url === undefined) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (isSystemGeneratedGlbUrl(trimmed)) return null;
  return (
    "Static designer GLB is not allowed. Use modular/parametric generation or SVG extrude " +
    `(upload lands under ${GENERATED_GLB_PATH_MARKER}).`
  );
}

export function assertNoDesignerStaticGlb(
  url: string | null | undefined,
  fieldLabel = "GLB URL",
): void {
  const reason = rejectDesignerStaticGlbUrl(url);
  if (reason) {
    throw new Error(`${fieldLabel}: ${reason}`);
  }
}

/** Sources that may carry a GLB URL on furniture / scene nodes. */
export interface FurnitureGlbUrlSources {
  readonly generatedGlbUrl?: string | null;
  readonly glbUrl?: string | null;
  readonly meshUrl?: string | null;
}

/**
 * Prefer generatedGlbUrl, then glbUrl, then meshUrl.
 * Returns trimmed non-empty string or null (does not apply policy).
 */
export function resolveFurnitureGlbUrl(
  sources: FurnitureGlbUrlSources,
): string | null {
  const candidates = [
    sources.generatedGlbUrl,
    sources.glbUrl,
    sources.meshUrl,
  ];
  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined) continue;
    const trimmed = candidate.trim();
    if (trimmed) return trimmed;
  }
  return null;
}

/**
 * True only when a non-empty URL is policy-allowed for viewer load
 * (catalog-assets/generated/* or blob:). Rejects designer static URLs.
 */
export function shouldLoadGlb(url: string | null | undefined): boolean {
  if (url === null || url === undefined) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  return isSystemGeneratedGlbUrl(trimmed);
}
