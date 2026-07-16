import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { lineTotalMinor, priceForSku } from "@/features/admin/pricing/priceBookContract";
import { emitPriceBookContract } from "@/features/admin/pricing/emitPriceBookContract";

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
      "features/admin/pricing/fixtures/linear-desk-2026-q3.json",
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
    expect(rule, "fixture must price OFL-TBL-001").not.toBeNull();
    if (!rule) throw new Error("expected price rule");
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

  it("returns null for blank familySlug or bookId", () => {
    expect(
      emitPriceBookContract(
        { familySlug: "  ", bookId: "b1", activeVersionId: null },
        [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "draft",
            rules: [],
          },
        ],
      ),
    ).toBeNull();
    expect(
      emitPriceBookContract(
        { familySlug: "f", bookId: "", activeVersionId: null },
        [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "draft",
            rules: [],
          },
        ],
      ),
    ).toBeNull();
  });

  it("returns null when every version is skipped", () => {
    expect(
      emitPriceBookContract(
        { familySlug: "f", bookId: "b1", activeVersionId: null },
        [
          {
            versionId: "  ",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "draft",
            rules: [],
          },
          {
            versionId: "v1",
            effectiveFrom: "",
            currency: "INR",
            status: "draft",
            rules: [],
          },
          {
            versionId: "v2",
            effectiveFrom: "2026-07-01",
            currency: "EUR",
            status: "draft",
            rules: [],
          },
        ],
      ),
    ).toBeNull();
  });

  it("keeps valid rules across uoms and drops bad currency/uom/price rows", () => {
    const contract = emitPriceBookContract(
      { familySlug: "f", bookId: "b1", activeVersionId: "v1" },
      [
        {
          versionId: "v1",
          effectiveFrom: "2026-07-01",
          currency: "USD",
          status: "active",
          rules: [
            {
              sku: "EACH-1",
              unitPriceMinor: 100,
              currency: "USD",
              uom: "each",
            },
            {
              sku: "MM-1",
              unitPriceMinor: 2,
              currency: "USD",
              uom: "mm",
              adjustmentBps: 250,
            },
            {
              sku: "SQM-1",
              unitPriceMinor: 3,
              currency: "USD",
              uom: "sqm",
            },
            {
              sku: "SEAT-1",
              unitPriceMinor: 4,
              currency: "USD",
              uom: "seat",
            },
            {
              sku: "bad-uom",
              unitPriceMinor: 1,
              currency: "USD",
              uom: "kg" as "each",
            },
            {
              sku: "bad-ccy",
              unitPriceMinor: 1,
              currency: "EUR" as "USD",
              uom: "each",
            },
            {
              sku: "neg",
              unitPriceMinor: -1,
              currency: "USD",
              uom: "each",
            },
            {
              sku: "nan",
              unitPriceMinor: Number.NaN,
              currency: "USD",
              uom: "each",
            },
            null as unknown as {
              sku: string;
              unitPriceMinor: number;
              currency: "USD";
              uom: "each";
            },
            {
              sku: "  ",
              unitPriceMinor: 1,
              currency: "USD",
              uom: "each",
            },
            {
              sku: "trimmed-ok",
              unitPriceMinor: 9,
              currency: "USD",
              uom: "each",
              adjustmentBps: Number.NaN,
            },
          ],
        },
      ],
    );
    expect(contract?.versions[0]?.currency).toBe("USD");
    const skus = contract?.versions[0]?.rules.map((r) => r.sku) ?? [];
    expect(skus).toEqual(["EACH-1", "MM-1", "SQM-1", "SEAT-1", "trimmed-ok"]);
    const mm = contract?.versions[0]?.rules.find((r) => r.sku === "MM-1");
    expect(mm?.adjustmentBps).toBe(250);
    const trimmed = contract?.versions[0]?.rules.find(
      (r) => r.sku === "trimmed-ok",
    );
    expect(trimmed).not.toHaveProperty("adjustmentBps");
  });

  it("skips versions with invalid currency while keeping valid siblings", () => {
    const contract = emitPriceBookContract(
      { familySlug: "f", bookId: "b1", activeVersionId: "v-good" },
      [
        {
          versionId: "v-bad-ccy",
          effectiveFrom: "2026-01-01",
          currency: "GBP",
          status: "retired",
          rules: [
            {
              sku: "X",
              unitPriceMinor: 1,
              currency: "INR",
              uom: "each",
            },
          ],
        },
        {
          versionId: "v-good",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "active",
          rules: [
            {
              sku: "Y",
              unitPriceMinor: 0,
              currency: "INR",
              uom: "each",
            },
          ],
        },
      ],
    );
    expect(contract?.versions).toHaveLength(1);
    expect(contract?.versions[0]?.versionId).toBe("v-good");
    expect(contract?.versions[0]?.rules[0]?.unitPriceMinor).toBe(0);
  });
});
