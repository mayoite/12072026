import { describe, expect, it } from "vitest";

import {
  lineTotalMinor,
  priceForSku,
  type PriceBookContract,
} from "@/features/planner/admin/pricing/priceBookContract";

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
        { sku: "OFL-DSK-LIN-1200", unitPriceMinor: 450_000_00, currency: "INR", uom: "each" },
        { sku: "OFL-TBL-001", unitPriceMinor: 12_500_00, currency: "INR", uom: "each", adjustmentBps: -500 },
      ],
    },
  ],
};

describe("priceBookContract", () => {
  it("resolves sku rules from a version", () => {
    const rule = priceForSku(FIXTURE, "v1", "OFL-TBL-001");
    expect(rule?.unitPriceMinor).toBe(12_500_00);
  });

  it("computes line total with adjustment bps", () => {
    const rule = priceForSku(FIXTURE, "v1", "OFL-TBL-001");
    expect(rule).not.toBeNull();
    if (!rule) return;
    expect(lineTotalMinor(rule, 2)).toBe(Math.round(12_500_00 * 2 * (1 - 500 / 10_000)));
  });

  it("returns null for unknown sku (price unavailable — never zero)", () => {
    expect(priceForSku(FIXTURE, "v1", "MISSING")).toBeNull();
    expect(lineTotalMinor({ sku: "X", unitPriceMinor: Number.NaN, currency: "INR", uom: "each" }, 1)).toBeNull();
  });
});