import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  readAdminPriceBookAudit,
  runPriceBookAction,
} from "@/features/admin/pricing/priceBookAdmin.server";

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

vi.mock("@/features/admin/pricing/priceBookAdmin.server", () => ({
  readAdminPriceBookAudit: vi.fn(),
  runPriceBookAction: vi.fn(),
}));

import { POST } from "@/app/api/admin/price-books/[bookId]/action/route";

const routeContext = {
  params: Promise.resolve({ bookId: "pb-linear-2026-q3" }),
};

function makeReq(body: unknown): NextRequest {
  return new NextRequest(
    "http://localhost/api/admin/price-books/pb-linear-2026-q3/action",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

describe("app/api/admin/price-books/[bookId]/action/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readAdminPriceBookAudit).mockResolvedValue([]);
  });

  it("POST returns 400 when action is invalid", async () => {
    const res = await POST(
      makeReq({ action: "publish", versionId: "v1" }),
      routeContext,
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toMatch(/approve, activate, or rollback/);
  });

  it("POST returns 400 when versionId is missing", async () => {
    const res = await POST(makeReq({ action: "approve" }), routeContext);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toMatch(/versionId/);
  });

  it("POST returns 422 when action is denied by service", async () => {
    vi.mocked(runPriceBookAction).mockResolvedValue({
      ok: false,
      error: "not approver",
    } as never);

    const res = await POST(
      makeReq({ action: "approve", versionId: "v1", role: "viewer" }),
      routeContext,
    );
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("not approver");
  });

  it("POST returns contract + history on success", async () => {
    vi.mocked(runPriceBookAction).mockResolvedValue({
      ok: true,
      contract: { bookId: "pb-linear-2026-q3" },
      previousActiveVersionId: null,
      newActiveVersionId: "v1",
    } as never);
    vi.mocked(readAdminPriceBookAudit).mockResolvedValue([
      { action: "approve", versionId: "v1" },
    ] as never);

    const res = await POST(
      makeReq({
        action: "approve",
        versionId: "v1",
        role: "approver",
        reason: "ok",
      }),
      routeContext,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.contract.bookId).toBe("pb-linear-2026-q3");
    expect(body.history).toHaveLength(1);
    expect(body.newActiveVersionId).toBe("v1");
    expect(runPriceBookAction).toHaveBeenCalledWith(
      "pb-linear-2026-q3",
      "approve",
      "v1",
      "approver",
      { actorId: "admin-1", reason: "ok" },
    );
  });
});
