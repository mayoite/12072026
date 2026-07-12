/**
 * POST /api/admin/svg-editor
 *
 * Fail-closed publish: `publishDescriptorWithPipeline`
 * (parse → compileSvgForPublish S1–S3 → S4 disk write → persist descriptor).
 * return { success, descriptor, thumb }.
 *
 * Error taxonomy:
 *   422 for invalid parse / compiler / pipeline failures
 *   500 for unexpected publish failures
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
import { parseAdminPayload } from "@/features/planner/admin/svg-editor/persistBlockDescriptor";
import { publishDescriptorWithPipeline } from "@/features/planner/admin/svg-editor/publishDescriptorWithPipeline";
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

async function handleSvgEditorPost(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    throw new ApiError(400, API_ERROR_CODES.INVALID_INPUT, "Invalid JSON body");
  }

  // Fail-closed 1B path: parse → compileSvgForPublish (S1–S3) → S4 write → persist.
  // Avoids broken full recompile via incomplete .next/standalone generate-svg tree.
  const published = await publishDescriptorWithPipeline(payload);
  if (!published.success) {
    const err = published.error;
    const isParse =
      err.startsWith("invalid:") ||
      err.startsWith("422.") ||
      err.startsWith("missing_field:") ||
      err.includes("Zod") ||
      err.toLowerCase().includes("parse");
    const isCompiler =
      err.startsWith("compiler_failed:") ||
      err.startsWith("compiler_exception:") ||
      err.startsWith("pipeline_failed:") ||
      err.includes("Pipeline error");

    if (isParse) {
      const reparsed = parseAdminPayload(payload);
      if (!reparsed.ok) {
        return descriptorErrorResponse(reparsed.error);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: isCompiler ? "compiler_failed" : "publish_failed",
          message: isCompiler
            ? "Backend SVG compilation failed. Check geometries."
            : "Publish failed.",
          details: err,
        },
      },
      { status: isCompiler || isParse ? 422 : 500 },
    );
  }

  const thumb = buildBlockThumbPngUrl(published.descriptor.slug);
  return success({ descriptor: published.descriptor, thumb });
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
