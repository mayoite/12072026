import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  requestProviderText,
  resolveProviderChain,
} from "@/lib/ai/providerChain";

vi.mock("@/features/shared/api/withAuth", async () => {
  const { error: errorFn } = await import("@/features/shared/api/apiResponse");
  const { ApiError: AE, toApiError: toAE } = await import(
    "@/features/shared/api/ApiError"
  );
  const adminAuth = {
    user: { id: "admin-1", email: "a@test.com", role: "admin" },
    isAdmin: true,
    requiredRole: "admin" as const,
  };
  return {
    withAuth: (
      handler: (
        req: NextRequest,
        auth: typeof adminAuth,
        context: unknown,
      ) => Promise<Response>,
    ) => {
      return async (req: NextRequest, context?: unknown) => {
        try {
          return await handler(req, adminAuth, context);
        } catch (err) {
          if (err instanceof AE) return errorFn(err);
          return errorFn(toAE(err));
        }
      };
    },
  };
});

vi.mock("@/lib/ai/providerChain", () => ({
  requestProviderText: vi.fn(),
  resolveProviderChain: vi.fn(),
}));

import { POST } from "@/app/api/admin/svg-editor/ai-generate/route";

function makeReq(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/admin/svg-editor/ai-generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("app/api/admin/svg-editor/ai-generate/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST returns 400 when prompt is missing", async () => {
    const res = await POST(makeReq({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toMatch(/Prompt is required/);
  });

  it("POST returns 500 when no AI provider is configured", async () => {
    vi.mocked(resolveProviderChain).mockReturnValue([]);
    const res = await POST(makeReq({ prompt: "desk top-down" }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toMatch(/No AI provider/);
  });

  it("POST returns cleaned SVG on success", async () => {
    vi.mocked(resolveProviderChain).mockReturnValue([
      { provider: "gemini", model: "gemini-pro" },
    ] as never);
    vi.mocked(requestProviderText).mockResolvedValue(
      "```svg\n<path d=\"M0 0\"/>\n```",
    );

    const res = await POST(makeReq({ prompt: "chair outline" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.svg).toBe('<path d="M0 0"/>');
    expect(body.provider).toBe("gemini");
    expect(requestProviderText).toHaveBeenCalled();
  });
});
