import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { lineTotalMinor, priceForSku } from "@/features/planner/admin/pricing/priceBookContract";
import { emitPriceBookContract } from "@/features/planner/admin/pricing/emitPriceBookContract";

describe("emitPriceBookContract", () => {
  it("projects DB rows to the documented contract", () => {
    const contract = emitPriceBookContract(
      {
        familySlug: "linear-desk-1200",
        bookId: "pb-linear-2026-q3",
        activeVersionId: "v1",
      },
      [
        {
          versionId: "v1",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "active",
          rules: [
            {
              sku: "OFL-DSK-LIN-1200",
              unitPriceMinor: 45_000_00,
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
      ],
    );
    expect(contract?.type).toBe("oando-price-book");
    expect(contract?.versions).toHaveLength(1);
    expect(priceForSku(contract!, "v1", "OFL-TBL-001")?.unitPriceMinor).toBe(12_500_00);
  });

  it("fixture JSON matches emit and Buyer P04 can total a line", () => {
    const fixturePath = path.join(
      process.cwd(),
      "features/planner/admin/pricing/fixtures/linear-desk-2026-q3.json",
    );
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
    const emitted = emitPriceBookContract(
      {
        familySlug: fixture.familySlug,
        bookId: fixture.bookId,
        activeVersionId: fixture.activeVersionId,
      },
      fixture.versions,
    );
    expect(emitted).toEqual(fixture);
    const rule = priceForSku(fixture, "v1", "OFL-TBL-001");
    expect(rule).not.toBeNull();
    if (!rule) return;
    expect(lineTotalMinor(rule, 2)).toBe(Math.round(12_500_00 * 2 * (1 - 500 / 10_000)));
  });

  it("drops invalid rules instead of emitting silent zero", () => {
    const contract = emitPriceBookContract(
      { familySlug: "x", bookId: "b1", activeVersionId: null },
      [
        {
          versionId: "v1",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "draft",
          rules: [{ sku: "", unitPriceMinor: 0, currency: "INR", uom: "each" }],
        },
      ],
    );
    expect(contract?.versions[0]?.rules).toHaveLength(0);
  });
});