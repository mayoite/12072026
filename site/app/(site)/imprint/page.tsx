import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { IMPRINT_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata = IMPRINT_PAGE_METADATA;

type LegalSection = { heading: string; lines: string[] };

export default async function ImprintPage() {
  const t = await getTranslations("legal");
  const sections = t.raw("imprint.sections") as LegalSection[];

  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={t("imprint.title")}
        subtitle={t("imprint.heroSubtitle")}
        showButton={false}
        backgroundImage="/images/hero/tvs-patna-enhanced.webp"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="scheme-panel-dark scheme-border rounded-2xl border p-7 md:p-9">
              <p className="typ-label text-inverse-muted">{t("imprint.overviewKicker")}</p>
              <h2 className="home-heading mt-3 text-inverse">{t("imprint.overviewTitle")}</h2>
              <p className="page-copy text-inverse-body mt-4">{t("imprint.overviewDescription")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  Contact office
                </Link>
                <Link href="/privacy" className="btn-outline-light">
                  Privacy policy
                </Link>
              </div>
            </aside>

            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((section) => (
                <article
                  key={section.heading}
                  className="scheme-panel scheme-border rounded-2xl border p-7 md:p-8"
                >
                  <h2 className="typ-card text-strong">{section.heading}</h2>
                  <div className="page-copy-sm text-body mt-4 space-y-1">
                    {section.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
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
