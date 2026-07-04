import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { NEWS_PAGE_METADATA } from "@/lib/site-data/routeMetadata";

export const metadata = NEWS_PAGE_METADATA;

type NewsCard = { category: string; title: string; summary: string };

export default async function NewsPage() {
  const t = await getTranslations("news");
  const cards = t.raw("cards") as NewsCard[];

  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        showButton={false}
        backgroundImage="/images/hero/dmrc-hero.webp"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="typ-label text-body mb-4">{t("introKicker")}</p>
              <h2 className="home-heading max-w-3xl">{t("introTitle")}</h2>
              <p className="page-copy text-body mt-5 max-w-2xl">{t("introDescription")}</p>
            </div>

            <div className="scheme-panel scheme-border rounded-2xl border p-6 md:p-8">
              <p className="typ-label text-body mb-4">Route intent</p>
              <p className="page-copy-sm text-body">
                This page stays useful only if it remains grounded in real project themes, live support routes,
                and current product/planning direction rather than synthetic newsroom content.
              </p>
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="soft" spacing="md" borderY>
        <HomeSectionInner>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {cards.map((item) => (
              <article key={item.title} className="scheme-panel scheme-border rounded-2xl border p-6">
                <p className="typ-label text-brand mb-3">{item.category}</p>
                <h3 className="typ-h3 text-strong">{item.title}</h3>
                <p className="page-copy-sm text-body mt-3">{item.summary}</p>
              </article>
            ))}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="scheme-panel-dark scheme-border grid gap-6 rounded-2xl border lg:grid-cols-[1.1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <h2 className="home-heading text-inverse">{t("ctaTitle")}</h2>
              <p className="page-copy text-inverse-body mt-4">{t("ctaDescription")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/downloads" className="btn-primary">
                {t("primaryCta")}
              </Link>
              <Link href="/contact" className="btn-outline-light">
                {t("secondaryCta")}
              </Link>
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
