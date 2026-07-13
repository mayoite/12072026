/**
 * ADM-PRICE-02/03, ADM-ROLE-01, ADM-AUDIT-01, ADM-PUB-02 — price book governance.
 */

import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  PRICE_BOOK_STATUS_LABEL,
  appendPriceBookAudit,
  buildPriceBookConfirmMessage,
  buildPriceBookReleaseImpactSummary,
  createPriceBookAuditEntry,
  describePriceBookActionAvailability,
  formatPriceBookAuditLine,
  listDistinctVersionStatuses,
  priceBookStatusLabel,
  readPriceBookAudit,
} from "@/features/planner/admin/pricing/priceBookGovernance";
import type { PriceBookContract } from "@/features/planner/admin/pricing/priceBookContract";
import {
  activatePriceBookVersion,
  type PriceBookStore,
} from "@/features/planner/admin/pricing/priceBookService";
import type { PriceBookVersionRow } from "@/features/planner/admin/pricing/emitPriceBookContract";

describe("ADM-PRICE-02 distinct commercial lifecycle states", () => {
  it("labels draft, approved, active, retired, rolled_back distinctly", () => {
    expect(Object.keys(PRICE_BOOK_STATUS_LABEL).sort()).toEqual(
      ["active", "approved", "draft", "retired", "rolled_back"].sort(),
    );
    expect(priceBookStatusLabel("draft")).toMatch(/Draft/i);
    expect(priceBookStatusLabel("approved")).toMatch(/Approved/i);
    expect(priceBookStatusLabel("active")).toMatch(/Active/i);
    expect(priceBookStatusLabel("retired")).toMatch(/Retired/i);
    expect(priceBookStatusLabel("rolled_back")).toMatch(/Rolled back/i);
    const labels = Object.values(PRICE_BOOK_STATUS_LABEL);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe("ADM-ROLE-01 server roles + safe unavailable explanations", () => {
  it("denies activate for author with clear reason", () => {
    const avail = describePriceBookActionAvailability(
      "activate",
      "author",
      "approved",
    );
    expect(avail.allowed).toBe(false);
    expect(avail.reason).toMatch(/approver/i);
    expect(avail.requiredRole).toBe("approver");
  });

  it("service rejects non-approver activate", async () => {
    let book = {
      familySlug: "f",
      bookId: "pb-1",
      activeVersionId: null as string | null,
    };
    let versions: PriceBookVersionRow[] = [
      {
        versionId: "v1",
        effectiveFrom: "2026-07-01",
        currency: "INR",
        status: "approved",
        rules: [],
      },
    ];
    const store: PriceBookStore = {
      async getBook(id) {
        if (id !== "pb-1") return null;
        return { book, versions };
      },
      async saveBook(nextBook, nextVersions) {
        book = nextBook;
        versions = [...nextVersions];
      },
    };
    const denied = await activatePriceBookVersion(store, "pb-1", "v1", "author");
    expect(denied.ok).toBe(false);
    if (denied.ok) return;
    expect(denied.error).toMatch(/Approver role required/i);
  });
});

describe("ADM-PRICE-03 + ADM-PUB-02 confirm impact", () => {
  it("confirm message includes role, reason, version, and impact", () => {
    const text = buildPriceBookConfirmMessage({
      action: "activate",
      role: "approver",
      bookId: "pb-linear-2026-q3",
      familySlug: "linear-desk-1200",
      versionId: "v1",
      versionStatus: "approved",
      currency: "INR",
      effectiveFrom: "2026-07-01",
      activeVersionId: null,
      ruleCount: 2,
      reason: "Q3 rate card go-live",
    });
    expect(text).toMatch(/Role: approver/);
    expect(text).toMatch(/Reason: Q3 rate card go-live/);
    expect(text).toMatch(/Target version: v1/);
    expect(text).toMatch(/Impact:/i);
    expect(text).toMatch(/2 rule/);
  });

  it("release impact summary names book, version, and previous active", () => {
    const summary = buildPriceBookReleaseImpactSummary({
      bookId: "pb-1",
      versionId: "v2",
      currency: "USD",
      effectiveFrom: "2026-08-01",
      ruleCount: 3,
      previousActiveVersionId: "v1",
    });
    expect(summary).toMatch(/pb-1/);
    expect(summary).toMatch(/v2/);
    expect(summary).toMatch(/v1/);
    expect(summary).toMatch(/3 price rule/);
  });
});

describe("ADM-AUDIT-01 history fields", () => {
  it("records actor, action, object, versions, reason, time, result", () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "pb-audit-"));
    try {
      const entry = createPriceBookAuditEntry({
        actorId: "user-42",
        role: "approver",
        action: "activate",
        bookId: "pb-1",
        versionId: "v1",
        previousVersionId: null,
        newVersionId: "v1",
        reason: "go live",
        result: "success",
        resultDetail: "activate ok",
        now: () => new Date("2026-07-13T12:00:00.000Z"),
        idFactory: () => "audit-1",
      });
      expect(entry.at).toBe("2026-07-13T12:00:00.000Z");
      expect(entry.actorId).toBe("user-42");
      expect(entry.action).toBe("activate");
      expect(entry.objectType).toBe("price_book_version");
      expect(entry.bookId).toBe("pb-1");
      expect(entry.versionId).toBe("v1");
      expect(entry.previousVersionId).toBeNull();
      expect(entry.newVersionId).toBe("v1");
      expect(entry.reason).toBe("go live");
      expect(entry.result).toBe("success");
      appendPriceBookAudit(entry, dir);
      const read = readPriceBookAudit("pb-1", dir);
      expect(read).toHaveLength(1);
      expect(formatPriceBookAuditLine(read[0]!)).toMatch(/actor=user-42/);
      expect(formatPriceBookAuditLine(read[0]!)).toMatch(/result=success/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("listDistinctVersionStatuses", () => {
  it("collects statuses present on a contract", () => {
    const contract: PriceBookContract = {
      type: "oando-price-book",
      schemaVersion: 1,
      familySlug: "f",
      bookId: "pb",
      activeVersionId: "v1",
      versions: [
        {
          versionId: "v1",
          effectiveFrom: "2026-07-01",
          currency: "INR",
          status: "active",
          rules: [],
        },
        {
          versionId: "v0",
          effectiveFrom: "2026-01-01",
          currency: "INR",
          status: "rolled_back",
          rules: [],
        },
      ],
    };
    expect(listDistinctVersionStatuses(contract).sort()).toEqual(
      ["active", "rolled_back"].sort(),
    );
  });
});
