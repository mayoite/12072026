import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";

vi.mock("@/app/api/_lib/public", () => ({
  enforcePublicApiRateLimit: vi.fn().mockResolvedValue(null),
}));

import { POST } from "@/app/api/planner/generated-glb/route";

function makeReq(): NextRequest {
  const headers = new Headers();
  headers.set("x-generated-glb-relative-path", "catalog-assets/generated/test.glb");
  headers.set("content-type", "application/octet-stream");
  return new NextRequest("http://localhost/api/planner/generated-glb", {
    method: "POST",
    headers,
    body: new ArrayBuffer(8),
  });
}

describe("app/api/planner/generated-glb/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(enforcePublicApiRateLimit).mockResolvedValue(null);
  });

  it("POST returns 501 not_configured and never writes public disk", async () => {
    const res = await POST(makeReq());
    expect(res.status).toBe(501);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("not_configured");
  });
});
