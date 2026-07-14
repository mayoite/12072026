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
});