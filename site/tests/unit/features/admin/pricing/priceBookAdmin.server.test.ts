/**
 * Admin price-book server helpers — injectable temp dirs only.
 */

import { describe, expect, it } from "vitest";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  DEFAULT_PRICE_BOOK_ID,
  ensureDefaultPriceBookSeeded,
  getPriceBookStore,
  listAdminPriceBooks,
  readAdminPriceBook,
  readAdminPriceBookAudit,
  resetDefaultPriceBookSeed,
  runPriceBookAction,
} from "@/features/admin/pricing/priceBookAdmin.server";
import {
  priceBookAuditLogPath,
  readPriceBookAudit,
} from "@/features/admin/pricing/priceBookGovernance.server";
import {
  readPriceBookFile,
  writePriceBookFile,
  type PriceBookFileRecord,
} from "@/features/admin/pricing/priceBookFileStore";

function withTempDir<T>(run: (dir: string) => T | Promise<T>): Promise<T> {
  const dir = mkdtempSync(path.join(os.tmpdir(), "pb-admin-server-"));
  return Promise.resolve()
    .then(() => run(dir))
    .finally(() => {
      rmSync(dir, { recursive: true, force: true });
    });
}

describe("priceBookAdmin.server", () => {
  it("ensureDefaultPriceBookSeeded loads fixture as draft and does not overwrite", async () => {
    await withTempDir((dir) => {
      const first = ensureDefaultPriceBookSeeded(dir);
      expect(first).not.toBeNull();
      expect(first?.bookId).toBe(DEFAULT_PRICE_BOOK_ID);
      expect(first?.activeVersionId).toBeNull();
      expect(first?.versions.every((v) => v.status === "draft")).toBe(true);
      expect(first?.familySlug).toBe("linear-desk-1200");
      expect(first?.versions[0]?.rules.length).toBeGreaterThan(0);

      writePriceBookFile(
        {
          ...first!,
          familySlug: "custom-after-seed",
        },
        dir,
      );
      const second = ensureDefaultPriceBookSeeded(dir);
      expect(second?.familySlug).toBe("custom-after-seed");
    });
  });

  it("resetDefaultPriceBookSeed force-writes draft seed", async () => {
    await withTempDir((dir) => {
      ensureDefaultPriceBookSeeded(dir);
      writePriceBookFile(
        {
          familySlug: "mutated",
          bookId: DEFAULT_PRICE_BOOK_ID,
          activeVersionId: "v1",
          versions: [
            {
              versionId: "v1",
              effectiveFrom: "2026-07-01",
              currency: "INR",
              status: "active",
              rules: [],
            },
          ],
        },
        dir,
      );
      const reset = resetDefaultPriceBookSeed(dir);
      expect(reset?.activeVersionId).toBeNull();
      expect(reset?.versions[0]?.status).toBe("draft");
      expect(readPriceBookFile(DEFAULT_PRICE_BOOK_ID, dir)?.familySlug).toBe(
        "linear-desk-1200",
      );
    });
  });

  it("getPriceBookStore reads books from the injected dir", async () => {
    await withTempDir(async (dir) => {
      ensureDefaultPriceBookSeeded(dir);
      const store = getPriceBookStore(dir);
      const snap = await store.getBook(DEFAULT_PRICE_BOOK_ID);
      expect(snap?.book.bookId).toBe(DEFAULT_PRICE_BOOK_ID);
      expect(await store.getBook("missing")).toBeNull();
    });
  });

  it("readAdminPriceBook returns snapshot + contract for seeded book", async () => {
    await withTempDir(async (dir) => {
      const result = await readAdminPriceBook(DEFAULT_PRICE_BOOK_ID, dir);
      expect(result).not.toBeNull();
      expect(result?.snapshot.book.bookId).toBe(DEFAULT_PRICE_BOOK_ID);
      expect(result?.contract?.type).toBe("oando-price-book");
      expect(result?.contract?.familySlug).toBe("linear-desk-1200");
    });
  });

  it("readAdminPriceBook returns null for unknown book id after seed", async () => {
    await withTempDir(async (dir) => {
      ensureDefaultPriceBookSeeded(dir);
      expect(await readAdminPriceBook("pb-unknown", dir)).toBeNull();
    });
  });

  it("listAdminPriceBooks seeds default and lists ids", async () => {
    await withTempDir((dir) => {
      const ids = listAdminPriceBooks(dir);
      expect(ids).toContain(DEFAULT_PRICE_BOOK_ID);
    });
  });

  it("runPriceBookAction approve → activate → rollback with audit trail", async () => {
    await withTempDir(async (dir) => {
      const seeded = ensureDefaultPriceBookSeeded(dir);
      const versionId = seeded!.versions[0]!.versionId;

      const denied = await runPriceBookAction(
        DEFAULT_PRICE_BOOK_ID,
        "approve",
        versionId,
        "viewer",
        { actorId: "u-viewer", reason: "peek", dir },
      );
      expect(denied.ok).toBe(false);

      const approved = await runPriceBookAction(
        DEFAULT_PRICE_BOOK_ID,
        "approve",
        versionId,
        "author",
        { actorId: "u-author", reason: "ready for review", dir },
      );
      expect(approved.ok).toBe(true);
      if (!approved.ok) throw new Error("expected approved.ok");
      expect(approved.action).toBe("approve");

      const activated = await runPriceBookAction(
        DEFAULT_PRICE_BOOK_ID,
        "activate",
        versionId,
        "approver",
        { actorId: "u-appr", reason: "go live", dir },
      );
      expect(activated.ok).toBe(true);
      if (!activated.ok) throw new Error("expected activated.ok");
      expect(activated.newActiveVersionId).toBe(versionId);

      const rolled = await runPriceBookAction(
        DEFAULT_PRICE_BOOK_ID,
        "rollback",
        versionId,
        "approver",
        { actorId: "u-appr", reason: "revert rates", dir },
      );
      expect(rolled.ok).toBe(true);
      if (!rolled.ok) throw new Error("expected rolled.ok");
      expect(rolled.action).toBe("rollback");

      const audit = readAdminPriceBookAudit(DEFAULT_PRICE_BOOK_ID, 40, dir);
      expect(audit.length).toBeGreaterThanOrEqual(4);
      expect(audit.some((e) => e.action === "deny" && e.result === "failure")).toBe(
        true,
      );
      expect(audit.some((e) => e.action === "approve" && e.result === "success")).toBe(
        true,
      );
      expect(audit.some((e) => e.action === "activate" && e.result === "success")).toBe(
        true,
      );
      expect(audit.some((e) => e.action === "rollback" && e.result === "success")).toBe(
        true,
      );
      expect(audit.every((e) => e.bookId === DEFAULT_PRICE_BOOK_ID)).toBe(true);
      expect(existsSync(priceBookAuditLogPath(dir))).toBe(true);
    });
  });

  it("runPriceBookAction defaults actor to unknown and reason to empty → (none)", async () => {
    await withTempDir(async (dir) => {
      ensureDefaultPriceBookSeeded(dir);
      await runPriceBookAction(
        DEFAULT_PRICE_BOOK_ID,
        "approve",
        "no-such-version",
        "author",
        { dir },
      );
      const audit = readPriceBookAudit(DEFAULT_PRICE_BOOK_ID, dir);
      expect(audit[0]?.actorId).toBe("unknown");
      expect(audit[0]?.reason).toBe("(none)");
      expect(audit[0]?.action).toBe("deny");
      expect(audit[0]?.result).toBe("failure");
    });
  });

  it("runPriceBookAction still returns commercial result if audit append fails", async () => {
    await withTempDir(async (dir) => {
      // Make audit path a directory so appendFileSync throws
      ensureDefaultPriceBookSeeded(dir);
      mkdirSync(priceBookAuditLogPath(dir), { recursive: true });

      const seeded = readPriceBookFile(DEFAULT_PRICE_BOOK_ID, dir);
      const versionId = seeded!.versions[0]!.versionId;
      const result = await runPriceBookAction(
        DEFAULT_PRICE_BOOK_ID,
        "approve",
        versionId,
        "author",
        { actorId: "u1", reason: "still works", dir },
      );
      expect(result.ok).toBe(true);
    });
  });

  it("readAdminPriceBookAudit respects limit after seed", async () => {
    await withTempDir(async (dir) => {
      ensureDefaultPriceBookSeeded(dir);
      const versionId = "v1";
      for (let i = 0; i < 5; i++) {
        await runPriceBookAction(
          DEFAULT_PRICE_BOOK_ID,
          "approve",
          versionId,
          "viewer",
          { actorId: `u-${i}`, reason: `attempt ${i}`, dir },
        );
      }
      const limited = readAdminPriceBookAudit(DEFAULT_PRICE_BOOK_ID, 2, dir);
      expect(limited).toHaveLength(2);
    });
  });

  it("activate demotes prior active when multiple versions exist", async () => {
    await withTempDir(async (dir) => {
      const record: PriceBookFileRecord = {
        familySlug: "linear-desk-1200",
        bookId: DEFAULT_PRICE_BOOK_ID,
        activeVersionId: "v1",
        versions: [
          {
            versionId: "v1",
            effectiveFrom: "2026-01-01",
            currency: "INR",
            status: "active",
            rules: [
              {
                sku: "OFL-TBL-001",
                unitPriceMinor: 100,
                currency: "INR",
                uom: "each",
              },
            ],
          },
          {
            versionId: "v2",
            effectiveFrom: "2026-07-01",
            currency: "INR",
            status: "approved",
            rules: [
              {
                sku: "OFL-TBL-001",
                unitPriceMinor: 200,
                currency: "INR",
                uom: "each",
              },
            ],
          },
        ],
      };
      writePriceBookFile(record, dir);

      const result = await runPriceBookAction(
        DEFAULT_PRICE_BOOK_ID,
        "activate",
        "v2",
        "approver",
        { actorId: "ops", reason: "Q3", dir },
      );
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected result.ok");
      expect(result.previousActiveVersionId).toBe("v1");
      expect(result.newActiveVersionId).toBe("v2");
      const after = readPriceBookFile(DEFAULT_PRICE_BOOK_ID, dir);
      expect(after?.versions.find((v) => v.versionId === "v1")?.status).toBe(
        "approved",
      );
      expect(after?.versions.find((v) => v.versionId === "v2")?.status).toBe(
        "active",
      );
    });
  });
});
