/**
 * Server helpers for admin price-book routes.
 */

import fs from "node:fs";
import path from "node:path";

import { emitPriceBookContract } from "./emitPriceBookContract";
import {
  PRICE_BOOKS_DIR_DEFAULT,
  createPriceBookFileStore,
  listPriceBookIds,
  readPriceBookFile,
  seedPriceBookIfMissing,
} from "./priceBookFileStore";
import {
  activatePriceBookVersion,
  approvePriceBookVersion,
  rollbackPriceBookVersion,
  type PriceBookRole,
} from "./priceBookService";

const DEFAULT_BOOK_ID = "pb-linear-2026-q3";

function loadFixtureSeed(): ReturnType<typeof readPriceBookFile> {
  const fixturePath = path.join(
    process.cwd(),
    "features/planner/admin/pricing/fixtures/linear-desk-2026-q3.json",
  );
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as {
    familySlug: string;
    bookId: string;
    activeVersionId: string | null;
    versions: Array<{
      versionId: string;
      effectiveFrom: string;
      currency: string;
      status: string;
      rules: unknown[];
    }>;
  };
  return {
    familySlug: fixture.familySlug,
    bookId: fixture.bookId,
    activeVersionId: null,
    versions: fixture.versions.map((version) => ({
      versionId: version.versionId,
      effectiveFrom: version.effectiveFrom,
      currency: version.currency as "INR",
      status: "draft" as const,
      rules: version.rules as never,
    })),
  };
}

export function getPriceBookStore() {
  return createPriceBookFileStore(PRICE_BOOKS_DIR_DEFAULT);
}

export function ensureDefaultPriceBookSeeded() {
  const seed = loadFixtureSeed();
  if (!seed) return null;
  return seedPriceBookIfMissing(DEFAULT_BOOK_ID, seed);
}

export async function readAdminPriceBook(bookId: string) {
  ensureDefaultPriceBookSeeded();
  const store = getPriceBookStore();
  const snapshot = await store.getBook(bookId);
  if (!snapshot) return null;
  const contract = emitPriceBookContract(snapshot.book, snapshot.versions);
  return { snapshot, contract };
}

export async function runPriceBookAction(
  bookId: string,
  action: "approve" | "activate" | "rollback",
  versionId: string,
  role: PriceBookRole,
) {
  ensureDefaultPriceBookSeeded();
  const store = getPriceBookStore();
  if (action === "approve") return approvePriceBookVersion(store, bookId, versionId, role);
  if (action === "activate") return activatePriceBookVersion(store, bookId, versionId, role);
  return rollbackPriceBookVersion(store, bookId, versionId, role);
}

export function listAdminPriceBooks(): string[] {
  ensureDefaultPriceBookSeeded();
  return listPriceBookIds();
}