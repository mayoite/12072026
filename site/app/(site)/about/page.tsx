import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { EditorialArrowLink } from "@/components/site/EditorialRoute";
import { HomeMarketingLayout } from "@/components/home/layout";
import { TRUSTED_BY_STATS } from "@/features/site/data/proof";
import { ABOUT_PAGE_METADATA } from "@/features/site/data/routeMetadata";

/** Canonical SEO for /about (title length, description, OG, Twitter, canonical, hreflang). */
export const metadata: Metadata = ABOUT_PAGE_METADATA;

type AboutPillar = { title: string; detail: string };

export default async function AboutPage() {
  const t = await getTranslations("about");
  const paragraphs = t.raw("paragraphs") as string[];
  const pillars = t.raw("modelPillars") as AboutPillar[];

  return (
    <HomeMarketingLayout>
    <div className="bg-page">
      <section className="pt-16">
        <div className="grid min-h-[42rem] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex items-center px-7 py-14 md:px-14 lg:px-16">
            <div className="max-w-xl">
              <p className="typ-label mb-5 text-bronze-500">
                {t("sectionKicker")}
              </p>
              <h1 className="home-heading !text-[clamp(2.4rem,5vw,4.4rem)]">
                {t("sectionTitle")}
              </h1>
              <div className="mt-8 space-y-4">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="page-copy text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
              <EditorialArrowLink href="/contact" className="mt-8">
                {t("confidenceCta")}
              </EditorialArrowLink>
            </div>
          </div>

          <div className="grid min-h-[34rem] grid-cols-6 grid-rows-6 gap-3 p-3 md:min-h-[46rem]">
            <div className="relative col-span-6 row-span-4 overflow-hidden md:col-span-4 md:row-span-6">
              <Image
                src="/images/hero/usha-hero.webp"
                alt="One&Only workplace project"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 54vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-3 row-span-2 overflow-hidden md:col-span-2 md:row-span-3">
              <Image
                src="/images/hero/titan-patna-hq.webp"
                alt="Completed workplace installation"
                fill
                sizes="(max-width: 768px) 50vw, 18vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-3 row-span-2 overflow-hidden md:col-span-2 md:row-span-3">
              <Image
                src="/images/hero/dmrc-hero.webp"
                alt="Institutional workspace delivery"
                fill
                sizes="(max-width: 768px) 50vw, 18vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border-soft)] bg-[var(--surface-inverse)] py-10 text-[var(--text-inverse)]">
        <div className="home-shell-xl grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUSTED_BY_STATS.map((item) => (
            <div key={item.label} className="border-l border-white/20 pl-5">
              <p className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-bronze-300)]">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-[var(--text-inverse-body)]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 md:py-24">
        <div className="home-shell-xl grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="typ-label mb-4 text-[var(--color-bronze-500)]">
              {t("modelKicker")}
            </p>
            <h2 className="home-heading">{t("modelTitle")}</h2>
            <p className="page-copy mt-6 text-body">{t("modelDescription")}</p>
          </div>

          <div className="grid gap-7">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className="grid gap-4 border-t border-[var(--border-soft)] pt-6 md:grid-cols-[4rem_1fr]"
              >
                <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-bronze-500)]">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="typ-h3 text-strong">{pillar.title}</h3>
                  <p className="page-copy-sm mt-3 text-body">{pillar.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
    </HomeMarketingLayout>
  );
}
