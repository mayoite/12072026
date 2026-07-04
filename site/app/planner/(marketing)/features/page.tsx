import { PlannerFeaturesHubPage } from "@/features/planner/landing/PlannerFeaturesHubPage";
import { SITE_URL } from "@/lib/siteUrl";
import { buildBreadcrumbJsonLd, buildPageJsonLd, buildPageMetadata } from "@/lib/helpers/seo";
import { sanitizeJsonForScript } from "@/lib/security/sanitize";

export const metadata = buildPageMetadata(SITE_URL, {
  title: "Planner Features — Measure, Catalog, 3D & Export",
  description:
    "Explore workspace planner capabilities: measurements, catalog furniture, 3D view, AI assist, and branded PDF export.",
  path: "/planner/features",
  keywords: [
    "planner features",
    "floor plan measurement",
    "office layout 3d",
    "furniture catalog planner",
  ],
});

const PAGE_JSON_LD = buildPageJsonLd(SITE_URL, {
  path: "/planner/features",
  title: "Planner Features",
  description: "Capability overview for the One&Only workspace planner.",
  pageType: "CollectionPage",
});

const BREADCRUMB_JSON_LD = buildBreadcrumbJsonLd(SITE_URL, [
  { name: "Planner", path: "/planner" },
  { name: "Features", path: "/planner/features" },
]);

export default function PlannerFeaturesHubRoute() {
  return (
    <>
      {[PAGE_JSON_LD, BREADCRUMB_JSON_LD].map((jsonLd) => (
        <script
          key={jsonLd["@type"] === "BreadcrumbList" ? "breadcrumb" : "page"}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(jsonLd) }}
        />
      ))}
      <PlannerFeaturesHubPage />
    </>
  );
}
