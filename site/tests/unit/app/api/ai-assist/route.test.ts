import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const resolveProviderChain = vi.hoisted(() => vi.fn());
const requestProviderText = vi.hoisted(() => vi.fn());

const authCapture = vi.hoisted(() => ({
  options: null as Record<string, unknown> | null,
}));

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth: (
    handler: (req: NextRequest) => Promise<Response>,
    options: Record<string, unknown>,
  ) => {
    authCapture.options = options;
    return handler;
  },
}));

vi.mock("@/lib/ai/providerChain", () => ({
  resolveProviderChain,
  requestProviderText,
}));

import { POST } from "@/app/api/ai-assist/route";

describe("app/api/ai-assist/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("requires CSRF protection on the mutating guest route", () => {
    expect(authCapture.options).toEqual(
      expect.objectContaining({ requireCsrf: true, role: "guest" }),
    );
  });

  const createReq = (body: unknown) =>
    new NextRequest("http://localhost/api/ai-assist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

  it("returns validation error for invalid payload", async () => {
    const res = await POST(createReq({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("returns 500 when no providers are configured", async () => {
    resolveProviderChain.mockReturnValue([]);
    const res = await POST(
      createReq({ messages: [{ role: "user", content: "Hello" }] }),
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toContain("Missing AI provider credentials");
  });

  it("returns provider content on success", async () => {
    resolveProviderChain.mockReturnValue([
      { provider: "openrouter", apiKey: "key", baseURL: "https://openrouter.ai/api/v1", model: "test" },
    ]);
    requestProviderText.mockResolvedValue('{"reply":"Hi"}');

    const res = await POST(
      createReq({ messages: [{ role: "user", content: "Hello" }] }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.content).toBe('{"reply":"Hi"}');
    expect(body.provider).toBe("openrouter");
    expect(res.headers.get("Deprecation")).toBe("true");
  });
});
