/**
 * Pure catalog display helpers (no server-only).
 * Used by descriptor → catalog mapping and search label tests.
 */

/**
 * Turn a slug like `chaise-lounge-001` into a guest-readable label
 * (`Chaise Lounge`). Trailing numeric serials (`-001`) are dropped for
 * display; version tokens like `v0` stay.
 */
export function humanizeCatalogSlug(slug: string | null | undefined): string {
  if (typeof slug !== "string") return "Catalog item";
  const trimmed = slug.trim();
  if (!trimmed) return "Catalog item";

  // Drop only padded serials (-001), not size tokens (-1400 / -1600).
  const withoutSerial = trimmed.replace(/-0\d{2}$/i, "");
  // Brand prefix → readable label ("oando-fluid-desk-1600" → "Fluid Desk 1600").
  const withoutBrand = withoutSerial.replace(/^oando[-_]+/i, "");
  const spaced = withoutBrand
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!spaced) return "Catalog item";

  return spaced
    .split(" ")
    .map((word) => {
      if (/^v\d+/i.test(word)) return word.toUpperCase();
      if (/^\d{3,4}$/.test(word)) return word; // mm size token
      if (word.length <= 2 && word === word.toUpperCase()) return word;
      // Series tokens stay title case
      if (/^(ws|l|ls)$/i.test(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    .replace(/\bWs\b/g, "Workstation")
    .replace(/\bLshape\b/gi, "L-Shape")
    .replace(/\bL Desk\b/gi, "L-Desk");


/** Words from a slug usable as search tags (minus pure numeric serials). */
export function catalogSlugSearchTags(slug: string | null | undefined): string[] {
  if (typeof slug !== "string") return [];
  const trimmed = slug.trim().toLowerCase();
  if (!trimmed) return [];
  return trimmed
    .split(/[-_]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 1 && !/^\d+$/.test(part));
}
