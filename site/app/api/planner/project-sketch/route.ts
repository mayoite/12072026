/**
 * Legacy project-sketch endpoint — retired.
 * Canonical conversion is POST /api/planner/sketch-to-plan.
 */

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "gone",
      message:
        "This endpoint is retired. Use POST /api/planner/sketch-to-plan for Sketch-to-Plan conversion.",
    },
    { status: 410 },
  );
}
