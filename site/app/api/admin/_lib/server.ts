import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { resolveAuthContext } from "@/lib/api/withAuth";
import { ApiError } from "@/lib/api/ApiError";
import {
  createAdminServiceClient,
  getClientIp,
  isMissingTableError,
} from "@/platform/supabase/adminServer";

/** @deprecated Import from `@/platform/supabase/adminServer` instead. */
export { createAdminServiceClient, getClientIp, isMissingTableError };

export async function enforceAdminRateLimit(
  req: NextRequest,
  scope: string,
  limit = 30,
  windowMs = 60 * 1000,
): Promise<NextResponse | null> {
  const ip = getClientIp(req);
  const limitRes = await rateLimit(`admin:${scope}:${ip}`, limit, windowMs);

  if (limitRes.success) return null;

  return NextResponse.json(
    { error: "Too many requests." },
    {
      status: 429,
      headers: { "X-RateLimit-Reset": limitRes.reset.toString() },
    },
  );
}

export async function requireAdminSession(): Promise<NextResponse | null> {
  try {
    await resolveAuthContext("admin");
    return null;
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}