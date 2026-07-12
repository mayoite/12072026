/**
 * POST /api/admin/svg-editor/bulk-import — atomic CSV import (Admin P02).
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { withAuth } from "@/features/shared/api/withAuth";
import { success } from "@/features/shared/api/apiResponse";
import { ApiError, API_ERROR_CODES } from "@/features/shared/api/ApiError";
import { bulkImportBlockDescriptors } from "@/features/planner/admin/svg-editor/bulkImportBlockDescriptors";
import { appendDescriptorAudit } from "@/features/planner/admin/svg-editor/descriptorAuditLog";
import { DEV_BYPASS_USER } from "@/lib/auth/devAuthBypass";

async function handleBulkImport(req: NextRequest, actorId: string) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, API_ERROR_CODES.INVALID_INPUT, "Invalid JSON body");
  }
  const csv =
    body && typeof body === "object" && "csv" in body && typeof (body as { csv: unknown }).csv === "string"
      ? (body as { csv: string }).csv
      : null;
  if (!csv || csv.trim() === "") {
    throw new ApiError(400, API_ERROR_CODES.INVALID_INPUT, "csv field is required");
  }

  const result = bulkImportBlockDescriptors(csv);
  if (!result.ok) {
    return NextResponse.json(
      { success: false, errors: result.errors },
      { status: 422 },
    );
  }

  for (const slug of result.imported) {
    appendDescriptorAudit({
      actorId,
      slug,
      action: "bulk_import",
      detail: { batchSize: result.imported.length },
    });
  }

  return success({ imported: result.imported, count: result.imported.length });
}

export const POST = withAuth(
  async (req, auth) => {
    const actorId = auth.user?.id ?? DEV_BYPASS_USER.id;
    return handleBulkImport(req, actorId);
  },
  {
    role: "admin",
    rateLimitScope: "svg-editor:bulk-import",
    rateLimit: 10,
    requireCsrf: true,
  },
);