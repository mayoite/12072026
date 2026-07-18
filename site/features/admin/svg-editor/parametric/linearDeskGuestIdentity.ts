/**
 * Guest inventory only lists oando-* brand slugs.
 * Parametric publish must normalize identity so place + BOQ can work.
 */

const GUEST_BRAND_PREFIX = "oando-";

/** Factory default slug pattern: oando-linear-desk-{widthMm}. */
const DEFAULT_SLUG_PATTERN = /^oando-linear-desk-\d+$/;
/** Factory default SKU pattern: OANDO-LINEAR-DSK-{widthMm}. */
const DEFAULT_SKU_PATTERN = /^OANDO-LINEAR-DSK-\d+$/;
/** Factory default display name: Linear desk {widthMm}. */
const DEFAULT_NAME_PATTERN = /^Linear desk \d+$/;

function roundedWidthMm(widthMm: number): number {
  return Number.isFinite(widthMm) ? Math.round(widthMm) : 1600;
}

/** Default guest-visible slug from width (mm). */
export function defaultLinearDeskSlug(widthMm: number): string {
  return `${GUEST_BRAND_PREFIX}linear-desk-${roundedWidthMm(widthMm)}`;
}

/** Default commercial SKU from width (mm). */
export function defaultLinearDeskSku(widthMm: number): string {
  return `OANDO-LINEAR-DSK-${roundedWidthMm(widthMm)}`;
}

/** Default human name from width (mm). */
export function defaultLinearDeskName(widthMm: number): string {
  return `Linear desk ${roundedWidthMm(widthMm)}`;
}

/** True when slug still matches the factory default pattern (any width). */
export function isDefaultLinearDeskSlug(slug: string): boolean {
  return DEFAULT_SLUG_PATTERN.test(slug.trim().toLowerCase());
}

/** True when SKU still matches the factory default pattern (any width). */
export function isDefaultLinearDeskSku(sku: string): boolean {
  return DEFAULT_SKU_PATTERN.test(sku.trim());
}

/** True when name still matches the factory default pattern (any width). */
export function isDefaultLinearDeskName(name: string): boolean {
  return DEFAULT_NAME_PATTERN.test(name.trim());
}

/** Ensure slug is guest-visible (oando-*) and valid-ish for catalog. */
export function ensureGuestVisibleSlug(
  rawSlug: string | undefined,
  widthMm: number,
): string {
  const fallback = defaultLinearDeskSlug(widthMm);
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
  return defaultLinearDeskSku(widthMm);
}

export function isGuestVisibleSlug(slug: string): boolean {
  const n = slug.trim().toLowerCase();
  return n.startsWith("oando-") || n.startsWith("oando_");
}

/**
 * Publish success copy — stable guest slug + commercial SKU (order factory identity).
 * Pure; form surfaces this after publishLinearDeskAction succeeds.
 */
export function formatLinearDeskPublishSuccess(parts: {
  readonly slug: string;
  readonly sku?: string | null;
}): string {
  const slug = parts.slug.trim();
  const sku =
    typeof parts.sku === "string" && parts.sku.trim().length > 0
      ? parts.sku.trim()
      : null;
  const skuBit = sku ? ` · SKU ${sku}` : "";
  return `Published ${slug}${skuBit} (live, guest-visible). SVG /svg-catalog/${slug}.svg`;
}
