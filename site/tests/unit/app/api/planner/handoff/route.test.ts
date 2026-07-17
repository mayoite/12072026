import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth: (handler: (req: NextRequest) => Promise<Response>) => handler,
}));

import { POST } from "@/app/api/planner/handoff/route";

describe("app/api/planner/handoff/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid payload", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 501 not_configured instead of fake success", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          project: {
            name: "Demo",
            entities: [{ type: "item", sku: "WS-1" }],
          },
        }),
      }),
    );
    expect(res.status).toBe(501);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("not_configured");
    expect(body.draftBoq).toEqual({ "WS-1": 1 });
  });
});
