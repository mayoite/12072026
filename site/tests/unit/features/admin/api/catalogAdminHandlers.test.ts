import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

type MockRow = Record<string, unknown>;

const sampleManagedRow: MockRow = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "Test Item",
  slug: "test-item",
  planner_source_slug: "test-item",
  category: "seating",
  category_id: "seating",
  category_name: "Seating",
  series_id: "ser-1",
  series_name: "Test Series",
  specs: { widthMm: 100, depthMm: 50, heightMm: 80, priceInr: 10, meshType: "box" },
  price: 10,
  active: true,
  visible: true,
  flagship_image: "/img.png",
  description: "A chair",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  metadata: { source: "admin-catalog" },
};

const createAdminServiceClient = vi.fn();
const isMissingTableError = vi.fn((msg?: string) =>
  typeof msg === "string" && msg.includes("does not exist"),
);
const fetchAdminConfiguratorCatalog = vi.fn();

vi.mock("@/platform/supabase/adminServer", () => ({
  createAdminServiceClient: (...args: unknown[]) => createAdminServiceClient(...args),
  isMissingTableError: (msg?: string) => isMissingTableError(msg),
}));

vi.mock("@/lib/catalog/configuratorCatalog.server", () => ({
  fetchAdminConfiguratorCatalog: (...args: unknown[]) =>
    fetchAdminConfiguratorCatalog(...args),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body: unknown, init?: { status?: number }) => ({ body, init })),
  },
  NextRequest: class NextRequest {
    url: string;
    method: string;
    headers: Headers;
    nextUrl: { searchParams: URLSearchParams };
    private readonly bodyText: string | undefined;
    constructor(url: string, init?: RequestInit) {
      this.url = url;
      this.method = init?.method ?? "GET";
      this.headers = new Headers(init?.headers as HeadersInit);
      this.nextUrl = { searchParams: new URL(url).searchParams };
      this.bodyText =
        typeof init?.body === "string"
          ? init.body
          : init?.body !== null && init?.body !== undefined
            ? String(init.body)
            : undefined;
    }
    async json(): Promise<unknown> {
      if (!this.bodyText) throw new Error("no body");
      return JSON.parse(this.bodyText);
    }
  },
}));

import {
  CATALOG_TYPES,
  createConfiguratorCatalog,
  createStandardCatalog,
  deleteConfiguratorCatalog,
  deleteStandardCatalog,
  listConfiguratorCatalog,
  listStandardCatalog,
  patchConfiguratorCatalog,
  patchStandardCatalog,
  resolveCatalogType,
} from "@/features/admin/api/catalogAdminHandlers";

function responseBody(res: unknown): Record<string, unknown> {
  return (res as { body?: Record<string, unknown> }).body ?? {};
}

function responseStatus(res: unknown): number | undefined {
  return (res as { init?: { status?: number } }).init?.status;
}

