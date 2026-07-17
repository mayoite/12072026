import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { DEFAULT_HERO_FALLBACK } from "@/features/site/data/homepage";
import { TERMS_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata = TERMS_PAGE_METADATA;

type TermsSection = { heading: string; body: string };

export default async function TermsPage() {
  const t = await getTranslations("legal");
  const sections = t.raw("terms.sections") as TermsSection[];

  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={t("terms.title")}
        subtitle={t("terms.heroSubtitle")}
        showButton={false}
        backgroundImage={DEFAULT_HERO_FALLBACK}
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="scheme-panel-soft scheme-border rounded-2xl border p-7 md:p-9">
              <p className="typ-label text-brand">{t("terms.overviewKicker")}</p>
              <h2 className="home-heading mt-3">{t("terms.overviewTitle")}</h2>
              <p className="page-copy text-body mt-4">{t("terms.overviewDescription")}</p>
              <div className="scheme-border mt-8 border-t pt-6">
                <p className="page-copy-sm text-body">
                  Use this page together with the refund, privacy, and service routes when a client
                  needs clear guidance on commercial handling, support scope, or warranty-backed
                  follow-up.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/refund-and-return-policy" className="btn-primary">
                  View refund policy
                </Link>
                <Link href="/service" className="btn-outline">
                  Service and support
                </Link>
              </div>
            </aside>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <article
                  key={section.heading}
                  className={`${
                    index === 0
                      ? "scheme-panel-dark scheme-border rounded-2xl border"
                      : "scheme-panel scheme-border rounded-2xl border"
                  } p-7 md:p-8`}
                >
                  <h2 className={`typ-card ${index === 0 ? "text-inverse" : "text-strong"}`}>
                    {section.heading}
                  </h2>
                  <p
                    className={`page-copy-sm mt-3 ${
                      index === 0 ? "text-inverse-body" : "text-body"
                    }`}
                  >
                    {section.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
