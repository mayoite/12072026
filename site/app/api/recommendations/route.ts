import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPublicApiIp } from "@/app/api/_lib/public";
import { getProducts, type Product } from '@/lib/catalog/site/getProducts';
import { createSupabaseAuthAdminClient } from '@/platform/supabase/auth-admin';
import { getCatalogProductHref } from '@/lib/catalog/site/categories';
import { rateLimit } from "@/lib/rateLimit";
import { normalizeAnonymousUserId } from "@/lib/tracking/anonymousUserId";
import { TRACKING_ANON_COOKIE } from "@/lib/tracking/trackingCookie";
import { fetchViewedProducts } from "@/lib/tracking/userHistoryRepository";

type RecommendationsPayload = {
  /** @deprecated Ignored for history lookup (IDOR). Prefer session cookie / bearer. */
  userId?: string;
  limit?: number;
};

type Recommendation = {
  productId: string;
  productName: string;
  category: string;
  why: string;
  budgetEstimate: string;
  href: string;
};

function normalizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function getBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match?.[1]) return null;

  return match[1].trim();
}



function getBudgetEstimate(product: Product): string {
  const range = product.metadata?.priceRange;
  if (range === "budget") return "Budget range";
  if (range === "mid") return "Mid range";
  if (range === "premium") return "Premium range";
  if (range === "luxury") return "Luxury range";
  return "Consult for pricing";
}

function getCategoryLabel(product: Product): string {
  return product.category_id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toRecommendation(product: Product, reason: string): Recommendation {
  return {
    productId: product.id,
    productName: product.name,
    category: getCategoryLabel(product),
    why: reason,
    budgetEstimate: getBudgetEstimate(product),
    href: getCatalogProductHref(product.category_id, product.slug),
  };
}

/**
 * Resolve history subject for personalization.
 * Bearer session first, then cookie-bound anon id (same as /api/tracking).
 * Body `userId` is never trusted — it enabled cross-user history IDOR.
 */
async function resolveUserId(req: NextRequest): Promise<string | null> {
  const token = getBearerToken(req);
  if (token) {
    try {
      const supabaseAdmin = createSupabaseAuthAdminClient();
      const { data: authData } = await supabaseAdmin.auth.getUser(token);
      const authUserId = normalizeText(authData?.user?.id);
      if (authUserId) return authUserId;
    } catch {
      // fall through to cookie-bound anonymous id
    }
  }

  try {
    const cookieStore = await cookies();
    const cookieAnonId = normalizeAnonymousUserId(
      cookieStore.get(TRACKING_ANON_COOKIE)?.value,
    );
    if (cookieAnonId) return cookieAnonId;
  } catch {
    // cookies() unavailable in some test contexts
  }

  return null;
}

function pickPopular(products: Product[], limit: number): Recommendation[] {
  return products.slice(0, limit).map((product) =>
    toRecommendation(
      product,
      "Popular in current enterprise fit-outs and suitable for scalable workspace deployments.",
    ),
  );
}

function pickPersonalized(
  products: Product[],
  viewedProductIds: string[],
  limit: number,
): Recommendation[] {
  const viewedSet = new Set(viewedProductIds);
  const viewedProducts = products.filter((product) => viewedSet.has(product.id));

  if (viewedProducts.length === 0) {
    return pickPopular(products, limit);
  }

  const categoryFrequency = new Map<string, number>();
  for (const product of viewedProducts) {
    categoryFrequency.set(
      product.category_id,
      (categoryFrequency.get(product.category_id) || 0) + 1,
    );
  }

  const sortedCategories = [...categoryFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  const candidates = products
    .filter((product) => !viewedSet.has(product.id))
    .sort((a, b) => {
      const aRank = sortedCategories.indexOf(a.category_id);
      const bRank = sortedCategories.indexOf(b.category_id);
      const aScore = aRank === -1 ? Number.MAX_SAFE_INTEGER : aRank;
      const bScore = bRank === -1 ? Number.MAX_SAFE_INTEGER : bRank;
      if (aScore !== bScore) return aScore - bScore;
      return a.name.localeCompare(b.name);
    });

  return candidates.slice(0, limit).map((product) =>
    toRecommendation(
      product,
      "Matched to your recent browsing history and similar enterprise category preferences.",
    ),
  );
}

export async function POST(req: NextRequest) {
  const ip = getPublicApiIp(req);

  try {
    const limitRes = await rateLimit(`recommendations:${ip}`, 30, 60 * 1000);
    if (!limitRes.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "X-RateLimit-Reset": limitRes.reset.toString() } },
      );
    }

    const payload = (await req.json().catch(() => ({}))) as RecommendationsPayload;
    const userId = await resolveUserId(req);
    const limit = Math.min(Math.max(Number(payload.limit) || 4, 1), 8);

    const products = await getProducts();
    if (products.length === 0) {
      return NextResponse.json({
        mode: "popular",
        recommendations: [],
        summary: "No products available right now.",
      });
    }

    if (!userId) {
      return NextResponse.json({
        mode: "popular",
        recommendations: pickPopular(products, limit),
        summary: "Showing popular products because no browsing history is available yet.",
      });
    }

    const supabaseAdmin = createSupabaseAuthAdminClient();
    const viewedProducts = await fetchViewedProducts(supabaseAdmin, userId);

    if (viewedProducts.length === 0) {
      return NextResponse.json({
        mode: "popular",
        recommendations: pickPopular(products, limit),
        summary: "Showing popular products because no browsing history is available yet.",
      });
    }

    return NextResponse.json({
      mode: "personalized",
      recommendations: pickPersonalized(products, viewedProducts, limit),
      summary: "Recommendations are tailored from your recent catalog exploration.",
    });
  } catch (error) {
    console.error("[recommendations] failed:", error);
    return NextResponse.json(
      {
        mode: "popular",
        recommendations: [],
        summary: "Recommendations are temporarily unavailable.",
      },
      { status: 500 },
    );
  }
}
