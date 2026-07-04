import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseAuthAdminClient } from '@/platform/supabase/auth-admin';
import { rateLimit } from '@/lib/rateLimit';
import {
  createAnonymousUserId,
  normalizeAnonymousUserId,
} from "@/lib/tracking/anonymousUserId";
import {
  TRACKING_ANON_COOKIE,
  TRACKING_ANON_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/tracking/trackingCookie";

type TrackingPayload = {
  productId?: string;
};

async function parseTrackingPayload(req: NextRequest): Promise<TrackingPayload> {
  try {
    return (await req.json()) as TrackingPayload;
  } catch {
    return {};
  }
}

function getBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match?.[1]) return null;

  return match[1].trim();
}

function normalizeId(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function isMissingUserHistoryTable(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    (normalized.includes("could not find the table") ||
      normalized.includes('relation "public.user_history" does not exist')) &&
    normalized.includes("user_history")
  );
}

function trackingNoopResponse(
  userId: string,
  productId: string,
  viewedProducts = [productId],
) {
  return NextResponse.json({
    success: true,
    tracked: false,
    userId,
    viewedProducts,
  });
}

function withAnonCookie(
  response: NextResponse,
  anonId: string | null,
): NextResponse {
  if (!anonId) return response;
  response.cookies.set(TRACKING_ANON_COOKIE, anonId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TRACKING_ANON_COOKIE_MAX_AGE_SECONDS,
  });
  return response;
}

async function resolveUserId(req: NextRequest): Promise<{
  userId: string;
  newAnonId: string | null;
}> {
  const token = getBearerToken(req);
  if (token) {
    try {
      const authClient = createSupabaseAuthAdminClient();
      const { data: authData } = await authClient.auth.getUser(token);
      const authUserId = normalizeId(authData?.user?.id);
      if (authUserId) return { userId: authUserId, newAnonId: null };
    } catch {
      // fall through to cookie-bound anonymous id
    }
  }

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(TRACKING_ANON_COOKIE)?.value;
  const cookieAnonId = normalizeAnonymousUserId(cookieValue);
  if (cookieAnonId) {
    return { userId: cookieAnonId, newAnonId: null };
  }

  const newAnonId = createAnonymousUserId();
  return { userId: newAnonId, newAnonId };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const rl = await rateLimit(`tracking:${ip}`, 30, 60000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)) } }
    );
  }

  try {
    const payload = await parseTrackingPayload(req);
    const productId = normalizeId(payload.productId);

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const { userId, newAnonId } = await resolveUserId(req);
    let supabaseAdmin: ReturnType<typeof createSupabaseAuthAdminClient>;

    try {
      supabaseAdmin = createSupabaseAuthAdminClient();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[tracking] Supabase admin client unavailable; skipping history write.",
          error,
        );
      }
      return withAnonCookie(trackingNoopResponse(userId, productId), newAnonId);
    }

    const { data, error } = await supabaseAdmin
      .from("user_history")
      .select("viewed_products")
      .eq("user_id", userId)
      .maybeSingle();

    if (error && !isMissingUserHistoryTable(error.message)) {
      console.error("Supabase fetch error:", error.message);
    }

    const existing = Array.isArray(data?.viewed_products)
      ? data.viewed_products.filter((item): item is string => typeof item === "string")
      : [];

    const withoutDuplicate = existing.filter((item) => item !== productId);
    const viewedProducts = [...withoutDuplicate, productId].slice(-10);

    const { error: upsertError } = await supabaseAdmin
      .from("user_history")
      .upsert(
        {
          user_id: userId,
          viewed_products: viewedProducts,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

    if (upsertError) {
      if (isMissingUserHistoryTable(upsertError.message)) {
        return withAnonCookie(trackingNoopResponse(userId, productId, viewedProducts), newAnonId);
      }
      return withAnonCookie(trackingNoopResponse(userId, productId, viewedProducts), newAnonId);
    }

    return withAnonCookie(
      NextResponse.json({ success: true, userId, viewedProducts }),
      newAnonId,
    );
  } catch (err) {
    console.error("Tracking API Error:", err);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
