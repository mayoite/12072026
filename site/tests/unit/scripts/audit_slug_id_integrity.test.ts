// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const jsonPath = path.join(repoRoot, "results/audits/slug-id-integrity-audit.json");
const mdPath = path.join(repoRoot, "results/audits/slug-id-overhaul-baseline.md");

function makeQuery(result: {
  data?: unknown;
  error?: { message: string } | null;
}) {
  const resolved = {
    data: result.data ?? [],
    error: result.error ?? null,
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
    id: "1",
    slug: "legacy-desk",
    name: "Linear Desk",
    category_id: "workstations",
    series_name: "Pro",
    description: "A desk",
    metadata: {},
  },
  {
    id: "2",
    slug: "legacy-chair",
    name: "Task Chair",
    category_id: "seating",
    series_name: "Flex",
    description: "A chair",
    metadata: {
      categoryIdCanonical: "seating",
      subcategoryId: "task",
      canonicalSlugV2: "seating-task-task-chair",
      canonicalSeriesId: "seating-task-flex",
    },
  },
];

const from = vi.fn((table: string) => {
  if (table === "products") {
    return makeQuery({ data: products });
  }
  if (table === "product_slug_aliases") {
    return makeQuery({ data: [] });
  }
  return makeQuery({ data: [] });
});

const createClient = vi.fn(() => ({ from }));

vi.mock("@supabase/supabase-js", () => ({
  createClient,
}));

vi.mock("dotenv", () => ({
  config: vi.fn(),
}));

const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

describe("audit_slug_id_integrity (name-mirror)", () => {
  afterEach(() => {
    // Layout forbids Markdown under results/
    if (fs.existsSync(mdPath)) fs.rmSync(mdPath, { force: true });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    exitSpy.mockClear();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://slug.example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    for (const p of [jsonPath, mdPath]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true });
    }
  });

  it("writes slug-id integrity audit json and baseline markdown", async () => {
    vi.resetModules();
    await import("@/scripts/audit_slug_id_integrity");

    await vi.waitFor(() => {
      expect(fs.existsSync(jsonPath)).toBe(true);
    });

    expect(createClient).toHaveBeenCalled();
    const summary = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as {
      totals: {
        products: number;
        aliasCoverageMissing: number;
      };
      missingCanonicalFields: unknown[];
      aliasCoverageMissing: unknown[];
    };
    expect(summary.totals.products).toBe(2);
    expect(typeof summary.totals.aliasCoverageMissing).toBe("number");
    expect(Array.isArray(summary.missingCanonicalFields)).toBe(true);

    const md = fs.readFileSync(mdPath, "utf8");
    expect(md).toContain("# Slug and ID Integrity Audit");
    expect(md).toContain("Products audited: 2");
  });
});
