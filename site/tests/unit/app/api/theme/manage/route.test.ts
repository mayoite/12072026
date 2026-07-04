import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/theme/manage/route";
import { getPresetById } from "@/lib/theme/presets";
import { enforceAdminRateLimit, requireAdminSession } from "@/app/api/admin/_lib/server";
import { validateCsrfRequest } from "@/lib/security/csrf";

vi.mock("@/lib/theme/presets", () => ({
  THEME_PRESETS: [
    { id: "premium-light", name: "Premium Light", description: "Light theme", tokens: { "--bg": "var(--color-white-50)" } },
    { id: "premium-dark", name: "Premium Dark", description: "Dark theme", tokens: { "--bg": "var(--color-black)", "--fg": "var(--color-white-50)" } },
  ],
  getPresetById: vi.fn(),
}));

vi.mock("@/app/api/admin/_lib/server", () => ({
  enforceAdminRateLimit: vi.fn(),
  requireAdminSession: vi.fn(),
}));

vi.mock("@/lib/security/csrf", () => ({
  validateCsrfRequest: vi.fn(),
}));

describe("Theme Manage API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createReq = (method: string, body?: any) => {
    return new NextRequest("http://localhost/api/theme/manage", {
      method,
      headers: { "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  describe("GET", () => {
    it("should return rate error if limit is exceeded", async () => {
      const mockRateError = Response.json({ error: "Too many requests" }, { status: 429 });
      (enforceAdminRateLimit as any).mockResolvedValue(mockRateError);

      const res = await GET(createReq("GET"));
      expect(res.status).toBe(429);
    });

    it("should return auth error if session is invalid", async () => {
      (enforceAdminRateLimit as any).mockResolvedValue(null);
      const mockAuthError = Response.json({ error: "Unauthorized" }, { status: 401 });
      (requireAdminSession as any).mockResolvedValue(mockAuthError);

      const res = await GET(createReq("GET"));
      expect(res.status).toBe(401);
    });

    it("should return list of presets including active state", async () => {
      (enforceAdminRateLimit as any).mockResolvedValue(null);
      (requireAdminSession as any).mockResolvedValue(null);

      const res = await GET(createReq("GET"));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.activeThemeId).toBe("premium-light");
      expect(data.presets).toHaveLength(2);
      expect(data.presets[0]).toEqual({
        id: "premium-light",
        name: "Premium Light",
        description: "Light theme",
        tokenCount: 1,
        isActive: true,
      });
      expect(data.presets[1].isActive).toBe(false);
    });
  });

  describe("POST", () => {
    it("should return rate error if limit is exceeded", async () => {
      const mockRateError = Response.json({ error: "Too many requests" }, { status: 429 });
      (enforceAdminRateLimit as any).mockResolvedValue(mockRateError);

      const res = await POST(createReq("POST", { presetId: "premium-dark" }));
      expect(res.status).toBe(429);
    });

    it("should return auth error if session is invalid", async () => {
      (enforceAdminRateLimit as any).mockResolvedValue(null);
      const mockAuthError = Response.json({ error: "Unauthorized" }, { status: 401 });
      (requireAdminSession as any).mockResolvedValue(mockAuthError);

      const res = await POST(createReq("POST", { presetId: "premium-dark" }));
      expect(res.status).toBe(401);
    });

    it("should return 403 if CSRF verification fails", async () => {
      (enforceAdminRateLimit as any).mockResolvedValue(null);
      (requireAdminSession as any).mockResolvedValue(null);
      (validateCsrfRequest as any).mockResolvedValue(false);

      const res = await POST(createReq("POST", { presetId: "premium-dark" }));
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBe("Invalid or missing CSRF token");
    });

    it("should return 400 if presetId is missing in request body", async () => {
      (enforceAdminRateLimit as any).mockResolvedValue(null);
      (requireAdminSession as any).mockResolvedValue(null);
      (validateCsrfRequest as any).mockResolvedValue(true);

      const res = await POST(createReq("POST", {}));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Missing required field: presetId");
    });

    it("should return 404 if preset is unknown", async () => {
      (enforceAdminRateLimit as any).mockResolvedValue(null);
      (requireAdminSession as any).mockResolvedValue(null);
      (validateCsrfRequest as any).mockResolvedValue(true);
      (getPresetById as any).mockReturnValue(null);

      const res = await POST(createReq("POST", { presetId: "unknown-preset" }));
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Unknown preset: unknown-preset");
    });

    it("should activate valid preset and update internal state", async () => {
      (enforceAdminRateLimit as any).mockResolvedValue(null);
      (requireAdminSession as any).mockResolvedValue(null);
      (validateCsrfRequest as any).mockResolvedValue(true);
      const mockPreset = { id: "premium-dark", name: "Premium Dark", tokens: { "--bg": "var(--color-black)" } };
      (getPresetById as any).mockReturnValue(mockPreset);

      const res = await POST(createReq("POST", { presetId: "premium-dark" }));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.activated.id).toBe("premium-dark");

      // Verify that activeThemeId has updated in subsequent GET
      const getRes = await GET(createReq("GET"));
      const getData = await getRes.json();
      expect(getData.activeThemeId).toBe("premium-dark");
    });

    it("should return 400 on malformed json body", async () => {
      (enforceAdminRateLimit as any).mockResolvedValue(null);
      (requireAdminSession as any).mockResolvedValue(null);
      (validateCsrfRequest as any).mockResolvedValue(true);

      const malformedReq = new NextRequest("http://localhost/api/theme/manage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{malformed_json",
      });

      const res = await POST(malformedReq);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Invalid request body");
    });
  });
});
