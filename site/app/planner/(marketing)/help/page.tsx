import { PlannerHelpPage } from "@/features/planner/help/PlannerHelpPage";
import { PLANNER_HELP_FAQ_ITEMS } from "@/features/planner/help/helpSections";
import { SITE_URL } from "@/lib/siteUrl";
import { buildBreadcrumbJsonLd, buildFAQJsonLd, buildPageJsonLd, buildPageMetadata } from "@/lib/helpers/seo";
import { sanitizeJsonForScript } from "@/lib/security/sanitize";

export const metadata = buildPageMetadata(SITE_URL, {
  title: "Planner Help — Workspace Layout Guide",
  description:
    "Learn how to draw walls, place furniture, measure areas, use AI assist, and export branded PDF floor plans.",
  path: "/planner/help",
  keywords: ["planner help", "floor plan guide", "workspace layout tutorial"],
});

const PAGE_JSON_LD = buildPageJsonLd(SITE_URL, {
  path: "/planner/help",
  title: "Planner Help — Workspace Layout Guide",
  description: "Help center for the One&Only workspace planner.",
  pageType: "WebPage",
});

const BREADCRUMB_JSON_LD = buildBreadcrumbJsonLd(SITE_URL, [
  { name: "Planner", path: "/planner" },
  { name: "Help", path: "/planner/help" },
]);

const FAQ_JSON_LD = buildFAQJsonLd(PLANNER_HELP_FAQ_ITEMS);

export default function PlannerHelpRoute() {
  return (
    <>
      {[PAGE_JSON_LD, BREADCRUMB_JSON_LD, FAQ_JSON_LD].map((jsonLd) => (
        <script
          key={jsonLd["@type"] === "FAQPage" ? "faq" : jsonLd["@type"] === "BreadcrumbList" ? "breadcrumb" : "page"}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(jsonLd) }}
        />
      ))}
      <PlannerHelpPage />
    </>
  );
}
