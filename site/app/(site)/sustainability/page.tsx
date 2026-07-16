import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { EditorialArrowLink } from "@/components/site/EditorialRoute";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { DEFAULT_HERO_FALLBACK } from "@/features/site/data/homepage";
import { SUSTAINABILITY_PAGE_COPY } from "@/features/site/data/routeCopy";
import { SUSTAINABILITY_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata = SUSTAINABILITY_PAGE_METADATA;

export default function SustainabilityPage() {
  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={SUSTAINABILITY_PAGE_COPY.heroTitle}
        subtitle={SUSTAINABILITY_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage={DEFAULT_HERO_FALLBACK}
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
            <div className="max-w-xl">
              <p className="typ-label text-body mb-4">
                {SUSTAINABILITY_PAGE_COPY.introKicker}
              </p>
              <h2 className="home-heading">{SUSTAINABILITY_PAGE_COPY.introTitle}</h2>
              <p className="page-copy mt-5 text-body">
                {SUSTAINABILITY_PAGE_COPY.introDescription}
              </p>
              <ul className="mt-6 space-y-3">
                {SUSTAINABILITY_PAGE_COPY.introPoints.map((point) => (
                  <li key={point} className="page-copy-sm text-body">
                    {point}
                  </li>
                ))}
              </ul>
              <EditorialArrowLink href="/products" className="mt-8">
                Browse durable products
              </EditorialArrowLink>
            </div>
            <div className="relative min-h-[22rem] overflow-hidden rounded-2xl md:min-h-[28rem]">
              <Image
                src="/images/products/imported/halo/image-1.webp"
                alt="Long-life office seating detail"
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="soft" spacing="md" borderY>
        <HomeSectionInner>
          <p className="typ-label text-body mb-4">
            {SUSTAINABILITY_PAGE_COPY.commitmentsKicker}
          </p>
          <h2 className="home-heading mb-10 max-w-3xl">
            {SUSTAINABILITY_PAGE_COPY.commitmentsTitle}
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {SUSTAINABILITY_PAGE_COPY.pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="scheme-panel scheme-border rounded-2xl border p-6"
              >
                <h3 className="typ-h3 text-strong">{pillar.title}</h3>
                <p className="page-copy-sm mt-3 text-body">{pillar.detail}</p>
              </article>
            ))}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
