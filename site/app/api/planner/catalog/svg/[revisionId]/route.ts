import type { NextRequest } from "next/server";

import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import { buildPublishedSvgResponse } from "@/features/planner/catalog-api/buildPublishedSvgResponse.server";

type RouteContext = { params: Promise<{ revisionId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const rateError = await enforcePublicApiRateLimit(
    request,
    "planner-catalog-svg:get",
    120,
  );
  if (rateError) return rateError;

  const { revisionId } = await context.params;
  return buildPublishedSvgResponse(request, revisionId);
}
