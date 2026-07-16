import { beforeEach, describe, expect, it, vi } from "vitest";

const selectMock = vi.fn();
const insertMock = vi.fn();
const updateMock = vi.fn();
const deleteMock = vi.fn();
const isPlannerDatabaseUrlConfigured = vi.fn();

vi.mock("server-only", () => ({}));

vi.mock("@/platform/drizzle/adminDb", () => ({
  adminDb: {
    select: (...args: unknown[]) => selectMock(...args),
    insert: (...args: unknown[]) => insertMock(...args),
    update: (...args: unknown[]) => updateMock(...args),
    delete: (...args: unknown[]) => deleteMock(...args),
  },
}));

vi.mock("@/platform/drizzle/schema/planner", () => ({
  priceBooks: {
    bookId: "bookId",
    id: "id",
    familySlug: "familySlug",
    activeVersionId: "activeVersionId",
  },
  priceBookVersions: {
    bookRowId: "bookRowId",
    versionId: "versionId",
    effectiveFrom: "effectiveFrom",
    currency: "currency",
    status: "status",
    rules: "rules",
  },
}));

vi.mock("@/platform/drizzle/databaseUrls", () => ({
  isPlannerDatabaseUrlConfigured: () => isPlannerDatabaseUrlConfigured(),
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a: unknown, b: unknown) => ({ a, b })),
}));

describe("priceBookDrizzleStore.server", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isPlannerDatabaseUrlConfigured.mockReturnValue(false);
  });

  it("tryCreatePriceBookDrizzleStore returns null when Auth DB URL unset", async () => {
    const { tryCreatePriceBookDrizzleStore } = await import(
      "@/features/admin/pricing/priceBookDrizzleStore.server"
    );
    expect(tryCreatePriceBookDrizzleStore()).toBeNull();
  });

  it("tryCreatePriceBookDrizzleStore returns store when configured", async () => {
    isPlannerDatabaseUrlConfigured.mockReturnValue(true);
    const { tryCreatePriceBookDrizzleStore } = await import(
      "@/features/admin/pricing/priceBookDrizzleStore.server"
    );
    const store = tryCreatePriceBookDrizzleStore();
    expect(store).not.toBeNull();
    expect(typeof store?.getBook).toBe("function");
    expect(typeof store?.saveBook).toBe("function");
  });

  it("getBook returns null when book missing", async () => {
    selectMock.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => []),
        })),
      })),
    });
    const { createPriceBookDrizzleStore } = await import(
      "@/features/admin/pricing/priceBookDrizzleStore.server"
    );
    const store = createPriceBookDrizzleStore();
    await expect(store.getBook("missing")).resolves.toBeNull();
  });

  it("getBook maps book + versions including unknown status and non-array rules", async () => {
    let call = 0;
    selectMock.mockImplementation(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => {
          call += 1;
          if (call === 1) {
            return {
              limit: vi.fn(async () => [
                {
                  id: "row-1",
                  familySlug: "linear-desk",
                  bookId: "pb-1",
                  activeVersionId: "v1",
                },
              ]),
            };
          }
          return Promise.resolve([
            {
              versionId: "v1",
              effectiveFrom: "2026-07-01",
              currency: "INR",
              status: "active",
              rules: [{ sku: "A", unitPrice: 1 }],
            },
            {
              versionId: "v2",
              effectiveFrom: "2026-08-01",
              currency: "INR",
              status: "weird-status",
              rules: null,
            },
            {
              versionId: "v3",
              effectiveFrom: 20260701,
              currency: "USD",
              status: "superseded",
              rules: [],
            },
          ]);
        }),
      })),
    }));

    const { createPriceBookDrizzleStore } = await import(
      "@/features/admin/pricing/priceBookDrizzleStore.server"
    );
    const store = createPriceBookDrizzleStore();
    const result = await store.getBook("pb-1");
    expect(result?.book.bookId).toBe("pb-1");
    expect(result?.book.familySlug).toBe("linear-desk");
    expect(result?.versions).toHaveLength(3);
    expect(result?.versions[0]?.status).toBe("active");
    expect(result?.versions[1]?.status).toBe("draft"); // unknown -> draft
    expect(result?.versions[1]?.rules).toEqual([]);
    expect(result?.versions[2]?.status).toBe("rolled_back");
    expect(String(result?.versions[2]?.effectiveFrom)).toBe("20260701");
  });

  it("saveBook inserts a new book and versions", async () => {
    selectMock.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => []),
        })),
      })),
    });
    insertMock.mockImplementation(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(async () => [{ id: "new-row" }]),
      })),
    }));

    const { createPriceBookDrizzleStore } = await import(
      "@/features/admin/pricing/priceBookDrizzleStore.server"
    );
    const store = createPriceBookDrizzleStore();
    await store.saveBook(
      { familySlug: "f", bookId: "pb-new", activeVersionId: null },
      [
        {
          versionId: "v1",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "draft",
          rules: [{ sku: "X", unitPrice: 9 }],
        },
      ],
    );

    expect(insertMock).toHaveBeenCalled();
  });

  it("saveBook updates existing book, replaces versions, and no-ops empty versions", async () => {
    selectMock.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => [
            {
              id: "existing-row",
              familySlug: "old",
              bookId: "pb-1",
              activeVersionId: null,
            },
          ]),
        })),
      })),
    });
    updateMock.mockReturnValue({
      set: vi.fn(() => ({
        where: vi.fn(async () => undefined),
      })),
    });
    deleteMock.mockReturnValue({
      where: vi.fn(async () => undefined),
    });
    insertMock.mockReturnValue({
      values: vi.fn(async () => undefined),
    });

    const { createPriceBookDrizzleStore } = await import(
      "@/features/admin/pricing/priceBookDrizzleStore.server"
    );
    const store = createPriceBookDrizzleStore();

    await store.saveBook(
      { familySlug: "f2", bookId: "pb-1", activeVersionId: "v2" },
      [],
    );
    expect(updateMock).toHaveBeenCalled();
    expect(deleteMock).toHaveBeenCalled();
    // empty versions short-circuit before version insert
    expect(insertMock).not.toHaveBeenCalled();

    await store.saveBook(
      { familySlug: "f2", bookId: "pb-1", activeVersionId: "v2" },
      [
        {
          versionId: "v2",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "approved",
          rules: [],
        },
      ],
    );
    expect(insertMock).toHaveBeenCalled();
  });
});
