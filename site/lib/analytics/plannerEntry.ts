import { readSiteAttribution } from "@/lib/analytics/siteAttribution";

export interface PlannerEntryContext {
  readonly sourcePage: string;
  readonly surface: string;
  readonly productSlug?: string;
  readonly categoryId?: string;
  readonly campaign?: string;
}

/** Site stamps these on planner entry URLs; guest id redirect must keep them. */
export const PLANNER_ENTRY_QUERY_KEYS = [
  "siteProduct",
  "siteCategory",
  "siteSource",
  "utm_source",
  "utm_medium",
  "utm_campaign",
] as const;

export type PlannerEntrySearchParams = Record<
  string,
  string | string[] | undefined
>;

export function isPlannerEntryHref(href: string): boolean {
  const normalized = href.trim().toLowerCase();
  if (!normalized.startsWith("/planner")) return false;
  if (normalized.startsWith("/planner/help")) return false;
  if (normalized.startsWith("/planner/features")) return false;
  return true;
}

export function buildPlannerEntryCampaign(context: PlannerEntryContext): string | undefined {
  const parts: string[] = [];
  if (context.productSlug) {
    parts.push(`product:${context.productSlug}`);
  }
  if (context.categoryId) {
    parts.push(`category:${context.categoryId}`);
  }
  if (context.surface) {
    parts.push(`surface:${context.surface}`);
  }
  const attribution = readSiteAttribution();
  if (attribution.campaign) {
    parts.push(`utm:${attribution.campaign}`);
  }
  return parts.length > 0 ? parts.join("|") : context.campaign;
}

export interface BuildPlannerEntryHrefOptions {
  /** Cookie-based utm_* params differ between SSR and client — omit in rendered links. */
  readonly includeAttribution?: boolean;
}

export function buildPlannerEntryHref(
  baseHref: string,
  context: Pick<PlannerEntryContext, "sourcePage" | "productSlug" | "categoryId">,
  options?: BuildPlannerEntryHrefOptions,
): string {
  const url = new URL(baseHref, "https://oneonly.in");
  if (context.productSlug) {
    url.searchParams.set("siteProduct", context.productSlug);
  }
  if (context.categoryId) {
    url.searchParams.set("siteCategory", context.categoryId);
  }
  url.searchParams.set("siteSource", context.sourcePage);
  if (options?.includeAttribution) {
    const attribution = readSiteAttribution();
    if (attribution.source && attribution.source !== "direct") {
      url.searchParams.set("utm_source", attribution.source);
    }
    if (attribution.medium && attribution.medium !== "none") {
      url.searchParams.set("utm_medium", attribution.medium);
    }
    if (attribution.campaign) {
      url.searchParams.set("utm_campaign", attribution.campaign);
    }
  }
  return `${url.pathname}${url.search}`;
}

/**
 * Copy Site continuity params from inbound searchParams.
 * Ignores arrays (ambiguous) and empty strings.
 */
export function pickPlannerEntrySearchParams(
  searchParams: PlannerEntrySearchParams,
): URLSearchParams {
  const out = new URLSearchParams();
  for (const key of PLANNER_ENTRY_QUERY_KEYS) {
    const raw = searchParams[key];
    if (typeof raw === "string" && raw.trim().length > 0) {
      out.set(key, raw);
    }
  }
  return out;
}

/** Bare guest URL → new draft id without dropping Site product/source params. */
export function buildGuestPlannerDraftRedirectHref(
  planId: string,
  searchParams?: PlannerEntrySearchParams,
): string {
  const params = pickPlannerEntrySearchParams(searchParams ?? {});
  params.set("id", planId);
  return `/planner/guest/?${params.toString()}`;
}

/** Member canvas without session → guest entry, keeping Site continuity params. */
export function buildGuestPlannerEntryHref(
  searchParams?: PlannerEntrySearchParams,
): string {
  const params = pickPlannerEntrySearchParams(searchParams ?? {});
  const qs = params.toString();
  return qs.length > 0 ? `/planner/guest/?${qs}` : "/planner/guest/";
}