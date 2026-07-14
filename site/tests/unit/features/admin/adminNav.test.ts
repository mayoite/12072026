import { describe, expect, it } from "vitest";

import {
  CRM_CLIENTS_PATH,
  CRM_PROJECTS_PATH,
  CRM_QUOTES_PATH,
} from "@/features/crm/crmRoutes";
import {
  ADMIN_HUB_CARDS,
  ADMIN_HUB_SECTIONS,
  ADMIN_NAV_GROUPS,
  ADMIN_NAV_ITEMS,
  type AdminNavItem,
} from "@/features/admin/adminNav";

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
      "Catalog Assets",
      "CRM",
      "Ops",
      "Platform",
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

  it("lists planner routes", () => {
    const planner = ADMIN_NAV_GROUPS.find((g) => g.title === "Planner");
    expect(planner?.items.map((i) => i.href)).toEqual([
      "/admin/plans",
      "/admin/features",
      "/admin/analytics",
    ]);
  });

  it("lists catalog asset routes including SVG studio and price books", () => {
    const catalog = ADMIN_NAV_GROUPS.find((g) => g.title === "Catalog Assets");
    expect(catalog?.items.map((i) => i.href)).toEqual([
      "/admin/catalog",
      "/admin/planner-catalog",
      "/admin/workspace-catalog",
      "/admin/svg-editor",
      "/admin/price-books",
    ]);
  });

  it("uses canonical CRM admin paths", () => {
    const crm = ADMIN_NAV_GROUPS.find((g) => g.title === "CRM");
    expect(crm?.items.map((i) => i.href)).toEqual([
      CRM_CLIENTS_PATH,
      CRM_PROJECTS_PATH,
      CRM_QUOTES_PATH,
    ]);
    expect(CRM_CLIENTS_PATH).toBe("/admin/crm/clients");
    expect(CRM_PROJECTS_PATH).toBe("/admin/crm/projects");
    expect(CRM_QUOTES_PATH).toBe("/admin/crm/quotes");
  });

  it("lists ops and platform routes", () => {
    const ops = ADMIN_NAV_GROUPS.find((g) => g.title === "Ops");
    expect(ops?.items.map((i) => i.href)).toEqual(["/admin/customer-queries"]);

    const platform = ADMIN_NAV_GROUPS.find((g) => g.title === "Platform");
    expect(platform?.items.map((i) => i.href)).toEqual([
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

  it("builds hub sections from nav groups (CRM + Ops merged)", () => {
    expect(ADMIN_HUB_SECTIONS.map((s) => s.title)).toEqual([
      "Planner operations",
      "Catalog assets",
      "CRM & ops",
      "Platform",
    ]);

    const planner = ADMIN_NAV_GROUPS.find((g) => g.title === "Planner")?.items ?? [];
    const catalog =
      ADMIN_NAV_GROUPS.find((g) => g.title === "Catalog Assets")?.items ?? [];
    const crm = ADMIN_NAV_GROUPS.find((g) => g.title === "CRM")?.items ?? [];
    const ops = ADMIN_NAV_GROUPS.find((g) => g.title === "Ops")?.items ?? [];
    const platform =
      ADMIN_NAV_GROUPS.find((g) => g.title === "Platform")?.items ?? [];

    expect(ADMIN_HUB_SECTIONS[0]?.items).toEqual(planner);
    expect(ADMIN_HUB_SECTIONS[1]?.items).toEqual(catalog);
    expect(ADMIN_HUB_SECTIONS[2]?.items).toEqual([...crm, ...ops]);
    expect(ADMIN_HUB_SECTIONS[3]?.items).toEqual(platform);
  });

  it("flattens deprecated ADMIN_HUB_CARDS from hub sections", () => {
    const expected = ADMIN_HUB_SECTIONS.flatMap((s) => s.items);
    expect(ADMIN_HUB_CARDS).toEqual(expected);
    // Hub omits Overview/Dashboard; cards are not the full nav item list
    expect(ADMIN_HUB_CARDS.length).toBeLessThan(ADMIN_NAV_ITEMS.length);
    expect(ADMIN_HUB_CARDS.some((c) => c.href === "/admin")).toBe(false);
  });
});
