import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  PUBLIC_INDEXABLE_ROUTES,
  SITE_ROUTE_CLASSIFICATION,
  getRouteClassification,
} from "@/features/site/data/routeClassification";

const SITE_ROOT = path.resolve(__dirname, "..", "..", "..", "..", "..");
const SITE_PAGES_DIR = path.join(SITE_ROOT, "app", "(site)");

function globPageRoutes(dir: string, base = ""): string[] {
  const routes: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      routes.push(...globPageRoutes(full, path.join(base, entry)));
    } else if (entry === "page.tsx") {
      routes.push(`/${base.replace(/\\/g, "/")}`);
    }
  }
  return routes;
}

const GLOBBED_ROUTES = globPageRoutes(SITE_PAGES_DIR).sort();

const CLASSIFIED_ROUTES = SITE_ROUTE_CLASSIFICATION.map((meta) => meta.route);

describe("SITE_ROUTE_CLASSIFICATION coverage", () => {
  it("classifies every globbed (site) page.tsx route", () => {
    expect(GLOBBED_ROUTES.length).toBeGreaterThan(0);
    for (const route of GLOBBED_ROUTES) {
      expect(CLASSIFIED_ROUTES, `missing classification for ${route}`).toContain(route);
    }
  });

  it("has no duplicate route keys", () => {
    const unique = new Set(CLASSIFIED_ROUTES);
    expect(unique.size).toBe(CLASSIFIED_ROUTES.length);
  });
});

describe("getRouteClassification resolution", () => {
  it("resolves static and dynamic primary routes", () => {
    expect(getRouteClassification("/")?.route).toBe("/");
    expect(getRouteClassification("/products")?.route).toBe("/products");
    expect(getRouteClassification("/products/workstations")?.route).toBe(
      "/products/[category]",
    );
    expect(getRouteClassification("/products/workstations/deskpro-x")?.route).toBe(
      "/products/[category]/[product]",
    );
    expect(getRouteClassification("/solutions/healthcare")?.route).toBe(
      "/solutions/[category]",
    );
  });

  it("classifies resolved routes honestly", () => {
    expect(getRouteClassification("/catalog")?.classification).toBe("redirect");
    expect(getRouteClassification("/login")?.classification).toBe("protected");
    expect(getRouteClassification("/portal/guest/view/abc")?.classification).toBe(
      "protected",
    );
    expect(getRouteClassification("/tracking")?.classification).toBe("public");
    expect(getRouteClassification("/tracking")?.indexable).toBe(false);
  });

  it("ignores query strings when matching", () => {
    expect(getRouteClassification("/login?next=/dashboard")?.route).toBe("/login");
  });
});

describe("PUBLIC_INDEXABLE_ROUTES derivation", () => {
  it("includes marketing routes and excludes noindex utilities", () => {
    expect(PUBLIC_INDEXABLE_ROUTES).toContain("/products");
    expect(PUBLIC_INDEXABLE_ROUTES).toContain("/about");
    expect(PUBLIC_INDEXABLE_ROUTES).not.toContain("/tracking");
    expect(PUBLIC_INDEXABLE_ROUTES).not.toContain("/quote-cart");
    expect(PUBLIC_INDEXABLE_ROUTES).not.toContain("/portal");
  });
});
