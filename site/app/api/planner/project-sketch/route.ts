import { NextRequest, NextResponse } from "next/server";
import { requestProviderText, resolveProviderChain, ServerChatMessage } from "@/lib/ai/providerChain";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageDataUrl, hints, projectName, displayUnit } = body;

    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return NextResponse.json({ success: false, error: "Missing or invalid imageDataUrl" }, { status: 400 });
    }

    const providers = resolveProviderChain();
    // Prioritize gemini for vision
    const geminiProvider = providers.find((p) => p.provider === "gemini") || providers[0];

    if (!geminiProvider) {
      return NextResponse.json({ success: false, error: "No AI provider configured" }, { status: 500 });
    }

    const promptText = `
      You are an expert floor planner. Analyze this sketch of a room.
      Determine the overall primary rectangular room dimensions in millimeters (widthMm, depthMm).
      Assume typical room scales if unclear (e.g., a standard bedroom is 3000x4000).
      If hints are provided, use them as guidance.
      Hints: ${JSON.stringify(hints ?? {})}
      
      Respond strictly with a JSON object in this format:
      {
        "widthMm": number,
        "depthMm": number
      }
    `;

    const messages: ServerChatMessage[] = [
      {
        role: "user",
        content: [
          { type: "text", text: promptText },
          { type: "image_url", image_url: { url: imageDataUrl } }
        ]
      }
    ];

    const resultText = await requestProviderText(geminiProvider, messages, {
      jsonMode: true,
      temperature: 0.1,
    });

    let widthMm = 6000;
    let depthMm = 4000;

    try {
      const parsed = JSON.parse(resultText);
      if (typeof parsed.widthMm === "number") widthMm = parsed.widthMm;
      if (typeof parsed.depthMm === "number") depthMm = parsed.depthMm;
    } catch (err) {
      console.error("Failed to parse sketch-to-plan JSON:", resultText);
    }

    const project = createRectangularRoomProject({
      name: projectName || "Sketch Conversion",
      widthMm,
      depthMm,
    });

    if (displayUnit) {
      project.displayUnit = displayUnit;
    }

    return NextResponse.json({
      success: true,
      status: "completed",
      project,
      floor: project.floors[0],
      message: "Sketch converted successfully.",
    });

  } catch (error) {
    console.error("Sketch-to-plan API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error processing sketch" },
      { status: 500 }
    );
  }
}
