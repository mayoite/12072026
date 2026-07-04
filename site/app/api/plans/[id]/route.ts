import type { NextRequest } from "next/server";

import {
  assertPlannerDocument,
  type PlannerDocument,
} from "@/features/planner/model/plannerDocument";
import {
  deletePlannerDocumentFromStore,
  loadPlannerDocumentFromStore,
  savePlannerDocumentToStore,
} from "@/features/planner/store/plannerSaves";
import { createServerClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rateLimit";
import { validateCsrfRequest } from "@/lib/security/csrf";
import { applyPlannerRouteTelemetry } from "@/lib/api/routeObservability";
import { success, error, rateLimitedError } from "@/lib/api/apiResponse";
import { ApiError, API_ERROR_CODES } from "@/lib/api/ApiError";
import { isAppAdmin } from "@/lib/auth/roles";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getRequestIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "127.0.0.1"
  );
}

function isAdminUser(user: { app_metadata?: Record<string, unknown> }) {
  return isAppAdmin(user);
}

export async function GET(req: NextRequest, context: RouteContext) {
  const startedAt = performance.now();
  const routeName = "api/plans/[id]";
  const queryShape = "user-detail-load";
  const telemetry = () => ({
    route: routeName,
    queryShape,
    durationMs: performance.now() - startedAt,
  });
  const ip = getRequestIp(req);
  const limitRes = await rateLimit(`plans:get-one:${ip}`, 30, 60 * 1000);
  if (!limitRes.success) {
    return applyPlannerRouteTelemetry(
      rateLimitedError("Too many requests", limitRes.reset),
      { ...telemetry(), rowCount: 0 },
    );
  }

  const { id } = await context.params;
  const planId = id?.trim();
  if (!planId) {
    return applyPlannerRouteTelemetry(
      error(ApiError.fromCode(API_ERROR_CODES.MISSING_REQUIRED_FIELD, "Plan id is required")),
      { ...telemetry(), rowCount: 0 },
    );
  }

  const supabase = await createServerClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id ?? null;
  if (!userId) {
    return applyPlannerRouteTelemetry(
      error(ApiError.fromCode(API_ERROR_CODES.AUTH_REQUIRED, "Authentication required")),
      { ...telemetry(), rowCount: 0 },
    );
  }

  try {
    const allowAdmin = isAdminUser(authData.user ?? {});
    const document = await loadPlannerDocumentFromStore(
      planId,
      allowAdmin ? undefined : userId,
    );
    if (!document) {
      return applyPlannerRouteTelemetry(
        error(ApiError.fromCode(API_ERROR_CODES.RESOURCE_NOT_FOUND, "Plan not found")),
        { ...telemetry(), rowCount: 0 },
      );
    }

    return applyPlannerRouteTelemetry(
      success({ document, source: "drizzle_plans" }),
      { ...telemetry(), rowCount: 1, source: "drizzle_plans" },
    );
  } catch (err) {
    return applyPlannerRouteTelemetry(
      error(
        new ApiError(
          500,
          API_ERROR_CODES.INTERNAL_ERROR,
          `Failed to load plan: ${err instanceof Error ? err.message : String(err)}`,
        ),
      ),
      { ...telemetry(), rowCount: 0, source: "drizzle_plans" },
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const startedAt = performance.now();
  const routeName = "api/plans/[id]";
  const queryShape = "user-detail-save";
  const telemetry = () => ({
    route: routeName,
    queryShape,
    durationMs: performance.now() - startedAt,
  });
  const ip = getRequestIp(req);
  const limitRes = await rateLimit(`plans:put:${ip}`, 20, 60 * 1000);
  if (!limitRes.success) {
    return applyPlannerRouteTelemetry(
      rateLimitedError("Too many requests", limitRes.reset),
      { ...telemetry(), rowCount: 0 },
    );
  }

  const isCsrfValid = await validateCsrfRequest(req);
  if (!isCsrfValid) {
    return applyPlannerRouteTelemetry(
      error(
        ApiError.fromCode(
          API_ERROR_CODES.INSUFFICIENT_PERMISSIONS,
          "Invalid or missing CSRF token",
        ),
      ),
      { ...telemetry(), rowCount: 0 },
    );
  }

  const { id } = await context.params;
  const planId = id?.trim();
  if (!planId) {
    return applyPlannerRouteTelemetry(
      error(ApiError.fromCode(API_ERROR_CODES.MISSING_REQUIRED_FIELD, "Plan id is required")),
      { ...telemetry(), rowCount: 0 },
    );
  }

  const supabase = await createServerClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id ?? null;
  if (!userId) {
    return applyPlannerRouteTelemetry(
      error(ApiError.fromCode(API_ERROR_CODES.AUTH_REQUIRED, "Authentication required")),
      { ...telemetry(), rowCount: 0 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const documentInput = (body.document ?? body) as unknown;
  let document: PlannerDocument;
  try {
    document = assertPlannerDocument(documentInput);
  } catch {
    return error(
      ApiError.fromCode(API_ERROR_CODES.VALIDATION_ERROR, "Invalid planner document payload"),
    );
  }

  const ownerUserId =
    typeof body.ownerUserId === "string" && body.ownerUserId.trim()
      ? body.ownerUserId.trim()
      : userId;
  const allowAdmin = isAdminUser(authData.user ?? {});
  if (!allowAdmin && ownerUserId !== userId) {
    return error(ApiError.fromCode(API_ERROR_CODES.INSUFFICIENT_PERMISSIONS, "Forbidden"));
  }

  try {
    const saved = await savePlannerDocumentToStore(
      { ...document, id: planId },
      {
        userId: ownerUserId,
        saveId: planId,
      },
    );
    return applyPlannerRouteTelemetry(
      success({ document: saved, source: "drizzle_plans" }),
      { ...telemetry(), rowCount: 1, source: "drizzle_plans" },
    );
  } catch (err) {
    return applyPlannerRouteTelemetry(
      error(
        new ApiError(
          500,
          API_ERROR_CODES.INTERNAL_ERROR,
          `Failed to save plan: ${err instanceof Error ? err.message : String(err)}`,
        ),
      ),
      { ...telemetry(), rowCount: 0, source: "drizzle_plans" },
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const startedAt = performance.now();
  const routeName = "api/plans/[id]";
  const queryShape = "user-detail-delete";
  const telemetry = () => ({
    route: routeName,
    queryShape,
    durationMs: performance.now() - startedAt,
  });
  const ip = getRequestIp(req);
  const limitRes = await rateLimit(`plans:delete:${ip}`, 15, 60 * 1000);
  if (!limitRes.success) {
    return applyPlannerRouteTelemetry(
      rateLimitedError("Too many requests", limitRes.reset),
      { ...telemetry(), rowCount: 0 },
    );
  }

  const isCsrfValid = await validateCsrfRequest(req);
  if (!isCsrfValid) {
    return applyPlannerRouteTelemetry(
      error(
        ApiError.fromCode(
          API_ERROR_CODES.INSUFFICIENT_PERMISSIONS,
          "Invalid or missing CSRF token",
        ),
      ),
      { ...telemetry(), rowCount: 0 },
    );
  }

  const { id } = await context.params;
  const planId = id?.trim();
  if (!planId) {
    return applyPlannerRouteTelemetry(
      error(ApiError.fromCode(API_ERROR_CODES.MISSING_REQUIRED_FIELD, "Plan id is required")),
      { ...telemetry(), rowCount: 0 },
    );
  }

  const supabase = await createServerClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id ?? null;
  if (!userId) {
    return applyPlannerRouteTelemetry(
      error(ApiError.fromCode(API_ERROR_CODES.AUTH_REQUIRED, "Authentication required")),
      { ...telemetry(), rowCount: 0 },
    );
  }

  try {
    const existing = await loadPlannerDocumentFromStore(planId, userId);
    if (!existing) {
      return error(ApiError.fromCode(API_ERROR_CODES.RESOURCE_NOT_FOUND, "Plan not found"));
    }

    const deleted = await deletePlannerDocumentFromStore(planId);
    return applyPlannerRouteTelemetry(
      success({ success: deleted, source: "drizzle_plans" }),
      { ...telemetry(), rowCount: deleted ? 1 : 0, source: "drizzle_plans" },
    );
  } catch (err) {
    return applyPlannerRouteTelemetry(
      error(
        new ApiError(
          500,
          API_ERROR_CODES.INTERNAL_ERROR,
          `Failed to delete plan: ${err instanceof Error ? err.message : String(err)}`,
        ),
      ),
      { ...telemetry(), rowCount: 0, source: "drizzle_plans" },
    );
  }
}