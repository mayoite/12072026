import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import type { PriceBookContract } from "@/features/admin/pricing/priceBookContract";
import {
  computePinnedQuoteBreakdown,
  pinQuoteAtBookVersion,
  pinQuotePriceBook,
  quoteStillValidAgainstBook,
  reproduciblePinnedTotal,
} from "@/features/admin/pricing/quotePriceBookPin";

const FIXTURE = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "features/admin/pricing/fixtures/linear-desk-2026-q3.json"),
    "utf8",
  ),
) as PriceBookContract;

describe("quotePriceBookPin", () => {
  it("pins quote to v1 and computes reproducible total", () => {
    const pin = pinQuotePriceBook("quote-001", FIXTURE, "v1");
    const result = computePinnedQuoteBreakdown(pin, FIXTURE, [
      { sku: "OFL-TBL-001", quantity: 2 },
    ]);
    expect(result.totalMinor).toBe(Math.round(12_500_00 * 2 * (1 - 500 / 10_000)));
    expect(result.lines[0]?.unavailable).toBe(false);
  });

  it("keeps pinned version valid after active book advances", () => {
    const pin = pinQuotePriceBook("quote-001", FIXTURE, "v1");
    const advanced: PriceBookContract = {
      ...FIXTURE,
      activeVersionId: "v2",
      versions: [
        ...FIXTURE.versions,
        {
          versionId: "v2",
          effectiveFrom: "2026-08-01",
          currency: "INR",
          status: "active",
          rules: [],
        },
      ],
    };
    expect(quoteStillValidAgainstBook(pin, advanced)).toBe(true);
    const pinned = computePinnedQuoteBreakdown(pin, FIXTURE, [{ sku: "OFL-TBL-001", quantity: 1 }]);
    const activeOnly = computePinnedQuoteBreakdown(
      pinQuotePriceBook("quote-001", advanced, "v2"),
      advanced,
      [{ sku: "OFL-TBL-001", quantity: 1 }],
    );
    expect(pinned.totalMinor).not.toBe(activeOnly.totalMinor);
  });

  it("pins at activation and keeps reproducible total after advance", () => {
    const pinResult = pinQuoteAtBookVersion("quote-002", FIXTURE, "v1");
    expect("quoteId" in pinResult).toBe(true);
    if (!("quoteId" in pinResult)) return;

    const advanced: PriceBookContract = {
      ...FIXTURE,
      activeVersionId: "v2",
      versions: [
        ...FIXTURE.versions,
        {
          versionId: "v2",
          effectiveFrom: "2026-08-01",
          currency: "INR",
          status: "active",
          rules: [
            {
              sku: "OFL-TBL-001",
              unitPriceMinor: 99_000_00,
              currency: "INR",
              uom: "each",
            },
          ],
        },
      ],
    };

    expect(
      reproduciblePinnedTotal(
        pinResult,
        FIXTURE,
        advanced,
        [{ sku: "OFL-TBL-001", quantity: 1 }],
      ),
    ).toBe(true);
  });

  it("marks missing SKU lines unavailable and nulls the quote total", () => {
    const pin = pinQuotePriceBook("quote-003", FIXTURE, "v1");
    const result = computePinnedQuoteBreakdown(pin, FIXTURE, [
      { sku: "OFL-TBL-001", quantity: 1 },
      { sku: "DOES-NOT-EXIST", quantity: 2 },
    ]);
    expect(result.totalMinor).toBeNull();
    expect(result.lines).toHaveLength(2);
    expect(result.lines[1]).toMatchObject({
      sku: "DOES-NOT-EXIST",
      unitPriceMinor: null,
      lineTotalMinor: null,
      unavailable: true,
      adjustmentBps: 0,
    });
    expect(result.lines[0]?.unavailable).toBe(false);
  });

  it("marks non-positive quantity as unavailable even when the rule exists", () => {
    const pin = pinQuotePriceBook("quote-004", FIXTURE, "v1");
    const result = computePinnedQuoteBreakdown(pin, FIXTURE, [
      { sku: "OFL-TBL-001", quantity: 0 },
    ]);
    expect(result.totalMinor).toBeNull();
    expect(result.lines[0]).toMatchObject({
      unitPriceMinor: 12_500_00,
      adjustmentBps: -500,
      lineTotalMinor: null,
      unavailable: true,
    });
  });

  it("defaults adjustmentBps to 0 when the rule omits it", () => {
    const pin = pinQuotePriceBook("quote-005", FIXTURE, "v1");
    const result = computePinnedQuoteBreakdown(pin, FIXTURE, [
      { sku: "OFL-DSK-LIN-1200", quantity: 1 },
    ]);
    expect(result.lines[0]?.adjustmentBps).toBe(0);
    expect(result.lines[0]?.unavailable).toBe(false);
    expect(result.totalMinor).toBe(45_000_000);
  });

  it("pinQuoteAtBookVersion rejects missing and non-pinable statuses", () => {
    expect(pinQuoteAtBookVersion("q", FIXTURE, "missing")).toEqual({
      ok: false,
      error: `Version "missing" not found on book ${FIXTURE.bookId}`,
    });

    const withRetired: PriceBookContract = {
      ...FIXTURE,
      versions: [
        ...FIXTURE.versions,
        {
          versionId: "v-retired",
          effectiveFrom: "2025-01-01",
          currency: "INR",
          status: "retired",
          rules: [],
        },
        {
          versionId: "v-rolled",
          effectiveFrom: "2025-06-01",
          currency: "INR",
          status: "rolled_back",
          rules: [],
        },
        {
          versionId: "v-draft",
          effectiveFrom: "2026-09-01",
          currency: "INR",
          status: "draft",
          rules: [
            {
              sku: "DRAFT-SKU",
              unitPriceMinor: 100,
              currency: "INR",
              uom: "each",
            },
          ],
        },
      ],
    };

    expect(pinQuoteAtBookVersion("q", withRetired, "v-retired")).toEqual({
      ok: false,
      error: 'Version "v-retired" is not pin-able (status retired)',
    });
    expect(pinQuoteAtBookVersion("q", withRetired, "v-rolled")).toEqual({
      ok: false,
      error: 'Version "v-rolled" is not pin-able (status rolled_back)',
    });

    const draftPin = pinQuoteAtBookVersion("q-draft", withRetired, "v-draft");
    expect("quoteId" in draftPin).toBe(true);
    if (!("quoteId" in draftPin)) return;
    expect(draftPin.versionId).toBe("v-draft");
    expect(draftPin.bookId).toBe(withRetired.bookId);
  });

  it("quoteStillValidAgainstBook is false when the pinned version is gone", () => {
    const pin = pinQuotePriceBook("quote-gone", FIXTURE, "v1");
    const stripped: PriceBookContract = {
      ...FIXTURE,
      activeVersionId: null,
      versions: FIXTURE.versions.filter((v) => v.versionId !== "v1"),
    };
    expect(quoteStillValidAgainstBook(pin, stripped)).toBe(false);
  });

  it("reproduciblePinnedTotal is false when pinned rules diverge", () => {
    const pin = pinQuotePriceBook("quote-div", FIXTURE, "v1");
    const mutated: PriceBookContract = {
      ...FIXTURE,
      versions: FIXTURE.versions.map((v) =>
        v.versionId === "v1"
          ? {
              ...v,
              rules: v.rules.map((r) =>
                r.sku === "OFL-TBL-001" ? { ...r, unitPriceMinor: 1 } : r,
              ),
            }
          : v,
      ),
    };
    expect(
      reproduciblePinnedTotal(pin, FIXTURE, mutated, [
        { sku: "OFL-TBL-001", quantity: 1 },
      ]),
    ).toBe(false);
  });
});
