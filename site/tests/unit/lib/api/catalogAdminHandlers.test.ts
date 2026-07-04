import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveCatalogType, listStandardCatalog } from "@/lib/api/catalogAdminHandlers";
import { NextRequest } from "next/server";

vi.mock("@/app/api/admin/_lib/server", () => {
  const mockSupabase = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
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
    constructor(url: string, init?: RequestInit) {
      this.url = url;
      this.method = init?.method ?? 'GET';
      this.headers = new Headers(init?.headers as HeadersInit);
    }
    nextUrl = { searchParams: new URLSearchParams(new URL('http://localhost/api/catalogs/standard?page=1&limit=10').search) };
  },
}));

describe("catalogAdminHandlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves catalog types correctly", () => {
    expect(resolveCatalogType("buddy")).toBe("configurator");
    expect(resolveCatalogType("standard")).toBe("standard");
    expect(resolveCatalogType("configurator")).toBe("configurator");
    expect(() => resolveCatalogType("invalid")).toThrow();
  });

  it("lists standard catalog items", async () => {
    const req = new NextRequest("http://localhost/api/catalogs/standard?page=1&limit=10");
    const response = await listStandardCatalog(req);
    expect(response).toBeDefined();
    expect((response as any).body.items.length).toBeGreaterThan(0);
  });
});
