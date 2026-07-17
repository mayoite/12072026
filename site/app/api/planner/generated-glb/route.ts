/**
 * POST /api/planner/generated-glb
 *
 * Accepts system-generated GLB bytes and stores them under Supabase
 * catalog-assets/generated/* when service role is configured.
 * Never writes under site/public (production hard rule).
 *
 * Headers:
 *   Content-Type: application/octet-stream
 *   X-Generated-Glb-Relative-Path: catalog-assets/generated/<file>.glb
 *
 * Security:
 * - Guests land under generated/guest/{unique}-… with upsert:false (no shared key overwrite).
 * - Authenticated members land under generated/u/{userId}/… with upsert allowed for own keys.
 * - Path traversal rejected; size limit 25 MB.
 *
 * Guest-allowed mutation: CSRF + rate limit via withAuth.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { withAuth, type AuthContext } from "@/features/shared/api/withAuth";
import { publishGeneratedGlbToSupabase } from "@/features/shared/catalog/catalogAssetStorage.server";
import {
  GENERATED_GLB_PATH_MARKER,
  isSystemGeneratedGlbUrl,
} from "@/features/planner/lib/glbAssetPolicy";

const PATH_HEADER = "x-generated-glb-relative-path";
const MAX_BYTES = 25 * 1024 * 1024;

export const POST = withAuth(
  async (req: NextRequest, auth: AuthContext) => {
    const relativePath = (req.headers.get(PATH_HEADER) ?? "").trim();
    if (
      !relativePath ||
      !isSystemGeneratedGlbUrl(relativePath) ||
      relativePath.includes("..") ||
      relativePath.includes("\\") ||
      relativePath.includes("\0")
    ) {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "invalid_path",
          message: `Relative path must be under ${GENERATED_GLB_PATH_MARKER}`,
        },
        { status: 400 },
      );
    }

    let body: ArrayBuffer;
    try {
      body = await req.arrayBuffer();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "invalid_body",
          message: "Could not read GLB body.",
        },
        { status: 400 },
      );
    }

    if (body.byteLength === 0) {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "empty_body",
          message: "GLB body is empty.",
        },
        { status: 400 },
      );
    }
    if (body.byteLength > MAX_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "too_large",
          message: "GLB exceeds 25 MB limit.",
        },
        { status: 413 },
      );
    }

    // Guests: unique guest/ keys + upsert false (no shared product overwrite).
    // Members: namespaced under generated/u/{userId}/ with upsert allowed for own keys.
    const uploaded = await publishGeneratedGlbToSupabase({
      relativePath,
      body,
      ownerId: auth.user?.id ?? null,
    });

    if (!uploaded.ok) {
      if (uploaded.reason === "supabase_service_role_not_configured") {
        return NextResponse.json(
          {
            ok: false,
            success: false,
            error: "not_configured",
            code: "SERVICE_UNAVAILABLE",
            message:
              "Persistent generated GLB storage is not configured (Supabase service role). Production must not write under site/public.",
          },
          { status: 501 },
        );
      }
      if (uploaded.reason === "invalid_generated_glb_path") {
        return NextResponse.json(
          {
            ok: false,
            success: false,
            error: "invalid_path",
            message: `Relative path must be under ${GENERATED_GLB_PATH_MARKER}`,
          },
          { status: 400 },
        );
      }
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "upload_failed",
          message: uploaded.reason,
        },
        { status: 502 },
      );
    }

    // publicUrlPath is what the browser stamps / fetches (policy-safe public URL).
    // relativePath is the namespaced catalog-assets/generated/… form after upload.
    return NextResponse.json({
      ok: true,
      success: true,
      relativePath: uploaded.path,
      publicUrlPath: uploaded.publicUrl,
      byteLength: body.byteLength,
    });
  },
  {
    role: "guest",
    rateLimitScope: "planner-generated-glb:post",
    rateLimit: 20,
    requireCsrf: true,
  },
);
