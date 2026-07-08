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

export function isSystemGeneratedGlbUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("blob:")) return true;
  return trimmed.includes(GENERATED_GLB_PATH_MARKER);
}

/**
 * Returns null if ok; otherwise a human-readable rejection reason.
 */
export function rejectDesignerStaticGlbUrl(
  url: string | null | undefined,
): string | null {
  if (url == null) return null;
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
