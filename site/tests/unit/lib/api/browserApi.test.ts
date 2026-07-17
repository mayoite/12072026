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
    mockFetch.mockResolvedValueOnce(
      Response.json({ token: "token123" }, { status: 200 }),
    );

    const token = await ensureCsrfToken();
    expect(token).toBe("token123");
    expect(mockFetch).toHaveBeenCalledWith("/api/csrf/", {
      credentials: "include",
      cache: "no-store",
    });
  });

  it("bootstraps before the first mutating request", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch
      .mockResolvedValueOnce(Response.json({ token: "token123" }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const response = await browserApiFetch("/api/update", { method: "POST" });
    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const request = mockFetch.mock.calls[1];
    expect(request?.[0]).toBe("/api/update/");
    expect(request?.[1]).toEqual(
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "x-csrf-token": "token123" }),
      }),
    );
  });

  it("does not retry an authorization 403", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch
      .mockResolvedValueOnce(Response.json({ token: "token123" }))
      .mockResolvedValueOnce(Response.json({ error: "Forbidden" }, { status: 403 }));

    const response = await browserApiFetch("/api/update", { method: "POST" });

    expect(response.status).toBe(403);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("refreshes once after an explicit CSRF rejection", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch
      .mockResolvedValueOnce(Response.json({ token: "firstToken" }))
      .mockResolvedValueOnce(
        Response.json(
          { error: { message: "Invalid or missing CSRF token" } },
          { status: 403, headers: { "X-CSRF-Rejected": "1" } },
        ),
      )
      .mockResolvedValueOnce(Response.json({ token: "secondToken" }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const response = await browserApiFetch("/api/update", { method: "POST" });

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(4);
    expect(mockFetch.mock.calls[3]?.[1]).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({ "x-csrf-token": "secondToken" }),
      }),
    );
  });
});
