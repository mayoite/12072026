/**
 * Resolve a published plan-symbol SVG URL for placement / canvas paint.
 * Prefer explicit catalog preview; fall back to disk `/svg-catalog/{slug}.svg`.
 */

import {
  buildSvgCatalogPublicUrl,
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
}): string | null {
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
    if (isPublishedSvgPlanUrl(url) || isSvgAssetUrl(url)) return url;
  }

  const slug = (input.slug ?? input.sourceSlug ?? "").trim();
  if (slug && /^[a-z0-9][a-z0-9._-]{0,120}$/i.test(slug)) {
    return buildSvgCatalogPublicUrl(slug);
  }
  return null;
}
