"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEventHandler, ReactNode } from "react";

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
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
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
  onMouseEnter,
  onClick,
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
}: PlannerLaunchLinkProps) {
  const pathname = usePathname() || "/";
  const entryContext = {
    sourcePage: pathname,
    productSlug,
    categoryId,
  };
  const resolvedHref = isPlannerEntryHref(href)
    ? buildPlannerEntryHref(href, entryContext)
    : href;

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (isPlannerEntryHref(href)) {
      handlePlannerEntryNavigation({
        href: buildPlannerEntryHref(href, entryContext, { includeAttribution: true }),
        pathname,
        surface,
        label,
        productSlug,
        categoryId,
      });
    }
    onClick?.(event);
  };

  return (
    <Link
      href={resolvedHref}
      className={className}
      prefetch={prefetch}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {children}
    </Link>
  );
}