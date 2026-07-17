/**
 * Re-export path kept for older inventory paths.
 * Authoritative env-host coverage: tests/unit/app/robots.test.ts
 */
import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import { ROBOTS_DISALLOW_PREFIXES } from "@/features/site/data/routeClassification";
import { SITE_URL } from "@/lib/siteUrl";

describe("robots.ts (stable import)", () => {
  it("returns valid robots config aligned with route classification", () => {
    const config = robots();
    expect(config.rules[0].userAgent).toBe("*");
    expect(config.sitemap[0]).toContain("/sitemap.xml");
    expect(config.rules[0].disallow).toEqual([...ROBOTS_DISALLOW_PREFIXES]);
    expect(config.rules[0].disallow).toContain("/portal/");
    expect(config.rules[0].disallow).toContain("/planner/guest/");
  });

  it("uses SITE_URL host (never hardcoded localhost) for sitemap and host", () => {
    const config = robots();
    const host = String(config.host ?? "");
    const sitemap = String(config.sitemap?.[0] ?? "");
    expect(host).toBe(SITE_URL.replace(/\/+$/, ""));
    expect(sitemap).toBe(`${SITE_URL.replace(/\/+$/, "")}/sitemap.xml`);
    expect(host).not.toMatch(/localhost|127\.0\.0\.1/i);
    expect(sitemap).not.toMatch(/localhost|127\.0\.0\.1/i);
  });
});
