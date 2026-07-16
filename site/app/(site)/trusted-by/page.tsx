import { ClientBadge } from "@/components/ClientBadge";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { TRUSTED_BY_CLIENTS, TRUSTED_BY_STATS } from "@/features/site/data/proof";
import { TRUSTED_BY_PAGE_COPY } from "@/features/site/data/routeCopy";
import { TRUSTED_BY_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata = TRUSTED_BY_PAGE_METADATA;

export default function TrustedByPage() {
  const sectors = Array.from(new Set(TRUSTED_BY_CLIENTS.map((client) => client.sector)));

  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={TRUSTED_BY_PAGE_COPY.heroTitle}
        subtitle={TRUSTED_BY_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/dmrc-hero.webp"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="min-w-0">
              <p className="typ-label mb-4 text-body">{TRUSTED_BY_PAGE_COPY.overviewKicker}</p>
              <h2 className="home-heading max-w-3xl">
                {TRUSTED_BY_PAGE_COPY.overviewTitle}
              </h2>
              <p className="page-copy mt-5 max-w-2xl text-body">
                {TRUSTED_BY_PAGE_COPY.overviewDescription}
              </p>
            </div>

            <div className="scheme-panel scheme-border rounded-2xl border p-6 md:p-8">
              <p className="typ-label mb-4 text-body">{TRUSTED_BY_PAGE_COPY.statsKicker}</p>
              <div className="grid grid-cols-2 gap-4">
                {TRUSTED_BY_STATS.map((item) => (
                  <div
                    key={item.label}
                    className="home-trust-kpi home-trust-kpi--light min-h-0 py-5"
                  >
                    <p className="typ-stat text-primary">{item.value}</p>
                    <p className="typ-label mt-2 text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="white" spacing="sm">
        <HomeSectionInner>
          <div className="scheme-panel-dark scheme-border grid gap-8 rounded-2xl border p-8 md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="min-w-0">
              <p className="typ-label text-inverse-muted">{TRUSTED_BY_PAGE_COPY.sectorsKicker}</p>
              <h2 className="home-heading mt-4 text-inverse">{TRUSTED_BY_PAGE_COPY.sectorsTitle}</h2>
              <p className="page-copy mt-4 max-w-xl text-inverse-body">
                {TRUSTED_BY_PAGE_COPY.sectorsDescription}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 self-start lg:justify-end">
              {sectors.map((sector) => (
                <span key={sector} className="shell-dark-chip shell-dark-chip--label">
                  {sector}
                </span>
              ))}
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <WhyChooseUs />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="mb-8 max-w-3xl">
            <p className="typ-label mb-4 text-body">{TRUSTED_BY_PAGE_COPY.rosterKicker}</p>
            <h2 className="home-heading">{TRUSTED_BY_PAGE_COPY.rosterTitle}</h2>
          </div>
          <div
            className="client-badge-group client-badge-group--dense"
            data-testid="trusted-by-roster"
          >
            {TRUSTED_BY_CLIENTS.map((client) => (
              <ClientBadge key={client.name} {...client} />
            ))}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
