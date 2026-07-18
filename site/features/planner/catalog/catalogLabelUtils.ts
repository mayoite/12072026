/**
 * Pure catalog display helpers (no server-only).
 * Used by descriptor → catalog mapping, inventory labels, and BOQ lines.
 */

/**
 * Commercial SKU abbreviations used in Oando brand codes
 * (`OANDO-FLUID-DSK-1600` → Desk, not "Dsk").
 */
const SKU_TOKEN_LABELS: Readonly<Record<string, string>> = {
  dsk: "Desk",
  chr: "Chair",
  tbl: "Table",
  mtg: "Meeting",
  ws: "Workstation",
  tsk: "Task",
  gst: "Guest",
  ped: "Pedestal",
  lck: "Locker",
  stg: "Storage",
  cab: "Cabinet",
  sof: "Sofa",
  lnr: "Linear",
  lshape: "L-Shape",
};

function titleCaseWord(word: string): string {
  if (!word) return word;
  if (/^v\d+/i.test(word)) return word.toUpperCase();
  // mm size tokens and pure numbers stay as-is
  if (/^\d{3,4}$/.test(word)) return word;
  if (/^\d+$/.test(word)) return word;

  const lower = word.toLowerCase();
  const fromSku = SKU_TOKEN_LABELS[lower];
  if (fromSku) return fromSku;

  // Short shape tokens (legacy slug helpers)
  if (lower === "l" || lower === "ls") return word.toUpperCase();
  if (lower === "ws") return "Workstation";

  if (word.length <= 2 && word === word.toUpperCase()) return word;

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Turn a slug or commercial SKU into a guest-readable brand label.
 *
 * Examples:
 * - `chaise-lounge-001` → `Chaise Lounge` (drops padded serial)
 * - `oando-fluid-desk-1600` → `Fluid Desk 1600`
 * - `OANDO-FLUID-DSK-1600` → `Fluid Desk 1600`
 * - `OANDO-OMNIA-DSK-1800` → `Omnia Desk 1800`
 *
 * Trailing padded serials (`-001`) are dropped; size tokens (`-1400` / `-1600`) stay.
 * Version tokens like `v0` stay uppercased.
 */
export function humanizeCatalogSlug(slug: string | null | undefined): string {
  if (typeof slug !== "string") return "Catalog item";
  const trimmed = slug.trim();
  if (!trimmed) return "Catalog item";

  // Drop only padded serials (-001), not size tokens (-1400 / -1600).
  const withoutSerial = trimmed.replace(/-0\d{2}$/i, "");
  // Brand prefix → readable label ("oando-fluid-desk-1600" / "OANDO-FLUID-DSK-1600").
  const withoutBrand = withoutSerial.replace(/^oando[-_]+/i, "");
  const spaced = withoutBrand
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!spaced) return "Catalog item";

  return spaced
    .split(" ")
    .map(titleCaseWord)
    .join(" ")
    .replace(/\bLshape\b/gi, "L-Shape")
    .replace(/\bL Desk\b/gi, "L-Desk");
}

/**
 * Prefer an explicit product name; otherwise humanize slug, then SKU.
 * Inventory tiles and BOQ identity share this resolution order.
 */
export function resolveCatalogDisplayName(input: {
  name?: string | null;
  slug?: string | null;
  sku?: string | null;
  catalogId?: string | null;
}): string {
  const preferred = typeof input.name === "string" ? input.name.trim() : "";
  if (preferred) return preferred;

  const slug = typeof input.slug === "string" ? input.slug.trim() : "";
  if (slug) return humanizeCatalogSlug(slug);

  const sku = typeof input.sku === "string" ? input.sku.trim() : "";
  if (sku) return humanizeCatalogSlug(sku);

  const catalogId =
    typeof input.catalogId === "string" ? input.catalogId.trim() : "";
  if (catalogId) return humanizeCatalogSlug(catalogId);

  return "Catalog item";
}

/**
 * Compact BOQ / review line label: brand display name + SKU when present.
 * Example: `Fluid Desk 1600 · OANDO-FLUID-DSK-1600`
 */
export function formatBoqLineDisplayName(
  name: string | null | undefined,
  sku?: string | null,
): string {
  const brand = typeof name === "string" ? name.trim() : "";
  const skuTrim = typeof sku === "string" ? sku.trim() : "";

  if (!brand && !skuTrim) return "Catalog item";
  if (!skuTrim) return brand || "Catalog item";
  if (!brand) return skuTrim;
  // Avoid "Name · SKU" when name already embeds the SKU.
  if (brand.includes(skuTrim)) return brand;
  return `${brand} · ${skuTrim}`;
}

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
