import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { withAuth } from "@/features/shared/api/withAuth";

type HandoffEntity = {
  type?: string;
  sku?: string;
};

type HandoffProject = {
  name?: string;
  entities?: HandoffEntity[];
};

/**
 * Quote handoff is not yet connected to an approved Oando destination.
 * Do not pretend success — clients must show not_configured / retry later.
 */
export const POST = withAuth(
  async (req: NextRequest, _auth) => {
    try {
      const body = (await req.json()) as {
        project?: HandoffProject;
        notes?: string;
      };
      const { project } = body;

      if (!project?.entities) {
        return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
      }

      const draftBoq: Record<string, number> = {};
      for (const entity of project.entities) {
        if (entity.type === "item" && entity.sku) {
          draftBoq[entity.sku] = (draftBoq[entity.sku] || 0) + 1;
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: "not_configured",
          message:
            "Quote handoff to Oando is not configured. Your draft was not submitted.",
          draftBoq,
        },
        { status: 501 },
      );
    } catch (err) {
      console.error("[Handoff API Error]", err);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
  {
    role: "member",
    rateLimitScope: "planner:handoff",
    rateLimit: 10,
    requireCsrf: true,
  },
);
