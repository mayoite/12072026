import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/features/site/data/seo";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * SITE-SEO-03 — portal SVG catalog is protected; keep noindex with parent portal.
 * Absolute title avoids double brand from root `%s | One&Only` template.
 * Classification: /portal/svg-catalog → protected, indexable false.
 */
export const metadata: Metadata = buildPageMetadata(SITE_URL, {
  title: "SVG catalog",
  description:
    "Protected SVG catalog browser for planner blocks. Not indexed.",
  path: "/portal/svg-catalog",
  indexable: false,
  alternates: false,
});

export default function SvgCatalogLayout({ children }: { children: ReactNode }) {
  return children;
}
