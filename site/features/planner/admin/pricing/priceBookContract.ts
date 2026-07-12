/**
 * Admin P05 — price-book JSON contract (Buyer P04 consumes this shape).
 * Versioned, immutable once released.
 */

export type PriceBookCurrency = "INR" | "USD";

export type PriceBookLineRule = {
  readonly sku: string;
  readonly unitPriceMinor: number;
  readonly currency: PriceBookCurrency;
  readonly uom: "each" | "mm" | "sqm" | "seat";
  readonly adjustmentBps?: number;
};

export type PriceBookVersion = {
  readonly versionId: string;
  readonly effectiveFrom: string;
  readonly currency: PriceBookCurrency;
  readonly status: "draft" | "approved" | "active" | "rolled_back";
  readonly rules: readonly PriceBookLineRule[];
};

export type PriceBookContract = {
  readonly type: "oando-price-book";
  readonly schemaVersion: 1;
  readonly familySlug: string;
  readonly bookId: string;
  readonly activeVersionId: string | null;
  readonly versions: readonly PriceBookVersion[];
};

export function lineTotalMinor(
  rule: PriceBookLineRule,
  quantity: number,
): number | null {
  if (!Number.isFinite(quantity) || quantity <= 0) return null;
  if (!Number.isFinite(rule.unitPriceMinor) || rule.unitPriceMinor < 0) return null;
  const base = Math.round(rule.unitPriceMinor * quantity);
  const bps = rule.adjustmentBps ?? 0;
  return Math.round(base * (1 + bps / 10_000));
}

export function priceForSku(
  book: PriceBookContract,
  versionId: string,
  sku: string,
): PriceBookLineRule | null {
  const version = book.versions.find((v) => v.versionId === versionId);
  if (!version) return null;
  return version.rules.find((r) => r.sku === sku) ?? null;
}