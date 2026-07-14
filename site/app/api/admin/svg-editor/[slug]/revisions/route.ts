/**
 * GET /api/admin/svg-editor/[slug]/revisions — revision history (Admin P06).
 */

import { withAuth } from "@/features/shared/api/withAuth";
import { success } from "@/features/shared/api/apiResponse";
import { ApiError, API_ERROR_CODES } from "@/features/shared/api/ApiError";
import { listDescriptorRevisions } from "@/features/admin/svg-editor/descriptorRevisionIndex";
import { readDescriptorAuditForSlug } from "@/features/admin/svg-editor/descriptorAuditLog";
import { tryLoad } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export const GET = withAuth<RouteContext>(
  async (_req, _auth, context) => {
    const { slug } = await context.params;
    if (!tryLoad(slug).ok) {
      throw new ApiError(404, API_ERROR_CODES.RESOURCE_NOT_FOUND, `Descriptor "${slug}" not found`);
    }
    return success({
      slug,
      revisions: listDescriptorRevisions(slug),
      audit: readDescriptorAuditForSlug(slug),
    });
  },
  { role: "admin", rateLimitScope: "svg-editor:revisions", rateLimit: 60 },
);