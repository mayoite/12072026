/**
 * PATCH /api/admin/svg-editor/[slug]/lifecycle — set live / draft / retired (Admin P02).
 */

import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { withAuth } from "@/features/shared/api/withAuth";
import { success } from "@/features/shared/api/apiResponse";
import { ApiError, API_ERROR_CODES } from "@/features/shared/api/ApiError";
import {
  type CatalogLifecycleState,
  setCatalogLifecycle,
} from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { appendDescriptorAudit } from "@/features/admin/svg-editor/storage/descriptorAuditLog";
import { tryLoad } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import { DEV_BYPASS_USER } from "@/lib/auth/devAuthBypass";

function parseState(value: unknown): CatalogLifecycleState | null {
  if (value === "live" || value === "draft" || value === "retired") return value;
  return null;
}

async function handleLifecyclePatch(
  req: NextRequest,
  slug: string,
  actorId: string,
) {
  if (!tryLoad(slug).ok) {
    throw new ApiError(404, API_ERROR_CODES.RESOURCE_NOT_FOUND, `Descriptor "${slug}" not found`);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, API_ERROR_CODES.INVALID_INPUT, "Invalid JSON body");
  }
  const state =
    body && typeof body === "object" && "state" in body
      ? parseState((body as { state: unknown }).state)
      : null;
  if (!state) {
    throw new ApiError(400, API_ERROR_CODES.INVALID_INPUT, "state must be live, draft, or retired");
  }

  const entry = setCatalogLifecycle(slug, state);
  appendDescriptorAudit({
    actorId,
    slug,
    action: state === "live" ? "approve" : "lifecycle_change",
    detail: { state },
  });
  revalidatePath("/admin/svg-editor");
  revalidatePath(`/admin/svg-editor/${slug}`);
  revalidatePath("/api/planner/catalog/svg-blocks");

  return success({ slug, lifecycle: entry });
}

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export const PATCH = withAuth<RouteContext>(
  async (req, auth, context) => {
    const { slug } = await context.params;
    const actorId = auth.user?.id ?? DEV_BYPASS_USER.id;
    return handleLifecyclePatch(req, slug, actorId);
  },
  {
    role: "admin",
    rateLimitScope: "svg-editor:lifecycle",
    rateLimit: 30,
    requireCsrf: true,
  },
);
