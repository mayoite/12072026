"use client";

import { ArrowRight } from "@phosphor-icons/react";

import { TrackedLink } from "@/components/ui/TrackedLink";

/**
 * Site Tier B — phone sticky primary CTA so the guest planner path stays one tap away.
 * Hidden from md+ (desktop has the hero CTAs).
 */
export function MobileStickyCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-theme-soft bg-panel/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-theme-float backdrop-blur-md md:hidden"
      data-testid="site-mobile-sticky-cta"
      role="region"
      aria-label="Start planning"
    >
      <TrackedLink
        href="/choose-product?mode=guest"
        surface="home-mobile-sticky"
        label="Design your layout"
        className="btn-primary flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-center text-sm font-semibold"
      >
        Design your layout
        <ArrowRight size={16} weight="bold" aria-hidden />
      </TrackedLink>
    </div>
  );
}
