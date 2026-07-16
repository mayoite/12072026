import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ClientBadge } from "@/components/ClientBadge";
import { KpiIntegrityMonitor } from "@/components/analytics/KpiIntegrityMonitor";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { DEFAULT_HERO_FALLBACK } from "@/features/site/data/homepage";
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

  const kpis = [
    { id: "client-organisations", value: clientsValue, label: "Client organisations" },
    { id: "projects-delivered", value: projectsValue, label: "Projects delivered" },
    { id: "sectors-served", value: sectorsValue, label: "Sectors served" },
  ] as const;

  return (
    <HomeMarketingLayout>
      <KpiIntegrityMonitor page="projects" source={source} stats={stats} />
      <Hero
        variant="small"
        title={PROJECTS_PAGE_COPY.heroTitle}
        subtitle={PROJECTS_PAGE_COPY.heroSubtitleTemplate.replace(
          "{clients}",
          clientsValue,
        )}
        showButton={false}
        backgroundImage={DEFAULT_HERO_FALLBACK}
        className="page-hero--compact"
        imageClassName="object-center md:object-[center_44%]"
        contentClassName="py-10 md:py-14"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div
            className="projects-kpi-grid mb-8 border-b border-theme-soft pb-8 md:mb-12 md:pb-12"
            role="group"
            aria-label="Delivery proof metrics"
          >
            {kpis.map((stat) => (
              <div
                key={stat.id}
                className="home-trust-kpi home-trust-kpi--light projects-kpi"
              >
                <p
                  data-testid={`kpi-${stat.id}-projects`}
                  className="typ-stat text-primary projects-kpi__value"
                >
                  {stat.value}
                </p>
                <p className="typ-label mt-1.5 text-muted projects-kpi__label">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <p
            data-testid="kpi-as-of-projects"
            className="typ-caption text-muted -mt-4 mb-8 text-center md:-mt-6 md:mb-12"
          >
            {asOfLabel}
          </p>

          <div className="scheme-panel scheme-border mb-10 rounded-2xl border p-5 sm:p-8 md:mb-12 md:p-10">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="typ-label mb-2 text-body sm:mb-3">
                  {PROJECTS_PAGE_COPY.featuredLabel}
                </p>
                <h2 className="home-heading">{PROJECTS_PAGE_COPY.featuredTitle}</h2>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <Link
                  href="/trusted-by"
                  className="btn-outline inline-flex min-h-11 w-full items-center justify-center sm:w-auto"
                >
                  Trusted by
                </Link>
                <Link
                  href="/portfolio"
                  className="btn-primary inline-flex min-h-11 w-full items-center justify-center sm:w-auto"
                >
                  View portfolio
                </Link>
              </div>
            </div>
            <div className="client-badge-group">
              {PROJECTS_PAGE_CLIENTS.slice(0, 12).map((client) => (
                <ClientBadge key={client.name} {...client} featured />
              ))}
            </div>
          </div>

          <div className="scheme-border border-t border-theme-soft pt-10 md:pt-12">
            <p className="typ-label mb-5 text-body md:mb-6">
              {PROJECTS_PAGE_COPY.allLabel}
            </p>
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
