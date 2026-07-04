import type { Viewport } from "next";
import "@/app/(site)/globals.css";
import "@/app/css/core/site/bundles/site-surfaces.css";
import "@/app/css/core/planner/bundles/marketing.css";
import "@/app/css/core/site/bundles/site-marketing.css";
import "@/app/css/core/site/bundles/footer.css";
import QueryProvider from "@/app/(site)/providers/QueryProvider";
import { RouteChrome } from "@/components/site/RouteChrome";
import { MaintenanceBanner } from "@/components/site/MaintenanceBanner";
import { ciscoSans, helveticaNeue } from "@/lib/fonts";
import { getSiteLayoutContext } from "@/lib/layout/siteLayoutContext";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { SITE_VIEWPORT } from "@/lib/siteViewport";
import { PlannerBodyTheme } from "@/features/planner/components/PlannerBodyTheme";
import { PlannerErrorBoundary } from "@/features/planner/editor/PlannerErrorBoundary";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { CsrfBootstrap } from "@/components/security/CsrfBootstrap";
import { NextIntlClientProvider } from "next-intl";

export const viewport: Viewport = SITE_VIEWPORT;

export default async function PlannerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { messages, lang } = await getSiteLayoutContext();
  return (
    <html
      lang={lang}
      className={`${ciscoSans.variable} ${helveticaNeue.variable}`}
      suppressHydrationWarning
    >
      <body
        className="scheme-page antialiased selection:bg-primary selection:text-inverse"
        suppressHydrationWarning
      >
        <ServiceWorkerRegister />
        <CsrfBootstrap />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-9999 focus:bg-panel focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:outline-none focus:ring-2 focus:ring-primary"
          suppressHydrationWarning
        >
          Skip to main content
        </a>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ThemeProvider>
              <PlannerBodyTheme />
              <MaintenanceBanner />
              <RouteChrome position="top" />
              <main id="main-content">
                <PlannerErrorBoundary label="Planner">{children}</PlannerErrorBoundary>
              </main>
              <RouteChrome position="bottom" />
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
