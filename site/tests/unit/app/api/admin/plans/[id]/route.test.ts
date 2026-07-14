import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/plans/[id]/route";
import {
  enforceAdminRateLimit,
  requireAdminSession,
} from "@/app/api/admin/_lib/server";
import {
  isPlannerDatabaseConfigured,
  loadPlannerDocumentAdmin,
  planRowToAdminDetail,
} from "@/features/planner/cloud-store/plannerPersistence";

vi.mock("@/app/api/admin/_lib/server", () => ({
  enforceAdminRateLimit: vi.fn(),
  requireAdminSession: vi.fn(),
}));

vi.mock("@/features/planner/cloud-store/plannerPersistence", () => ({
  isPlannerDatabaseConfigured: vi.fn(),
  loadPlannerDocumentAdmin: vi.fn(),
  planRowToAdminDetail: vi.fn(async (row) => row),
}));

vi.mock("@/lib/api/routeObservability", () => ({
  applyPlannerRouteTelemetry: vi.fn((res) => res),
  jsonWithPlannerRouteTelemetry: vi.fn((data) => Response.json(data)),
}));

const routeContext = { params: Promise.resolve({ id: "plan-42" }) };

describe("app/api/admin/plans/[id]/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(enforceAdminRateLimit).mockResolvedValue(null);
    vi.mocked(requireAdminSession).mockResolvedValue(null);
    vi.mocked(isPlannerDatabaseConfigured).mockReturnValue(true);
  });

  it("GET returns 503 when planner storage is not configured", async () => {
    vi.mocked(isPlannerDatabaseConfigured).mockReturnValue(false);
    const res = await GET(
      new NextRequest("http://localhost/api/admin/plans/plan-42"),
      routeContext,
    );
    expect(res.status).toBe(503);
  });

  it("GET returns 404 when plan is not found", async () => {
    vi.mocked(loadPlannerDocumentAdmin).mockResolvedValue({
      success: false,
      error: { code: "NOT_FOUND" },
    } as never);
    const res = await GET(
      new NextRequest("http://localhost/api/admin/plans/plan-42"),
      routeContext,
    );
    expect(res.status).toBe(404);
  });

  it("GET returns admin plan detail on success", async () => {
    vi.mocked(loadPlannerDocumentAdmin).mockResolvedValue({
      success: true,
      row: { id: "plan-42", title: "HQ Fitout" },
    } as never);
    const res = await GET(
      new NextRequest("http://localhost/api/admin/plans/plan-42"),
      routeContext,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.plan.id).toBe("plan-42");
    expect(planRowToAdminDetail).toHaveBeenCalled();
  });
});
