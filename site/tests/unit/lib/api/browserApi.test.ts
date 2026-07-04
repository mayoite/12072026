import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiPath, ensureCsrfToken, browserApiFetch, invalidateCsrfToken } from "@/lib/api/browserApi";

describe("browserApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    invalidateCsrfToken();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("normalizes API paths with trailing slash", () => {
    expect(apiPath("/api/products")).toBe("/api/products/");
    expect(apiPath("/api/products?id=123")).toBe("/api/products/?id=123");
    expect(apiPath("/not-api")).toBe("/not-api");
  });

  it("ensureCsrfToken fetches token successfully", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: "token123" }),
    } as any);

    const token = await ensureCsrfToken();
    expect(token).toBe("token123");
    expect(mockFetch).toHaveBeenCalledWith("/api/csrf/", { credentials: "include" });
  });

  it("browserApiFetch forwards requests and retries on 403 for mutating methods", async () => {
    const mockFetch = vi.mocked(fetch);

    // Initial POST returns 403 (no CSRF token yet)
    mockFetch.mockResolvedValueOnce({
      status: 403,
      ok: false,
    } as Response);

    // CSRF bootstrap call returns new token
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: "retryToken" }),
    } as Response);

    // Retry POST returns 200
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
    } as Response);

    const response = await browserApiFetch("/api/update", { method: "POST" });
    expect(response.status).toBe(200);
  });
});
