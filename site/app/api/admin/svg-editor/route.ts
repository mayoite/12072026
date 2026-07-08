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
import { NextResponse } from "next/server";
import { withAuth } from "@/features/shared/api/withAuth";
import { success } from "@/features/shared/api/apiResponse";
import { ApiError, API_ERROR_CODES } from "@/features/shared/api/ApiError";
import {
  persistBlockDescriptor,
  parseAdminPayload,
  type PersistError,
} from "@/features/planner/admin/svg-editor/persistBlockDescriptor";
import { runSvgPipeline } from "@/features/planner/admin/svg-editor/svgPipelineRunner";
import type { BlockDescriptor } from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";
import { buildBlockThumbPngUrl } from "@/features/planner/open3d/catalog/svg/svgPreviewAssets";
import {
  toOpen3dDescriptorErrorHttp,
  type Open3dDescriptorError,
} from "@/features/planner/open3d/catalog/svg/svgTypes";

function descriptorErrorResponse(descriptorError: Open3dDescriptorError): NextResponse {
  const http = toOpen3dDescriptorErrorHttp(descriptorError);
  return NextResponse.json(
    {
      success: false,
      error: {
        ...http.body,
        ...(descriptorError.kind === "invalid"
          ? { issues: descriptorError.issues }
          : {}),
      },
    },
    { status: http.status },
  );
}

function persistErrorResponse(persistError: PersistError): NextResponse {
  const status =
    persistError.reason === "hashMismatch" || persistError.reason === "lockBusy"
      ? 409
      : persistError.reason === "ioError" || persistError.reason === "dualReadMismatch"
        ? 500
        : 422;
  return NextResponse.json(
    {
      success: false,
      error: {
        error:
          persistError.reason === "lockBusy"
            ? "lock_busy"
            : persistError.reason === "hashMismatch"
              ? "hash_mismatch"
              : persistError.reason,
        code: persistError.code,
        fieldPath: persistError.fieldPath,
        message: persistError.message,
        ...(persistError.issues ? { issues: persistError.issues } : {}),
      },
    },
    { status },
  );
}

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
    return descriptorErrorResponse(parsed.error);
  }

  const descriptor: BlockDescriptor = parsed.value;

  // Shell Phase 03 Compilation Gate (Run BEFORE persist to prevent silent corruption)
  let thumb: string | undefined;
  try {
    const pipeline = await runSvgPipeline(descriptor);
    if (!pipeline.ok) {
      // If compiler fails (e.g. invalid SVG geometry), we reject immediately.
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "compiler_failed",
            message: "Backend SVG compilation failed. Check geometries.",
            details: pipeline.error,
          }
        },
        { status: 422 }
      );
    }
    thumb = buildBlockThumbPngUrl(descriptor.slug);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "compiler_exception",
          message: "A fatal error occurred during SVG compilation.",
          details: String(err),
        }
      },
      { status: 500 }
    );
  }

  // Atomic write (04-ADMIN-06) - Only runs if compilation succeeds
  const persistResult = persistBlockDescriptor(descriptor);
  if (!persistResult.ok) {
    return persistErrorResponse(persistResult.error);
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
