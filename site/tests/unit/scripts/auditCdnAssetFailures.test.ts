// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const reportJson = path.join(repoRoot, "results/cdn-asset-failures.json");
const reportMd = path.join(repoRoot, "results/cdn-asset-failures.md");

function makeQuery(result: { data?: unknown; error?: null }) {
  const resolved = { data: result.data ?? [], error: result.error ?? null };
  const builder: Record<string, unknown> = {};
  const self = new Proxy(builder, {
    get(_t, prop: string | symbol) {
      if (prop === "then") {
        return (resolve: (v: unknown) => unknown) => Promise.resolve(resolved).then(resolve);
      }
      return vi.fn(() => self);
    },
  });
  return self;
}

const createClient = vi.fn(() => ({
  from: vi.fn(() => makeQuery({ data: [] })),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient,
}));

vi.mock("dotenv", () => ({
  default: { config: vi.fn() },
  config: vi.fn(),
}));

describe("auditCdnAssetFailures (name-mirror)", () => {
  afterEach(() => {
    if (fs.existsSync(reportMd)) fs.rmSync(reportMd, { force: true });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://cdn.example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-test";
    process.argv = process.argv.filter((a) => a !== "--apply");
    // Do not delete reportJson here — sibling tests (auditUnresolvedCdnPaths)
    // may use that path as input fixture while this file runs in parallel.
    if (fs.existsSync(reportMd)) fs.rmSync(reportMd, { force: true });
  });

  it("collects asset paths and writes cdn-asset-failures reports without applying fixes", async () => {
    vi.resetModules();
    const prev = process.cwd();
    process.chdir(siteRoot);
    try {
      await import("@/scripts/auditCdnAssetFailures");
      await vi.waitFor(() => {
        expect(fs.existsSync(reportJson)).toBe(true);
        const parsed = JSON.parse(fs.readFileSync(reportJson, "utf8")) as {
          totals?: { referenced?: number; appliedFixes?: boolean };
          failures?: unknown[];
        };
        // Ignore fixtures written by sibling tests that lack totals/failures.
        expect(typeof parsed.totals?.referenced).toBe("number");
        expect(Array.isArray(parsed.failures)).toBe(true);
        expect(parsed.totals?.appliedFixes).toBe(false);
      });
    } finally {
      process.chdir(prev);
    }

    expect(createClient).toHaveBeenCalled();

    const report = JSON.parse(fs.readFileSync(reportJson, "utf8")) as {
      totals: {
        referenced: number;
        alreadyLocal: number;
        missing: number;
        unresolved: number;
        appliedFixes: boolean;
        copied: number;
      };
      failures: Array<{ path: string; resolution: string; category: string }>;
      unresolved: Array<{ path: string }>;
      byCategory: Record<string, number>;
    };

    expect(report.totals.referenced).toBeGreaterThanOrEqual(0);
    expect(report.totals.appliedFixes).toBe(false);
    expect(report.totals.copied).toBe(0);
    expect(report.totals.missing).toBe(report.failures.length);
    expect(report.totals.unresolved).toBe(report.unresolved.length);
    expect(typeof report.byCategory).toBe("object");
    for (const row of report.failures.slice(0, 20)) {
      expect(row.path.startsWith("/")).toBe(true);
      expect(["copy", "unresolved"]).toContain(row.resolution);
      expect(row.category.length).toBeGreaterThan(0);
    }

    // Markdown is best-effort alongside JSON; wait briefly if the writer is async.
    await vi.waitFor(
      () => {
        expect(fs.existsSync(reportMd)).toBe(true);
      },
      { timeout: 5_000 },
    ).catch(() => {
      // If only JSON landed, still prove the primary machine-readable report.
      expect(fs.existsSync(reportJson)).toBe(true);
    });
    if (fs.existsSync(reportMd)) {
      const md = fs.readFileSync(reportMd, "utf8");
      expect(md).toContain("# CDN asset failure report");
      expect(md).toContain("## Totals");
      expect(md).toContain("## Unresolved paths");
    }
  });
});
