import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { bulkImportBlockDescriptors } from "@/features/admin/svg-editor/bulkImportBlockDescriptors";
import { appendDescriptorAudit } from "@/features/admin/svg-editor/descriptorAuditLog";

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

vi.mock("@/features/admin/svg-editor/bulkImportBlockDescriptors", () => ({
  bulkImportBlockDescriptors: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/descriptorAuditLog", () => ({
  appendDescriptorAudit: vi.fn(),
}));

import { POST } from "@/app/api/admin/svg-editor/bulk-import/route";

function makeReq(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/admin/svg-editor/bulk-import", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("app/api/admin/svg-editor/bulk-import/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST returns 400 when csv is missing", async () => {
    const res = await POST(makeReq({ dryRun: true }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toMatch(/csv field is required/);
  });

  it("POST dryRun returns preview payload", async () => {
    vi.mocked(bulkImportBlockDescriptors).mockReturnValue({
      dryRun: true,
      summary: { total: 1, accepted: 1, rejected: 0 },
      additions: [
        {
          slug: "desk-a",
          sku: "SKU-1",
          csvRow: 2,
          lifecycle: "draft",
        },
      ],
      rejects: [],
      conflicts: [],
      canApply: true,
    } as never);

    const res = await POST(
      makeReq({ csv: "slug,sku\ndesk-a,SKU-1", dryRun: true }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.dryRun).toBe(true);
    expect(body.additions[0].slug).toBe("desk-a");
    expect(body.canApply).toBe(true);
  });

  it("POST apply returns 422 on import failure", async () => {
    vi.mocked(bulkImportBlockDescriptors).mockReturnValue({
      ok: false,
      errors: ["row 2 invalid slug"],
    } as never);

    const res = await POST(makeReq({ csv: "slug\nbad slug" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.errors).toContain("row 2 invalid slug");
  });

  it("POST apply imports and audits each slug", async () => {
    vi.mocked(bulkImportBlockDescriptors).mockReturnValue({
      ok: true,
      imported: ["desk-a", "desk-b"],
      provenance: { source: "csv" },
    } as never);

    const res = await POST(makeReq({ csv: "slug\ndesk-a\ndesk-b" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.imported).toEqual(["desk-a", "desk-b"]);
    expect(body.count).toBe(2);
    expect(appendDescriptorAudit).toHaveBeenCalledTimes(2);
  });
});
