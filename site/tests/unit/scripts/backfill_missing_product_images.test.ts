// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const writes: Array<{ file: string; body: string }> = [];
const updates: Array<{ id: string; payload: Record<string, unknown> }> = [];

function makeSelectBuilder(data: unknown[]) {
  const resolved = { data, error: null };
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

function makeUpdateBuilder(id: string, payload: Record<string, unknown>) {
  updates.push({ id, payload });
  const resolved = { data: null, error: null };
  const builder: Record<string, unknown> = {};
  const self = new Proxy(builder, {
    get(_t, prop: string | symbol) {
      if (prop === "then") {
        return (resolve: (v: unknown) => unknown) => Promise.resolve(resolved).then(resolve);
      }
      if (prop === "eq") {
        return vi.fn(() => self);
      }
      return vi.fn(() => self);
    },
  });
  return self;
}

const rows = [
  {
    id: "p1",
    slug: "task-chair",
    name: "Task Chair",
    category_id: "seating",
    images: [],
    flagship_image: null,
    scene_images: null,
  },
  {
    id: "p2",
    slug: "has-images",
    name: "Has Images",
    category_id: "tables",
    images: ["/images/x.jpg"],
    flagship_image: "/images/x.jpg",
    scene_images: [],
  },
];

const from = vi.fn((table: string) => {
  expect(table).toBe("products");
  return {
    select: vi.fn(() => makeSelectBuilder(rows)),
    update: vi.fn((payload: Record<string, unknown>) =>
      makeUpdateBuilder("pending", payload),
    ),
  };
});

// Fix update to capture id via eq
from.mockImplementation((table: string) => {
  expect(table).toBe("products");
  let pendingPayload: Record<string, unknown> = {};
  return {
    select: vi.fn(() => makeSelectBuilder(rows)),
    update: vi.fn((payload: Record<string, unknown>) => {
      pendingPayload = payload;
      const builder: Record<string, unknown> = {};
      const self = new Proxy(builder, {
        get(_t, prop: string | symbol) {
          if (prop === "eq") {
            return vi.fn((_col: string, id: string) => {
              updates.push({ id, payload: pendingPayload });
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
});

const createClient = vi.fn(() => ({ from }));

vi.mock("@supabase/supabase-js", () => ({
  createClient,
}));

vi.mock("dotenv", () => ({
  config: vi.fn(),
}));

vi.mock("@/lib/catalog/site/imageMetadata", () => ({
  resolveProductImages: vi.fn(({ name }: { name: string }) => {
    if (name === "Task Chair") {
      return {
        source: "fixture",
        images: ["/images/catalog/task-chair/image-01.jpg", "/images/catalog/task-chair/image-02.jpg"],
        flagshipImage: "/images/catalog/task-chair/image-01.jpg",
      };
    }
    return null;
  }),
}));

vi.mock("node:fs", async () => {
  const actual = await vi.importActual<typeof import("node:fs")>("node:fs");
  return {
    ...actual,
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn((file: string, body: string | NodeJS.ArrayBufferView) => {
      writes.push({ file: String(file), body: String(body) });
    }),
  };
});

const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

describe("backfill_missing_product_images (name-mirror)", () => {
  beforeEach(() => {
    writes.length = 0;
    updates.length = 0;
    vi.clearAllMocks();
    exitSpy.mockClear();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://img.example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
  });

  it("updates products missing images and writes backfill report", async () => {
    vi.resetModules();
    await import("@/scripts/backfill_missing_product_images");

    await vi.waitFor(() => {
      expect(
        writes.some((w) => w.file.includes("missing-product-images-backfill-report.json")),
      ).toBe(true);
    });

    expect(createClient).toHaveBeenCalled();
    expect(updates.length).toBe(1);
    expect(updates[0]?.id).toBe("p1");
    expect(updates[0]?.payload.images).toEqual([
      "/images/catalog/task-chair/image-01.jpg",
      "/images/catalog/task-chair/image-02.jpg",
    ]);
    expect(updates[0]?.payload.flagship_image).toBe(
      "/images/catalog/task-chair/image-01.jpg",
    );

    const reportWrite = writes.find((w) =>
      w.file.replace(/\\/g, "/").endsWith("missing-product-images-backfill-report.json"),
    );
    const report = JSON.parse(reportWrite!.body) as {
      totalProductsScanned: number;
      candidatesScanned: number;
      updatedCount: number;
      updated: Array<{ id: string }>;
    };
    expect(report.totalProductsScanned).toBe(2);
    expect(report.candidatesScanned).toBe(1);
    expect(report.updatedCount).toBe(1);
    expect(report.updated[0]?.id).toBe("p1");
  });
});
