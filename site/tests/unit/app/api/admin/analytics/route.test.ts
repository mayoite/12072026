import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth: (handler: unknown) => handler,
}));

const isPlannerDatabaseConfigured = vi.fn(() => false);
const listPlannerAnalyticsRows = vi.fn();

vi.mock("@/features/planner/cloud-store/plannerPersistence", () => ({
  isPlannerDatabaseConfigured: () => isPlannerDatabaseConfigured(),
  listPlannerAnalyticsRows: (...args: unknown[]) =>
    listPlannerAnalyticsRows(...args),
}));

import { GET } from "@/app/api/admin/analytics/route";

describe("app/api/admin/analytics/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isPlannerDatabaseConfigured.mockReturnValue(false);
  });

  it("returns empty shell when planner DB is not configured", async () => {
    const res = await (GET as (req: NextRequest) => Promise<Response>)(
      new NextRequest("http://localhost/api/admin/analytics?period=7d"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.source).toBe("planner-db-not-configured");
    expect(body.summary.totalPlans).toBe(0);
    expect(body.plansCreated).toHaveLength(7);
    expect(body.topFurniture).toEqual([]);
    expect(body.exports).toEqual([]);
    expect(body.databaseConfigured).toBe(false);
  });

  it("returns live plan summary when DB has rows", async () => {
    isPlannerDatabaseConfigured.mockReturnValue(true);
    listPlannerAnalyticsRows.mockResolvedValue({
      success: true,
      rows: [
        {
          id: "p1",
          item_count: 4,
          room_width_mm: 5000,
          room_depth_mm: 4000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });

    const res = await (GET as (req: NextRequest) => Promise<Response>)(
      new NextRequest("http://localhost/api/admin/analytics?period=30d"),
    );
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.source).toBe("drizzle_plans");
    expect(body.summary.totalPlans).toBe(1);
    expect(body.topFurniture.length).toBeGreaterThan(0);
    expect(body.furnitureSource).toBe("catalog-sample");
    expect(body.exports.length).toBeGreaterThan(0);
  });
});
