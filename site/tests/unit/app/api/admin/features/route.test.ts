import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const getFeatureFlags = vi.hoisted(() => vi.fn(() => ({ plannerV2: true })));
const setFeatureFlags = vi.hoisted(() => vi.fn());
const getAllFlagNames = vi.hoisted(() => vi.fn(() => ["plannerV2"]));

vi.mock("@/lib/api/withAuth", () => ({
  withAuth: (handler: unknown) => handler,
}));

vi.mock("@/features/planner/lib/featureFlags", () => ({
  getFeatureFlags,
  setFeatureFlags,
  getAllFlagNames,
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => null),
}));

import { GET, PATCH } from "@/app/api/admin/features/route";

describe("app/api/admin/features/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns local feature flags when Supabase is unavailable", async () => {
    const res = await (GET as () => Promise<Response>)();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.flags.plannerV2).toBe(true);
    expect(body.source).toBe("local");
  });

  it("PATCH returns validation error when no updates are provided", async () => {
    const req = new NextRequest("http://localhost/api/admin/features", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await (PATCH as (req: NextRequest) => Promise<Response>)(req);
    expect(res.status).toBe(400);
  });

  it("PATCH updates local flags when Supabase is unavailable", async () => {
    const req = new NextRequest("http://localhost/api/admin/features", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: "plannerV2", enabled: false }),
    });
    const res = await (PATCH as (req: NextRequest) => Promise<Response>)(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.source).toBe("local");
    expect(setFeatureFlags).toHaveBeenCalledWith({ plannerV2: false });
  });
});
