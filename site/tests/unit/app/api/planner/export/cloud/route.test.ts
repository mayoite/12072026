import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth:
    (
      handler: (
        req: NextRequest,
        auth: { user: { id: string } | null; isAdmin: boolean },
      ) => Promise<Response>,
    ) =>
    (req: NextRequest) =>
      handler(req, { user: { id: "member-1" }, isAdmin: false }),
}));

const publishPlannerExportToSupabase = vi.fn();

vi.mock("@/features/shared/catalog/catalogAssetStorage.server", () => ({
  publishPlannerExportToSupabase: (...args: unknown[]) =>
    publishPlannerExportToSupabase(...args),
}));

import {
  POST,
  normalizePlannerExportContentType,
  PLANNER_CLOUD_EXPORT_CONTENT_TYPES,
} from "@/app/api/planner/export/cloud/route";

function makeReq(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/planner/export/cloud", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("app/api/planner/export/cloud/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    publishPlannerExportToSupabase.mockResolvedValue({
      ok: true,
      path: "planner-exports/member-1/plan-1/1-export.json",
      publicUrl: "https://example.supabase.co/storage/v1/object/public/x",
    });
  });

  it("exports PLANNER_CLOUD_EXPORT_CONTENT_TYPES allowlist", () => {
    expect(PLANNER_CLOUD_EXPORT_CONTENT_TYPES).toContain("application/json");
    expect(PLANNER_CLOUD_EXPORT_CONTENT_TYPES).toContain("text/csv");
    expect(PLANNER_CLOUD_EXPORT_CONTENT_TYPES).toContain("text/plain");
  });

  it("normalizePlannerExportContentType accepts allowlisted types and strips charset", () => {
    expect(normalizePlannerExportContentType("text/csv;charset=utf-8")).toBe("text/csv");
    expect(normalizePlannerExportContentType("application/json")).toBe("application/json");
    expect(normalizePlannerExportContentType(undefined)).toBe("application/json");
  });

  it("normalizePlannerExportContentType rejects text/html and unknown types", () => {
    expect(normalizePlannerExportContentType("text/html")).toBeNull();
    expect(normalizePlannerExportContentType("application/javascript")).toBeNull();
    expect(normalizePlannerExportContentType("image/svg+xml")).toBeNull();
  });

  it("returns 400 for missing body", async () => {
    const res = await POST(makeReq({ planId: "p1", body: "" }));
    expect(res.status).toBe(400);
    expect(publishPlannerExportToSupabase).not.toHaveBeenCalled();
  });

  it("rejects bad content-type without uploading", async () => {
    const res = await POST(
      makeReq({
        planId: "plan-1",
        filename: "evil.html",
        contentType: "text/html",
        body: "<script>alert(1)</script>",
      }),
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("invalid_content_type");
    expect(publishPlannerExportToSupabase).not.toHaveBeenCalled();
  });

  it("uploads allowlisted JSON export", async () => {
    const res = await POST(
      makeReq({
        planId: "plan-1",
        filename: "boq.json",
        contentType: "application/json",
        body: '{"lines":[]}',
      }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(publishPlannerExportToSupabase).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: "member-1",
        planId: "plan-1",
        contentType: "application/json",
      }),
    );
  });

  it("returns 501 when storage is not configured", async () => {
    publishPlannerExportToSupabase.mockResolvedValue({
      ok: false,
      reason: "supabase_service_role_not_configured",
    });
    const res = await POST(
      makeReq({
        planId: "plan-1",
        body: "{}",
        contentType: "application/json",
      }),
    );
    expect(res.status).toBe(501);
  });
});
