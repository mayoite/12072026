/**
 * POST /api/admin/svg-editor/bulk-import — ADM-SVG-18 preview + atomic apply.
 * Body: { csv: string, dryRun?: boolean }
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
  if (!body || typeof body !== "object") {
    throw new ApiError(400, API_ERROR_CODES.INVALID_INPUT, "Body must be an object");
  }
  const record = body as { csv?: unknown; dryRun?: unknown };
  const csv = typeof record.csv === "string" ? record.csv : null;
  const dryRun = record.dryRun === true;
  if (!csv || csv.trim() === "") {
    throw new ApiError(400, API_ERROR_CODES.INVALID_INPUT, "csv field is required");
  }

  if (dryRun) {
    const preview = bulkImportBlockDescriptors(csv, { dryRun: true });
    if (!("dryRun" in preview) || !preview.dryRun) {
      throw new ApiError(500, API_ERROR_CODES.INTERNAL, "Preview path failed");
    }
    return success({
      dryRun: true,
      summary: preview.summary,
      additions: preview.additions.map((row) => ({
        slug: row.slug,
        sku: row.sku,
        csvRow: row.csvRow,
        lifecycle: row.lifecycle,
      })),
      rejects: preview.rejects,
      conflicts: preview.conflicts,
      canApply: preview.canApply,
    });
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
      detail: {
        batchSize: result.imported.length,
        provenance: result.provenance,
      },
    });
  }

  return success({
    imported: result.imported,
    count: result.imported.length,
    provenance: result.provenance,
  });
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
