import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH, DELETE } from "@/app/api/admin/plans/route";
import {
  enforceAdminRateLimit,
  requireAdminSession,
} from "@/app/api/admin/_lib/server";
import { validateCsrfRequest } from "@/lib/security/csrf";
import {
  isPlannerDatabaseConfigured,
  listPlannerDocumentsAdmin,
  patchPlannerDocumentAdmin,
  deletePlannerDocument,
  planRowToAdminSummary,
} from "@/features/planner/store/plannerPersistence";

vi.mock("@/app/api/admin/_lib/server", () => ({
  enforceAdminRateLimit: vi.fn(),
  requireAdminSession: vi.fn(),
}));

vi.mock("@/lib/security/csrf", () => ({
  validateCsrfRequest: vi.fn(),
}));

vi.mock("@/features/planner/store/plannerPersistence", () => ({
  isPlannerDatabaseConfigured: vi.fn(),
  listPlannerDocumentsAdmin: vi.fn(),
  patchPlannerDocumentAdmin: vi.fn(),
  deletePlannerDocument: vi.fn(),
  planRowToAdminSummary: vi.fn((row) => row),
}));

vi.mock("@/lib/api/routeObservability", () => ({
  applyPlannerRouteTelemetry: vi.fn((res) => res),
  jsonWithPlannerRouteTelemetry: vi.fn((data) => Response.json(data)),
}));

describe("app/api/admin/plans/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(enforceAdminRateLimit).mockResolvedValue(null);
    vi.mocked(requireAdminSession).mockResolvedValue(null);
    vi.mocked(validateCsrfRequest).mockResolvedValue(true);
    vi.mocked(isPlannerDatabaseConfigured).mockReturnValue(false);
  });

  it("GET returns unconfigured payload when planner DB is missing", async () => {
    const res = await GET(new NextRequest("http://localhost/api/admin/plans"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.plans).toEqual([]);
    expect(body.source).toBe("unconfigured");
  });

  it("GET returns 401 when admin session is missing", async () => {
    vi.mocked(requireAdminSession).mockResolvedValue(
      Response.json({ error: "Unauthorized" }, { status: 401 }) as never,
    );
    const res = await GET(new NextRequest("http://localhost/api/admin/plans"));
    expect(res.status).toBe(401);
  });

  it("PATCH returns 403 when CSRF is invalid", async () => {
    vi.mocked(isPlannerDatabaseConfigured).mockReturnValue(true);
    vi.mocked(validateCsrfRequest).mockResolvedValue(false);
    const req = new NextRequest("http://localhost/api/admin/plans", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: "plan-1", status: "active" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(403);
  });

  it("DELETE returns 400 when id query param is missing", async () => {
    vi.mocked(isPlannerDatabaseConfigured).mockReturnValue(true);
    const res = await DELETE(new NextRequest("http://localhost/api/admin/plans", { method: "DELETE" }));
    expect(res.status).toBe(400);
  });

  it("DELETE removes plan when configured", async () => {
    vi.mocked(isPlannerDatabaseConfigured).mockReturnValue(true);
    vi.mocked(deletePlannerDocument).mockResolvedValue({ success: true } as never);
    const res = await DELETE(
      new NextRequest("http://localhost/api/admin/plans?id=plan-1", { method: "DELETE" }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(deletePlannerDocument).toHaveBeenCalledWith("plan-1");
    expect(planRowToAdminSummary).not.toHaveBeenCalled();
    expect(listPlannerDocumentsAdmin).not.toHaveBeenCalled();
    expect(patchPlannerDocumentAdmin).not.toHaveBeenCalled();
  });
});
