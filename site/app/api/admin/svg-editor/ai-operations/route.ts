import { NextRequest } from "next/server";

import { requestSvgAiOperations } from "@/features/admin/svg-editor-v2/ai/requestSvgAiOperations.server";
import { SvgAiRequestV1Schema } from "@/features/admin/svg-editor-v2/ai/svgAiSchemasV1";
import { ApiError, API_ERROR_CODES } from "@/features/shared/api/ApiError";
import { error, success } from "@/features/shared/api/apiResponse";
import { withAuth } from "@/features/shared/api/withAuth";

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function handleAiOperations(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 1_100_000) return error(new ApiError(413, API_ERROR_CODES.VALIDATION_ERROR, "Request is too large"));
  const parsed = SvgAiRequestV1Schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error(new ApiError(400, API_ERROR_CODES.VALIDATION_ERROR, "Invalid SVG AI request"));
  if (await sha256(parsed.data.svg) !== parsed.data.baseChecksum) {
    return error(new ApiError(409, API_ERROR_CODES.VALIDATION_ERROR, "SVG checksum does not match the request"));
  }
  try {
    return success(await requestSvgAiOperations(parsed.data));
  } catch {
    return error(new ApiError(502, API_ERROR_CODES.INTERNAL_ERROR, "SVG AI operation provider failed safely"));
  }
}

export const POST = withAuth(
  async (request) => handleAiOperations(request as NextRequest),
  { role: "admin", rateLimitScope: "svg-editor-v2:ai-operations", rateLimit: 10, requireCsrf: true },
);
