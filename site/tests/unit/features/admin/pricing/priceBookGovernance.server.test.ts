import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  appendPriceBookAudit,
  priceBookAuditLogPath,
  readPriceBookAudit,
} from "@/features/admin/pricing/priceBookGovernance.server";
import type { PriceBookAuditEntry } from "@/features/admin/pricing/priceBookGovernance";

describe("priceBookGovernance.server", () => {
  let dir = "";
  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  it("resolves audit path and round-trips entries by bookId", () => {
    dir = mkdtempSync(path.join(os.tmpdir(), "pb-audit-"));
    expect(priceBookAuditLogPath(dir)).toBe(
      path.resolve(dir, "_price-book-audit.jsonl"),
    );
    const entry: PriceBookAuditEntry = {
      id: "audit-1",
      at: "2026-07-01T00:00:00.000Z",
      actorId: "u1",
      role: "approver",
      action: "activate",
      objectType: "price_book_version",
      bookId: "pb-linear",
      versionId: "v1",
      previousVersionId: null,
      newVersionId: "v1",
      reason: "activate",
      result: "success",
      resultDetail: "activated",
    };
    appendPriceBookAudit(entry, dir);
    appendPriceBookAudit({ ...entry, id: "audit-2", bookId: "other" }, dir);
    const rows = readPriceBookAudit("pb-linear", dir);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.action).toBe("activate");
    expect(readPriceBookAudit("missing", dir)).toEqual([]);
  });
});
