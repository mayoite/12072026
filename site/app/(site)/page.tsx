import type { Metadata } from "next";
import "@/app/css/core/locked/site/homepage-sections.css";
import { HomepageHero } from "@/components/home/HomepageHero";
import { HomeMarketingLayout } from "@/components/home/layout";
import { Collections } from "@/components/home/Collections";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ShowcaseCarousel } from "@/components/home/ShowcaseCarousel";
import { InteractiveTools } from "@/components/home/InteractiveTools";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { MobileStickyCta } from "@/components/home/MobileStickyCta";

import { SITE_BRAND } from "@/lib/analytics/seo";
import { buildPageJsonLd, buildPageMetadata } from "@/lib/analytics/seo";
import { buildLocalBusinessJsonLd } from "@/features/site/data/seo";
import { HOMEPAGE_SHOWCASE_CONTENT } from "@/features/site/data/homepage";
import { getBusinessStats } from "@/features/crm/businessStats";
import { SITE_URL } from "@/lib/siteUrl";
import { sanitizeJsonForScript } from "@/lib/security/sanitize";

export const metadata: Metadata = buildPageMetadata(SITE_URL, {
  title: SITE_BRAND.defaultTitle,
  description: SITE_BRAND.description,
  path: "/",
});

export default async function Home() {
  const { stats } = await getBusinessStats();
  const homeJsonLd = buildPageJsonLd(SITE_URL, {
    path: "/",
    title: SITE_BRAND.defaultTitle,
    description: SITE_BRAND.description,
    pageType: "WebPage",
  });
  const localBusinessJsonLd = buildLocalBusinessJsonLd(SITE_URL);

  return (
    <HomeMarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(homeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(localBusinessJsonLd) }}
      />

      <HomepageHero />
      <Collections />
      <TrustStrip stats={stats} />
      <InteractiveTools />
      <WhyChooseUs />
      <ShowcaseCarousel
        sectionLabel={HOMEPAGE_SHOWCASE_CONTENT.sectionLabel}
        sectionAriaLabel={`${HOMEPAGE_SHOWCASE_CONTENT.sectionTitleLead} ${HOMEPAGE_SHOWCASE_CONTENT.sectionTitleAccent}`}
        sectionTitle={
          <>
            {HOMEPAGE_SHOWCASE_CONTENT.sectionTitleLead}{" "}
            <span className="text-accent-italic">
              {HOMEPAGE_SHOWCASE_CONTENT.sectionTitleAccent}
            </span>
          </>
        }
        items={[...HOMEPAGE_SHOWCASE_CONTENT.items]}
        browseLink={HOMEPAGE_SHOWCASE_CONTENT.browseCta.href}
        browseLabel={HOMEPAGE_SHOWCASE_CONTENT.browseCta.label}
      />
      <ContactTeaser />
      {/* Phone: keep guest planner one tap away (Site Tier B). */}
      <div className="h-20 md:hidden" aria-hidden />
      <MobileStickyCta />
    </HomeMarketingLayout>
  );
}
