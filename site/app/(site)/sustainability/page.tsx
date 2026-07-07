import Image from "next/image";
import {
  EditorialArrowLink,
} from "@/components/site/EditorialRoute";
import { HomeMarketingLayout } from "@/components/home/layout";
import { SUSTAINABILITY_PAGE_COPY } from "@/lib/site-data/routeCopy";
import { SUSTAINABILITY_PAGE_METADATA } from "@/lib/site-data/routeMetadata";

export const metadata = SUSTAINABILITY_PAGE_METADATA;

export default function SustainabilityPage() {
  return (
    <HomeMarketingLayout>
    <div className="bg-[var(--surface-page)]">
      <section className="grid pt-16 lg:min-h-[42rem] lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex items-center px-7 py-14 md:px-14 lg:px-16">
          <div className="max-w-xl">
            <h1 className="home-heading !text-[clamp(2.25rem,4vw,3.25rem)]">
              Designed to <span className="text-accent-italic">last.</span>
            </h1>
            <h2 className="mt-10 font-[family-name:var(--font-display)] text-2xl font-light text-strong">
              {SUSTAINABILITY_PAGE_COPY.introTitle}
            </h2>
            <p className="page-copy mt-5 text-body">
              {SUSTAINABILITY_PAGE_COPY.introDescription}
            </p>
          </div>
        </div>
        <div className="relative min-h-[28rem] lg:min-h-full">
          <Image
            src="/images/products/imported/halo/image-1.webp"
            alt="Long-life office seating detail"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-y border-[var(--border-soft)] py-14 md:py-18">
        <div className="home-shell-xl grid gap-8 md:grid-cols-3">
          {SUSTAINABILITY_PAGE_COPY.pillars.map((pillar, index) => (
            <article key={pillar.title} className="border-l border-[var(--border-soft)] pl-6">
              <span className="text-[var(--color-bronze-500)]">0{index + 1}</span>
              <h3 className="typ-h3 mt-7 text-strong">{pillar.title}</h3>
              <p className="page-copy-sm mt-3 text-body">{pillar.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-dark-midnight-blue-700)] py-14 text-[var(--text-inverse)] md:py-20">
        <div className="home-shell-xl grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <h2 className="home-heading text-inverse">{SUSTAINABILITY_PAGE_COPY.ecoScoreTitle}</h2>
          <div>
            <p className="page-copy text-[var(--text-inverse-body)]">
              {SUSTAINABILITY_PAGE_COPY.ecoScoreDescription}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {SUSTAINABILITY_PAGE_COPY.ecoScoreItems.map((item) => (
                <div key={item.index} className="border-t border-[var(--border-inverse)] pt-5">
                  <span className="text-[var(--color-bronze-300)]">0{item.index}</span>
                  <h3 className="mt-3 text-lg font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-inverse-body)]">{item.detail}</p>
                </div>
              ))}
            </div>
            <EditorialArrowLink href="/products" className="mt-9 text-[var(--text-inverse)]">
              Explore products
            </EditorialArrowLink>
          </div>
        </div>
      </section>
    </div>
    </HomeMarketingLayout>
  );
}
