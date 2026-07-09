import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { PLANNER_GUEST_COOKIE } from "./lib/auth/constants";
import { isDevAuthBypassEnabled } from "./lib/auth/devAuthBypass";
import { isMaintenanceReadonly } from "./lib/platform/maintenanceMode";

/** Canonical planner paths only — legacy /oando-planner/* and /buddy-planner/* 301 in next.config.js */
const PLANNER_GUEST_PATHS = ["/planner", "/planner/guest", "/planner/canvas"];
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const BLOCKED_PAGE_PREFIXES = ["/admin", "/crm", "/ops"];
const BLOCKED_WRITE_API_PREFIXES = [
  "/api/plans",
  "/api/planner",
  "/api/tracking",
  "/api/quotes",
  "/api/customer-queries",
];

/** next-intl locale negotiation/rewrite middleware (i18n layer). */
const intlMiddleware = createIntlMiddleware(routing);

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

/** Fabric / WebGL planner surfaces require eval at runtime; Next.js dev (React Refresh) needs it on every route. */
function allowsUnsafeEval(pathname: string): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return isCanvasHeavyPath(pathname);
}

export function isCanvasHeavyPath(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  const prefixes = ["/planner", "/dashboard", "/portal", "/admin", "/crm", "/ops", "/catalog"];
  return prefixes.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

export function buildContentSecurityPolicy(pathname: string): string {
  const scriptSrc = allowsUnsafeEval(pathname)
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com"
    : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com https://cdn.tldraw.com",
    "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://api.openai.com https://openrouter.ai https://www.google-analytics.com https://unpkg.com https://cdn.tldraw.com",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; ");
}

export function isPlannerGuestAllowedPath(pathname: string): boolean {
  const normalizedPathname = normalizePathname(pathname);
  return PLANNER_GUEST_PATHS.some((path) => {
    if (normalizedPathname === path) return true;
    if (path === "/planner") return false;
    return normalizedPathname.startsWith(`${path}/`);
  });
}

/** Phase 05: public Puck.Render previews — exempt from member portal auth (I-D live routes). */
const PORTAL_PUBLIC_SVG_CATALOG_PREFIX = "/portal/svg-catalog";

export function isPublicPortalSvgCatalogPath(pathname: string): boolean {
  const normalizedPathname = normalizePathname(pathname);
  return (
    normalizedPathname === PORTAL_PUBLIC_SVG_CATALOG_PREFIX ||
    normalizedPathname.startsWith(`${PORTAL_PUBLIC_SVG_CATALOG_PREFIX}/`)
  );
}

export function isProtectedPath(pathname: string): boolean {
  const normalizedPathname = normalizePathname(pathname);

  if (isPublicPortalSvgCatalogPath(normalizedPathname)) {
    return false;
  }

  if (
    normalizedPathname === "/dashboard" ||
    normalizedPathname.startsWith("/dashboard/") ||
    normalizedPathname === "/portal" ||
    normalizedPathname.startsWith("/portal/") ||
    normalizedPathname === "/admin" ||
    normalizedPathname.startsWith("/admin/") ||
    normalizedPathname === "/crm" ||
    normalizedPathname.startsWith("/crm/") ||
    normalizedPathname === "/ops" ||
    normalizedPathname.startsWith("/ops/")
  ) {
    return true;
  }

  return false;
}

/** Fast edge check: Supabase SSR session cookies (and legacy Appwrite if present). */
export function hasSessionAuthCookies(
  cookies: Array<{ name: string; value: string }>,
): boolean {
  return cookies.some((cookie) => {
    const name = cookie.name;
    if (name.startsWith("a_session_")) return true;
    if (name.startsWith("sb-") && name.includes("auth-token")) return true;
    return false;
  });
}

function applyMaintenanceHeader(response: NextResponse) {
  response.headers.set("x-site-maintenance", "readonly");
  return response;
}

/**
 * NEXT.JS 16 PROXY
 * Must be named 'proxy' and placed at the root of the project.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const maintenanceReadonly = isMaintenanceReadonly();

  if (maintenanceReadonly) {
    if (BLOCKED_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      const url = request.nextUrl.clone();
      url.pathname = "/offline";
      url.searchParams.set("reason", "maintenance");
      return applyMaintenanceHeader(NextResponse.redirect(url));
    }

    if (
      WRITE_METHODS.has(request.method) &&
      BLOCKED_WRITE_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
    ) {
      return applyMaintenanceHeader(
        NextResponse.json(
          { error: "Service temporarily in read-only maintenance mode." },
          {
            status: 503,
            headers: { "Retry-After": "300" },
          },
        ),
      );
    }
  }

  // ── i18n layer ────────────────────────────────────────────────────────────
  // Run next-intl locale negotiation first. If it rewrites/redirects (e.g. to
  // add a locale prefix or honor the NEXT_LOCALE cookie), return that response
  // and skip the security/auth logic below. A plain `next()` falls through.
  const intlResponse = undefined; // Bypassed: locales resolved in request.ts via cookies/headers to support prefixless dynamic translations
  if (intlResponse && !(intlResponse as NextResponse).headers.get("x-middleware-next")) {
    return intlResponse;
  }

  const isProtected = isProtectedPath(pathname);
  const hasPlannerGuestPass = request.cookies.has(PLANNER_GUEST_COOKIE);
  const allowPlannerGuest = hasPlannerGuestPass && isPlannerGuestAllowedPath(pathname);

  // Fast cookie existence check — avoids network calls for anonymous traffic.
  // Session validation still happens in layouts via getOptionalUser().
  const hasAuthCookies = hasSessionAuthCookies(request.cookies.getAll());
  const devAuthBypass = isDevAuthBypassEnabled();

  // Short-circuit: If they have no auth cookies, are not a guest, and the route is protected -> Boot them immediately.
  // Dev bypass (DEV_AUTH_BYPASS=1, non-prod) skips this gate for local admin/P0.1 work.
  if (!devAuthBypass && !hasAuthCookies && !allowPlannerGuest && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/access";
    redirectUrl.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    return maintenanceReadonly
      ? applyMaintenanceHeader(NextResponse.redirect(redirectUrl))
      : NextResponse.redirect(redirectUrl);
  }

  // STRICT GUEST ENFORCEMENT — /planner/guest (legacy planner URLs 301 here first)
  if (
    !hasAuthCookies &&
    (allowPlannerGuest ||
      pathname.startsWith("/planner/guest") ||
      request.headers.get("referer")?.includes("/guest"))
  ) {
    const isMutationMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(request.method);
    const isServerAction = request.headers.has("next-action");
    
    const isBlockedApi = 
      pathname.startsWith("/api/plans") || 
      pathname.includes("/export") || 
      pathname.includes("/import") || 
      pathname.includes("/publish") ||
      pathname.includes("/share") ||
      pathname.includes("/persist");

    if (isBlockedApi || (isMutationMethod && isServerAction)) {
      const response = NextResponse.json(
        {
          error: "Guest users cannot perform save, import, export, publish, or share actions.",
        },
        { status: 403 },
      );
      return maintenanceReadonly ? applyMaintenanceHeader(response) : response;
    }
  }

  // The actual session validation is handled by getOptionalUser() in session.ts
  // at the page/layout level. The edge proxy just does a fast cookie existence check.
  
  // If the i18n middleware produced a passthrough `next()` response (e.g. it set
  // the x-next-intl-locale header without rewriting), reuse it so the header is
  // preserved; otherwise create a fresh response.
  const response = intlResponse ?? NextResponse.next({ request });

  // ── Security Headers ──────────────────────────────────────────────────────
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("Content-Security-Policy", buildContentSecurityPolicy(pathname));

  return maintenanceReadonly ? applyMaintenanceHeader(response) : response;
}

export const config = {
  matcher: [
    // i18n locale-prefixed paths and the root, handled by the next-intl layer.
    "/",
    "/(hi|fr|de|es)/:path*",
    "/api/:path*",
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder assets (images, fonts, etc.)
     * - API routes are matched separately via `/api/:path*` above
     */
    "/((?!_next|_vercel|api|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|eot)$).*)",
  ],
};

