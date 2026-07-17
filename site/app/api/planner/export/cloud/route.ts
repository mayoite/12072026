/**
 * POST /api/planner/export/cloud
 * Upload a Planner plan/BOQ export payload to Supabase Storage (catalog-assets).
 * Member auth + CSRF. Best-effort cloud backup — not a substitute for local download.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { withAuth } from "@/features/shared/api/withAuth";
import { publishPlannerExportToSupabase } from "@/features/shared/catalog/catalogAssetStorage.server";
import {
  normalizePlannerExportContentType,
  PLANNER_CLOUD_EXPORT_CONTENT_TYPES,
} from "@/features/planner/export/plannerCloudExportContentType";

type CloudExportBody = {
  planId?: string;
  filename?: string;
  contentType?: string;
  body?: string;
};

export const POST = withAuth(
  async (req: NextRequest, auth) => {
    let payload: CloudExportBody;
    try {
      payload = (await req.json()) as CloudExportBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const body = typeof payload.body === "string" ? payload.body : "";
    if (!body.trim()) {
      return NextResponse.json({ error: "Missing export body" }, { status: 400 });
    }
    if (body.length > 8_000_000) {
      return NextResponse.json({ error: "Export too large" }, { status: 413 });
    }

    const planId =
      typeof payload.planId === "string" && payload.planId.trim()
        ? payload.planId.trim()
        : "untitled";
    const filename =
      typeof payload.filename === "string" && payload.filename.trim()
        ? payload.filename.trim()
        : "plan-export.json";
    const contentType = normalizePlannerExportContentType(
      typeof payload.contentType === "string" ? payload.contentType : undefined,
    );
    if (!contentType) {
      return NextResponse.json(
        {
          success: false,
          error: "invalid_content_type",
          message: `contentType must be one of: ${PLANNER_CLOUD_EXPORT_CONTENT_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const ownerId = auth.user?.id ?? "member";
    const result = await publishPlannerExportToSupabase({
      ownerId,
      planId,
      filename,
      body,
      contentType,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result.reason,
          message:
            result.reason === "supabase_service_role_not_configured"
              ? "Cloud export storage is not configured."
              : "Cloud export failed.",
        },
        { status: result.reason === "supabase_service_role_not_configured" ? 501 : 502 },
      );
    }

    return NextResponse.json({
      success: true,
      path: result.path,
      publicUrl: result.publicUrl,
    });
  },
  {
    role: "member",
    requireCsrf: true,
    rateLimitScope: "planner:export-cloud",
    rateLimit: 20,
  },
);
