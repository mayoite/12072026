import type { Metadata, Viewport } from "next";
import "./(site)/globals.css";
import "@/app/css/core/locked/site/index.css";
import "@/app/css/core/locked/site/footer.css";
import "@/app/css/core/locked/site/contact.css";
import "@/app/css/core/locked/site/site-marketing.css";
import "@/app/css/core/locked/site/workspace-hub.css";
import "@/app/css/core/locked/site/legal.css";
import "@/app/css/core/locked/site/error.css";
import { NextIntlClientProvider } from "next-intl";
import { getSiteLayoutContext } from "@/lib/layout/siteLayoutContext";
import { ciscoSans, helveticaNeue } from "@/lib/fonts";
import { SITE_URL } from "@/lib/siteUrl";
import { buildGlobalJsonLd, buildSiteMetadata } from "@/lib/analytics/seo";
import { SITE_VIEWPORT } from "@/lib/siteViewport";
import { MaintenanceBanner } from "@/components/site/MaintenanceBanner";
import { SiteAnalytics } from "@/components/site/SiteAnalytics";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { CsrfBootstrap } from "@/components/security/CsrfBootstrap";
import { sanitizeJsonForScript } from "@/lib/security/sanitize";

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
  const { messages, locale, lang } = await getSiteLayoutContext();
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
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-9999 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-panel focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-strong focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to main content
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MaintenanceBanner />
          {children}
          {/* Vercel owns these endpoints. Local production smoke tests do not. */}
          {process.env.VERCEL === "1" ? <SiteAnalytics /> : null}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
