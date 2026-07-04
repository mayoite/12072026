import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { SOLUTIONS_PAGE_METADATA } from "@/lib/site-data/routeMetadata";

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

export default function SolutionsPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--surface-page)]">
      <section className="border-b border-[var(--border-soft)] bg-[var(--surface-page)] pb-12 pt-[calc(4rem+3rem)] md:pb-16 md:pt-[calc(4rem+4rem)]">
        <div className="home-shell-xl">
          <h1 className="home-heading max-w-4xl !text-[clamp(2.25rem,4vw,3.25rem)]">
            Designed for the way <span className="text-accent-italic">work happens.</span>
          </h1>
        </div>
      </section>

      <section className="bg-[var(--surface-page)]">
        <div className="grid items-stretch lg:grid-cols-2">
          <div className="relative h-full min-h-[20rem] self-stretch sm:min-h-[26rem] lg:min-h-[32rem]">
            <Image
              src="/images/hero/titan-hero.webp"
              alt="Completed office workstation project by One&Only"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[center_25%]"
              priority
            />
          </div>

          <nav aria-label="Workspace solution categories" className="flex items-center">
            <ul className="w-full px-6 py-4 md:px-12 lg:px-16">
              {solutions.map((solution) => (
                <li key={solution.href} className="border-b border-[var(--border-soft)]">
                  <Link
                    href={solution.href}
                    className="group flex items-center justify-between gap-6 py-6 text-strong transition-colors hover:text-primary md:py-5 lg:py-4"
                  >
                    <span className="font-[family-name:var(--font-display)] text-[2rem] font-light leading-[1.1] tracking-[-0.04em] md:text-[2.5rem] lg:text-[2.25rem]">
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
        </div>
      </section>

      <section className="bg-[var(--color-dark-midnight-blue-700)] py-12 text-[var(--text-inverse)] md:py-20">
        <div className="home-shell-xl">
          <h2 className="sr-only">How we deliver workspace projects</h2>
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            {process.map((step) => (
              <article key={step.number}>
                <div className="flex items-center gap-4 text-[var(--color-bronze-300)]">
                  <span className="font-[family-name:var(--font-display)] text-4xl font-light">
                    {step.number}
                  </span>
                  <span className="h-px flex-1 bg-[var(--color-bronze-300)]/50" />
                </div>
                <h3 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-light text-inverse md:mt-8">
                  {step.title}
                </h3>
                <p className="page-copy mt-3 max-w-sm text-inverse-body">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface-page)] py-16 text-center md:py-28">
        <div className="home-shell-xl">
          <h2 className="home-heading">
            Let&apos;s plan your <span className="text-accent-italic">workspace.</span>
          </h2>
          <Link
            href="/contact"
            className="mt-8 inline-flex border border-[var(--color-bronze-400)] bg-[var(--surface-page)] px-8 py-4 font-[family-name:var(--font-display)] text-base font-normal text-[var(--color-bronze-500)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--color-bronze-500)]"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
