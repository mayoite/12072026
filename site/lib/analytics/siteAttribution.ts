const SEO_COOKIE_KEYS = {
  source: "oando_seo_source",
  medium: "oando_seo_medium",
  campaign: "oando_seo_campaign",
  landing: "oando_seo_landing",
} as const;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  if (!entry) return null;
  return decodeURIComponent(entry.slice(prefix.length));
}

export interface SiteAttributionSnapshot {
  readonly source: string;
  readonly medium: string;
  readonly campaign: string;
  readonly landing: string;
}

export function readSiteAttribution(): SiteAttributionSnapshot {
  return {
    source: readCookie(SEO_COOKIE_KEYS.source) ?? "direct",
    medium: readCookie(SEO_COOKIE_KEYS.medium) ?? "none",
    campaign: readCookie(SEO_COOKIE_KEYS.campaign) ?? "",
    landing: readCookie(SEO_COOKIE_KEYS.landing) ?? "",
  };
}