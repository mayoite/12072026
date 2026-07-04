import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { RouteCtaBand } from "@/components/shared/RouteCtaBand";
import { SectionIntro } from "@/components/shared/SectionIntro";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { DEFAULT_HERO_FALLBACK } from "@/lib/site-data/homepage";
import { buildPageMetadata } from "@/lib/site-data/seo";
import {
  PLANNING_PAGE_COPY,
  PLANNING_PAGE_DELIVERABLES,
  PLANNING_PAGE_STEPS,
} from "@/lib/site-data/routeCopy";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = buildPageMetadata(SITE_URL, {
  title: PLANNING_PAGE_COPY.heroTitle,
  description: PLANNING_PAGE_COPY.heroSubtitle,
  path: "/planning",
  image: DEFAULT_HERO_FALLBACK,
});

export default function PlanningPage() {
  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={PLANNING_PAGE_COPY.heroTitle}
        subtitle={PLANNING_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage={DEFAULT_HERO_FALLBACK}
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <SectionIntro
            kicker={PLANNING_PAGE_COPY.workflowKicker}
            title={PLANNING_PAGE_COPY.workflowTitle}
            className="mb-12"
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PLANNING_PAGE_STEPS.map((step) => (
              <article key={step.title} className="scheme-panel scheme-border rounded-2xl border p-6">
                <h3 className="typ-h3 text-strong">{step.title}</h3>
                <p className="page-copy text-body mt-3">{step.detail}</p>
              </article>
            ))}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="soft" spacing="md" borderY>
        <HomeSectionInner>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
            <SectionIntro
              kicker={PLANNING_PAGE_COPY.deliverablesKicker}
              title={PLANNING_PAGE_COPY.deliverablesTitle}
            />

            <div className="scheme-panel scheme-border rounded-2xl border p-6 md:p-8">
              <ul className="space-y-4">
                {PLANNING_PAGE_DELIVERABLES.map((item) => (
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

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="scheme-panel scheme-border rounded-2xl border p-6 md:p-8">
            <p className="typ-label text-body">{PLANNING_PAGE_COPY.bestForKicker}</p>
            <p className="page-copy text-body mt-3">{PLANNING_PAGE_COPY.bestForDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <TrackedLink
                href="/contact"
                label={PLANNING_PAGE_COPY.primaryCta}
                surface="planning-best-for"
                className="btn-primary"
              >
                {PLANNING_PAGE_COPY.primaryCta}
              </TrackedLink>
              <TrackedLink
                href="/products"
                label={PLANNING_PAGE_COPY.secondaryCta}
                surface="planning-best-for"
                className="btn-outline"
              >
                {PLANNING_PAGE_COPY.secondaryCta}
              </TrackedLink>
              <TrackedLink
                href="/planner"
                label="Open Oando Planner"
                surface="planning-best-for"
                className="btn-outline"
              >
                Open Oando Planner
              </TrackedLink>
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="white" spacing="sm">
        <HomeSectionInner>
          <RouteCtaBand
            kicker={PLANNING_PAGE_COPY.deskKicker}
            title={PLANNING_PAGE_COPY.deskTitle}
            description={PLANNING_PAGE_COPY.deskDescription}
            actions={[
              { href: "/downloads", label: PLANNING_PAGE_COPY.tertiaryCta },
              { href: "/contact", label: PLANNING_PAGE_COPY.primaryCta, variant: "primary" },
            ]}
          />
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
