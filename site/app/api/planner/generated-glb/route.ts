/**
 * POST /api/planner/generated-glb
 *
 * Persistent generated GLB storage is not configured.
 * Production must never write under site/public.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";

export async function POST(req: NextRequest) {
  const rateError = await enforcePublicApiRateLimit(
    req,
    "planner-generated-glb:post",
    20,
  );
  if (rateError) return rateError;

  return NextResponse.json(
    {
      ok: false,
      error: "not_configured",
      message:
        "Persistent generated GLB storage is not configured. Production must not write under site/public.",
    },
    { status: 501 },
  );
}
