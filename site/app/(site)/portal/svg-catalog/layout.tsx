import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * SITE-SEO-03 — portal SVG catalog is protected; keep noindex with parent portal.
 * Classification: /portal/svg-catalog → protected, indexable false.
 */
export const metadata: Metadata = {
  title: "SVG catalog | One&Only",
  robots: { index: false, follow: false },
};

export default function SvgCatalogLayout({ children }: { children: ReactNode }) {
  return children;
}
