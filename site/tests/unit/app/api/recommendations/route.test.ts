import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/recommendations/route";
import { getProducts } from "@/lib/catalog/site/getProducts";
import { createSupabaseAuthAdminClient } from "@/platform/supabase/auth-admin";
import { rateLimit } from "@/lib/rateLimit";
import { createAnonymousUserId } from "@/lib/tracking/anonymousUserId";

vi.mock("@/lib/catalog/site/getProducts", () => ({
  getProducts: vi.fn(),
}));

vi.mock("@/platform/supabase/auth-admin", () => ({
  createSupabaseAuthAdminClient: vi.fn(),
}));

vi.mock("@/lib/catalog/site/categories", () => ({
  getCatalogProductHref: vi.fn((cat, slug) => `/catalog/${cat}/${slug}`),
}));

vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/tracking/anonymousUserId", () => ({
  createAnonymousUserId: vi.fn(() => "new-anon-123"),
  normalizeAnonymousUserId: vi.fn((id) => id || null),
}));

describe("Recommendations API Route", () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "auth-user-999" } } }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    (createSupabaseAuthAdminClient as any).mockReturnValue(mockSupabase);
    (rateLimit as any).mockResolvedValue({ success: true, reset: 12345 });
  });

  const createReq = (body: any, headers: Record<string, string> = {}) => {
    return new NextRequest("http://localhost/api/recommendations", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
  };

  it("should return 429 if rate limit is exceeded", async () => {
    (rateLimit as any).mockResolvedValue({ success: false, reset: 999 });
    const req = createReq({});
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toBe("Too many requests. Please slow down.");
    expect(res.headers.get("X-RateLimit-Reset")).toBe("999");
  });

  it("should return empty recommendations if getProducts returns empty", async () => {
    (getProducts as any).mockResolvedValue([]);
    const req = createReq({});
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.mode).toBe("popular");
    expect(data.recommendations).toEqual([]);
  });

  it("should use bearer token auth for resolving user ID if present", async () => {
    (getProducts as any).mockResolvedValue([
      { id: "p1", name: "Chair A", category_id: "office-chairs", slug: "chair-a", metadata: { priceRange: "budget" } },
    ]);
    const req = createReq({ userId: "" }, { authorization: "Bearer token123" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockSupabase.auth.getUser).toHaveBeenCalledWith("token123");
  });

  it("should fallback to generating anonymous user ID if auth and body id are missing", async () => {
    (getProducts as any).mockResolvedValue([
      { id: "p1", name: "Chair A", category_id: "office-chairs", slug: "chair-a" },
    ]);
    const req = createReq({ userId: "" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(createAnonymousUserId).toHaveBeenCalled();
  });

  it("should show popular products if there is no viewed products history (data is null)", async () => {
    (getProducts as any).mockResolvedValue([
      { id: "p1", name: "Chair A", category_id: "office-chairs", slug: "chair-a", metadata: { priceRange: "mid" } },
      { id: "p2", name: "Chair B", category_id: "office-chairs", slug: "chair-b", metadata: { priceRange: "premium" } },
    ]);
    mockSupabase.maybeSingle.mockResolvedValue({ data: null, error: null });
    const req = createReq({ userId: "anon-456", limit: 2 });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.mode).toBe("popular");
    expect(data.recommendations).toHaveLength(2);
    expect(data.recommendations[0].productId).toBe("p1");
    expect(data.recommendations[0].budgetEstimate).toBe("Mid range");
    expect(data.recommendations[1].budgetEstimate).toBe("Premium range");
  });

  it("should show popular products if database returns missing table error or other database error", async () => {
    (getProducts as any).mockResolvedValue([
      { id: "p1", name: "Chair A", category_id: "office-chairs", slug: "chair-a", metadata: { priceRange: "luxury" } },
    ]);
    const spyConsole = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSupabase.maybeSingle.mockResolvedValue({
      data: null,
      error: { message: "Could not find the table public.user_history in the schema" },
    });
    const req = createReq({ userId: "anon-456" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.mode).toBe("popular");
    expect(data.recommendations[0].budgetEstimate).toBe("Luxury range");
    // Should NOT log for missing table
    expect(spyConsole).not.toHaveBeenCalled();

    // Now test with other error which SHOULD log
    mockSupabase.maybeSingle.mockResolvedValue({
      data: null,
      error: { message: "Some other database error" },
    });
    await POST(createReq({ userId: "anon-456" }));
    expect(spyConsole).toHaveBeenCalled();
    spyConsole.mockRestore();
  });

  it("should recommend personalized products based on frequency of category views", async () => {
    (getProducts as any).mockResolvedValue([
      { id: "p1", name: "Chair A", category_id: "chairs", slug: "chair-a", metadata: { priceRange: "luxury" } },
      { id: "p2", name: "Desk B", category_id: "desks", slug: "desk-b", metadata: { priceRange: "budget" } },
      { id: "p3", name: "Chair C", category_id: "chairs", slug: "chair-c" },
      { id: "p4", name: "Table D", category_id: "tables", slug: "table-d" },
    ]);

    // User viewed p1 (chairs) and p2 (desks)
    mockSupabase.maybeSingle.mockResolvedValue({
      data: { viewed_products: ["p1", "p2"] },
      error: null,
    });

    const req = createReq({ userId: "anon-789", limit: 2 });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.mode).toBe("personalized");
    expect(data.recommendations).toHaveLength(2);
    expect(data.recommendations[0].productId).toBe("p3");
    expect(data.recommendations[1].productId).toBe("p4");
    expect(data.recommendations[0].budgetEstimate).toBe("Consult for pricing");
  });

  it("should return 500 when an exception occurs", async () => {
    (getProducts as any).mockRejectedValue(new Error("Generic Failure"));
    const spyConsole = vi.spyOn(console, "error").mockImplementation(() => {});
    const req = createReq({ userId: "anon-fail" });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.mode).toBe("popular");
    expect(data.summary).toBe("Recommendations are temporarily unavailable.");
    expect(spyConsole).toHaveBeenCalled();
    spyConsole.mockRestore();
  });
});
