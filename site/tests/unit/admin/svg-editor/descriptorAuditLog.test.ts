/**
 * Admin P06 — append-only descriptor audit log.
 * Injectable `dir`; never writes to canonical block-descriptors.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  appendDescriptorAudit,
  descriptorAuditLogPath,
  readDescriptorAuditForSlug,
} from "@/features/planner/admin/svg-editor/descriptorAuditLog";

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(path.join(os.tmpdir(), "audit-log-"));
});

afterEach(() => {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
});

describe("descriptorAuditLog", () => {
  it("appends entries and reads newest-first for a slug", () => {
    const first = appendDescriptorAudit(
      {
        actorId: "admin-1",
        slug: "chaise",
        action: "publish",
        detail: { version: 1 },
      },
      workDir,
    );
    const second = appendDescriptorAudit(
      {
        actorId: "admin-2",
        slug: "chaise",
        action: "rollback",
        detail: { fromVersion: 1, newVersion: 2 },
      },
      workDir,
    );
    appendDescriptorAudit(
      {
        actorId: "admin-1",
        slug: "other",
        action: "approve",
        detail: { ok: true },
      },
      workDir,
    );

    expect(first.id.length).toBeGreaterThan(0);
    expect(first.at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(existsSync(descriptorAuditLogPath(workDir))).toBe(true);

    const forChaise = readDescriptorAuditForSlug("chaise", workDir);
    expect(forChaise).toHaveLength(2);
    expect(forChaise[0]?.id).toBe(second.id);
    expect(forChaise[0]?.action).toBe("rollback");
    expect(forChaise[1]?.id).toBe(first.id);
  });

  it("returns empty when log file is missing", () => {
    expect(readDescriptorAuditForSlug("chaise", workDir)).toEqual([]);
  });

  it("skips corrupt lines and respects limit", () => {
    const logPath = descriptorAuditLogPath(workDir);
    const good = {
      id: "good-1",
      at: "2026-01-01T00:00:00.000Z",
      actorId: "a",
      slug: "chaise",
      action: "publish",
      detail: {},
    };
    const good2 = { ...good, id: "good-2", action: "approve" };
    writeFileSync(
      logPath,
      ["not-json", JSON.stringify(good), JSON.stringify(good2)].join("\n") + "\n",
      "utf8",
    );

    const limited = readDescriptorAuditForSlug("chaise", workDir, 1);
    expect(limited).toHaveLength(1);
    expect(limited[0]?.id).toBe("good-2");

    const all = readDescriptorAuditForSlug("chaise", workDir, 50);
    expect(all.map((e) => e.id)).toEqual(["good-2", "good-1"]);
  });
});
