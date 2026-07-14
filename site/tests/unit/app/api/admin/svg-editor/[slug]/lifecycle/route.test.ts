import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { setCatalogLifecycle } from "@/features/admin/svg-editor/catalogLifecycle";
import { appendDescriptorAudit } from "@/features/admin/svg-editor/descriptorAuditLog";
import { tryLoad } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";

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

vi.mock("@/features/admin/svg-editor/catalogLifecycle", () => ({
  setCatalogLifecycle: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/descriptorAuditLog", () => ({
  appendDescriptorAudit: vi.fn(),
}));

vi.mock("@/features/planner/project/catalog/svg/svgBlockDescriptorLoader", () => ({
  tryLoad: vi.fn(),
}));

import { PATCH } from "@/app/api/admin/svg-editor/[slug]/lifecycle/route";

const routeContext = { params: Promise.resolve({ slug: "desk-a" }) };

function makeReq(body: unknown): NextRequest {
  return new NextRequest(
    "http://localhost/api/admin/svg-editor/desk-a/lifecycle",
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

describe("app/api/admin/svg-editor/[slug]/lifecycle/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tryLoad).mockReturnValue({ ok: true } as never);
  });

  it("PATCH returns 404 when descriptor is missing", async () => {
    vi.mocked(tryLoad).mockReturnValue({ ok: false } as never);
    const res = await PATCH(makeReq({ state: "live" }), routeContext);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("RESOURCE_NOT_FOUND");
  });

  it("PATCH returns 400 for invalid state", async () => {
    const res = await PATCH(makeReq({ state: "archived" }), routeContext);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toMatch(/live, draft, or retired/);
  });

  it("PATCH sets lifecycle and audits approve when live", async () => {
    vi.mocked(setCatalogLifecycle).mockReturnValue({
      slug: "desk-a",
      state: "live",
    } as never);

    const res = await PATCH(makeReq({ state: "live" }), routeContext);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.slug).toBe("desk-a");
    expect(body.lifecycle.state).toBe("live");
    expect(setCatalogLifecycle).toHaveBeenCalledWith("desk-a", "live");
    expect(appendDescriptorAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: "admin-1",
        slug: "desk-a",
        action: "approve",
      }),
    );
  });
});
