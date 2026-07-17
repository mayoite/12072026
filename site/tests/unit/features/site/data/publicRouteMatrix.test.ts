/**
 * S2 public route matrix (unit): hard redirects, hard 404 classification,
 * no soft-404 commercial indexables, no public Admin nav.
 */
// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  SITE_ROUTE_CLASSIFICATION,
  getRouteClassification,
} from "@/features/site/data/routeClassification";
import {
  SITE_CTA_LINKS,
  SITE_FOOTER_NAV,
  SITE_HEADER_MORE_LINKS,
  SITE_HEADER_PRIMARY_LINKS,
  SITE_NAV_FEATURED_CARDS,
  SITE_NAV_LINKS,
  SITE_NAV_SEARCH_FALLBACK_LINKS,
} from "@/features/site/data/navigation";

const siteRoot = path.resolve(__dirname, "../../../../..");
const nextConfigPath = path.join(siteRoot, "config/build/next.config.js");

/** Marketing redirect sources that must be permanent: true in next.config (→ 308). */
const HARD_PUBLIC_REDIRECT_SOURCES = [
  "/catalog",
  "/brochure",
  "/download-brochure",
  "/news",
  "/gallery",
  "/social",
  "/imprint",
  "/support-ivr",
  "/tracking",
  "/products/category/:slug",
] as const;

describe("public route matrix — next.config hard redirects", () => {
  it("declares permanent:true for every public marketing redirect source", () => {
    const raw = fs.readFileSync(nextConfigPath, "utf8");
    for (const source of HARD_PUBLIC_REDIRECT_SOURCES) {
      // Each source block should set permanent: true nearby.
      const sourceIdx = raw.indexOf(`source: "${source}"`);
      expect(sourceIdx, `missing source ${source}`).toBeGreaterThanOrEqual(0);
      const window = raw.slice(sourceIdx, sourceIdx + 220);
      expect(window, `${source} must be permanent`).toMatch(/permanent:\s*true/);
    }
  });
});

describe("public route matrix — classification honesty", () => {
  it("classifies known public hard-redirect paths as redirect + not indexable", () => {
    const samples: Array<{ path: string; classification: string }> = [
      { path: "/catalog", classification: "redirect" },
      { path: "/brochure", classification: "redirect" },
      { path: "/download-brochure", classification: "redirect" },
      { path: "/news", classification: "redirect" },
      { path: "/gallery", classification: "redirect" },
      { path: "/social", classification: "redirect" },
      { path: "/imprint", classification: "redirect" },
      { path: "/support-ivr", classification: "redirect" },
      { path: "/tracking", classification: "redirect" },
      { path: "/products/category/seating", classification: "redirect" },
      { path: "/repo-store", classification: "redirect" },
      { path: "/login", classification: "redirect" },
    ];
    for (const sample of samples) {
      const meta = getRouteClassification(sample.path);
      expect(meta?.classification, sample.path).toBe(sample.classification);
      expect(meta?.indexable, sample.path).toBe(false);
    }
  });

  it("keeps commercial indexable routes public (not redirect shells)", () => {
    for (const route of [
      "/",
      "/products",
      "/solutions",
      "/about",
      "/contact",
      "/planning",
      "/portfolio",
      "/projects",
      "/downloads",
    ]) {
      const meta = getRouteClassification(route);
      expect(meta?.classification, route).toBe("public");
      expect(meta?.indexable, route).toBe(true);
    }
  });

  it("never classifies /admin as a public indexable marketing route", () => {
    const admin = SITE_ROUTE_CLASSIFICATION.find((m) => m.route.startsWith("/admin"));
    // Admin is outside (site) classification table; if present it must not be public+indexable.
    if (admin) {
      expect(admin.classification === "public" && admin.indexable).toBe(false);
    }
    expect(getRouteClassification("/admin")).toBeUndefined();
  });
});

describe("public route matrix — nav data", () => {
  it("exposes no /admin href or Admin label in public nav surfaces", () => {
    const hrefs = [
      ...SITE_NAV_LINKS.map((l) => l.href),
      ...SITE_HEADER_PRIMARY_LINKS.map((l) => l.href),
      ...SITE_HEADER_MORE_LINKS.map((l) => l.href),
      ...SITE_CTA_LINKS.map((l) => l.href),
      ...SITE_NAV_FEATURED_CARDS.map((c) => c.href),
      ...SITE_NAV_SEARCH_FALLBACK_LINKS.map((l) => l.href),
      ...SITE_FOOTER_NAV.flatMap((s) => s.links.map((l) => l.href)),
    ];
    const labels = [
      ...SITE_NAV_LINKS.map((l) => l.label),
      ...SITE_CTA_LINKS.map((l) => l.label),
      ...SITE_NAV_SEARCH_FALLBACK_LINKS.map((l) => l.label),
      ...SITE_FOOTER_NAV.flatMap((s) => s.links.map((l) => l.label)),
    ];
    expect(hrefs.some((h) => /^\/admin(\/|$)/i.test(h))).toBe(false);
    expect(labels.some((l) => l.trim().toLowerCase() === "admin")).toBe(false);
  });
});
