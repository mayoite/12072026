/**
 * PDP optional plan-symbol thumb when a published plan SVG exists.
 * Disk authority: `/svg-catalog/{slug}.svg`. Revision API when pointer known.
 * Does not flip release authority; pure URL resolution + injectable existence check.
 */

import { resolvePlanSvgUrl } from "@/features/planner/catalog/resolvePlanSvgUrl";
import { buildSvgCatalogPublicUrl } from "@/features/planner/catalog/svg/svgPreviewAssets";

export interface PdpPlanSvgThumbInput {
  /** Marketing / catalog product slug (URL key). */
  readonly productSlug?: string | null;
  /** Optional metadata.sourceSlug or explicit plan slug. */
  readonly sourceSlug?: string | null;
  /** Explicit plan-symbol slug when joined. */
  readonly planSlug?: string | null;
  /** Products DB published_svg_revision_id when known. */
  readonly publishedSvgRevisionId?: string | null;
}

export interface PdpPlanSvgThumbResult {
  readonly url: string;
  readonly source: "revision" | "disk";
  readonly slug?: string;
}

function normalizeSlug(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^[a-z0-9][a-z0-9._-]{0,120}$/i.test(trimmed)) return null;
  return trimmed;
}

/**
 * Ordered unique slug candidates for disk `/svg-catalog/{slug}.svg` lookup.
 * Prefer explicit plan slug, then product slug, then source slug.
 */
export function listPdpPlanSvgSlugCandidates(
  input: PdpPlanSvgThumbInput,
): string[] {
  const ordered = [
    normalizeSlug(input.planSlug),
    normalizeSlug(input.productSlug),
    normalizeSlug(input.sourceSlug),
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const slug of ordered) {
    if (!slug) continue;
    const key = slug.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(slug);
  }
  return out;
}

/**
 * Resolve a public plan SVG thumb URL when published artifact is available.
 * `diskExists(slug)` should return true only when `public/svg-catalog/{slug}.svg` is present
 * (or equivalent CDN mirror). Omit / always-false → only revision URL may win.
 */
export function resolvePdpPlanSvgThumb(
  input: PdpPlanSvgThumbInput,
  options?: {
    readonly diskExists?: (slug: string) => boolean;
  },
): PdpPlanSvgThumbResult | null {
  const revisionId = input.publishedSvgRevisionId?.trim();
  if (revisionId) {
    const url = resolvePlanSvgUrl({ publishedSvgRevisionId: revisionId });
    if (url) {
      return { url, source: "revision" };
    }
  }

  const diskExists = options?.diskExists;
  if (!diskExists) return null;

  for (const slug of listPdpPlanSvgSlugCandidates(input)) {
    if (!diskExists(slug)) continue;
    const url = buildSvgCatalogPublicUrl(slug);
    return { url, source: "disk", slug };
  }

  return null;
}
