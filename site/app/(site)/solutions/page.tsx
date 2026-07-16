import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { DEFAULT_HERO_FALLBACK } from "@/features/site/data/homepage";
import { SOLUTIONS_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata = SOLUTIONS_PAGE_METADATA;

const solutions = [
  { title: "Workstations", href: "/solutions/workstations" },
  { title: "Seating", href: "/solutions/seating" },
  { title: "Tables", href: "/solutions/tables" },
  { title: "Storage", href: "/solutions/storages" },
  { title: "Soft seating", href: "/solutions/soft-seating" },
  { title: "Education", href: "/solutions/education" },
] as const;

const process = [
  {
    number: "01",
    title: "Brief",
    description: "We understand your people, space, priorities, and budget.",
  },
  {
    number: "02",
    title: "Plan",
    description: "We turn the brief into layouts, product selections, and a clear proposal.",
  },
  {
    number: "03",
    title: "Deliver",
    description: "We coordinate production, installation, and handover.",
  },
] as const;

export default async function SolutionsPage() {
  await getTranslations("solutions");

  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={
          <>
            Designed for the way <span className="text-accent-italic">work happens.</span>
          </>
        }
        subtitle="Workspace solutions for workstations, seating, tables, storage, and education environments across Patna, Ranchi, Bihar, and Jharkhand."
        showButton={false}
        backgroundImage={DEFAULT_HERO_FALLBACK}
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <p className="typ-label text-body mb-4">Solution categories</p>
          <h2 className="home-heading mb-8 max-w-3xl">
            Choose the workspace system that matches the brief.
          </h2>
          <nav aria-label="Workspace solution categories">
            <ul className="w-full max-w-3xl">
              {solutions.map((solution) => (
                <li key={solution.href} className="border-b border-[var(--border-soft)]">
                  <Link
                    href={solution.href}
                    className="group flex min-h-14 items-center justify-between gap-6 py-5 text-strong transition-colors hover:text-primary"
                  >
                    <span className="font-[family-name:var(--font-display)] text-[1.75rem] font-light leading-[1.1] tracking-[-0.04em] md:text-[2.25rem]">
                      {solution.title}
                    </span>
                    <span className="text-[var(--color-bronze-500)] transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRight aria-hidden="true" size={24} weight="light" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="soft" spacing="md" borderY>
        <HomeSectionInner>
          <h2 className="home-heading mb-10">How we deliver workspace projects</h2>
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {process.map((step) => (
              <article key={step.number}>
                <div className="flex items-center gap-4 text-primary">
                  <span className="font-[family-name:var(--font-display)] text-4xl font-light">
                    {step.number}
                  </span>
                  <span className="h-px flex-1 bg-[var(--border-soft)]" />
                </div>
                <h3 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-light text-strong">
                  {step.title}
                </h3>
                <p className="page-copy-sm mt-4 text-body">{step.description}</p>
              </article>
            ))}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
