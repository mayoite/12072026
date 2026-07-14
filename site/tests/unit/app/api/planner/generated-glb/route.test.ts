import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  writeGeneratedGlbToPublic,
  assertWritableGeneratedGlbRelativePath,
} from "@/features/planner/asset-engine/mesh/writeGeneratedGlbToPublic";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";

vi.mock("@/app/api/_lib/public", () => ({
  enforcePublicApiRateLimit: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/features/planner/asset-engine/mesh/writeGeneratedGlbToPublic", () => ({
  writeGeneratedGlbToPublic: vi.fn(),
  assertWritableGeneratedGlbRelativePath: vi.fn((path: string) => path),
}));

import { POST } from "@/app/api/planner/generated-glb/route";

function makeReq(options: {
  path?: string | null;
  body?: ArrayBuffer | null;
}): NextRequest {
  const headers = new Headers();
  if (options.path) {
    headers.set("x-generated-glb-relative-path", options.path);
  }
  headers.set("content-type", "application/octet-stream");
  return new NextRequest("http://localhost/api/planner/generated-glb", {
    method: "POST",
    headers,
    body: options.body ?? undefined,
  });
}

describe("app/api/planner/generated-glb/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(enforcePublicApiRateLimit).mockResolvedValue(null);
    vi.mocked(assertWritableGeneratedGlbRelativePath).mockImplementation(
      (path: string) => path,
    );
  });

  it("POST returns 400 when relative path header is missing", async () => {
    const res = await POST(makeReq({ path: null, body: new ArrayBuffer(4) }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("missing_relative_path");
  });

  it("POST returns 400 for invalid relative path", async () => {
    vi.mocked(assertWritableGeneratedGlbRelativePath).mockImplementation(() => {
      throw new Error("path traversal rejected");
    });
    const res = await POST(
      makeReq({
        path: "../evil.glb",
        body: new ArrayBuffer(4),
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("invalid_relative_path");
  });

  it("POST returns 400 for empty body", async () => {
    const res = await POST(
      makeReq({
        path: "catalog-assets/generated/test.glb",
        body: new ArrayBuffer(0),
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("empty_body");
  });

  it("POST writes GLB and returns public path on success", async () => {
    vi.mocked(writeGeneratedGlbToPublic).mockReturnValue({
      relativePath: "catalog-assets/generated/test.glb",
      publicUrlPath: "/catalog-assets/generated/test.glb",
      byteLength: 8,
      absolutePath: "/tmp/test.glb",
    });

    const res = await POST(
      makeReq({
        path: "catalog-assets/generated/test.glb",
        body: new ArrayBuffer(8),
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.relativePath).toBe("catalog-assets/generated/test.glb");
    expect(body.publicUrlPath).toBe("/catalog-assets/generated/test.glb");
    expect(body.byteLength).toBe(8);
    expect(writeGeneratedGlbToPublic).toHaveBeenCalled();
  });
});
