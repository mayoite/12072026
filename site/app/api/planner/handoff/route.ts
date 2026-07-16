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

export const POST = withAuth(
  async (req: NextRequest, _auth) => {
    try {
      const body = (await req.json()) as {
        project?: HandoffProject;
        notes?: string;
      };
      const { project, notes: _notes } = body;

      if (!project?.entities) {
        return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
      }

      const boq: Record<string, number> = {};
      for (const entity of project.entities) {
        if (entity.type === "item" && entity.sku) {
          boq[entity.sku] = (boq[entity.sku] || 0) + 1;
        }
      }

      // Stub: real handoff will post to ERP/email.
      return NextResponse.json({
        success: true,
        boq,
        message: "Handoff successfully submitted to Oando.",
      });
    } catch (err) {
      console.error("[Handoff API Error]", err);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
  { role: "member", rateLimitScope: "planner:handoff", rateLimit: 10 },
);
