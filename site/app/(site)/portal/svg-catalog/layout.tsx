import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Phase 05 public catalog subtree — overrides parent /portal layout noindex.
 * GS: BP-05 public preview; I-D live routes table.
 */
export const metadata: Metadata = {
  title: "SVG catalog | One&Only",
  robots: { index: true, follow: true },
};

export default function SvgCatalogLayout({ children }: { children: ReactNode }) {
  return children;
}
