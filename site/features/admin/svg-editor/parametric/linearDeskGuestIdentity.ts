/**
 * Guest inventory only lists oando-* brand slugs.
 * Parametric publish must normalize identity so place + BOQ can work.
 */

const GUEST_BRAND_PREFIX = "oando-";

/** Ensure slug is guest-visible (oando-*) and valid-ish for catalog. */
export function ensureGuestVisibleSlug(
  rawSlug: string | undefined,
  widthMm: number,
): string {
  const width = Number.isFinite(widthMm) ? Math.round(widthMm) : 1600;
  const fallback = `${GUEST_BRAND_PREFIX}linear-desk-${width}`;
  const trimmed = (rawSlug ?? "").trim().toLowerCase();
  if (!trimmed) return fallback;

  let slug = trimmed
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) return fallback;
  if (!slug.startsWith(GUEST_BRAND_PREFIX)) {
    slug = `${GUEST_BRAND_PREFIX}${slug}`;
  }
  // Max 64 for schema-ish: oando- + rest
  if (slug.length > 64) {
    slug = slug.slice(0, 64).replace(/-$/, "");
  }
  if (!/^[a-z][a-z0-9-]{1,63}$/.test(slug)) {
    return fallback;
  }
  return slug;
}

/** Prefer form SKU; otherwise brand-style code from width. */
export function ensureCommercialSku(
  rawSku: string | undefined,
  widthMm: number,
): string {
  const trimmed = (rawSku ?? "").trim();
  if (trimmed.length > 0) return trimmed.slice(0, 120);
  const width = Number.isFinite(widthMm) ? Math.round(widthMm) : 1600;
  return `OANDO-LINEAR-DSK-${width}`;
}

export function isGuestVisibleSlug(slug: string): boolean {
  const n = slug.trim().toLowerCase();
  return n.startsWith("oando-") || n.startsWith("oando_");
}
