import { NextResponse } from "next/server";
import { withAuth } from "@/server/auth";

export const POST = withAuth(async (req, { user }) => {
  try {
    const { project, notes } = await req.json();

    if (!project || !project.entities) {
      return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
    }

    // Basic BOQ generation logic: count items by type/SKU
    const boq: Record<string, number> = {};
    for (const entity of project.entities) {
      if (entity.type === "item" && entity.sku) {
        boq[entity.sku] = (boq[entity.sku] || 0) + 1;
      }
    }

    // In a real implementation, we would send this to Oando's ERP or email system.
    // For now, we simulate success and return the generated BOQ summary.
    console.log(`[Handoff] User ${user.id} requested BOQ for project ${project.name}`);
    console.log(`[Handoff] BOQ:`, boq);
    if (notes) console.log(`[Handoff] Notes:`, notes);

    return NextResponse.json({ 
      success: true, 
      boq, 
      message: "Handoff successfully submitted to Oando." 
    });
  } catch (error) {
    console.error("[Handoff API Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
