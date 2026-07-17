/**
 * Legacy project-sketch endpoint — retired.
 * Canonical conversion is POST /api/planner/sketch-to-plan.
 * Still CSRF + rate-limited so clients cannot hammer a dead path.
 */

import { NextResponse } from "next/server";
import { withAuth } from "@/features/shared/api/withAuth";

export const POST = withAuth(
  async () => {
    return NextResponse.json(
      {
        success: false,
        error: "gone",
        code: "METHOD_NOT_ALLOWED",
        message:
          "This endpoint is retired. Use POST /api/planner/sketch-to-plan for Sketch-to-Plan conversion.",
      },
      { status: 410 },
    );
  },
  {
    role: "guest",
    rateLimitScope: "planner-project-sketch:post",
    rateLimit: 10,
    requireCsrf: true,
  },
);
