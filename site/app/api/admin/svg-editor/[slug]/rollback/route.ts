/**
 * POST /api/admin/svg-editor/[slug]/rollback — restore a prior revision (Admin P06).
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { withAuth } from "@/features/shared/api/withAuth";
import { success } from "@/features/shared/api/apiResponse";
import { ApiError, API_ERROR_CODES } from "@/features/shared/api/ApiError";
import { rollbackDescriptorToVersion } from "@/features/admin/svg-editor/lifecycle/rollbackDescriptorVersion";
import { tryLoad } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { DEV_BYPASS_USER } from "@/lib/auth/devAuthBypass";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

async function handleRollback(req: NextRequest, slug: string, actorId: string) {
  if (!tryLoad(slug).ok) {
    throw new ApiError(404, API_ERROR_CODES.RESOURCE_NOT_FOUND, `Descriptor "${slug}" not found`);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, API_ERROR_CODES.INVALID_INPUT, "Invalid JSON body");
  }
  const version =
    body && typeof body === "object" && "version" in body
      ? Number((body as { version: unknown }).version)
      : Number.NaN;
  if (!Number.isInteger(version) || version < 1) {
    throw new ApiError(400, API_ERROR_CODES.INVALID_INPUT, "version must be a positive integer");
  }

  const result = await rollbackDescriptorToVersion(slug, version, actorId);
  if (!result.ok) {
    return NextResponse.json({ success: false, error: result.error }, { status: 422 });
  }
  return success(result);
}

export const POST = withAuth<RouteContext>(
  async (req, auth, context) => {
    const { slug } = await context.params;
    const actorId = auth.user?.id ?? DEV_BYPASS_USER.id;
    return handleRollback(req, slug, actorId);
  },
  {
    role: "admin",
    rateLimitScope: "svg-editor:rollback",
    rateLimit: 10,
    requireCsrf: true,
  },
);