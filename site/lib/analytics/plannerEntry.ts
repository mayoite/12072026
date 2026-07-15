import { readSiteAttribution } from "@/lib/analytics/siteAttribution";

export interface PlannerEntryContext {
  readonly sourcePage: string;
  readonly surface: string;
  readonly productSlug?: string;
  readonly categoryId?: string;
  readonly campaign?: string;
}

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

export function buildPlannerEntryHref(
  baseHref: string,
  context: Pick<PlannerEntryContext, "sourcePage" | "productSlug" | "categoryId">,
): string {
  const url = new URL(baseHref, "https://oneonly.in");
  if (context.productSlug) {
    url.searchParams.set("siteProduct", context.productSlug);
  }
  if (context.categoryId) {
    url.searchParams.set("siteCategory", context.categoryId);
  }
  url.searchParams.set("siteSource", context.sourcePage);
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
  return `${url.pathname}${url.search}`;
}