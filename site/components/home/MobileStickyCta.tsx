"use client";

import { ArrowRight } from "@phosphor-icons/react";

import { TrackedLink } from "@/components/ui/TrackedLink";
import { HOMEPAGE_HERO_CONTENT } from "@/features/site/data/homepage";

/**
 * Site Tier B — phone sticky primary CTA so the guest planner path stays one tap away.
 * Label/href match HOMEPAGE_HERO_CONTENT.primaryCta (no hardcode drift).
 * Hidden from md+ (desktop has the hero CTAs).
 */
export function MobileStickyCta() {
  const { label, href } = HOMEPAGE_HERO_CONTENT.primaryCta;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-theme-soft bg-panel/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-theme-float backdrop-blur-md md:hidden"
      data-testid="site-mobile-sticky-cta"
      role="region"
      aria-label="Start planning"
    >
      <TrackedLink
        href={href}
        surface="home-mobile-sticky"
        label={label}
        className="btn-primary flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-center text-sm font-semibold"
      >
        {label}
        <ArrowRight size={16} weight="bold" aria-hidden />
      </TrackedLink>
    </div>
  );
}
