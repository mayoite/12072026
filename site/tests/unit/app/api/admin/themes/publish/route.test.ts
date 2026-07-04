import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/admin/themes/publish/route";
import {
  enforceAdminRateLimit,
  requireAdminSession,
} from "@/app/api/admin/_lib/server";
import { validateCsrfRequest } from "@/lib/security/csrf";
import {
  createR2CatalogClient,
  resolveCatalogBucketName,
  contentTypeForKey,
} from "@/lib/storage/r2Catalog";

vi.mock("@/app/api/admin/_lib/server", () => ({
  enforceAdminRateLimit: vi.fn(),
  requireAdminSession: vi.fn(),
}));

vi.mock("@/lib/security/csrf", () => ({
  validateCsrfRequest: vi.fn(),
}));

const mockSend = vi.hoisted(() => vi.fn());

vi.mock("@/lib/storage/r2Catalog", () => ({
  createR2CatalogClient: vi.fn(() => ({ send: mockSend })),
  resolveCatalogBucketName: vi.fn(() => "catalog-bucket"),
  contentTypeForKey: vi.fn(() => "application/json"),
}));

vi.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: class PutObjectCommand {
    input: unknown;
    constructor(input: unknown) {
      this.input = input;
    }
  },
}));

describe("app/api/admin/themes/publish/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(enforceAdminRateLimit).mockResolvedValue(null);
    vi.mocked(requireAdminSession).mockResolvedValue(null);
    vi.mocked(validateCsrfRequest).mockResolvedValue(true);
    mockSend.mockResolvedValue({});
  });

  const createReq = (body: unknown) =>
    new NextRequest("http://localhost/api/admin/themes/publish", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

  it("returns 403 when CSRF is invalid", async () => {
    vi.mocked(validateCsrfRequest).mockResolvedValue(false);
    const res = await POST(createReq({ themeName: "premium", tokens: { "--bg": "var(--color-white-50)" } }));
    expect(res.status).toBe(403);
  });

  it("returns 400 when themeName or tokens are invalid", async () => {
    const res = await POST(createReq({ themeName: "bad name!", tokens: "not-an-object" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing themeName or tokens");
  });

  it("publishes theme to R2 and returns CDN url", async () => {
    const res = await POST(
      createReq({ themeName: "premium-light", tokens: { "--primary": "var(--color-black)" } }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.url).toContain("themes/premium-light.json");
    expect(mockSend).toHaveBeenCalled();
    expect(createR2CatalogClient).toHaveBeenCalled();
    expect(resolveCatalogBucketName).toHaveBeenCalled();
    expect(contentTypeForKey).toHaveBeenCalled();
  });
});
