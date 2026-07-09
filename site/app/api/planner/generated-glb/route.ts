/**
 * POST /api/planner/generated-glb
 *
 * Accept system-generated GLB bytes and write under site/public/catalog-assets/generated/
 * so open3d G8 can fetch them same-origin. Used by placeModularWithGeneratedGlbBrowser
 * (client cannot use node:fs writeGeneratedGlbToPublic).
 *
 * Headers:
 *   Content-Type: application/octet-stream
 *   X-Generated-Glb-Relative-Path: catalog-assets/generated/<file>.glb
 *
 * Body: raw GLB bytes
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import {
  writeGeneratedGlbToPublic,
  assertWritableGeneratedGlbRelativePath,
} from "@/features/planner/asset-engine/mesh/writeGeneratedGlbToPublic";
import { GENERATED_GLB_PATH_MARKER } from "@/features/planner/lib/glbAssetPolicy";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MiB — modular cabinet-v0 is small

export async function POST(req: NextRequest) {
  const rateError = await enforcePublicApiRateLimit(
    req,
    "planner-generated-glb:post",
    20,
  );
  if (rateError) return rateError;

  const relativeHeader = req.headers
    .get("x-generated-glb-relative-path")
    ?.trim();
  if (!relativeHeader) {
    return NextResponse.json(
      {
        ok: false,
        error: "missing_relative_path",
        message: `Header X-Generated-Glb-Relative-Path required (${GENERATED_GLB_PATH_MARKER}…)`,
      },
      { status: 400 },
    );
  }

  let relativePath: string;
  try {
    relativePath = assertWritableGeneratedGlbRelativePath(relativeHeader);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_relative_path",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 400 },
    );
  }

  let buffer: ArrayBuffer;
  try {
    buffer = await req.arrayBuffer();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "body_read_failed",
        message: "Could not read request body as ArrayBuffer",
      },
      { status: 400 },
    );
  }

  if (buffer.byteLength === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "empty_body",
        message: "GLB body must be non-empty",
      },
      { status: 400 },
    );
  }

  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        error: "body_too_large",
        message: `GLB body exceeds ${MAX_BYTES} bytes`,
      },
      { status: 413 },
    );
  }

  try {
    const write = writeGeneratedGlbToPublic(buffer, relativePath);
    return NextResponse.json({
      ok: true,
      relativePath: write.relativePath,
      publicUrlPath: write.publicUrlPath,
      byteLength: write.byteLength,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: "write_failed",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
