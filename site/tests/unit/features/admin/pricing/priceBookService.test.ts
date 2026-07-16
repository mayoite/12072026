import { describe, expect, it } from "vitest";

import {
  activatePriceBookVersion,
  approvePriceBookVersion,
  rollbackPriceBookVersion,
  type PriceBookStore,
} from "@/features/admin/pricing/priceBookService";
import type {
  PriceBookRow,
  PriceBookVersionRow,
} from "@/features/admin/pricing/emitPriceBookContract";

function memoryStore(seed: {
  bookId: string;
  familySlug?: string;
  activeVersionId?: string | null;
  versions: PriceBookVersionRow[];
}): PriceBookStore & {
  getState: () => { book: PriceBookRow; versions: PriceBookVersionRow[] };
} {
  let book: PriceBookRow = {
    familySlug: seed.familySlug ?? "linear-desk-1200",
    bookId: seed.bookId,
    activeVersionId: seed.activeVersionId ?? null,
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
    getState() {
      return { book, versions };
    },
  };
}

const rule = {
  sku: "OFL-TBL-001",
  unitPriceMinor: 1_000_00,
  currency: "INR" as const,
  uom: "each" as const,
};

describe("priceBookService", () => {
  describe("activatePriceBookVersion", () => {
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
      if (denied.ok) return;
      expect(denied.error).toMatch(/Approver role required/i);
      expect(denied.previousActiveVersionId).toBeNull();

      const viewerDenied = await activatePriceBookVersion(
        store,
        "pb-1",
        "v1",
        "viewer",
      );
      expect(viewerDenied.ok).toBe(false);
      if (viewerDenied.ok) return;
      expect(viewerDenied.error).toMatch(/Approver role required/i);
    });

    it("rejects missing book", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        versions: [],
      });
      const result = await activatePriceBookVersion(store, "missing", "v1", "approver");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/not found/i);
    });

    it("rejects missing version", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        activeVersionId: "v0",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "approved",
            rules: [rule],
          },
        ],
      });
      const result = await activatePriceBookVersion(store, "pb-1", "v9", "approver");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/Version "v9" not found/);
      expect(result.previousActiveVersionId).toBe("v0");
    });

    it("rejects activation from retired status", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "retired",
            rules: [rule],
          },
        ],
      });
      const result = await activatePriceBookVersion(store, "pb-1", "v1", "approver");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/cannot be activated from status retired/);
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
            rules: [rule],
          },
        ],
      });
      const result = await activatePriceBookVersion(store, "pb-1", "v1", "approver");
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected result.ok");
      expect(result.contract.activeVersionId).toBe("v1");
      expect(result.newActiveVersionId).toBe("v1");
      expect(result.previousActiveVersionId).toBeNull();
    });

    it("activates from draft and demotes previous active to approved", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        activeVersionId: "v1",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-01-01",
            currency: "INR",
            status: "active",
            rules: [rule],
          },
          {
            versionId: "v2",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "draft",
            rules: [rule],
          },
        ],
      });
      const result = await activatePriceBookVersion(store, "pb-1", "v2", "approver");
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected result.ok");
      expect(result.previousActiveVersionId).toBe("v1");
      expect(result.newActiveVersionId).toBe("v2");
      const state = store.getState();
      expect(state.versions.find((v) => v.versionId === "v1")?.status).toBe("approved");
      expect(state.versions.find((v) => v.versionId === "v2")?.status).toBe("active");
    });

    it("returns save error when store.saveBook throws Error", async () => {
      const store: PriceBookStore = {
        async getBook() {
          return {
            book: {
              familySlug: "f",
              bookId: "pb-1",
              activeVersionId: null,
            },
            versions: [
              {
                versionId: "v1",
                effectiveFrom: "2026-07-01",
                currency: "INR",
                status: "approved",
                rules: [rule],
              },
            ],
          };
        },
        async saveBook() {
          throw new Error("disk full");
        },
      };
      const result = await activatePriceBookVersion(store, "pb-1", "v1", "approver");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toBe("disk full");
    });

    it("stringifies non-Error save failures", async () => {
      const store: PriceBookStore = {
        async getBook() {
          return {
            book: {
              familySlug: "f",
              bookId: "pb-1",
              activeVersionId: null,
            },
            versions: [
              {
                versionId: "v1",
                effectiveFrom: "2026-07-01",
                currency: "INR",
                status: "approved",
                rules: [rule],
              },
            ],
          };
        },
        async saveBook() {
          throw "boom";
        },
      };
      const result = await activatePriceBookVersion(store, "pb-1", "v1", "approver");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toBe("boom");
    });

    it("fails contract emission when familySlug is empty", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        familySlug: "   ",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "approved",
            rules: [rule],
          },
        ],
      });
      const result = await activatePriceBookVersion(store, "pb-1", "v1", "approver");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/contract emission/i);
    });

    it("aborts and restores when post-save verification loses history", async () => {
      let book: PriceBookRow = {
        familySlug: "linear-desk-1200",
        bookId: "pb-1",
        activeVersionId: null,
      };
      let versions: PriceBookVersionRow[] = [
        {
          versionId: "v1",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "approved",
          rules: [rule],
        },
        {
          versionId: "v0",
          effectiveFrom: "2026-01-01",
          currency: "INR",
          status: "retired",
          rules: [rule],
        },
      ];
      let saveCount = 0;
      const store: PriceBookStore = {
        async getBook(bookId) {
          if (bookId !== "pb-1") return null;
          // After first save, pretend history shrank
          if (saveCount >= 1) {
            return { book, versions: versions.slice(0, 1) };
          }
          return { book, versions };
        },
        async saveBook(nextBook, nextVersions) {
          saveCount += 1;
          book = nextBook;
          versions = [...nextVersions];
        },
      };
      const result = await activatePriceBookVersion(store, "pb-1", "v1", "approver");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/history would have been lost/i);
      // restore called — original snapshot written back
      expect(saveCount).toBe(2);
      expect(book.activeVersionId).toBeNull();
      expect(versions).toHaveLength(2);
    });
  });

  describe("approvePriceBookVersion", () => {
    it("denies viewer", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "draft",
            rules: [rule],
          },
        ],
      });
      const result = await approvePriceBookVersion(store, "pb-1", "v1", "viewer");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/Viewer cannot approve/i);
    });

    it("rejects missing book", async () => {
      const store = memoryStore({ bookId: "pb-1", versions: [] });
      const result = await approvePriceBookVersion(store, "other", "v1", "author");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/not found/i);
    });

    it("rejects missing version", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        activeVersionId: "vx",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "draft",
            rules: [rule],
          },
        ],
      });
      const result = await approvePriceBookVersion(store, "pb-1", "v9", "author");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/Version "v9" not found/);
      expect(result.previousActiveVersionId).toBe("vx");
    });

    it("rejects non-draft status", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "approved",
            rules: [rule],
          },
        ],
      });
      const result = await approvePriceBookVersion(store, "pb-1", "v1", "approver");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/Only draft versions can be approved/);
    });

    it("approves draft and keeps active version id unchanged", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        activeVersionId: "v-live",
        versions: [
          {
            versionId: "v-live",
            effectiveFrom: "2026-01-01",
            currency: "INR",
            status: "active",
            rules: [rule],
          },
          {
            versionId: "v-new",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "draft",
            rules: [rule],
          },
        ],
      });
      const result = await approvePriceBookVersion(store, "pb-1", "v-new", "author");
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected result.ok");
      expect(result.action).toBe("approve");
      expect(result.newActiveVersionId).toBe("v-live");
      expect(result.previousActiveVersionId).toBe("v-live");
      expect(store.getState().versions.find((v) => v.versionId === "v-new")?.status).toBe(
        "approved",
      );
    });

    it("fails when contract cannot emit after approve", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        familySlug: "",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "draft",
            rules: [rule],
          },
        ],
      });
      const result = await approvePriceBookVersion(store, "pb-1", "v1", "author");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/Approve failed contract emission/);
    });
  });

  describe("rollbackPriceBookVersion", () => {
    it("requires approver role", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "active",
            rules: [rule],
          },
        ],
      });
      const denied = await rollbackPriceBookVersion(store, "pb-1", "v1", "author");
      expect(denied.ok).toBe(false);
      if (denied.ok) return;
      expect(denied.error).toMatch(/Approver role required/i);
    });

    it("rejects missing book", async () => {
      const store = memoryStore({ bookId: "pb-1", versions: [] });
      const result = await rollbackPriceBookVersion(store, "nope", "v1", "approver");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/not found/i);
    });

    it("rejects missing version", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        activeVersionId: "v1",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "active",
            rules: [rule],
          },
        ],
      });
      const result = await rollbackPriceBookVersion(store, "pb-1", "v9", "approver");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/Version "v9" not found/);
      expect(result.previousActiveVersionId).toBe("v1");
    });

    it("rolls back active version without deleting history", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        activeVersionId: "v1",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "active",
            rules: [rule],
          },
          {
            versionId: "v2",
            effectiveFrom: "2026-08-01",
            currency: "INR",
            status: "approved",
            rules: [rule],
          },
        ],
      });
      const result = await rollbackPriceBookVersion(store, "pb-1", "v1", "approver");
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected result.ok");
      expect(result.contract.versions).toHaveLength(2);
      expect(result.contract.versions.find((v) => v.versionId === "v1")?.status).toBe(
        "rolled_back",
      );
      // fallback active: last approved in reverse order → v2
      expect(result.newActiveVersionId).toBe("v2");
    });

    it("sets activeVersionId null when no approved fallback remains", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        activeVersionId: "v1",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "active",
            rules: [rule],
          },
        ],
      });
      const result = await rollbackPriceBookVersion(store, "pb-1", "v1", "approver");
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected result.ok");
      expect(result.newActiveVersionId).toBeNull();
      expect(store.getState().book.activeVersionId).toBeNull();
    });

    it("fails when contract cannot emit after rollback", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        familySlug: "  ",
        activeVersionId: "v1",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "active",
            rules: [rule],
          },
        ],
      });
      const result = await rollbackPriceBookVersion(store, "pb-1", "v1", "approver");
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatch(/Rollback failed contract emission/);
    });

    it("rolling back a non-active version marks it rolled_back and demotes live active", async () => {
      // Implementation marks the target rolled_back and any active → approved.
      const store = memoryStore({
        bookId: "pb-1",
        activeVersionId: "v-live",
        versions: [
          {
            versionId: "v-live",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "active",
            rules: [rule],
          },
          {
            versionId: "v-old",
            effectiveFrom: "2026-01-01",
            currency: "INR",
            status: "approved",
            rules: [rule],
          },
        ],
      });
      const result = await rollbackPriceBookVersion(
        store,
        "pb-1",
        "v-old",
        "approver",
      );
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected result.ok");
      const state = store.getState();
      expect(state.versions.find((v) => v.versionId === "v-old")?.status).toBe(
        "rolled_back",
      );
      expect(state.versions.find((v) => v.versionId === "v-live")?.status).toBe(
        "approved",
      );
      // reverse-find first approved → v-live remains available as fallback
      expect(result.newActiveVersionId).toBe("v-live");
      expect(result.previousActiveVersionId).toBe("v-live");
    });
  });

  describe("approve allows author and approver", () => {
    it("approves draft as approver", async () => {
      const store = memoryStore({
        bookId: "pb-1",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "draft",
            rules: [rule],
          },
        ],
      });
      const result = await approvePriceBookVersion(store, "pb-1", "v1", "approver");
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected result.ok");
      expect(result.action).toBe("approve");
      expect(store.getState().versions[0]?.status).toBe("approved");
    });
  });
});
