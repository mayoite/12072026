/**
 * Shared SVG preview asset constants and URL builders.
 * Used by admin pipeline, portal catalog, and planner inventory thumbnails.
 */

export const SVG_THUMB_BUCKET = "site-block-thumbs";
export const SVG_CATALOG_PUBLIC_PATH = "/svg-catalog";

/** Master raster width for PNG uploads and artifact compilation. */
export const SVG_RASTER_MASTER_WIDTH = 1024;

/** Standard display width for catalog block PNG thumbs (1x). */
export const SVG_RASTER_PREVIEW_WIDTH = 512;

/** Retina display width for catalog block PNG thumbs (2x). */
export const SVG_RASTER_RETINA_WIDTH = 1024;

/** Deterministic Sharp/Resvg derivative widths for revision artifacts. */
export const SVG_THUMBNAIL_WIDTHS = [128, 256, 512] as const;

export type SvgThumbVariant = "1x" | "2x";

export function isSvgAssetUrl(url: string): boolean {
  const path = url.split("?")[0]?.split("#")[0] ?? "";
  return path.toLowerCase().endsWith(".svg");
}

export function buildSvgCatalogPublicUrl(slug: string): string {
  return `${SVG_CATALOG_PUBLIC_PATH}/${slug}.svg`;
}

function thumbObjectKey(slug: string, variant: SvgThumbVariant = "1x"): string {
  return variant === "2x" ? `${slug}@2x.png` : `${slug}.png`;
}

/** Build the CDN/R2 URL for a block PNG thumb. */
export function buildBlockThumbPngUrl(
  slug: string,
  variant: SvgThumbVariant = "1x",
): string {
  const key = thumbObjectKey(slug, variant);
  const accountId = (process.env.CLOUDFLARE_ACCOUNT_ID || "").trim();
  if (accountId) {
    return `https://${accountId}.r2.cloudflarestorage.com/${SVG_THUMB_BUCKET}/${key}`;
  }
  return `https://cdn.oando.co.in/${SVG_THUMB_BUCKET}/${key}`;
}

/** srcSet for retina PNG thumbs (512w 1x + 1024w 2x). */
export function buildBlockThumbSrcSet(slug: string): string {
  return `${buildBlockThumbPngUrl(slug, "1x")} 1x, ${buildBlockThumbPngUrl(slug, "2x")} 2x`;
}