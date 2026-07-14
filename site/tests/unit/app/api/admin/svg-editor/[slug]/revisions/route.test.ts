import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { listDescriptorRevisions } from "@/features/admin/svg-editor/descriptorRevisionIndex";
import { readDescriptorAuditForSlug } from "@/features/admin/svg-editor/descriptorAuditLog";
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

vi.mock("@/features/admin/svg-editor/descriptorRevisionIndex", () => ({
  listDescriptorRevisions: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/descriptorAuditLog", () => ({
  readDescriptorAuditForSlug: vi.fn(),
}));

vi.mock("@/features/planner/project/catalog/svg/svgBlockDescriptorLoader", () => ({
  tryLoad: vi.fn(),
}));

import { GET } from "@/app/api/admin/svg-editor/[slug]/revisions/route";

const routeContext = { params: Promise.resolve({ slug: "desk-a" }) };

describe("app/api/admin/svg-editor/[slug]/revisions/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tryLoad).mockReturnValue({ ok: true } as never);
  });

  it("GET returns 404 when descriptor is missing", async () => {
    vi.mocked(tryLoad).mockReturnValue({ ok: false } as never);
    const res = await GET(
      new NextRequest("http://localhost/api/admin/svg-editor/missing/revisions"),
      { params: Promise.resolve({ slug: "missing" }) },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("RESOURCE_NOT_FOUND");
  });

  it("GET returns revisions and audit for slug", async () => {
    vi.mocked(listDescriptorRevisions).mockReturnValue([
      { version: 1, path: "/r1" },
    ] as never);
    vi.mocked(readDescriptorAuditForSlug).mockReturnValue([
      { action: "save", slug: "desk-a" },
    ] as never);

    const res = await GET(
      new NextRequest("http://localhost/api/admin/svg-editor/desk-a/revisions"),
      routeContext,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.slug).toBe("desk-a");
    expect(body.revisions).toHaveLength(1);
    expect(body.audit).toHaveLength(1);
    expect(listDescriptorRevisions).toHaveBeenCalledWith("desk-a");
  });
});
