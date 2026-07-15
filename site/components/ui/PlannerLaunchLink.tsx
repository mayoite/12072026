"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  buildPlannerEntryHref,
  isPlannerEntryHref,
} from "@/lib/analytics/plannerEntry";
import { handlePlannerEntryNavigation } from "@/lib/analytics/siteEvents";

interface PlannerLaunchLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  surface: string;
  label: string;
  productSlug?: string;
  categoryId?: string;
  prefetch?: boolean;
  "aria-label"?: string;
  "data-testid"?: string;
}

export function PlannerLaunchLink({
  href,
  children,
  className,
  surface,
  label,
  productSlug,
  categoryId,
  prefetch,
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
}: PlannerLaunchLinkProps) {
  const pathname = usePathname() || "/";
  const resolvedHref = isPlannerEntryHref(href)
    ? buildPlannerEntryHref(href, {
        sourcePage: pathname,
        productSlug,
        categoryId,
      })
    : href;

  const onClick = () => {
    if (isPlannerEntryHref(href)) {
      handlePlannerEntryNavigation({
        href: resolvedHref,
        pathname,
        surface,
        label,
        productSlug,
        categoryId,
      });
      return;
    }
  };

  return (
    <Link
      href={resolvedHref}
      className={className}
      prefetch={prefetch}
      onClick={onClick}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {children}
    </Link>
  );
}