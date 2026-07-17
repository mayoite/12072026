// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const enforcePublicApiRateLimit = vi.fn();
const buildPublishedSvgResponse = vi.fn();

vi.mock("@/app/api/_lib/public", () => ({
  enforcePublicApiRateLimit: (...args: unknown[]) =>
    enforcePublicApiRateLimit(...args),
}));

vi.mock("@/features/planner/catalog-api/buildPublishedSvgResponse.server", () => ({
  buildPublishedSvgResponse: (...args: unknown[]) =>
    buildPublishedSvgResponse(...args),
}));

import { GET } from "@/app/api/planner/catalog/svg/[revisionId]/route";

describe("app/api/planner/catalog/svg/[revisionId]/route (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    enforcePublicApiRateLimit.mockResolvedValue(null);
    buildPublishedSvgResponse.mockResolvedValue(
      new Response("<svg/>", { status: 200 }),
    );
  });

  it("returns rate-limit response without building SVG payload", async () => {
    enforcePublicApiRateLimit.mockResolvedValueOnce(
      new Response("Too many requests", { status: 429 }),
    );
    const request = new NextRequest(
      "http://localhost/api/planner/catalog/svg/rev-1",
    );
    const response = await GET(request, {
      params: Promise.resolve({ revisionId: "rev-1" }),
    });
    expect(response.status).toBe(429);
    expect(buildPublishedSvgResponse).not.toHaveBeenCalled();
  });

  it("delegates to buildPublishedSvgResponse with route revisionId", async () => {
    const request = new NextRequest(
      "http://localhost/api/planner/catalog/svg/side-table-r1",
    );
    const response = await GET(request, {
      params: Promise.resolve({ revisionId: "side-table-r1" }),
    });
    expect(response.status).toBe(200);
    expect(enforcePublicApiRateLimit).toHaveBeenCalledWith(
      request,
      "planner-catalog-svg:get",
      120,
    );
    expect(buildPublishedSvgResponse).toHaveBeenCalledWith(
      request,
      "side-table-r1",
    );
  });
});
