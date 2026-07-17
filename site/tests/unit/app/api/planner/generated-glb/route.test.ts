import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const authState = vi.hoisted(() => ({
  user: null as { id: string; email?: string; role?: string } | null,
}));

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth:
    (
      handler: (
        req: NextRequest,
        auth: {
          user: { id: string; email?: string; role?: string } | null;
          isAdmin: boolean;
          requiredRole: string;
        },
      ) => Promise<Response>,
    ) =>
    (req: NextRequest) =>
      handler(req, {
        user: authState.user,
        isAdmin: false,
        requiredRole: "guest",
      }),
}));

const publishGeneratedGlbToSupabase = vi.fn();

vi.mock("@/features/shared/catalog/catalogAssetStorage.server", () => ({
  publishGeneratedGlbToSupabase: (...args: unknown[]) =>
    publishGeneratedGlbToSupabase(...args),
}));

import { POST } from "@/app/api/planner/generated-glb/route";

function makeReq(path = "catalog-assets/generated/test.glb") {
  const headers = new Headers();
  headers.set("x-generated-glb-relative-path", path);
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
    authState.user = null;
  });

  it("returns 501 not_configured when storage is unavailable", async () => {
    publishGeneratedGlbToSupabase.mockResolvedValue({
      ok: false,
      reason: "supabase_service_role_not_configured",
    });
    const res = await POST(makeReq());
    expect(res.status).toBe(501);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("not_configured");
  });

  it("returns 400 for invalid path", async () => {
    const res = await POST(makeReq("evil/static.glb"));
    expect(res.status).toBe(400);
    expect(publishGeneratedGlbToSupabase).not.toHaveBeenCalled();
  });

  it("returns 400 for path traversal attempts", async () => {
    const res = await POST(makeReq("catalog-assets/generated/../../secret.glb"));
    expect(res.status).toBe(400);
    expect(publishGeneratedGlbToSupabase).not.toHaveBeenCalled();
  });

  it("uploads as guest with ownerId null (no shared overwrite identity)", async () => {
    publishGeneratedGlbToSupabase.mockResolvedValue({
      ok: true,
      path: "catalog-assets/generated/guest/abc-test.glb",
      publicUrl:
        "https://example.supabase.co/storage/v1/object/public/catalog-assets/generated/guest/abc-test.glb",
    });
    const res = await POST(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(publishGeneratedGlbToSupabase).toHaveBeenCalledWith(
      expect.objectContaining({
        relativePath: "catalog-assets/generated/test.glb",
        ownerId: null,
      }),
    );
  });

  it("passes authenticated user id as ownerId for member uploads", async () => {
    authState.user = { id: "member-42", email: "m@example.com", role: "member" };
    publishGeneratedGlbToSupabase.mockResolvedValue({
      ok: true,
      path: "catalog-assets/generated/u/member-42/test.glb",
      publicUrl:
        "https://example.supabase.co/storage/v1/object/public/catalog-assets/generated/u/member-42/test.glb",
    });
    const res = await POST(makeReq());
    expect(res.status).toBe(200);
    expect(publishGeneratedGlbToSupabase).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: "member-42",
      }),
    );
  });
});
