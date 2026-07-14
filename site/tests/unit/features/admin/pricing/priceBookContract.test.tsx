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
