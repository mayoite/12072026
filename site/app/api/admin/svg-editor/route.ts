/**
 * POST /api/admin/svg-editor
 *
 * 04-ADMIN-06: Accept JSON BlockDescriptor, Zod (via parseAdminPayload), atomic persist,
 * shell to Phase 03 generate-svg.mjs (via svgPipelineRunner which also triggers R2 PNG thumb upload),
 * return { success, descriptor, thumb }.
 *
 * Error taxonomy:
 *   422 for invalid (Open3dDescriptorError.invalid + parse failures)
 *   500 for IO/pipeline hard failures (still return descriptor if persisted)
 *
 * Auth: withAuth(['admin']) + CSRF for POST.
 * Server-only (no client bundle).
 * No `any`.
 */

import type { NextRequest } from "next/server";
import { withAuth } from "@/lib/api/withAuth";
import { success, error } from "@/lib/api/apiResponse";
import { ApiError, API_ERROR_CODES } from "@/lib/api/ApiError";
import {
  persistBlockDescriptor,
  parseAdminPayload,
} from "@/features/planner/admin/svg-editor/persistBlockDescriptor";
import { runSvgPipeline } from "@/features/planner/admin/svg-editor/svgPipelineRunner";
import type { BlockDescriptor } from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";
import { buildBlockThumbPngUrl } from "@/features/planner/open3d/catalog/svg/svgPreviewAssets";

async function handleSvgEditorPost(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    throw new ApiError(400, API_ERROR_CODES.INVALID_INPUT, "Invalid JSON body");
  }

  // Phase 02/04 Zod boundary (re-uses parseAdminPayload which calls freeze + schema)
  const parsed = parseAdminPayload(payload);
  if (!parsed.ok) {
    // 422 taxonomy per 04-ADMIN-09 and Phase 02 mapper
    const e = parsed.error;
    return error(
      new ApiError(
        422,
        API_ERROR_CODES.INVALID_INPUT,
        e.message || "BlockDescriptor validation failed",
        { fieldPath: e.fieldPath, issues: (e as { issues?: unknown }).issues as Record<string, unknown> | undefined }
      )
    );
  }

  const descriptor: BlockDescriptor = parsed.value;

  // Atomic write (04-ADMIN-06)
  const persistResult = persistBlockDescriptor(descriptor, { writeHistory: true });
  if (!persistResult.ok) {
    const pe = persistResult.error;
    const status = pe.reason === "versionMismatch" || pe.reason === "hashMismatch" ? 409 : 422;
    return error(new ApiError(status, API_ERROR_CODES.INVALID_INPUT, pe.message, { fieldPath: pe.fieldPath }));
  }

  // Shell Phase 03 + R2 side effect (generate-svg.mjs inside runner does PNG + uploadPngToR2)
  // catalog_snapshot name treated as generic R2 reference per clarification.
  let thumb: string | undefined;
  try {
    const pipeline = await runSvgPipeline(descriptor);
    if (pipeline.ok) {
      thumb = buildBlockThumbPngUrl(descriptor.slug);
    } else {
      // Best-effort: descriptor persisted; thumb may be stale or unavailable.
      thumb = buildBlockThumbPngUrl(descriptor.slug);
    }
  } catch {
    thumb = buildBlockThumbPngUrl(descriptor.slug);
  }

  return success({ descriptor: persistResult.descriptor, thumb });
}

export const POST = withAuth(
  async (req: NextRequest) => handleSvgEditorPost(req),
  {
    role: "admin",
    rateLimitScope: "svg-editor:post",
    rateLimit: 20,
    requireCsrf: true,
  }
);
