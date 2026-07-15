import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getOptionalUser } from "@/lib/auth/session";
import { sanitizeNextPath } from "@/lib/auth/plannerRedirect";
import { AccessForm } from "./AccessForm";
import { SiteWorkspaceShell } from "@/components/home/layout";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { ACCESS_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata: Metadata = ACCESS_PAGE_METADATA;

export default async function AccessRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getOptionalUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const nextPath = sanitizeNextPath(
    typeof resolvedSearchParams?.next === "string" ? resolvedSearchParams.next : undefined,
  );

  if (user) {
    redirect(nextPath);
  }

  const guestHref = "/choose-product?mode=guest";
  const requiresAdmin = nextPath === "/admin" || nextPath.startsWith("/admin/");
  const t = await getTranslations("workspace");

  return (
    <SiteWorkspaceShell>
      <div className="flex min-h-screen w-full">
      {/* Form Side */}
      <div className="flex w-full flex-col lg:w-1/2 relative">
        <div className="absolute top-8 left-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-strong transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToHome")}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center p-8 lg:p-12">
          <AccessForm nextPath={nextPath} guestHref={guestHref} requiresAdmin={requiresAdmin} />
        </div>
      </div>

      {/* Visual Side */}
      <div className="scheme-panel-soft hidden w-1/2 relative overflow-hidden lg:block border-l scheme-border">
        {/* Static architectural CSS pattern */}
        <div className="absolute inset-0 z-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="architectural-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-muted"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#architectural-grid)" />
            {/* Adding some architectural lines to break the grid */}
            <line x1="0" y1="200" x2="100%" y2="200" stroke="currentColor" strokeWidth="2" className="text-muted opacity-50" />
            <line x1="300" y1="0" x2="300" y2="100%" stroke="currentColor" strokeWidth="2" className="text-muted opacity-50" />
            <circle cx="300" cy="200" r="8" fill="currentColor" className="text-muted" />
          </svg>
        </div>
        
        <div className="relative z-10 flex h-full flex-col items-start justify-end p-12 text-strong">
          <div className="max-w-md scheme-panel surface-overlay-08 p-8 rounded-2xl border scheme-border">
            <h3 className="typ-h3 mb-3">
              {t("accessPanelTitle")}
            </h3>
            <p className="page-copy-sm text-muted">
              {t("accessPanelDescription")}
            </p>
          </div>
        </div>
      </div>
      </div>
    </SiteWorkspaceShell>
  );
}
