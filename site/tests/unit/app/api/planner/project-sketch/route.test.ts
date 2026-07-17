import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth:
    (
      handler: (
        req: NextRequest,
        auth: {
          user: { id: string; email: string; role: string } | null;
          isAdmin: boolean;
          requiredRole: string;
        },
      ) => Promise<Response>,
    ) =>
    (req: NextRequest) =>
      handler(req, {
        user: null,
        isAdmin: false,
        requiredRole: "guest",
      }),
}));

import { POST } from "@/app/api/planner/project-sketch/route";

function makeReq(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/planner/project-sketch", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("app/api/planner/project-sketch/route.ts", () => {
  it("POST returns 410 gone and points at sketch-to-plan", async () => {
    const res = await POST(
      makeReq({ imageDataUrl: "data:image/png;base64,abc" }),
    );
    expect(res.status).toBe(410);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("gone");
    expect(String(body.message)).toMatch(/sketch-to-plan/i);
  });
});
