import type { NextRequest} from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  buildPlannerDocumentFromPortalPublishData,
  type PlannerPortalPublishData,
} from "@/features/planner/store/plannerPublish";
import {
  listPlannerDocumentsFromStore,
  savePlannerDocumentToStore,
} from "@/features/planner/store/plannerSaves";
import { rateLimit } from "@/lib/rateLimit";
import { validateCsrfRequest } from "@/lib/security/csrf";
import { applyPlannerRouteTelemetry } from "@/features/shared/api/routeObservability";
import { success, error, rateLimitedError } from "@/features/shared/api/apiResponse";
import { ApiError, API_ERROR_CODES } from "@/features/shared/api/ApiError";

type PublishBody = {
  id?: string;
  projectName?: string;
  data?: Record<string, unknown>;
  status?: string;
};

function getRequestIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "127.0.0.1"
  );
}

export async function GET(req: NextRequest) {
  const startedAt = performance.now();
  const routeName = "api/plans";
  const queryShape = "user-summary-list";
  const telemetry = () => ({
    route: routeName,
    queryShape,
    durationMs: performance.now() - startedAt,
  });
  const ip = getRequestIp(req);
  const limitRes = await rateLimit(`plans:get:${ip}`, 20, 60 * 1000);
  if (!limitRes.success) {
    return applyPlannerRouteTelemetry(
      rateLimitedError("Too many requests", limitRes.reset),
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
    const documents = await listPlannerDocumentsFromStore({ userId });
    return applyPlannerRouteTelemetry(
      success({ documents }),
      { ...telemetry(), rowCount: documents.length, source: "drizzle_plans" },
    );
  } catch (err) {
    return applyPlannerRouteTelemetry(
      error(
        new ApiError(
          500,
          API_ERROR_CODES.INTERNAL_ERROR,
          `Failed to list plans: ${err instanceof Error ? err.message : String(err)}`,
        ),
      ),
      { ...telemetry(), rowCount: 0, source: "drizzle_plans" },
    );
  }
}

export async function POST(req: NextRequest) {
  const startedAt = performance.now();
  const routeName = "api/plans";
  const queryShape = "user-publish-write";
  const telemetry = () => ({
    route: routeName,
    queryShape,
    durationMs: performance.now() - startedAt,
  });
  const ip = getRequestIp(req);
  const limitRes = await rateLimit(`plans:post:${ip}`, 15, 60 * 1000);
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

  const body = (await req.json().catch(() => ({}))) as PublishBody;
  const id = typeof body.id === "string" ? body.id.trim() : "";
  const projectName = typeof body.projectName === "string" ? body.projectName.trim() : "";
  const data = body.data;

  if (!id) {
    return applyPlannerRouteTelemetry(
      error(ApiError.fromCode(API_ERROR_CODES.MISSING_REQUIRED_FIELD, "Plan id is required")),
      { ...telemetry(), rowCount: 0 },
    );
  }
  if (!projectName) {
    return applyPlannerRouteTelemetry(
      error(ApiError.fromCode(API_ERROR_CODES.MISSING_REQUIRED_FIELD, "Project name is required")),
      { ...telemetry(), rowCount: 0 },
    );
  }
  if (!data || typeof data !== "object") {
    return applyPlannerRouteTelemetry(
      error(ApiError.fromCode(API_ERROR_CODES.MISSING_REQUIRED_FIELD, "Plan data is required")),
      { ...telemetry(), rowCount: 0 },
    );
  }
  const status: "draft" | "active" = body.status === "draft" ? "draft" : "active";

  const supabase = await createServerClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id ?? null;

  if (!userId) {
    return applyPlannerRouteTelemetry(
      error(
        ApiError.fromCode(
          API_ERROR_CODES.AUTH_REQUIRED,
          "Authentication required to publish to portal",
        ),
      ),
      { ...telemetry(), rowCount: 0 },
    );
  }

  const publishData = {
    projectName,
    walls: Array.isArray(data.walls) ? data.walls : [],
    rooms: Array.isArray(data.rooms) ? data.rooms : [],
    furniture: Array.isArray(data.furniture) ? data.furniture : [],
    doors: Array.isArray(data.doors) ? data.doors : [],
    windows: Array.isArray(data.windows) ? data.windows : [],
    measurements: Array.isArray(data.measurements) ? data.measurements : [],
    zones: Array.isArray(data.zones) ? data.zones : [],
    textLabels: Array.isArray(data.textLabels) ? data.textLabels : [],
    structuralElements: Array.isArray(data.structuralElements) ? data.structuralElements : [],
    backgroundImage: data.backgroundImage ?? null,
  } satisfies PlannerPortalPublishData;

  const document = buildPlannerDocumentFromPortalPublishData(publishData, { status });

  try {
    await savePlannerDocumentToStore(document, {
      userId,
      saveId: id,
    });
  } catch (err) {
    return applyPlannerRouteTelemetry(
      error(
        new ApiError(
          500,
          API_ERROR_CODES.INTERNAL_ERROR,
          `Failed to publish plan: ${
            err instanceof Error ? err.message : String(err)
          }`,
        ),
      ),
      { ...telemetry(), rowCount: 0, source: "drizzle_plans" },
    );
  }

  return applyPlannerRouteTelemetry(
    success({
      id,
      portalPath: `/portal/${id}`,
    }),
    { ...telemetry(), rowCount: 1, source: "drizzle_plans" },
  );
}