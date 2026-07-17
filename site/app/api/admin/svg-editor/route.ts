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
import { parseAdminPayload } from "@/features/admin/svg-editor/storage/persistBlockDescriptor";
import { publishDescriptorWithPipeline } from "@/features/admin/svg-editor/publish/publishDescriptorWithPipeline";
import { resolveSvgPublishDualWriteDeps } from "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite";
import { buildBlockThumbPngUrl } from "@/features/planner/catalog/svg/svgPreviewAssets";
import {
  toPlannerDescriptorErrorHttp,
  type PlannerDescriptorError,
} from "@/features/planner/catalog/svg/svgTypes";
import { tryLoad } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { assertDraftNotStale, readOpenedBaselineFromPayload } from "@/features/admin/svg-editor/lifecycle/staleDraftPublishGate";
import { DEV_BYPASS_USER } from "@/lib/auth/devAuthBypass";

function descriptorErrorResponse(descriptorError: PlannerDescriptorError): NextResponse {
  const http = toPlannerDescriptorErrorHttp(descriptorError);
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

async function handleSvgEditorPost(req: NextRequest, actorId: string) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    throw new ApiError(400, API_ERROR_CODES.INVALID_INPUT, "Invalid JSON body");
  }

  // Fail-closed 1B path: parse → compileSvgForPublish (S1–S3) → S4 write → persist.
  // Avoids broken full recompile via incomplete .next/standalone generate-svg tree.

  // DB-SVG-09: stale check uses openedBaselineGeneratedAt from raw body (not post-freeze generatedAt).
  const parsedForStale = parseAdminPayload(payload);
  if (parsedForStale.ok) {
    const clientSlug = parsedForStale.value.slug;
    const clientGeneratedAt = readOpenedBaselineFromPayload(payload);
    if (clientSlug && clientSlug !== "new") {
      const serverDescriptor = tryLoad(clientSlug);
      if (serverDescriptor.ok) {
        const staleCheck = assertDraftNotStale({
          slug: clientSlug,
          clientBaselineGeneratedAt: clientGeneratedAt,
          serverBaselineGeneratedAt: serverDescriptor.value.generatedAt ?? 0,
        });
        if (!staleCheck.ok) {
          return NextResponse.json(
            { success: false, error: { code: "stale_draft", message: staleCheck.error } },
            { status: 409 },
          );
        }
      }
    }
  }

  const dualWrite = await resolveSvgPublishDualWriteDeps();
  const published = await publishDescriptorWithPipeline(payload, {
    dbRepository: dualWrite.dbRepository,
    artifactStore: dualWrite.artifactStore,
    actorId,
  });
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
  async (req: NextRequest, auth) =>
    handleSvgEditorPost(req, auth.user?.id ?? DEV_BYPASS_USER.id),
  {
    role: "admin",
    rateLimitScope: "svg-editor:post",
    rateLimit: 20,
    requireCsrf: true,
  }
);
