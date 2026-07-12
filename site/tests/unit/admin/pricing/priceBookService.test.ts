import { describe, expect, it } from "vitest";

import {
  activatePriceBookVersion,
  rollbackPriceBookVersion,
  type PriceBookStore,
} from "@/features/planner/admin/pricing/priceBookService";
import type { PriceBookVersionRow } from "@/features/planner/admin/pricing/emitPriceBookContract";

function memoryStore(seed: {
  bookId: string;
  versions: PriceBookVersionRow[];
}): PriceBookStore {
  let book = {
    familySlug: "linear-desk-1200",
    bookId: seed.bookId,
    activeVersionId: null as string | null,
  };
  let versions = [...seed.versions];
  return {
    async getBook(bookId) {
      if (bookId !== seed.bookId) return null;
      return { book, versions };
    },
    async saveBook(nextBook, nextVersions) {
      book = nextBook;
      versions = [...nextVersions];
    },
  };
}

describe("priceBookService", () => {
  it("requires approver role to activate", async () => {
    const store = memoryStore({
      bookId: "pb-1",
      versions: [
        {
          versionId: "v1",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "approved",
          rules: [],
        },
      ],
    });
    const denied = await activatePriceBookVersion(store, "pb-1", "v1", "author");
    expect(denied.ok).toBe(false);
  });

  it("activates an approved version and emits contract", async () => {
    const store = memoryStore({
      bookId: "pb-1",
      versions: [
        {
          versionId: "v1",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "approved",
          rules: [
            {
              sku: "OFL-TBL-001",
              unitPriceMinor: 1_000_00,
              currency: "INR",
              uom: "each",
            },
          ],
        },
      ],
    });
    const result = await activatePriceBookVersion(store, "pb-1", "v1", "approver");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.contract.activeVersionId).toBe("v1");
  });

  it("rolls back active version without deleting history", async () => {
    const store = memoryStore({
      bookId: "pb-1",
      versions: [
        {
          versionId: "v1",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "active",
          rules: [],
        },
        {
          versionId: "v2",
          effectiveFrom: "2026-08-01",
          currency: "INR",
          status: "approved",
          rules: [],
        },
      ],
    });
    const result = await rollbackPriceBookVersion(store, "pb-1", "v1", "approver");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.contract.versions).toHaveLength(2);
    expect(result.contract.versions.find((v) => v.versionId === "v1")?.status).toBe("rolled_back");
  });
});