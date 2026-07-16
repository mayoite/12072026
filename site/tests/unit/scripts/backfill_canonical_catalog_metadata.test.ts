// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const writes: Array<{ file: string; body: string }> = [];
const productUpdates: Array<{ id: string; metadata: Record<string, unknown> }> = [];
const aliasInserts: Array<Record<string, unknown>> = [];

function thenable<T>(value: T) {
  const builder: Record<string, unknown> = {};
  const self = new Proxy(builder, {
    get(_t, prop: string | symbol) {
      if (prop === "then") {
        return (resolve: (v: T) => unknown) => Promise.resolve(value).then(resolve);
      }
      return vi.fn(() => self);
    },
  });
  return self;
}

const products = [
  {
    id: "p1",
    category_id: "workstations",
    name: "Linear Desk Pro",
    slug: "legacy-linear-desk",
    series_name: "DeskPro",
    description: "Workstation desk",
    metadata: {},
  },
];

const from = vi.fn((table: string) => {
  if (table === "products") {
    return {
      select: vi.fn(() => thenable({ data: products, error: null })),
      update: vi.fn((payload: { metadata: Record<string, unknown> }) => {
        const chain: Record<string, unknown> = {};
        const self = new Proxy(chain, {
          get(_t, prop: string | symbol) {
            if (prop === "eq") {
              return vi.fn((_col: string, id: string) => {
                productUpdates.push({ id, metadata: payload.metadata });
                return Promise.resolve({ data: null, error: null });
              });
            }
            if (prop === "then") {
              return (resolve: (v: unknown) => unknown) =>
                Promise.resolve({ data: null, error: null }).then(resolve);
            }
            return vi.fn(() => self);
          },
        });
        return self;
      }),
    };
  }
  if (table === "product_slug_aliases") {
    return {
      select: vi.fn(() => thenable({ data: [], error: null })),
      insert: vi.fn((rows: Array<Record<string, unknown>>) => {
        aliasInserts.push(...rows);
        return Promise.resolve({ data: null, error: null });
      }),
    };
  }
  return {
    select: vi.fn(() => thenable({ data: [], error: null })),
  };
});

const createClient = vi.fn(() => ({ from }));

vi.mock("@supabase/supabase-js", () => ({
  createClient,
}));

vi.mock("dotenv", () => ({
  config: vi.fn(),
}));

vi.mock("fs", async () => {
  const actual = await vi.importActual("fs") as Record<string, unknown> & { readFileSync?: (...args: never[]) => unknown; default?: unknown };
  return {
    ...actual,
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn((file: string, body: string | NodeJS.ArrayBufferView) => {
      writes.push({ file: String(file), body: String(body) });
    }),
  };
});

const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

describe("backfill_canonical_catalog_metadata (name-mirror)", () => {
  beforeEach(() => {
    writes.length = 0;
    productUpdates.length = 0;
    aliasInserts.length = 0;
    vi.clearAllMocks();
    exitSpy.mockClear();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://meta.example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
  });

  it("writes canonical metadata and produces a backfill report", async () => {
    vi.resetModules();
    await import("@/scripts/backfill_canonical_catalog_metadata");

    await vi.waitFor(() => {
      expect(
        writes.some((w) => w.file.includes("canonical-metadata-backfill-report.json")),
      ).toBe(true);
    });

    expect(createClient).toHaveBeenCalled();
    expect(productUpdates.length).toBe(1);
    expect(productUpdates[0]?.id).toBe("p1");
    expect(productUpdates[0]?.metadata.categoryIdCanonical).toBeDefined();
    expect(productUpdates[0]?.metadata.canonicalSlugV2).toBeDefined();
    expect(productUpdates[0]?.metadata.canonicalSeriesId).toBeDefined();

    const reportWrite = writes.find((w) =>
      w.file.replace(/\\/g, "/").endsWith("canonical-metadata-backfill-report.json"),
    );
    const report = JSON.parse(reportWrite!.body) as {
      productsUpdated: number;
      aliasesInserted: number;
    };
    expect(report.productsUpdated).toBe(1);
    expect(typeof report.aliasesInserted).toBe("number");
  });
});
