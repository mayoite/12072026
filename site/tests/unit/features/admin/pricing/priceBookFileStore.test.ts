/**
 * File-backed price book store — temp dirs only; never touches product seed.
 */

import { describe, expect, it } from "vitest";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import os from "node:os";

import {
  createPriceBookFileStore,
  ensurePriceBooksDir,
  listPriceBookIds,
  normalizeRules,
  PRICE_BOOKS_DIR_DEFAULT,
  readPriceBookFile,
  seedPriceBookIfMissing,
  writePriceBookFile,
  type PriceBookFileRecord,
} from "@/features/admin/pricing/priceBookFileStore";
import type { PriceBookLineRule } from "@/features/admin/pricing/priceBookContract";

function sampleRecord(
  overrides: Partial<PriceBookFileRecord> = {},
): PriceBookFileRecord {
  return {
    familySlug: "linear-desk-1200",
    bookId: "pb-test-1",
    activeVersionId: null,
    versions: [
      {
        versionId: "v1",
        effectiveFrom: "2026-07-01",
        currency: "INR",
        status: "draft",
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
    ...overrides,
  };
}

function withTempDir<T>(run: (dir: string) => T | Promise<T>): Promise<T> {
  const dir = mkdtempSync(path.join(os.tmpdir(), "pb-file-store-"));
  return Promise.resolve()
    .then(() => run(dir))
    .finally(() => {
      rmSync(dir, { recursive: true, force: true });
    });
}

describe("priceBookFileStore", () => {
  it("PRICE_BOOKS_DIR_DEFAULT lives under features/admin/pricing/data/price-books", () => {
    expect(PRICE_BOOKS_DIR_DEFAULT.replace(/\\/g, "/")).toMatch(
      /features\/admin\/pricing\/data\/price-books$/,
    );
  });

  it("ensurePriceBooksDir creates nested directories and returns the path", async () => {
    await withTempDir((root) => {
      const nested = path.join(root, "a", "b", "price-books");
      expect(existsSync(nested)).toBe(false);
      const result = ensurePriceBooksDir(nested);
      expect(result).toBe(nested);
      expect(existsSync(nested)).toBe(true);
      // idempotent
      expect(ensurePriceBooksDir(nested)).toBe(nested);
    });
  });

  it("writePriceBookFile then readPriceBookFile round-trips", async () => {
    await withTempDir((dir) => {
      const record = sampleRecord({ activeVersionId: "v1" });
      writePriceBookFile(record, dir);
      const file = path.join(dir, `${record.bookId}.json`);
      expect(existsSync(file)).toBe(true);
      const raw = readFileSync(file, "utf8");
      expect(raw.endsWith("\n")).toBe(true);
      const read = readPriceBookFile(record.bookId, dir);
      expect(read).toEqual(record);
    });
  });

  it("readPriceBookFile returns null for missing file", async () => {
    await withTempDir((dir) => {
      expect(readPriceBookFile("does-not-exist", dir)).toBeNull();
    });
  });

  it("readPriceBookFile returns null when bookId does not match file payload", async () => {
    await withTempDir((dir) => {
      const file = path.join(dir, "pb-claimed.json");
      writeFileSync(
        file,
        JSON.stringify(sampleRecord({ bookId: "pb-other" }), null, 2),
        "utf8",
      );
      expect(readPriceBookFile("pb-claimed", dir)).toBeNull();
    });
  });

  it("readPriceBookFile returns null for corrupt JSON", async () => {
    await withTempDir((dir) => {
      writeFileSync(path.join(dir, "pb-bad.json"), "{not-json", "utf8");
      expect(readPriceBookFile("pb-bad", dir)).toBeNull();
    });
  });

  it("listPriceBookIds returns only .json stems and creates dir if missing", async () => {
    await withTempDir((root) => {
      const dir = path.join(root, "books");
      expect(listPriceBookIds(dir)).toEqual([]);
      writePriceBookFile(sampleRecord({ bookId: "pb-a" }), dir);
      writePriceBookFile(sampleRecord({ bookId: "pb-b" }), dir);
      writeFileSync(path.join(dir, "notes.txt"), "ignore", "utf8");
      writeFileSync(path.join(dir, "not-a-book.json.bak"), "{}", "utf8");
      expect(listPriceBookIds(dir).sort()).toEqual(["pb-a", "pb-b"]);
    });
  });

  it("seedPriceBookIfMissing writes once and returns existing thereafter", async () => {
    await withTempDir((dir) => {
      const seed = sampleRecord({ bookId: "pb-seed", familySlug: "seed-family" });
      const first = seedPriceBookIfMissing("pb-seed", seed, dir);
      expect(first).toEqual(seed);
      const secondSeed: PriceBookFileRecord = {
        ...seed,
        familySlug: "should-not-overwrite",
      };
      const second = seedPriceBookIfMissing("pb-seed", secondSeed, dir);
      expect(second.familySlug).toBe("seed-family");
      expect(readPriceBookFile("pb-seed", dir)?.familySlug).toBe("seed-family");
    });
  });

  it("createPriceBookFileStore getBook/saveBook persist via files", async () => {
    await withTempDir(async (dir) => {
      const store = createPriceBookFileStore(dir);
      expect(await store.getBook("pb-1")).toBeNull();

      await store.saveBook(
        {
          familySlug: "linear-desk-1200",
          bookId: "pb-1",
          activeVersionId: null,
        },
        [
          {
            versionId: "v1",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "draft",
            rules: [],
          },
        ],
      );

      const snap = await store.getBook("pb-1");
      expect(snap).not.toBeNull();
      expect(snap?.book.bookId).toBe("pb-1");
      expect(snap?.book.familySlug).toBe("linear-desk-1200");
      expect(snap?.versions).toHaveLength(1);
      expect(snap?.versions[0]?.status).toBe("draft");

      await store.saveBook(
        { ...snap!.book, activeVersionId: "v1" },
        [{ ...snap!.versions[0]!, status: "active" }],
      );
      const updated = await store.getBook("pb-1");
      expect(updated?.book.activeVersionId).toBe("v1");
      expect(updated?.versions[0]?.status).toBe("active");
    });
  });

  it("normalizeRules shallow-copies each rule", () => {
    const rules: PriceBookLineRule[] = [
      {
        sku: "SKU-1",
        unitPriceMinor: 100,
        currency: "INR",
        uom: "each",
        adjustmentBps: -100,
      },
    ];
    const copy = normalizeRules(rules);
    expect(copy).toEqual(rules);
    expect(copy).not.toBe(rules);
    expect(copy[0]).not.toBe(rules[0]);
    copy[0]!.sku = "mutated";
    expect(rules[0]!.sku).toBe("SKU-1");
  });

  it("normalizeRules returns empty array for empty input", () => {
    expect(normalizeRules([])).toEqual([]);
  });

  it("writePriceBookFile overwrites an existing book in place", async () => {
    await withTempDir((dir) => {
      writePriceBookFile(sampleRecord({ bookId: "pb-ow", familySlug: "first" }), dir);
      writePriceBookFile(
        sampleRecord({
          bookId: "pb-ow",
          familySlug: "second",
          activeVersionId: "v1",
        }),
        dir,
      );
      const read = readPriceBookFile("pb-ow", dir);
      expect(read?.familySlug).toBe("second");
      expect(read?.activeVersionId).toBe("v1");
      // no leftover temp files
      const leftovers = readdirSync(dir).filter((e) => e.includes(".tmp-"));
      expect(leftovers).toEqual([]);
    });
  });

  it("createPriceBookFileStore copies versions array on save (no shared ref)", async () => {
    await withTempDir(async (dir) => {
      const store = createPriceBookFileStore(dir);
      const versions = [
        {
          versionId: "v1",
          effectiveFrom: "2026-07-01",
          currency: "INR" as const,
          status: "draft" as const,
          rules: [] as const,
        },
      ];
      await store.saveBook(
        { familySlug: "f", bookId: "pb-ref", activeVersionId: null },
        versions,
      );
      const snap = await store.getBook("pb-ref");
      expect(snap?.versions).toEqual(versions);
      expect(snap?.versions).not.toBe(versions);
    });
  });
});
