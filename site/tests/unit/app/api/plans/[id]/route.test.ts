import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "@/app/api/plans/[id]/route";
import { createServerClient } from "@/lib/supabase/server";
import {
  loadPlannerDocumentFromStore,
  savePlannerDocumentToStore,
  deletePlannerDocumentFromStore,
} from "@/features/planner/store/plannerSaves";
import { rateLimit } from "@/lib/rateLimit";
import { validateCsrfRequest } from "@/lib/security/csrf";

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@/features/planner/store/plannerSaves", () => ({
  loadPlannerDocumentFromStore: vi.fn(),
  savePlannerDocumentToStore: vi.fn(),
  deletePlannerDocumentFromStore: vi.fn(),
}));

vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/security/csrf", () => ({
  validateCsrfRequest: vi.fn(),
}));

vi.mock("@/lib/api/routeObservability", () => ({
  applyPlannerRouteTelemetry: vi.fn((res) => res),
  jsonWithPlannerRouteTelemetry: vi.fn((data) => Response.json(data)),
}));

const routeContext = { params: Promise.resolve({ id: "plan-1" }) };

describe("app/api/plans/[id]/route.ts", () => {
  let mockSupabase: { auth: { getUser: ReturnType<typeof vi.fn> } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
      },
    };
    vi.mocked(createServerClient).mockResolvedValue(mockSupabase as never);
    vi.mocked(rateLimit).mockResolvedValue({ success: true, reset: 1 });
    vi.mocked(validateCsrfRequest).mockResolvedValue(true);
  });

  it("GET returns 401 when unauthenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const res = await GET(new NextRequest("http://localhost/api/plans/plan-1"), routeContext);
    expect(res.status).toBe(401);
  });

  it("GET returns 404 when plan is missing", async () => {
    vi.mocked(loadPlannerDocumentFromStore).mockResolvedValue(null);
    const res = await GET(new NextRequest("http://localhost/api/plans/plan-1"), routeContext);
    expect(res.status).toBe(404);
  });

  it("GET returns document when found", async () => {
    vi.mocked(loadPlannerDocumentFromStore).mockResolvedValue({ id: "plan-1" } as never);
    const res = await GET(new NextRequest("http://localhost/api/plans/plan-1"), routeContext);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.document.id).toBe("plan-1");
  });

  it("PUT returns 403 when CSRF is invalid", async () => {
    vi.mocked(validateCsrfRequest).mockResolvedValue(false);
    const req = new NextRequest("http://localhost/api/plans/plan-1", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ document: { id: "plan-1", walls: [], rooms: [] } }),
    });
    const res = await PUT(req, routeContext);
    expect(res.status).toBe(403);
  });

  it("DELETE returns 404 when plan does not exist", async () => {
    vi.mocked(loadPlannerDocumentFromStore).mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/plans/plan-1", { method: "DELETE" });
    const res = await DELETE(req, routeContext);
    expect(res.status).toBe(404);
    expect(deletePlannerDocumentFromStore).not.toHaveBeenCalled();
  });

  it("DELETE removes existing plan", async () => {
    vi.mocked(loadPlannerDocumentFromStore).mockResolvedValue({ id: "plan-1" } as never);
    vi.mocked(deletePlannerDocumentFromStore).mockResolvedValue(true);
    const req = new NextRequest("http://localhost/api/plans/plan-1", { method: "DELETE" });
    const res = await DELETE(req, routeContext);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(savePlannerDocumentToStore).not.toHaveBeenCalled();
  });
});
