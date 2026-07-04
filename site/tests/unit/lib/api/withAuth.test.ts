import { describe, it, expect, vi, beforeEach } from "vitest";
import { withAuth, resolveAuthContext } from "@/lib/api/withAuth";
import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rateLimit";
import { validateCsrfRequest } from "@/lib/security/csrf";
import { success } from "@/lib/api/apiResponse";

vi.mock("@/lib/supabase/server", () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  };
  return {
    createServerClient: vi.fn(() => Promise.resolve(mockSupabase)),
  };
});

vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn(() => Promise.resolve({ success: true, reset: 0 })),
}));

vi.mock("@/lib/security/csrf", () => ({
  validateCsrfRequest: vi.fn(() => Promise.resolve(true)),
}));

describe("withAuth middleware", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const supabase = await createServerClient();
    vi.mocked(supabase.auth.getUser).mockReset();
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: null,
    } as never);
    vi.mocked(rateLimit).mockResolvedValue({ success: true, reset: 0 });
    vi.mocked(validateCsrfRequest).mockResolvedValue(true);
  });

  it("returns 429 with rate-limit envelope when limited", async () => {
    vi.mocked(rateLimit).mockResolvedValueOnce({ success: false, reset: 100 });
    const handler = vi.fn();
    const wrapped = withAuth(handler, { rateLimitScope: "test-scope" });

    const response = await wrapped(new NextRequest("http://localhost/api/test"), {});
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(response.headers.get("X-RateLimit-Reset")).toBe("100");
    expect(handler).not.toHaveBeenCalled();
  });

  it("returns 401 when member auth is required but user is missing", async () => {
    const handler = vi.fn();
    const wrapped = withAuth(handler, { rateLimitScope: "test-scope", role: "member" });

    const response = await wrapped(new NextRequest("http://localhost/api/test"), {});
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe("AUTH_REQUIRED");
    expect(handler).not.toHaveBeenCalled();
  });

  it("returns 403 when admin role is required but user is only a member", async () => {
    const supabase = await createServerClient();
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: {
        user: {
          id: "user-1",
          email: "member@example.com",
          app_metadata: { role: "member" },
        },
      },
      error: null,
    } as never);

    const handler = vi.fn();
    const wrapped = withAuth(handler, { rateLimitScope: "test-scope", role: "admin" });

    const response = await wrapped(new NextRequest("http://localhost/api/test"), {});
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error.code).toBe("INSUFFICIENT_PERMISSIONS");
    expect(handler).not.toHaveBeenCalled();
  });

  it("returns 403 when CSRF validation fails on mutating requests", async () => {
    const supabase = await createServerClient();
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: {
        user: {
          id: "admin-1",
          email: "admin@example.com",
          app_metadata: { role: "admin" },
        },
      },
      error: null,
    } as never);
    vi.mocked(validateCsrfRequest).mockResolvedValueOnce(false);

    const handler = vi.fn();
    const wrapped = withAuth(handler, {
      rateLimitScope: "test-scope",
      role: "admin",
      requireCsrf: true,
    });

    const response = await wrapped(
      new NextRequest("http://localhost/api/test", { method: "POST" }),
      {},
    );
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error.message).toContain("CSRF");
    expect(handler).not.toHaveBeenCalled();
  });

  it("invokes handler with resolved auth context for authenticated admin", async () => {
    const supabase = await createServerClient();
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: {
        user: {
          id: "admin-1",
          email: "admin@example.com",
          app_metadata: { roles: ["admin"] },
        },
      },
      error: null,
    } as never);

    const handler = vi.fn(async (_req, auth) =>
      success({ userId: auth.user?.id, isAdmin: auth.isAdmin }),
    );
    const wrapped = withAuth(handler, { rateLimitScope: "test-scope", role: "admin" });

    const response = await wrapped(new NextRequest("http://localhost/api/test"), {});
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.userId).toBe("admin-1");
    expect(body.isAdmin).toBe(true);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("resolveAuthContext allows guest routes without a session", async () => {
    const auth = await resolveAuthContext("guest");
    expect(auth.user).toBeNull();
    expect(auth.isAdmin).toBe(false);
    expect(auth.requiredRole).toBe("guest");
  });
});
