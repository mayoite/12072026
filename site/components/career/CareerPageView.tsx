import { Briefcase, GraduationCap, Users } from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { JobCard } from "@/components/career/JobCard";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { RouteCtaBand } from "@/components/shared/RouteCtaBand";
import { CAREER_PAGE_COPY, CAREER_PAGE_JOBS } from "@/lib/site-data/routeCopy";

const CAREER_PILLAR_ICONS = {
  users: Users,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
} as const;

export function CareerPageView() {
  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={CAREER_PAGE_COPY.heroTitle}
        subtitle={CAREER_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/tvs-patna-enhanced.webp"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="mb-12 max-w-4xl space-y-5">
            <p className="typ-label text-body">{CAREER_PAGE_COPY.introKicker}</p>
            <h2 className="home-heading">{CAREER_PAGE_COPY.introTitle}</h2>
            <p className="page-copy text-body">{CAREER_PAGE_COPY.introDescription}</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {CAREER_PAGE_COPY.pillars.map((pillar) => {
              const Icon = CAREER_PILLAR_ICONS[pillar.icon];
              return (
                <article key={pillar.title} className="scheme-panel scheme-border rounded-2xl border p-6">
                  <Icon className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />
                  <h3 className="typ-h3 text-strong">{pillar.title}</h3>
                  <p className="page-copy-sm text-body mt-3">{pillar.detail}</p>
                </article>
              );
            })}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="soft" spacing="md" borderY>
        <HomeSectionInner>
          <div className="mb-8 max-w-3xl">
            <p className="typ-label text-body mb-4">{CAREER_PAGE_COPY.processKicker}</p>
            <h2 className="home-heading">{CAREER_PAGE_COPY.processTitle}</h2>
            <p className="page-copy text-body mt-5">{CAREER_PAGE_COPY.processDescription}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {CAREER_PAGE_COPY.processSteps.map((step, index) => (
              <article
                key={step.title}
                className="scheme-panel-soft scheme-border rounded-2xl border p-6"
              >
                <p className="typ-label text-brand mb-3">Step {index + 1}</p>
                <h3 className="typ-h3 text-strong">{step.title}</h3>
                <p className="page-copy-sm text-body mt-3">{step.detail}</p>
              </article>
            ))}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="home-heading">{CAREER_PAGE_COPY.openingsTitle}</h2>
            <p className="typ-label text-body">
              {CAREER_PAGE_COPY.openingsAvailableTemplate.replace("{count}", String(CAREER_PAGE_JOBS.length))}
            </p>
          </div>

          <div className="space-y-4">
            {CAREER_PAGE_JOBS.map((job) => (
              <JobCard
                key={`${job.title}-${job.department}`}
                title={job.title}
                department={job.department}
                location={job.location}
              />
            ))}
          </div>

          <div className="scheme-panel scheme-border mt-10 rounded-2xl border p-6">
            <h3 className="typ-h3 text-strong">{CAREER_PAGE_COPY.fallbackTitle}</h3>
            <p className="page-copy-sm text-body mt-3 max-w-2xl">
              {CAREER_PAGE_COPY.fallbackDescription}
            </p>
            <a href={`mailto:${CAREER_PAGE_COPY.careersEmail}`} className="link-arrow mt-5">
              {CAREER_PAGE_COPY.careersEmail}
            </a>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="white" spacing="sm">
        <HomeSectionInner>
          <RouteCtaBand
            title={CAREER_PAGE_COPY.supportTitle}
            description={CAREER_PAGE_COPY.supportDescription}
            actions={[
              { href: "/contact", label: CAREER_PAGE_COPY.supportPrimaryCta, variant: "primary" },
              { href: "/planning", label: CAREER_PAGE_COPY.supportSecondaryCta, variant: "outline-light" },
            ]}
          />
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