/** Chainable supabase mock covering list/insert/update/delete/eq/single. */
function makeSupabase(options?: {
  list?: { data?: MockRow[] | null; error?: { message?: string; code?: string } | null };
  insert?: { data?: MockRow | null; error?: { message?: string; code?: string } | null };
  update?: { data?: MockRow | null; error?: { message?: string; code?: string } | null };
  delete?: { error?: { message?: string; code?: string } | null };
  selectOne?: { data?: MockRow | null; error?: { message?: string; code?: string } | null };
}) {
  const listResult = options?.list ?? {
    data: [sampleManagedRow],
    error: null,
  };
  const insertResult = options?.insert ?? {
    data: sampleManagedRow,
    error: null,
  };
  const updateResult = options?.update ?? {
    data: sampleManagedRow,
    error: null,
  };
  const deleteResult = options?.delete ?? { error: null };
  const selectOneResult = options?.selectOne ?? {
    data: sampleManagedRow,
    error: null,
  };

  const from = vi.fn(() => {
    const chain: Record<string, unknown> = {};
    const self = () => chain;

    chain.select = vi.fn(() => self());
    chain.insert = vi.fn(() => self());
    chain.update = vi.fn(() => self());
    chain.delete = vi.fn(() => self());
    chain.eq = vi.fn(() => self());
    chain.order = vi.fn(async () => listResult);
    chain.single = vi.fn(async () => {
      // After insert/update, return those results; after select+eq, selectOne.
      return insertResult.data !== undefined && options?.insert
        ? insertResult
        : options?.update
          ? updateResult
          : selectOneResult;
    });

    // Make thenable for delete().eq() without single
    Object.assign(chain, {
      then: undefined,
    });

    // delete path: .delete().eq() returns promise-like via thenable after eq
    const originalEq = chain.eq as ReturnType<typeof vi.fn>;
    chain.eq = vi.fn((...args: unknown[]) => {
      originalEq(...args);
      const next = self();
      // After delete+eq, callers await the chain directly
      (next as { then?: unknown }).then = (
        resolve: (v: unknown) => unknown,
        reject?: (e: unknown) => unknown,
      ) =>
        Promise.resolve(deleteResult).then(resolve, reject);
      (next as { single: ReturnType<typeof vi.fn> }).single = vi.fn(async () => {
        if (options?.insert) return insertResult;
        if (options?.update) return updateResult;
        return selectOneResult;
      });
      return next;
    });

    // insert().select().single()
    chain.insert = vi.fn(() => {
      const insertChain: Record<string, unknown> = {
        select: vi.fn(() => ({
          single: vi.fn(async () => insertResult),
        })),
      };
      return insertChain;
    });

    // update().eq().select().single() OR update().eq().select("id, active").single()
    chain.update = vi.fn(() => {
      const updateChain: Record<string, unknown> = {};
      updateChain.eq = vi.fn(() => {
        const afterEq: Record<string, unknown> = {
          select: vi.fn(() => ({
            single: vi.fn(async () => updateResult),
          })),
          single: vi.fn(async () => updateResult),
        };
        return afterEq;
      });
      updateChain.select = vi.fn(() => ({
        single: vi.fn(async () => updateResult),
      }));
      return updateChain;
    });

    // select("*").eq().single() for patch existing lookup
    chain.select = vi.fn(() => {
      const selectChain: Record<string, unknown> = {
        order: vi.fn(async () => listResult),
        eq: vi.fn(() => ({
          single: vi.fn(async () => selectOneResult),
          select: vi.fn(() => ({
            single: vi.fn(async () => selectOneResult),
          })),
        })),
        single: vi.fn(async () => selectOneResult),
      };
      return selectChain;
    });

    // delete().eq()
    chain.delete = vi.fn(() => ({
      eq: vi.fn(async () => deleteResult),
    }));

    return chain;
  });

  return { from };
}

