// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const jsonPath = path.join(repoRoot, "results/audits/supabase-admin-schema-audit.json");
const mdPath = path.join(repoRoot, "results/audits/supabase-admin-schema-audit.md");

function makeQuery(result: {
  data?: unknown;
  error?: { message: string } | null;
  count?: number | null;
}) {
  const resolved = {
    data: result.data ?? [],
    error: result.error ?? null,
    count: result.count ?? 0,
  };
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

const from = vi.fn((table: string) => {
  if (table === "customer_queries" || table === "profiles" || table === "teams") {
    return makeQuery({ data: [{ id: "1" }], count: 3 });
  }
  return makeQuery({ data: [], count: 0 });
});

const createClient = vi.fn(() => ({ from }));

vi.mock("@supabase/supabase-js", () => ({
  createClient,
}));

vi.mock("dotenv", () => ({
  config: vi.fn(),
}));

const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

describe("audit_supabase_admin (name-mirror)", () => {
  afterEach(() => {
    if (fs.existsSync(mdPath)) fs.rmSync(mdPath, { force: true });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    exitSpy.mockClear();
    process.env.NEXT_ADMIN_SUPABASE_URL = "https://admin.example.supabase.co";
    process.env.SUPABASE_ADMIN_SERVICE_ROLE_KEY = "service-role-test";
    for (const p of [jsonPath, mdPath]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true });
    }
  });

  it("probes admin tables and writes schema audit reports", async () => {
    vi.resetModules();
    await import("@/scripts/audit_supabase_admin");

    await vi.waitFor(() => {
      expect(fs.existsSync(jsonPath)).toBe(true);
    });

    expect(createClient).toHaveBeenCalledWith(
      "https://admin.example.supabase.co",
      "service-role-test",
      expect.objectContaining({
        auth: expect.objectContaining({ persistSession: false }),
      }),
    );

    const summary = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as {
      supabaseHost: string;
      tables: Array<{ table: string; exists: boolean; rowCount: number | null }>;
      runtimeQueries: Array<{ label: string; ok: boolean }>;
    };
    expect(summary.supabaseHost).toBe("admin.example.supabase.co");
    expect(summary.tables.length).toBeGreaterThanOrEqual(5);
    expect(summary.tables.some((t) => t.table === "customer_queries" && t.exists)).toBe(
      true,
    );
    expect(summary.runtimeQueries.some((q) => q.label === "Customer queries" && q.ok)).toBe(
      true,
    );

    const md = fs.readFileSync(mdPath, "utf8");
    expect(md).toContain("# Supabase Admin Schema Audit");
    expect(md).toContain("customer_queries");
    expect(exitSpy).not.toHaveBeenCalledWith(1);
  });
});
