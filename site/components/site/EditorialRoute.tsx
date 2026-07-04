import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactNode } from "react";

type EditorialHeroProps = {
  lead: string;
  accent: string;
};

export function EditorialHero({ lead, accent }: EditorialHeroProps) {
  return (
    <section className="border-b border-[var(--border-soft)] bg-[var(--surface-page)] pb-12 pt-[calc(4rem+3rem)] md:pb-16 md:pt-[calc(4rem+4rem)]">
      <div className="home-shell-xl">
        <h1 className="home-heading max-w-4xl !text-[clamp(2.25rem,4vw,3.25rem)]">
          {lead} <span className="text-accent-italic">{accent}</span>
        </h1>
      </div>
    </section>
  );
}

type EditorialArrowLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function EditorialArrowLink({
  href,
  children,
  className = "",
}: EditorialArrowLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-4 font-medium text-strong transition-colors hover:text-[var(--color-bronze-500)] ${className}`}
    >
      <span>{children}</span>
      <ArrowRight
        aria-hidden="true"
        size={19}
        weight="light"
        className="text-[var(--color-bronze-500)] transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}

type EditorialCtaProps = {
  lead: string;
  accent: string;
  href: string;
  label: string;
};

export function EditorialCta({ lead, accent, href, label }: EditorialCtaProps) {
  return (
    <section className="border-t border-[var(--border-soft)] bg-[var(--surface-page)] py-16 text-center md:py-24">
      <div className="home-shell-xl">
        <h2 className="home-heading">
          {lead} <span className="text-accent-italic">{accent}</span>
        </h2>
        <Link
          href={href}
          className="mt-8 inline-flex border border-[var(--color-bronze-400)] bg-[var(--surface-page)] px-8 py-4 font-[family-name:var(--font-display)] text-base font-normal text-[var(--color-bronze-500)] transition-colors hover:bg-[var(--surface-soft)]"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}
