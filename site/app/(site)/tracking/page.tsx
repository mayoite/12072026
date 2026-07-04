import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { RouteCtaBand } from "@/components/shared/RouteCtaBand";
import { SectionIntro } from "@/components/shared/SectionIntro";
import { TRACKING_PAGE_COPY } from "@/lib/site-data/routeCopy";
import { TRACKING_PAGE_METADATA } from "@/lib/site-data/routeMetadata";

export const metadata = TRACKING_PAGE_METADATA;

export default function TrackingPage() {
  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={TRACKING_PAGE_COPY.heroTitle}
        subtitle={TRACKING_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/titan-hero.webp"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <SectionIntro
              kicker={TRACKING_PAGE_COPY.introKicker}
              title={TRACKING_PAGE_COPY.introTitle}
              description={TRACKING_PAGE_COPY.introDescription}
              maxWidthClassName="max-w-2xl"
            />

            <div className="scheme-panel scheme-border rounded-2xl border p-6 md:p-8">
              <h3 className="typ-h3 text-strong">{TRACKING_PAGE_COPY.referenceTitle}</h3>
              <ul className="mt-5 space-y-4">
                {TRACKING_PAGE_COPY.referenceItems.map((item) => (
                  <li
                    key={item}
                    className="page-copy-sm text-body shell-list-divider pb-4 last:border-b-0 last:pb-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="soft" spacing="md" borderY>
        <HomeSectionInner>
          <SectionIntro title={TRACKING_PAGE_COPY.lanesTitle} className="mb-8" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {TRACKING_PAGE_COPY.lanes.map((lane) => (
              <article key={lane.title} className="scheme-panel scheme-border rounded-2xl border p-6">
                <h3 className="typ-h3 text-strong">{lane.title}</h3>
                <p className="page-copy-sm text-body mt-3">{lane.detail}</p>
              </article>
            ))}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <RouteCtaBand
            title={TRACKING_PAGE_COPY.supportTitle}
            description={TRACKING_PAGE_COPY.supportDescription}
            actions={[
              { href: "/service", label: TRACKING_PAGE_COPY.primaryCta, variant: "primary" },
              { href: "/contact", label: TRACKING_PAGE_COPY.secondaryCta },
              { href: "/downloads", label: TRACKING_PAGE_COPY.tertiaryCta },
            ]}
          />
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
