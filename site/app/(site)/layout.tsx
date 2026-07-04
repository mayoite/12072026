import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/app/css/core/site/bundles/footer.css";
import "@/app/css/core/site/bundles/contact.css";
import "@/app/css/core/site/bundles/site-marketing.css";
import "@/app/css/core/site/bundles/workspace-hub.css";
import "@/app/css/core/site/bundles/legal.css";
import "@/app/css/core/site/bundles/error.css";
import { NextIntlClientProvider } from "next-intl";
import { getSiteLayoutContext } from "@/lib/layout/siteLayoutContext";
import QueryProvider from "@/app/(site)/providers/QueryProvider";
import { ciscoSans, helveticaNeue } from "@/lib/fonts";
import { SITE_URL } from "@/lib/siteUrl";
import { buildGlobalJsonLd, buildSiteMetadata } from "@/lib/analytics/seo";
import { SITE_VIEWPORT } from "@/lib/siteViewport";
import { RouteChrome } from "@/components/site/RouteChrome";
import { MaintenanceBanner } from "@/components/site/MaintenanceBanner";
import { sanitizeJsonForScript } from "@/lib/security/sanitize";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { CsrfBootstrap } from "@/components/security/CsrfBootstrap";
import { SiteErrorBoundary } from "@/components/site/SiteErrorBoundary";

export const metadata: Metadata = buildSiteMetadata(SITE_URL);

export const viewport: Viewport = {
  ...SITE_VIEWPORT,
  themeColor: "var(--color-ocean-boat-blue-900)",
};

const GLOBAL_JSON_LD = buildGlobalJsonLd(SITE_URL);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { messages, lang } = await getSiteLayoutContext();
  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${ciscoSans.variable} ${helveticaNeue.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: sanitizeJsonForScript(GLOBAL_JSON_LD),
          }}
        />
      </head>
      <body className="scheme-page antialiased selection:bg-primary selection:text-inverse" suppressHydrationWarning>
        <ServiceWorkerRegister />
        <CsrfBootstrap />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-9999 focus:bg-panel focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to main content
        </a>
        <SiteErrorBoundary>
          <NextIntlClientProvider messages={messages}>
            <QueryProvider>
              <MaintenanceBanner />
              <RouteChrome position="top" />
              <main id="main-content">{children}</main>
              <RouteChrome position="bottom" />
            </QueryProvider>
          </NextIntlClientProvider>
        </SiteErrorBoundary>
      </body>
    </html>
  );
}
