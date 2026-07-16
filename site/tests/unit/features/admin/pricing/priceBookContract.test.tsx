/**
 * Phase 4 first slice + ADM-PRICE-01:
 * immutable version IDs, explicit currency/dates/status,
 * currency display primary, missing price unavailable (never zero).
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  describePriceBookVersion,
  displayPriceForSku,
  formatPriceBookCurrency,
  formatPriceBookMinorSecondary,
  getPriceBookVersion,
  lineTotalMinor,
  priceForSku,
  type PriceBookContract,
} from "@/features/admin/pricing/priceBookContract";
import { AdminPriceBookPageView } from "@/features/admin/pricing/AdminPriceBookPageView";

const FIXTURE: PriceBookContract = {
  type: "oando-price-book",
  schemaVersion: 1,
  familySlug: "linear-desk-1200",
  bookId: "pb-linear-2026-q3",
  activeVersionId: "v1",
  versions: [
    {
      versionId: "v1",
      effectiveFrom: "2026-07-01",
      currency: "INR",
      status: "active",
      rules: [
        {
          sku: "OFL-DSK-LIN-1200",
          unitPriceMinor: 450_000_00,
          currency: "INR",
          uom: "each",
        },
        {
          sku: "OFL-TBL-001",
          unitPriceMinor: 12_500_00,
          currency: "INR",
          uom: "each",
          adjustmentBps: -500,
        },
      ],
    },
    {
      versionId: "v0",
      effectiveFrom: "2026-01-01",
      effectiveTo: "2026-06-30",
      currency: "INR",
      status: "rolled_back",
      rules: [
        {
          sku: "OFL-DSK-LIN-1200",
          unitPriceMinor: 400_000_00,
          currency: "INR",
          uom: "each",
        },
      ],
    },
  ],
};

describe("price book version identity and metadata", () => {
  it("keeps immutable version IDs and explicit currency, dates, status", () => {
    const v1 = getPriceBookVersion(FIXTURE, "v1");
    expect(v1?.versionId).toBe("v1");
    const meta = describePriceBookVersion(v1!);
    expect(meta).toEqual({
      versionId: "v1",
      currency: "INR",
      effectiveFrom: "2026-07-01",
      effectiveTo: null,
      status: "active",
    });
    const v0 = describePriceBookVersion(getPriceBookVersion(FIXTURE, "v0")!);
    expect(v0.effectiveTo).toBe("2026-06-30");
    expect(v0.status).toBe("rolled_back");
    // Book id stable across versions
    expect(FIXTURE.bookId).toBe("pb-linear-2026-q3");
    expect(FIXTURE.versions.map((v) => v.versionId)).toEqual(["v1", "v0"]);
  });
});

describe("priceBookContract resolution", () => {
  it("resolves sku rules from a version", () => {
    const rule = priceForSku(FIXTURE, "v1", "OFL-TBL-001");
    expect(rule?.unitPriceMinor).toBe(12_500_00);
  });

  it("computes line total with adjustment bps", () => {
    const rule = priceForSku(FIXTURE, "v1", "OFL-TBL-001");
    expect(rule).not.toBeNull();
    if (!rule) throw new Error("expected rule");
    expect(lineTotalMinor(rule, 2)).toBe(
      Math.round(12_500_00 * 2 * (1 - 500 / 10_000)),
    );
  });

  it("returns null for unknown sku (price unavailable — never zero)", () => {
    expect(priceForSku(FIXTURE, "v1", "MISSING")).toBeNull();
    expect(
      lineTotalMinor(
        { sku: "X", unitPriceMinor: Number.NaN, currency: "INR", uom: "each" },
        1,
      ),
    ).toBeNull();
    const missing = displayPriceForSku(FIXTURE, "v1", "MISSING");
    expect(missing.available).toBe(false);
    expect(missing.primary).toBe("Price unavailable");
    expect(missing.unitPriceMinor).toBeNull();
    expect(missing.primary).not.toBe("₹0.00");
    expect(missing.primary).not.toMatch(/^0/);
  });
});

describe("ADM-PRICE-01 currency primary, raw minor secondary", () => {
  it("formats INR major currency from minor units", () => {
    // 45000000 minor paise → ₹4,50,000.00 (en-IN grouping) or ₹450,000.00
    const formatted = formatPriceBookCurrency(450_000_00, "INR", "en-IN");
    expect(formatted.replace(/[^\d]/g, "")).toMatch(/450000/);
    expect(formatted).toMatch(/₹|INR|Rs/i);
  });

  it("displayPriceForSku exposes currency primary and minor secondary", () => {
    const display = displayPriceForSku(FIXTURE, "v1", "OFL-DSK-LIN-1200");
    expect(display.available).toBe(true);
    if (!display.available) throw new Error("expected display.available");
    expect(display.primary.replace(/[^\d]/g, "")).toMatch(/450000/);
    expect(display.secondary).toMatch(/45000000/);
    expect(display.secondary).toMatch(/minor/i);
    expect(display.unitPriceMinor).toBe(450_000_00);
  });

  it("returns Price unavailable for non-finite minor units (never 0)", () => {
    expect(formatPriceBookCurrency(Number.NaN, "INR")).toBe("Price unavailable");
    expect(formatPriceBookCurrency(Number.POSITIVE_INFINITY, "USD")).toBe(
      "Price unavailable",
    );
    expect(formatPriceBookMinorSecondary(Number.NaN, "INR")).toBe("—");
    expect(formatPriceBookMinorSecondary(Number.NEGATIVE_INFINITY, "USD")).toBe(
      "—",
    );
  });

  it("formats minor secondary with trunc and currency code", () => {
    expect(formatPriceBookMinorSecondary(12_345.9, "USD")).toBe(
      "12345 USD minor units",
    );
    expect(formatPriceBookMinorSecondary(0, "INR")).toBe("0 INR minor units");
  });

  it("formats USD with en-US locale", () => {
    const formatted = formatPriceBookCurrency(199_99, "USD", "en-US");
    expect(formatted).toMatch(/\$|USD/i);
    expect(formatted.replace(/[^\d]/g, "")).toMatch(/19999|199\.99|19999/);
  });
});

describe("lineTotalMinor edge cases", () => {
  const freeRule = {
    sku: "FREE",
    unitPriceMinor: 0,
    currency: "INR" as const,
    uom: "each" as const,
  };
  const baseRule = {
    sku: "X",
    unitPriceMinor: 1000,
    currency: "INR" as const,
    uom: "each" as const,
  };

  it("returns null for non-positive or non-finite quantity", () => {
    expect(lineTotalMinor(baseRule, 0)).toBeNull();
    expect(lineTotalMinor(baseRule, -2)).toBeNull();
    expect(lineTotalMinor(baseRule, Number.NaN)).toBeNull();
    expect(lineTotalMinor(baseRule, Number.POSITIVE_INFINITY)).toBeNull();
  });

  it("returns null for negative unit price; free line (0) is a valid total", () => {
    expect(
      lineTotalMinor(
        { ...baseRule, unitPriceMinor: -1 },
        1,
      ),
    ).toBeNull();
    expect(lineTotalMinor(freeRule, 3)).toBe(0);
  });

  it("defaults missing adjustmentBps to 0 and applies positive bps", () => {
    expect(lineTotalMinor(baseRule, 2)).toBe(2000);
    expect(
      lineTotalMinor({ ...baseRule, adjustmentBps: 1000 }, 1),
    ).toBe(Math.round(1000 * (1 + 1000 / 10_000)));
  });
});

describe("priceForSku / getPriceBookVersion / displayPriceForSku edges", () => {
  it("returns null for unknown version", () => {
    expect(getPriceBookVersion(FIXTURE, "nope")).toBeNull();
    expect(priceForSku(FIXTURE, "nope", "OFL-TBL-001")).toBeNull();
    const missingVersion = displayPriceForSku(FIXTURE, "nope", "OFL-TBL-001");
    expect(missingVersion.available).toBe(false);
    expect(missingVersion.primary).toBe("Price unavailable");
    expect(missingVersion.secondary).toBeNull();
    expect(missingVersion.currency).toBeNull();
  });

  it("treats free line (0 minor) as available, not missing", () => {
    const freeBook: PriceBookContract = {
      ...FIXTURE,
      versions: [
        {
          versionId: "v-free",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "active",
          rules: [
            {
              sku: "PROMO-FREE",
              unitPriceMinor: 0,
              currency: "INR",
              uom: "each",
            },
          ],
        },
      ],
    };
    const display = displayPriceForSku(freeBook, "v-free", "PROMO-FREE");
    expect(display.available).toBe(true);
    if (!display.available) throw new Error("expected available");
    expect(display.unitPriceMinor).toBe(0);
    expect(display.secondary).toMatch(/0 INR minor/);
  });

  it("marks negative stored unit price as unavailable", () => {
    const badBook: PriceBookContract = {
      ...FIXTURE,
      versions: [
        {
          versionId: "v-bad",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "draft",
          rules: [
            {
              sku: "BAD",
              unitPriceMinor: -50,
              currency: "INR",
              uom: "each",
            },
          ],
        },
      ],
    };
    const display = displayPriceForSku(badBook, "v-bad", "BAD");
    expect(display.available).toBe(false);
    expect(display.unitPriceMinor).toBeNull();
  });
});

describe("AdminPriceBookPageView presentation", () => {
  it("renders currency, dates, status, and unavailable for missing SKU", () => {
    render(
      <AdminPriceBookPageView
        initialBookId={FIXTURE.bookId}
        initialContract={FIXTURE}
      />,
    );
    expect(screen.getByTestId("admin-price-book-id")).toHaveTextContent(
      "pb-linear-2026-q3",
    );
    expect(screen.getByTestId("admin-price-book-version-meta")).toHaveTextContent(
      /Currency:\s*INR/,
    );
    expect(screen.getByTestId("admin-price-book-version-meta")).toHaveTextContent(
      /2026-07-01/,
    );
    expect(screen.getByTestId("admin-price-book-version-meta")).toHaveTextContent(
      /active/,
    );
    expect(
      screen.getByTestId("admin-price-primary-OFL-DSK-LIN-1200").textContent?.replace(
        /[^\d]/g,
        "",
      ),
    ).toMatch(/450000/);
    // Raw storage stays under Advanced disclosure (still in DOM).
    const technical = screen.getByTestId("admin-price-book-technical");
    expect(technical.tagName.toLowerCase()).toBe("details");
    expect(technical).not.toHaveAttribute("open");
    expect(
      screen.getByTestId("admin-price-secondary-OFL-DSK-LIN-1200"),
    ).toHaveTextContent(/minor/i);
    expect(screen.getByTestId("admin-price-primary-missing")).toHaveTextContent(
      "Price unavailable",
    );
    // Activate is the primary commercial action; approve/rollback are not.
    expect(screen.getByTestId("admin-price-book-activate")).toHaveClass(
      "admin-btn--primary",
    );
    expect(screen.getByTestId("admin-price-book-approve")).not.toHaveClass(
      "admin-btn--primary",
    );
    expect(screen.getByTestId("admin-price-book-rollback")).not.toHaveClass(
      "admin-btn--primary",
    );
  });
});
