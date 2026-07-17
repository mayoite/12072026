import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import {
  enforceAdminRateLimit,
  requireAdminSession,
} from "@/app/api/admin/_lib/server";
import {
  createAdminServiceClient,
  getClientIp,
  isMissingTableError,
} from "@/platform/supabase/adminServer";
import { rateLimit } from "@/lib/rateLimit";
import { createServerClient } from "@/platform/supabase/server";
import { DEV_BYPASS_USER } from "@/lib/auth/devAuthBypass";

vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn(),
}));

vi.mock("@/platform/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({ auth: { persistSession: false } })),
}));

describe("app/api/admin/_lib/server.ts", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    // Unit gate honesty: bypass must be off unless a test turns it on.
    process.env.DEV_AUTH_BYPASS = "0";
    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("enforceAdminRateLimit", () => {
    it("returns null on success", async () => {
      vi.mocked(rateLimit).mockResolvedValue({ success: true, reset: 1 });
      const req = new NextRequest("http://localhost");
      const result = await enforceAdminRateLimit(req, "plans:get");
      expect(result).toBeNull();
      expect(rateLimit).toHaveBeenCalledWith("admin:plans:get:127.0.0.1", 30, 60 * 1000);
    });

    it("returns 429 when limited", async () => {
      vi.mocked(rateLimit).mockResolvedValue({ success: false, reset: 42 });
      const req = new NextRequest("http://localhost");
      const result = await enforceAdminRateLimit(req, "plans:get");
      expect(result?.status).toBe(429);
      expect(result?.headers.get("X-RateLimit-Reset")).toBe("42");
    });
  });

  describe("requireAdminSession", () => {
    it("returns 401 when session is missing and DEV_AUTH_BYPASS is off", async () => {
      vi.mocked(createServerClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      } as never);
      const result = await requireAdminSession();
      expect(result?.status).toBe(401);
      const body = await result?.json();
      expect(body).toMatchObject({ error: expect.any(String) });
    });

    it("returns 403 when session user is not admin and bypass is off", async () => {
      vi.mocked(createServerClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: "member-1",
                email: "member@example.com",
                app_metadata: { role: "member" },
              },
            },
            error: null,
          }),
        },
      } as never);
      const result = await requireAdminSession();
      expect(result?.status).toBe(403);
    });

    it("returns null when an admin session is present", async () => {
      vi.mocked(createServerClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: "admin-1",
                email: "admin@example.com",
                app_metadata: { role: "admin" },
              },
            },
            error: null,
          }),
        },
      } as never);
      const result = await requireAdminSession();
      expect(result).toBeNull();
    });

    it("returns null under DEV_AUTH_BYPASS=1 in non-production (local only)", async () => {
      process.env.NODE_ENV = "development";
      process.env.DEV_AUTH_BYPASS = "1";
      const result = await requireAdminSession();
      expect(result).toBeNull();
      // Bypass must not call Supabase when enabled.
      expect(createServerClient).not.toHaveBeenCalled();
      expect(DEV_BYPASS_USER.role).toBe("admin");
    });

    it("returns 401 in production even when DEV_AUTH_BYPASS=1 and session missing", async () => {
      process.env.NODE_ENV = "production";
      process.env.DEV_AUTH_BYPASS = "1";
      vi.mocked(createServerClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      } as never);
      const result = await requireAdminSession();
      expect(result?.status).toBe(401);
    });
  });
});

describe("platform/supabase/adminServer (used by admin routes)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("getClientIp reads cf-connecting-ip first", () => {
    const req = new NextRequest("http://localhost", {
      headers: { "cf-connecting-ip": "1.1.1.1" },
    });
    expect(getClientIp(req)).toBe("1.1.1.1");
  });

  it("isMissingTableError detects missing table messages", () => {
    expect(isMissingTableError("relation foo does not exist")).toBe(true);
    expect(isMissingTableError("Could not find the table public.foo")).toBe(true);
    expect(isMissingTableError("permission denied for table foo")).toBe(true);
    expect(isMissingTableError("connection timeout")).toBe(false);
  });

  it("createAdminServiceClient returns null when service env is missing", () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(createAdminServiceClient()).toBeNull();
  });

  it("createAdminServiceClient returns a client when env is configured", () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    expect(createAdminServiceClient()).not.toBeNull();
  });
});
