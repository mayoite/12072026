import type { Metadata } from "next";

import { PlannerLandingPage } from "@/features/planner/landing/PlannerLandingPage";
import { PLANNER_LANDING_PAGE_METADATA } from "@/features/site/data/routeMetadata";
import { SITE_URL } from "@/lib/siteUrl";
import { buildPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/helpers/seo";
import { sanitizeJsonForScript } from "@/lib/security/sanitize";

/** Canonical SEO for /planner (registry-owned; do not re-inline). */
export const metadata: Metadata = PLANNER_LANDING_PAGE_METADATA;

const PAGE_JSON_LD = buildPageJsonLd(SITE_URL, {
  path: "/planner",
  title: "Workspace Planner — Design Your Office Layout",
  description:
    "Plan desks, zones, and equipment on mm-accurate floor plans with 2D, 3D, and branded PDF export.",
  pageType: "WebPage",
});

const BREADCRUMB_JSON_LD = buildBreadcrumbJsonLd(SITE_URL, [
  { name: "Home", path: "/" },
  { name: "Workspace Planner", path: "/planner" },
]);

export default function PlannerLandingRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(PAGE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(BREADCRUMB_JSON_LD) }}
      />
      <PlannerLandingPage />
    </>
  );
}
