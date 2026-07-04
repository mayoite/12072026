import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/api/withAuth", () => ({
  withAuth: (handler: unknown) => handler,
}));

vi.mock("@/features/planner/store/plannerPersistence", () => ({
  isPlannerDatabaseConfigured: vi.fn(() => false),
  listPlannerAnalyticsRows: vi.fn(),
}));

import { GET } from "@/app/api/admin/analytics/route";

describe("app/api/admin/analytics/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns local fallback analytics when planner DB is not configured", async () => {
    const res = await (GET as (req: NextRequest) => Promise<Response>)(
      new NextRequest("http://localhost/api/admin/analytics?period=7d"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.source).toBe("local-fallbacks");
    expect(body.summary.totalPlans).toBe(0);
    expect(body.plansCreated).toHaveLength(7);
    expect(body.topFurniture.length).toBeGreaterThan(0);
  });
});
