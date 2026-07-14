import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ClientBadge } from "@/components/ClientBadge";
import { KpiIntegrityMonitor } from "@/components/analytics/KpiIntegrityMonitor";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { PROJECTS_PAGE_CLIENTS, PROJECTS_PAGE_COPY } from "@/features/site/data/routeCopy";
import { getBusinessStats } from "@/features/crm/businessStats";
import { formatKpiAsOf, formatKpiValuePlus } from "@/lib/kpiFormat";
import { PROJECTS_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata = PROJECTS_PAGE_METADATA;

export default async function ProjectsPage() {
  const { stats, source } = await getBusinessStats();
  const clientsValue = formatKpiValuePlus(stats.clientOrganisations);
  const projectsValue = formatKpiValuePlus(stats.projectsDelivered);
  const sectorsValue = formatKpiValuePlus(stats.sectorsServed);
  const asOfLabel = formatKpiAsOf(stats.asOfDate);

  return (
    <HomeMarketingLayout>
      <KpiIntegrityMonitor page="projects" source={source} stats={stats} />
      <Hero
        variant="small"
        title={PROJECTS_PAGE_COPY.heroTitle}
        subtitle={PROJECTS_PAGE_COPY.heroSubtitleTemplate.replace("{clients}", clientsValue)}
        showButton={false}
        backgroundImage={PROJECTS_PAGE_COPY.heroBackgroundImage}
        className="h-[34vh] min-h-[16.5rem] md:h-[37vh] md:min-h-[18.5rem]"
        imageClassName="!scale-100 object-[center_44%]"
        contentClassName="py-10 md:py-12"
        overlayClassName="bg-black/40"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          {/* Home trust-strip language: typ-stat + typ-label, readable 3-up grid */}
          <div className="mb-12 grid grid-cols-1 gap-4 border-b border-theme-soft pb-12 sm:grid-cols-3 sm:gap-6 md:mb-16 md:pb-16">
            {[
              { id: "client-organisations", value: clientsValue, label: "Client Organisations" },
              { id: "projects-delivered", value: projectsValue, label: "Projects Delivered" },
              { id: "sectors-served", value: sectorsValue, label: "Sectors Served" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="home-trust-kpi home-trust-kpi--light text-center"
              >
                <p
                  data-testid={`kpi-${stat.id}-projects`}
                  className="typ-stat text-primary"
                >
                  {stat.value}
                </p>
                <p className="typ-label mt-2 text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <p
            data-testid="kpi-as-of-projects"
            className="typ-caption text-muted -mt-6 mb-12 text-center md:-mt-10 md:mb-16"
          >
            {asOfLabel}
          </p>

          <div className="scheme-panel scheme-border mb-12 rounded-2xl border p-5 sm:p-8 md:p-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="typ-label mb-3 text-body">{PROJECTS_PAGE_COPY.featuredLabel}</p>
                <h2 className="home-heading">{PROJECTS_PAGE_COPY.featuredTitle}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/trusted-by" className="btn-outline">
                  Trusted by
                </Link>
                <Link href="/portfolio" className="btn-primary">
                  View portfolio
                </Link>
              </div>
            </div>
            {/* Max 4 cols — never 6-col crush. Shared client-badge-group. */}
            <div className="client-badge-group">
              {PROJECTS_PAGE_CLIENTS.slice(0, 12).map((client) => (
                <ClientBadge key={client.name} {...client} featured />
              ))}
            </div>
          </div>

          <div className="scheme-border border-t border-theme-soft pt-12">
            <p className="typ-label mb-6 text-body">{PROJECTS_PAGE_COPY.allLabel}</p>
            <div className="client-badge-group client-badge-group--dense">
              {PROJECTS_PAGE_CLIENTS.slice(12).map((client) => (
                <ClientBadge key={client.name} {...client} />
              ))}
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
