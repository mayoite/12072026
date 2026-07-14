import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/platform/supabase/adminServer", () => {
  const mockSupabase = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() =>
          Promise.resolve({
            data: [
              {
                id: "00000000-0000-0000-0000-000000000000",
                name: "Test Item",
                slug: "test-item",
                planner_source_slug: "test-item",
                category: "seating",
                category_id: "seating",
                category_name: "Seating",
                series_id: "ser-1",
                series_name: "Test Series",
                specs: { widthMm: 100, depthMm: 50, heightMm: 80 },
                price: 10,
                visible: true,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
                metadata: null,
              },
            ],
            error: null,
          }),
        ),
      })),
    })),
  };
  return {
    createAdminServiceClient: vi.fn(() => mockSupabase),
    isMissingTableError: vi.fn(() => false),
  };
});

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, init })),
  },
  NextRequest: class NextRequest {
    url: string;
    method: string;
    headers: Headers;
    nextUrl: { searchParams: URLSearchParams };
    constructor(url: string, init?: RequestInit) {
      this.url = url;
      this.method = init?.method ?? "GET";
      this.headers = new Headers(init?.headers as HeadersInit);
      this.nextUrl = { searchParams: new URL(url).searchParams };
    }
  },
}));

import {
  CATALOG_TYPES,
  listStandardCatalog,
  resolveCatalogType,
} from "@/features/admin/api/catalogAdminHandlers";

describe("catalogAdminHandlers (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exposes catalog type keys", () => {
    expect(Object.keys(CATALOG_TYPES).length).toBeGreaterThan(0);
    expect("standard" in CATALOG_TYPES || Array.isArray(CATALOG_TYPES)).toBeTruthy();
  });

  it("resolves catalog types", () => {
    expect(resolveCatalogType("buddy")).toBe("configurator");
    expect(resolveCatalogType("configurator")).toBe("configurator");
    expect(resolveCatalogType("standard")).toBe("standard");
    expect(() => resolveCatalogType("invalid")).toThrow();
  });

  it("lists standard catalog items", async () => {
    const req = new NextRequest(
      "http://localhost/api/catalogs/standard?page=1&limit=10",
    );
    const response = await listStandardCatalog(req);
    const body = (response as unknown as { body?: { items?: unknown[] } }).body;
    expect(body?.items?.length ?? 0).toBeGreaterThan(0);
  });
});
