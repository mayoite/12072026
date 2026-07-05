// Archived on 2026-06-29 after Next.js 16 moved root request handling to proxy.ts.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isMaintenanceReadonly } from "@/lib/platform/maintenanceMode";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const BLOCKED_PAGE_PREFIXES = ["/admin", "/crm", "/ops"];

const BLOCKED_WRITE_API_PREFIXES = [
  "/api/plans",
  "/api/planner",
  "/api/tracking",
  "/api/quotes",
  "/api/customer-queries",
];

export function middleware(request: NextRequest) {
  if (!isMaintenanceReadonly()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (BLOCKED_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const url = request.nextUrl.clone();
    url.pathname = "/offline";
    url.searchParams.set("reason", "maintenance");
    return NextResponse.redirect(url);
  }

  if (
    WRITE_METHODS.has(request.method) &&
    BLOCKED_WRITE_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.json(
      { error: "Service temporarily in read-only maintenance mode." },
      {
        status: 503,
        headers: { "Retry-After": "300" },
      },
    );
  }

  const response = NextResponse.next();
  response.headers.set("x-site-maintenance", "readonly");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)"],
};
