import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import {
  createAdminServiceClient,
  getClientIp,
  enforceAdminRateLimit,
  requireAdminSession,
  isMissingTableError,
} from "@/app/api/admin/_lib/server";
import { rateLimit } from "@/lib/rateLimit";
import { createServerClient } from "@/lib/supabase/server";

vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
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
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getClientIp", () => {
    it("reads cf-connecting-ip first", () => {
      const req = new NextRequest("http://localhost", {
        headers: { "cf-connecting-ip": "1.1.1.1" },
      });
      expect(getClientIp(req)).toBe("1.1.1.1");
    });
  });

  describe("isMissingTableError", () => {
    it("detects missing table messages", () => {
      expect(isMissingTableError("relation foo does not exist")).toBe(true);
      expect(isMissingTableError("Could not find the table public.foo")).toBe(true);
      expect(isMissingTableError("permission denied for table foo")).toBe(true);
      expect(isMissingTableError("connection timeout")).toBe(false);
    });
  });

  describe("createAdminServiceClient", () => {
    it("returns null when service env is missing", () => {
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
      expect(createAdminServiceClient()).toBeNull();
    });

    it("returns a client when env is configured", () => {
      process.env.SUPABASE_URL = "https://example.supabase.co";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
      expect(createAdminServiceClient()).not.toBeNull();
    });
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
      expect(result!.status).toBe(429);
      const body = await result!.json();
      expect(body.error).toBe("Too many requests.");
    });
  });

  describe("requireAdminSession", () => {
    it("returns 401 when user is missing", async () => {
      vi.mocked(createServerClient).mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
      } as never);
      const result = await requireAdminSession();
      expect(result!.status).toBe(401);
    });

    it("returns 403 when user is not admin", async () => {
      vi.mocked(createServerClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-1", app_metadata: { role: "member" } } },
            error: null,
          }),
        },
      } as never);
      const result = await requireAdminSession();
      expect(result!.status).toBe(403);
    });

    it("returns null for admin session", async () => {
      vi.mocked(createServerClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "admin-1", app_metadata: { role: "admin" } } },
            error: null,
          }),
        },
      } as never);
      const result = await requireAdminSession();
      expect(result).toBeNull();
    });
  });
});
