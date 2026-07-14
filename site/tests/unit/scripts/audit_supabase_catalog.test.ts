// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const schemaJson = path.join(repoRoot, "results/audits/supabase-schema-audit.json");
const schemaMd = path.join(repoRoot, "results/audits/supabase-schema-audit.md");
const qualityJson = path.join(repoRoot, "results/audits/supabase-data-quality-audit.json");
const runtimeMd = path.join(repoRoot, "results/audits/supabase-runtime-query-audit.md");

function makeQuery(result: {
  data?: unknown;
  error?: { message: string } | null;
  count?: number | null;
}) {
  const resolved = {
    data: result.data ?? [],
    error: result.error ?? null,
    count: result.count ?? (Array.isArray(result.data) ? result.data.length : 0),
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

const products = [
  {
    id: "p1",
    slug: "desk-a",
    name: "Desk A",
    category_id: "workstations",
    metadata: { subcategory_id: "linear" },
    flagship_image: "/images/a.jpg",
    alt_text: "Desk",
  },
  {
    id: "p2",
    slug: "",
    name: "Blank Slug",
    category_id: "seating",
    metadata: {},
    flagship_image: null,
    alt_text: null,
  },
];

const from = vi.fn((table: string) => {
  if (table === "products") {
    return makeQuery({ data: products, count: products.length });
  }
  if (table === "categories") {
    return makeQuery({ data: [{ id: "workstations" }], count: 1 });
  }
  if (table === "product_slug_aliases") {
    return makeQuery({
      data: [{ id: 1, alias_slug: "old-desk", canonical_slug: "desk-a", is_active: true }],
      count: 1,
    });
  }
  if (table === "business_stats_current") {
    return makeQuery({
      data: [{ id: "s1", is_active: true, as_of_date: "2026-01-01" }],
      count: 1,
    });
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

describe("audit_supabase_catalog (name-mirror)", () => {
  afterEach(() => {
    for (const p of [schemaMd, runtimeMd]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true });
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    exitSpy.mockClear();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://catalog.example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    for (const p of [schemaJson, schemaMd, qualityJson, runtimeMd]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true });
    }
  });

  it("audits catalog tables and writes schema + data-quality reports", async () => {
    vi.resetModules();
    await import("@/scripts/audit_supabase_catalog");

    await vi.waitFor(() => {
      expect(fs.existsSync(schemaJson)).toBe(true);
    });

    expect(createClient).toHaveBeenCalled();

    const summary = JSON.parse(fs.readFileSync(schemaJson, "utf8")) as {
      supabaseHost: string;
      dataQuality: {
        productCount: number;
        blankSlugs: number;
        missingPrimaryImage: number;
        aliasCount: number;
      };
      tables: Array<{ table: string }>;
    };
    expect(summary.supabaseHost).toBe("catalog.example.supabase.co");
    expect(summary.dataQuality.productCount).toBe(2);
    expect(summary.dataQuality.blankSlugs).toBe(1);
    expect(summary.dataQuality.missingPrimaryImage).toBe(1);
    expect(summary.dataQuality.aliasCount).toBe(1);
    expect(summary.tables.some((t) => t.table === "products")).toBe(true);

    const quality = JSON.parse(fs.readFileSync(qualityJson, "utf8")) as {
      productCount: number;
    };
    expect(quality.productCount).toBe(2);

    const md = fs.readFileSync(schemaMd, "utf8");
    expect(md).toContain("# Supabase Schema Audit");
    expect(md).toContain("blank slugs: 1");
  });
});
