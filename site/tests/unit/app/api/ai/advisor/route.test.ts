import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth: (handler: (req: NextRequest) => Promise<Response>) => handler,
}));

import { POST } from "@/app/api/ai/advisor/route";

describe("app/api/ai/advisor/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createReq = (body: unknown) =>
    new NextRequest("http://localhost/api/ai/advisor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

  it("returns validation error for invalid payload", async () => {
    const res = await POST(createReq({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("returns layout suggestion for layout-related queries", async () => {
    const res = await POST(
      createReq({
        messages: [{ role: "user", content: "Suggest a layout for my office" }],
        plannerType: "oando",
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.reply).toMatch(/layout/i);
    expect(body.suggestion?.type).toBe("layout");
  });

  it("returns generic advisory reply for non-layout queries", async () => {
    const res = await POST(
      createReq({
        messages: [{ role: "user", content: "What seating should I choose?" }],
        plannerType: "buddy",
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.reply).toMatch(/buddy/i);
    expect(body.suggestion).toBeUndefined();
  });
});
