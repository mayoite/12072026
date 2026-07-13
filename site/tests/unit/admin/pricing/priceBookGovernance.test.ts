/**
 * ADM-PRICE-02/03, ADM-ROLE-01, ADM-AUDIT-01, ADM-PUB-02 — price book governance.
 */

import { describe, expect, it } from "vitest";
import { appendFileSync, mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  PRICE_BOOK_STATUS_LABEL,
  buildPriceBookConfirmMessage,
  buildPriceBookReleaseImpactSummary,
  createPriceBookAuditEntry,
  describePriceBookActionAvailability,
  formatPriceBookAuditLine,
  listDistinctVersionStatuses,
  priceBookStatusLabel,
} from "@/features/planner/admin/pricing/priceBookGovernance";
import {
  appendPriceBookAudit,
  priceBookAuditLogPath,
  readPriceBookAudit,
} from "@/features/planner/admin/pricing/priceBookGovernance.server";
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

  it("allows activate for approver on draft or approved", () => {
    expect(
      describePriceBookActionAvailability("activate", "approver", "approved").allowed,
    ).toBe(true);
    expect(
      describePriceBookActionAvailability("activate", "approver", "draft").allowed,
    ).toBe(true);
  });

  it("denies activate from retired status", () => {
    const avail = describePriceBookActionAvailability(
      "activate",
      "approver",
      "retired",
    );
    expect(avail.allowed).toBe(false);
    expect(avail.reason).toMatch(/cannot be activated/i);
  });

  it("denies approve for viewer and non-draft", () => {
    const viewer = describePriceBookActionAvailability("approve", "viewer", "draft");
    expect(viewer.allowed).toBe(false);
    expect(viewer.reason).toMatch(/viewer/i);
    expect(viewer.requiredRole).toBe("author");

    const notDraft = describePriceBookActionAvailability(
      "approve",
      "author",
      "active",
    );
    expect(notDraft.allowed).toBe(false);
    expect(notDraft.reason).toMatch(/Only draft/i);
  });

  it("allows approve for author on draft", () => {
    const avail = describePriceBookActionAvailability("approve", "author", "draft");
    expect(avail.allowed).toBe(true);
    expect(avail.reason).toBeNull();
    expect(avail.requiredRole).toBe("author");
  });

  it("rollback requires approver and active status", () => {
    const author = describePriceBookActionAvailability("rollback", "author", "active");
    expect(author.allowed).toBe(false);
    expect(author.reason).toMatch(/approver/i);

    const notActive = describePriceBookActionAvailability(
      "rollback",
      "approver",
      "approved",
    );
    expect(notActive.allowed).toBe(false);
    expect(notActive.reason).toMatch(/Only the active version/i);

    const ok = describePriceBookActionAvailability("rollback", "approver", "active");
    expect(ok.allowed).toBe(true);
    expect(ok.reason).toBeNull();
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
    expect(text).toMatch(/Prior active version none/i);
  });

  it("approve confirm explains customer prices stay on active version", () => {
    const text = buildPriceBookConfirmMessage({
      action: "approve",
      role: "author",
      bookId: "pb-1",
      familySlug: "family-a",
      versionId: "v2",
      versionStatus: "draft",
      currency: "INR",
      effectiveFrom: "2026-07-01",
      activeVersionId: "v1",
      ruleCount: 1,
      reason: "  ",
    });
    expect(text).toMatch(/APPROVE/);
    expect(text).toMatch(/\(no reason provided\)/);
    expect(text).toMatch(/draft to approved/);
    expect(text).toMatch(/active version v1/);
  });

  it("rollback confirm mentions pin reproducibility", () => {
    const text = buildPriceBookConfirmMessage({
      action: "rollback",
      role: "approver",
      bookId: "pb-1",
      familySlug: "family-a",
      versionId: "v1",
      versionStatus: "active",
      currency: "USD",
      effectiveFrom: "2026-01-01",
      activeVersionId: "v1",
      ruleCount: 4,
      reason: "bad rates",
    });
    expect(text).toMatch(/ROLLBACK/);
    expect(text).toMatch(/rolled back/i);
    expect(text).toMatch(/reproducible/i);
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

  it("release impact uses none when no previous active", () => {
    const summary = buildPriceBookReleaseImpactSummary({
      bookId: "pb-1",
      versionId: "v1",
      currency: "INR",
      effectiveFrom: "2026-07-01",
      ruleCount: 0,
      previousActiveVersionId: null,
    });
    expect(summary).toMatch(/Previous active version: none/);
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

  it("defaults empty reason to (none) and generates id/at", () => {
    const entry = createPriceBookAuditEntry({
      actorId: "a",
      role: "author",
      action: "deny",
      bookId: "pb",
      versionId: "v",
      previousVersionId: null,
      newVersionId: null,
      reason: "   ",
      result: "failure",
      resultDetail: "nope",
    });
    expect(entry.reason).toBe("(none)");
    expect(entry.id.length).toBeGreaterThan(0);
    expect(entry.at).toMatch(/T/);
    expect(formatPriceBookAuditLine(entry)).toMatch(/prev=—/);
    expect(formatPriceBookAuditLine(entry)).toMatch(/new=—/);
  });
});

describe("priceBookGovernance.server audit edge cases", () => {
  it("returns empty when audit log missing", () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "pb-audit-miss-"));
    try {
      expect(readPriceBookAudit("pb-1", dir)).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("skips corrupt lines, filters by bookId, respects limit newest-first", () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "pb-audit-edge-"));
    try {
      const make = (bookId: string, id: string) =>
        createPriceBookAuditEntry({
          actorId: "a",
          role: "approver",
          action: "approve",
          bookId,
          versionId: "v1",
          previousVersionId: null,
          newVersionId: null,
          reason: "r",
          result: "success",
          resultDetail: "ok",
          idFactory: () => id,
          now: () => new Date("2026-07-13T12:00:00.000Z"),
        });
      appendPriceBookAudit(make("pb-a", "1"), dir);
      appendPriceBookAudit(make("pb-b", "2"), dir);
      appendFileSync(priceBookAuditLogPath(dir), "not-json\n", "utf8");
      appendPriceBookAudit(make("pb-a", "3"), dir);
      appendPriceBookAudit(make("pb-a", "4"), dir);

      const allA = readPriceBookAudit("pb-a", dir);
      expect(allA.map((e) => e.id)).toEqual(["4", "3", "1"]);
      expect(readPriceBookAudit("pb-a", dir, 2).map((e) => e.id)).toEqual(["4", "3"]);
      expect(readPriceBookAudit("pb-b", dir)).toHaveLength(1);
      expect(readPriceBookAudit("pb-none", dir)).toEqual([]);
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
