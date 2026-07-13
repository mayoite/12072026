import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/features/shared/api/withAuth";
import { ApiError, API_ERROR_CODES } from "@/features/shared/api/ApiError";
import { success, error } from "@/features/shared/api/apiResponse";
import { requestProviderText, resolveProviderChain } from "@/lib/ai/providerChain";

const SYSTEM_PROMPT = `You are an expert SVG graphic designer.
Your task is to generate valid, clean SVG markup based on the user's prompt.
The output MUST contain only the raw <path>, <rect>, <circle>, or <polygon> elements.
Do NOT output the wrapping <svg> tag.
Do NOT use markdown code fences like \`\`\`svg. Output only the raw XML nodes.
Do NOT add styling, fills, or strokes. The paths will be styled by the application.
Keep the paths scaled for a viewBox of roughly "0 0 1000 1000".
If the user asks for a furniture item (like a chair or desk), generate the top-down 2D outline.
Be as precise and minimalist as possible.`;

async function handleAiGenerate(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.prompt !== "string") {
    return error(new ApiError(400, API_ERROR_CODES.VALIDATION_ERROR, "Prompt is required"));
  }

  const providers = resolveProviderChain();
  // Attempt to find Gemini provider first since the user has Gemini Ultra
  const geminiProvider = providers.find((p) => p.provider === "gemini");
  const provider = geminiProvider || providers[0];

  if (!provider) {
    return error(new ApiError(500, API_ERROR_CODES.INTERNAL_ERROR, "No AI provider configured. Missing GEMINI_API_KEY."));
  }

  try {
    const rawSvg = await requestProviderText(
      provider,
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: body.prompt }
      ],
      { temperature: 0.2 }
    );
    
    // Clean up any markdown wrapping just in case
    const cleanedSvg = rawSvg.replace(/^```[a-z]*\n?/im, "").replace(/```$/im, "").trim();

    return success({ svg: cleanedSvg, provider: provider.provider });
  } catch (err) {
    console.error("[ai-generate] failed:", err);
    return error(new ApiError(500, API_ERROR_CODES.INTERNAL_ERROR, "AI Generation failed"));
  }
}

export const POST = withAuth(
  async (req) => handleAiGenerate(req as NextRequest),
  { role: "admin", rateLimitScope: "admin-write", rateLimit: 20 }
);
