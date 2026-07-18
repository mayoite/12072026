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

/**
 * Immutable published SVG served from Products DB pointer + R2 artifact bytes.
 * Prefer this over disk `/svg-catalog/{slug}.svg` when a revision id is known.
 */
export function buildPublishedSvgApiUrl(revisionId: string): string {
  const id = revisionId.trim();
  return `/api/planner/catalog/svg/${id}`;
}

export function isPublishedSvgApiUrl(url: string): boolean {
  const path = url.split("?")[0]?.split("#")[0] ?? "";
  return /^\/api\/planner\/catalog\/svg\/[a-z][a-z0-9-]{1,127}$/i.test(path);
}

/**
 * Extract revision id from a published SVG API URL (AF-15/DB-SVG-13 pin source).
 * Returns null for disk `/svg-catalog/` or non-revision URLs.
 */
export function parsePublishedSvgRevisionId(
  url: string | null | undefined,
): string | null {
  if (typeof url !== "string") return null;
  const path = url.split("?")[0]?.split("#")[0] ?? "";
  const match = path.match(
    /^\/api\/planner\/catalog\/svg\/([a-z][a-z0-9-]{1,127})$/i,
  );
  return match?.[1] ?? null;
}

/**
 * Supabase Storage mirror path (Admin publish best-effort upload).
 * Prefer disk `/svg-catalog/` for live paint; use this for CDN / cross-env import.
 */
export function buildSupabasePlannerSymbolUrl(slug: string): string | null {
  const base =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    "";
  if (!base) return null;
  const safe = slug.trim();
  if (!safe) return null;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/catalog-assets/planner-symbols/${safe}/symbol.svg`;
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