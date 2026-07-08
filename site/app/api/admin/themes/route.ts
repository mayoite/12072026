/**
 * GET /api/admin/themes — List block themes (admin only).
 *
 * Auth: `admin` role required (enforced by `withAuth`). Rate-limited per IP.
 * Response (200): `{ success: true, themes: ThemeRow[] }`.
 */

import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";
import { withAuth } from "@/features/shared/api/withAuth";
import { success } from "@/features/shared/api/apiResponse";
import { ApiError, API_ERROR_CODES } from "@/features/shared/api/ApiError";
import {
  createAdminServiceClient,
  isMissingTableError,
} from "@/platform/supabase/adminServer";

type ThemeRow = {
  id: string;
  name: string;
  is_active: boolean;
};

async function handleThemesGet(): Promise<NextResponse> {
  const supabase = createAdminServiceClient();
  if (!supabase) {
    return success({ themes: [] as ThemeRow[], source: "none" });
  }

  const { data, error: dbError } = await supabase
    .from("block_themes")
    .select("id, name, is_active")
    .order("created_at", { ascending: false });

  if (dbError) {
    if (isMissingTableError(dbError.message)) {
      return success({ themes: [] as ThemeRow[], source: "block_themes" });
    }
    console.error("[admin/themes] GET error:", dbError.message);
    throw ApiError.fromCode(API_ERROR_CODES.INTERNAL_ERROR, "Failed to load themes.");
  }

  return success({
    themes: (data ?? []) as ThemeRow[],
    source: "block_themes",
  });
}

export const GET = withAuth(
  async (_req: NextRequest) => handleThemesGet(),
  { role: "admin", rateLimitScope: "themes:list", rateLimit: 30 },
);