describe("catalogAdminHandlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createAdminServiceClient.mockReturnValue(makeSupabase());
    isMissingTableError.mockImplementation(
      (msg?: string) => typeof msg === "string" && msg.includes("does not exist"),
    );
    fetchAdminConfiguratorCatalog.mockResolvedValue([
      { id: "c1", name: "Config desk", category: "desks", active: true },
    ]);
  });

  it("exposes catalog type keys and resolves aliases", () => {
    expect(CATALOG_TYPES).toEqual(
      expect.arrayContaining(["standard", "configurator", "buddy"]),
    );
    expect(resolveCatalogType("buddy")).toBe("configurator");
    expect(resolveCatalogType("configurator")).toBe("configurator");
    expect(resolveCatalogType("standard")).toBe("standard");
    expect(() => resolveCatalogType("invalid")).toThrow(/Invalid catalog type/);
  });

  describe("listStandardCatalog", () => {
    it("lists managed products and applies filters", async () => {
      const rows = [
        { ...sampleManagedRow, name: "Alpha Desk", category: "workstation", active: true },
        {
          ...sampleManagedRow,
          id: "11111111-1111-4111-8111-111111111111",
          name: "Hidden Chair",
          category: "seating",
          active: false,
          description: "secret",
        },
      ];
      createAdminServiceClient.mockReturnValue(
        makeSupabase({ list: { data: rows, error: null } }),
      );

      const filtered = await listStandardCatalog(
        new NextRequest(
          "http://localhost/api/catalogs/standard?page=1&limit=10&category=seating&search=hidden&visible=false",
        ),
      );
      const body = responseBody(filtered);
      expect(body.source).toBe("planner_managed_products");
      expect((body.items as unknown[]).length).toBe(1);
      expect((body.items as { name: string }[])[0]?.name).toBe("Hidden Chair");
    });

    it("falls back to local furniture catalog when supabase is null", async () => {
      createAdminServiceClient.mockReturnValue(null);
      const res = await listStandardCatalog(
        new NextRequest("http://localhost/api/catalogs/standard?page=1&limit=5"),
      );
      const body = responseBody(res);
      expect(body.source).toBe("local-catalog");
      expect((body.items as unknown[]).length).toBeGreaterThan(0);
      expect((body.pagination as { limit: number }).limit).toBe(5);
    });

    it("falls back to local when table is missing", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          list: {
            data: null,
            error: { message: "relation planner_managed_products does not exist" },
          },
        }),
      );
      isMissingTableError.mockReturnValue(true);
      const res = await listStandardCatalog(
        new NextRequest("http://localhost/api/catalogs/standard?page=1&limit=10"),
      );
      expect(responseBody(res).source).toBe("local-catalog");
    });

    it("returns 500 on non-missing database errors", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          list: { data: null, error: { message: "connection refused" } },
        }),
      );
      isMissingTableError.mockReturnValue(false);
      const res = await listStandardCatalog(
        new NextRequest("http://localhost/api/catalogs/standard?page=1&limit=10"),
      );
      const body = responseBody(res);
      expect(body.error || body.message || body.code).toBeDefined();
    });

    it("rejects invalid query params", async () => {
      const res = await listStandardCatalog(
        new NextRequest("http://localhost/api/catalogs/standard?page=not-a-number"),
      );
      expect(responseBody(res)).toBeDefined();
    });
  });

  describe("createStandardCatalog", () => {
    const validBody = {
      name: "New Desk",
      category: "desks",
      subcategory: "linear",
      width_mm: 1200,
      depth_mm: 600,
      height_mm: 750,
      price: 1000,
      mesh_type: "box",
      image_url: "/desk.png",
      visible: true,
      description: "A desk",
    };

    it("creates when storage is configured", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          insert: {
            data: {
              ...sampleManagedRow,
              name: "New Desk",
              category: "desks",
              specs: { widthMm: 1200, depthMm: 600, heightMm: 750, priceInr: 1000 },
            },
            error: null,
          },
        }),
      );
      const res = await createStandardCatalog(
        new NextRequest("http://localhost/api/catalogs/standard", {
          method: "POST",
          body: JSON.stringify(validBody),
        }),
      );
      expect(responseStatus(res)).toBe(201);
      expect(responseBody(res).source).toBe("planner_managed_products");
    });

    it("returns 503 when storage is not configured", async () => {
      createAdminServiceClient.mockReturnValue(null);
      const res = await createStandardCatalog(
        new NextRequest("http://localhost/api/catalogs/standard", {
          method: "POST",
          body: JSON.stringify(validBody),
        }),
      );
      expect(responseBody(res)).toBeDefined();
    });

    it("returns validation error for bad body", async () => {
      const res = await createStandardCatalog(
        new NextRequest("http://localhost/api/catalogs/standard", {
          method: "POST",
          body: JSON.stringify({ name: "" }),
        }),
      );
      expect(responseBody(res)).toBeDefined();
    });

    it("maps missing-table insert errors to unavailable", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          insert: {
            data: null,
            error: { message: "relation does not exist" },
          },
        }),
      );
      isMissingTableError.mockReturnValue(true);
      const res = await createStandardCatalog(
        new NextRequest("http://localhost/api/catalogs/standard", {
          method: "POST",
          body: JSON.stringify(validBody),
        }),
      );
      expect(responseBody(res)).toBeDefined();
    });
  });

  describe("patchStandardCatalog", () => {
    it("rejects empty id", async () => {
      const res = await patchStandardCatalog(
        new NextRequest("http://localhost/x", {
          method: "PATCH",
          body: JSON.stringify({ name: "x" }),
        }),
        "  ",
      );
      expect(responseBody(res)).toBeDefined();
    });

    it("returns 503 when storage missing", async () => {
      createAdminServiceClient.mockReturnValue(null);
      const res = await patchStandardCatalog(
        new NextRequest("http://localhost/x", {
          method: "PATCH",
          body: JSON.stringify({ name: "Renamed" }),
        }),
        sampleManagedRow.id as string,
      );
      expect(responseBody(res)).toBeDefined();
    });

    it("returns not found when row missing", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          selectOne: { data: null, error: { message: "not found" } },
        }),
      );
      const res = await patchStandardCatalog(
        new NextRequest("http://localhost/x", {
          method: "PATCH",
          body: JSON.stringify({ name: "Renamed" }),
        }),
        "missing-id",
      );
      expect(responseBody(res)).toBeDefined();
    });

    it("patches existing item fields", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          selectOne: { data: sampleManagedRow, error: null },
          update: {
            data: { ...sampleManagedRow, name: "Renamed" },
            error: null,
          },
        }),
      );
      const res = await patchStandardCatalog(
        new NextRequest("http://localhost/x", {
          method: "PATCH",
          body: JSON.stringify({
            name: "Renamed",
            category: "storage",
            subcategory: "pedestal",
            width_mm: 400,
            depth_mm: 500,
            height_mm: 700,
            price: 50,
            mesh_type: "cylinder",
            image_url: "/n.png",
            description: "updated",
            visible: false,
          }),
        }),
        sampleManagedRow.id as string,
      );
      expect(responseBody(res).source).toBe("planner_managed_products");
    });
  });

  describe("deleteStandardCatalog", () => {
    it("rejects empty id and missing storage", async () => {
      expect(responseBody(await deleteStandardCatalog(""))).toBeDefined();
      createAdminServiceClient.mockReturnValue(null);
      expect(responseBody(await deleteStandardCatalog("id-1"))).toBeDefined();
    });

    it("deletes when storage is configured", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({ delete: { error: null } }),
      );
      const res = await deleteStandardCatalog(sampleManagedRow.id as string);
      expect(responseBody(res).source).toBe("planner_managed_products");
    });

    it("surfaces delete database errors", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({ delete: { error: { message: "fk violation" } } }),
      );
      isMissingTableError.mockReturnValue(false);
      const res = await deleteStandardCatalog("id-1");
      expect(responseBody(res)).toBeDefined();
    });
  });

  describe("listConfiguratorCatalog", () => {
    it("lists configurator products", async () => {
      const res = await listConfiguratorCatalog(
        new NextRequest(
          "http://localhost/api/catalogs/configurator?category=desks&active=true",
        ),
      );
      const body = responseBody(res);
      expect(body.source).toBe("configurator_products");
      expect(body.total).toBe(1);
    });

    it("returns 503 when fetch yields null", async () => {
      fetchAdminConfiguratorCatalog.mockResolvedValue(null);
      const res = await listConfiguratorCatalog(
        new NextRequest("http://localhost/api/catalogs/configurator"),
      );
      expect(responseBody(res)).toBeDefined();
    });

    it("returns 500 when fetch throws", async () => {
      fetchAdminConfiguratorCatalog.mockRejectedValue(new Error("boom"));
      const res = await listConfiguratorCatalog(
        new NextRequest("http://localhost/api/catalogs/configurator"),
      );
      expect(responseBody(res)).toBeDefined();
    });
  });

  describe("createConfiguratorCatalog", () => {
    const fixedBody = {
      name: "Fixed Pedestal",
      category: "storage",
      sizing_type: "fixed",
      default_footprint: { L: 400, D: 500, H: 700 },
      active: true,
    };

    it("returns 503 without supabase", async () => {
      createAdminServiceClient.mockReturnValue(null);
      const res = await createConfiguratorCatalog(
        new NextRequest("http://localhost/x", {
          method: "POST",
          body: JSON.stringify(fixedBody),
        }),
      );
      expect(responseBody(res)).toBeDefined();
    });

    it("creates fixed configurator product", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          insert: { data: { id: "c-new", ...fixedBody }, error: null },
        }),
      );
      const res = await createConfiguratorCatalog(
        new NextRequest("http://localhost/x", {
          method: "POST",
          body: JSON.stringify(fixedBody),
        }),
      );
      expect(responseStatus(res)).toBe(201);
    });

    it("maps unique constraint to 409", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          insert: { data: null, error: { message: "dup", code: "23505" } },
        }),
      );
      const res = await createConfiguratorCatalog(
        new NextRequest("http://localhost/x", {
          method: "POST",
          body: JSON.stringify(fixedBody),
        }),
      );
      expect(responseBody(res)).toBeDefined();
    });

    it("rejects invalid body", async () => {
      const res = await createConfiguratorCatalog(
        new NextRequest("http://localhost/x", {
          method: "POST",
          body: JSON.stringify({ name: "x" }),
        }),
      );
      expect(responseBody(res)).toBeDefined();
    });
  });

  describe("patchConfiguratorCatalog", () => {
    it("returns 503 without supabase", async () => {
      createAdminServiceClient.mockReturnValue(null);
      const res = await patchConfiguratorCatalog(
        new NextRequest("http://localhost/x", {
          method: "PATCH",
          body: JSON.stringify({ active: false }),
        }),
        "c1",
      );
      expect(responseBody(res)).toBeDefined();
    });

    it("supports active-only toggle", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          update: { data: { id: "c1", active: false }, error: null },
        }),
      );
      const res = await patchConfiguratorCatalog(
        new NextRequest("http://localhost/x", {
          method: "PATCH",
          body: JSON.stringify({ active: false }),
        }),
        "c1",
      );
      expect(responseBody(res).item).toEqual({ id: "c1", active: false });
    });

    it("full body patch for fixed product", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          update: {
            data: { id: "c1", name: "Updated" },
            error: null,
          },
        }),
      );
      const res = await patchConfiguratorCatalog(
        new NextRequest("http://localhost/x", {
          method: "PATCH",
          body: JSON.stringify({
            name: "Updated",
            category: "storage",
            sizing_type: "fixed",
            default_footprint: { L: 1, D: 2, H: 3 },
          }),
        }),
        "c1",
      );
      expect(responseBody(res).item).toBeDefined();
    });
  });

  describe("deleteConfiguratorCatalog", () => {
    it("soft-archives product", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          update: { data: { id: "c1", active: false }, error: null },
        }),
      );
      const res = await deleteConfiguratorCatalog("c1");
      const body = responseBody(res);
      expect(body.archived).toBe(true);
    });

    it("returns 503 without supabase", async () => {
      createAdminServiceClient.mockReturnValue(null);
      const res = await deleteConfiguratorCatalog("c1");
      expect(responseBody(res)).toBeDefined();
    });

    it("surfaces archive errors", async () => {
      createAdminServiceClient.mockReturnValue(
        makeSupabase({
          update: { data: null, error: { message: "fail" } },
        }),
      );
      const res = await deleteConfiguratorCatalog("c1");
      expect(responseBody(res)).toBeDefined();
    });
  });
});
