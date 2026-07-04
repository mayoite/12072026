import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createSupabaseAuthAdminClient } from "@/platform/supabase/auth-admin";
import { rateLimit } from "@/lib/rateLimit";
import { createAnonymousUserId } from "@/lib/tracking/anonymousUserId";
import { TRACKING_ANON_COOKIE } from "@/lib/tracking/trackingCookie";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/platform/supabase/auth-admin", () => ({
  createSupabaseAuthAdminClient: vi.fn(),
}));

vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/tracking/anonymousUserId", () => ({
  createAnonymousUserId: vi.fn(() => "new-anon-123"),
  normalizeAnonymousUserId: vi.fn((id) => (typeof id === "string" && id.trim() ? id.trim() : null)),
}));

import { cookies } from "next/headers";
import { POST } from "@/app/api/tracking/route";

function mockTrackingCookie(value: string | null) {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn((name: string) =>
      name === TRACKING_ANON_COOKIE && value ? { value } : undefined,
    ),
  } as never);
}

describe("Tracking API Route", () => {
  let mockSupabaseAdmin: {
    auth: { getUser: ReturnType<typeof vi.fn> };
    from: ReturnType<typeof vi.fn>;
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    maybeSingle: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockTrackingCookie(null);
    mockSupabaseAdmin = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
    };
    vi.mocked(createSupabaseAuthAdminClient).mockReturnValue(mockSupabaseAdmin as never);
    vi.mocked(rateLimit).mockResolvedValue({ success: true, reset: Date.now() + 60000 });
  });

  const createReq = (body: unknown, headers: Record<string, string> = {}) =>
    new NextRequest("http://localhost/api/tracking", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });

  it("should return 429 if rate limit is exceeded", async () => {
    vi.mocked(rateLimit).mockResolvedValue({ success: false, reset: Date.now() + 10000 });
    const res = await POST(createReq({}));
    expect(res.status).toBe(429);
  });

  it("should return 400 if productId is missing", async () => {
    const res = await POST(createReq({ userId: "user-1" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing productId");
  });

  it("should use bearer token user id if valid", async () => {
    mockSupabaseAdmin.auth.getUser.mockResolvedValue({
      data: { user: { id: "resolved-auth-user" } },
      error: null,
    });
    const res = await POST(
      createReq({ productId: "prod-1" }, { authorization: "Bearer auth-token-xyz" }),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.userId).toBe("resolved-auth-user");
  });

  it("should handle invalid request JSON body gracefully", async () => {
    const res = await POST(createReq("{malformed-json"));
    expect(res.status).toBe(400);
  });

  it("should track viewed products using the HttpOnly anon cookie id", async () => {
    mockTrackingCookie("user-existing");
    mockSupabaseAdmin.maybeSingle.mockResolvedValue({
      data: { viewed_products: ["prod-old-1", "prod-old-2"] },
      error: null,
    });
    const res = await POST(createReq({ productId: "prod-new", userId: "ignored-body-id" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.viewedProducts).toEqual(["prod-old-1", "prod-old-2", "prod-new"]);
    expect(mockSupabaseAdmin.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-existing",
        viewed_products: ["prod-old-1", "prod-old-2", "prod-new"],
      }),
      { onConflict: "user_id" },
    );
  });

  it("should slice the viewed_products array to at most 10 items", async () => {
    mockTrackingCookie("user-existing");
    mockSupabaseAdmin.maybeSingle.mockResolvedValue({
      data: { viewed_products: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"] },
      error: null,
    });
    const res = await POST(createReq({ productId: "p11" }));
    const data = await res.json();
    expect(data.viewedProducts).toHaveLength(10);
    expect(data.viewedProducts).toEqual(["p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11"]);
  });

  it("should return noop response if Supabase admin client throws on creation", async () => {
    vi.mocked(createSupabaseAuthAdminClient).mockImplementation(() => {
      throw new Error("Admin configuration unavailable");
    });
    const res = await POST(createReq({ productId: "prod-1" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.tracked).toBe(false);
    expect(data.success).toBe(true);
    expect(data.userId).toBe("new-anon-123");
  });

  it("should return noop response if user_history table is missing during read or write", async () => {
    mockTrackingCookie("user-1");
    mockSupabaseAdmin.maybeSingle.mockResolvedValue({
      data: null,
      error: { message: 'relation "public.user_history" does not exist' },
    });
    const res1 = await POST(createReq({ productId: "prod-1" }));
    expect(res1.status).toBe(200);

    mockSupabaseAdmin.maybeSingle.mockResolvedValue({ data: null, error: null });
    mockSupabaseAdmin.upsert.mockResolvedValue({
      error: { message: "Could not find the table public.user_history in the schema" },
    });
    const res2 = await POST(createReq({ productId: "prod-1" }));
    expect(res2.status).toBe(200);
  });

  it("should return 500 status when an unhandled exception occurs", async () => {
    vi.mocked(createAnonymousUserId).mockImplementationOnce(() => {
      throw new Error("Global crash");
    });
    const spyConsole = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(createReq({ productId: "prod-1" }));
    expect(res.status).toBe(500);
    expect(spyConsole).toHaveBeenCalled();
    spyConsole.mockRestore();
  });
});
