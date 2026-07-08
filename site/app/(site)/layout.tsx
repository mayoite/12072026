import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/app/css/core/locked/site/index.css";
import "@/app/css/core/locked/site/footer.css";
import "@/app/css/core/locked/site/contact.css";
import "@/app/css/core/locked/site/site-marketing.css";
import "@/app/css/core/locked/site/workspace-hub.css";
import "@/app/css/core/locked/site/legal.css";
import "@/app/css/core/locked/site/error.css";
import QueryProvider from "@/app/(site)/providers/QueryProvider";
import { SITE_URL } from "@/lib/siteUrl";
import { buildSiteMetadata } from "@/lib/analytics/seo";
import { SITE_VIEWPORT } from "@/lib/siteViewport";
import { RouteChromeSuspense } from "@/components/site/RouteChromeSuspense";
import { SiteErrorBoundary } from "@/components/site/SiteErrorBoundary";

export const metadata: Metadata = buildSiteMetadata(SITE_URL);

export const viewport: Viewport = {
  ...SITE_VIEWPORT,
  themeColor: "var(--color-ocean-boat-blue-900)",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SiteErrorBoundary>
      <QueryProvider>
        <RouteChromeSuspense position="top" />
        <main id="main-content">{children}</main>
        <RouteChromeSuspense position="bottom" />
      </QueryProvider>
    </SiteErrorBoundary>
  );
}
