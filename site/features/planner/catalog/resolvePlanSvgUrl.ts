/**
 * Resolve a published plan-symbol SVG URL for placement / canvas paint.
 * Prefer explicit catalog preview (incl. DB revision API); fall back to disk
 * `/svg-catalog/{slug}.svg` only when no revision URL is available.
 */

import {
  buildPublishedSvgApiUrl,
  buildSvgCatalogPublicUrl,
  isPublishedSvgApiUrl,
  isSvgAssetUrl,
} from "@/features/planner/catalog/svg/svgPreviewAssets";
import { isPublishedSvgPlanUrl } from "@/features/planner/catalog/svg/svgPlanSymbolCache";

export function resolvePlanSvgUrl(input: {
  previewImageUrl?: string | null;
  imageUrls?: readonly string[] | null;
  imageUrl?: string | null;
  thumbnail?: string | null;
  slug?: string | null;
  sourceSlug?: string | null;
  /** DB-SVG product pointer — preferred paint source when present. */
  publishedSvgRevisionId?: string | null;
}): string | null {
  const revisionId = input.publishedSvgRevisionId?.trim();
  if (revisionId && /^[a-z][a-z0-9-]{1,127}$/i.test(revisionId)) {
    return buildPublishedSvgApiUrl(revisionId);
  }

  const candidates = [
    input.previewImageUrl,
    input.imageUrl,
    input.thumbnail,
    ...(input.imageUrls ?? []),
  ];
  for (const raw of candidates) {
    if (typeof raw !== "string") continue;
    const url = raw.trim();
    if (!url) continue;
    if (
      isPublishedSvgApiUrl(url) ||
      isPublishedSvgPlanUrl(url) ||
      isSvgAssetUrl(url)
    ) {
      return url;
    }
  }

  const slug = (input.slug ?? input.sourceSlug ?? "").trim();
  if (slug && /^[a-z0-9][a-z0-9._-]{0,120}$/i.test(slug)) {
    return buildSvgCatalogPublicUrl(slug);
  }
  return null;
}
