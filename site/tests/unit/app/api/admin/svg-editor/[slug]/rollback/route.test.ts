import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { rollbackDescriptorToVersion } from "@/features/admin/svg-editor/lifecycle/rollbackDescriptorVersion";
import { tryLoad } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";

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

vi.mock("@/features/admin/svg-editor/lifecycle/rollbackDescriptorVersion", () => ({
  rollbackDescriptorToVersion: vi.fn(),
}));

vi.mock("@/features/planner/catalog/svg/svgBlockDescriptorLoader", () => ({
  tryLoad: vi.fn(),
}));

import { POST } from "@/app/api/admin/svg-editor/[slug]/rollback/route";

const routeContext = { params: Promise.resolve({ slug: "desk-a" }) };

function makeReq(body: unknown): NextRequest {
  return new NextRequest(
    "http://localhost/api/admin/svg-editor/desk-a/rollback",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

describe("app/api/admin/svg-editor/[slug]/rollback/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tryLoad).mockReturnValue({ ok: true } as never);
  });

  it("POST returns 404 when descriptor is missing", async () => {
    vi.mocked(tryLoad).mockReturnValue({ ok: false } as never);
    const res = await POST(makeReq({ version: 1 }), routeContext);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("RESOURCE_NOT_FOUND");
  });

  it("POST returns 400 when version is not a positive integer", async () => {
    const res = await POST(makeReq({ version: 0 }), routeContext);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toMatch(/positive integer/);
  });

  it("POST returns 422 when rollback fails", async () => {
    vi.mocked(rollbackDescriptorToVersion).mockResolvedValue({
      ok: false,
      error: "revision missing",
    } as never);

    const res = await POST(makeReq({ version: 3 }), routeContext);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("revision missing");
  });

  it("POST returns success payload on rollback", async () => {
    vi.mocked(rollbackDescriptorToVersion).mockResolvedValue({
      ok: true,
      slug: "desk-a",
      version: 2,
    } as never);

    const res = await POST(makeReq({ version: 2 }), routeContext);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.slug).toBe("desk-a");
    expect(rollbackDescriptorToVersion).toHaveBeenCalledWith(
      "desk-a",
      2,
      "admin-1",
    );
  });
});
