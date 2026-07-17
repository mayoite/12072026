import { describe, expect, it } from "vitest";

import {
  CRM_CLIENTS_PATH,
  CRM_PROJECTS_PATH,
  CRM_QUOTES_PATH,
} from "@/features/crm/crmRoutes";
import {
  ADMIN_HUB_CARDS,
  ADMIN_HUB_KPIS,
  ADMIN_HUB_SECTIONS,
  ADMIN_NAV_GROUPS,
  ADMIN_NAV_ITEMS,
  resolveAdminNavItem,
  type AdminNavItem,
} from "@/features/admin/ui/adminNav";

function assertNavItemShape(item: AdminNavItem): void {
  expect(item.href.length).toBeGreaterThan(0);
  expect(item.label.length).toBeGreaterThan(0);
  expect(item.description.length).toBeGreaterThan(0);
  expect(typeof item.icon).toBe("object");
}

describe("adminNav", () => {
  it("defines the expected top-level group titles in order", () => {
    expect(ADMIN_NAV_GROUPS.map((g) => g.title)).toEqual([
      "Overview",
      "Planner",
      "Catalog",
      "CRM",
      "System",
    ]);
  });

  it("places Dashboard as the sole Overview item", () => {
    const overview = ADMIN_NAV_GROUPS.find((g) => g.title === "Overview");
    expect(overview?.items).toHaveLength(1);
    expect(overview?.items[0]).toMatchObject({
      href: "/admin",
      label: "Dashboard",
    });
  });

  it("lists planner routes including analytics", () => {
    const planner = ADMIN_NAV_GROUPS.find((g) => g.title === "Planner");
    expect(planner?.items.map((i) => i.href)).toEqual([
      "/admin/plans",
      "/admin/features",
      "/admin/analytics",
    ]);
  });

  it("lists catalog routes including SVG studio and price books", () => {
    const catalog = ADMIN_NAV_GROUPS.find((g) => g.title === "Catalog");
    expect(catalog?.items.map((i) => i.href)).toEqual([
      "/admin/catalog",
      "/admin/planner-catalog",
      "/admin/workspace-catalog",
      "/admin/svg-editor",
      "/admin/price-books",
    ]);
  });

  it("uses canonical CRM admin paths, hub, and customer queries", () => {
    const crm = ADMIN_NAV_GROUPS.find((g) => g.title === "CRM");
    expect(crm?.items.map((i) => i.href)).toEqual([
      "/admin/crm",
      CRM_CLIENTS_PATH,
      CRM_PROJECTS_PATH,
      CRM_QUOTES_PATH,
      "/admin/customer-queries",
    ]);
    expect(CRM_CLIENTS_PATH).toBe("/admin/crm/clients");
    expect(CRM_PROJECTS_PATH).toBe("/admin/crm/projects");
    expect(CRM_QUOTES_PATH).toBe("/admin/crm/quotes");
  });

  it("AF-08: CRM nav labels mark browser demo; queries stay server-backed", () => {
    const crm = ADMIN_NAV_GROUPS.find((g) => g.title === "CRM");
    expect(crm).toBeDefined();
    const byHref = new Map(crm!.items.map((i) => [i.href, i]));
    expect(byHref.get("/admin/crm")?.description).toMatch(/Browser demo/i);
    expect(byHref.get(CRM_CLIENTS_PATH)?.description).toMatch(/Browser demo/i);
    expect(byHref.get(CRM_PROJECTS_PATH)?.description).toMatch(/Browser demo/i);
    expect(byHref.get(CRM_QUOTES_PATH)?.description).toMatch(/Browser demo/i);
    expect(byHref.get("/admin/customer-queries")?.description).toMatch(
      /Server-backed/i,
    );
    expect(byHref.get("/admin/customer-queries")?.description).not.toMatch(
      /Browser demo/i,
    );

    const quotesKpi = ADMIN_HUB_KPIS.find((k) => k.label === "Quotes");
    expect(quotesKpi?.hint).toMatch(/Browser demo/i);
    const svgKpi = ADMIN_HUB_KPIS.find((k) => k.label === "SVG symbols");
    expect(svgKpi?.hint).not.toMatch(/pipeline/i);
    expect(svgKpi?.hint).toMatch(/disk/i);

    const catalog = ADMIN_NAV_GROUPS.find((g) => g.title === "Catalog");
    const svgNav = catalog?.items.find((i) => i.href === "/admin/svg-editor");
    expect(svgNav?.description).toMatch(/disk/i);
    expect(svgNav?.description).toMatch(/live authority/i);
  });

  it("lists system routes", () => {
    const system = ADMIN_NAV_GROUPS.find((g) => g.title === "System");
    expect(system?.items.map((i) => i.href)).toEqual([
      "/admin/settings",
      "/admin/themes",
      "/admin/inventory",
    ]);
  });

  it("requires every nav item to have href, label, description, and icon", () => {
    for (const group of ADMIN_NAV_GROUPS) {
      expect(group.items.length).toBeGreaterThan(0);
      for (const item of group.items) {
        assertNavItemShape(item);
      }
    }
  });

  it("flattens ADMIN_NAV_ITEMS in group order without duplicates by href", () => {
    const expected = ADMIN_NAV_GROUPS.flatMap((g) => g.items);
    expect(ADMIN_NAV_ITEMS).toEqual(expected);
    const hrefs = ADMIN_NAV_ITEMS.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("builds hub sections from nav groups", () => {
    expect(ADMIN_HUB_SECTIONS.map((s) => s.title)).toEqual([
      "Planner operations",
      "Catalog",
      "CRM & ops",
      "System",
    ]);

    const planner = ADMIN_NAV_GROUPS.find((g) => g.title === "Planner")?.items ?? [];
    const catalog = ADMIN_NAV_GROUPS.find((g) => g.title === "Catalog")?.items ?? [];
    const crm = ADMIN_NAV_GROUPS.find((g) => g.title === "CRM")?.items ?? [];
    const system = ADMIN_NAV_GROUPS.find((g) => g.title === "System")?.items ?? [];

    expect(ADMIN_HUB_SECTIONS[0]?.items).toEqual(planner);
    expect(ADMIN_HUB_SECTIONS[1]?.items).toEqual(catalog);
    expect(ADMIN_HUB_SECTIONS[2]?.items).toEqual(crm);
    expect(ADMIN_HUB_SECTIONS[3]?.items).toEqual(system);
  });

  it("exposes hub KPI shortcuts with distinct hrefs", () => {
    expect(ADMIN_HUB_KPIS.length).toBe(4);
    const hrefs = ADMIN_HUB_KPIS.map((k) => k.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const kpi of ADMIN_HUB_KPIS) {
      expect(kpi.label.length).toBeGreaterThan(0);
      expect(kpi.hint.length).toBeGreaterThan(0);
    }
  });

  it("resolves the deepest matching nav item for a pathname", () => {
    expect(resolveAdminNavItem("/admin")?.label).toBe("Dashboard");
    expect(resolveAdminNavItem("/admin/")?.label).toBe("Dashboard");
    expect(resolveAdminNavItem("/admin/crm/projects")?.label).toBe("Projects");
    expect(resolveAdminNavItem("/admin/crm/projects/abc")?.label).toBe("Projects");
    expect(resolveAdminNavItem("/admin/svg-editor/foo")?.label).toBe("SVG symbols");
  });

  it("flattens deprecated ADMIN_HUB_CARDS from hub sections", () => {
    const expected = ADMIN_HUB_SECTIONS.flatMap((s) => s.items);
    expect(ADMIN_HUB_CARDS).toEqual(expected);
    expect(ADMIN_HUB_CARDS.length).toBeLessThan(ADMIN_NAV_ITEMS.length);
    expect(ADMIN_HUB_CARDS.some((c) => c.href === "/admin")).toBe(false);
  });
});
