import { describe, it, expect } from "vitest";
import {
  ADMIN_NAV_GROUPS,
  ADMIN_NAV_ITEMS,
  ADMIN_HUB_SECTIONS,
  ADMIN_HUB_CARDS,
} from "@/features/planner/admin/adminNav";

describe("adminNav configuration", () => {
  it("defines the expected nav groups and items", () => {
    expect(ADMIN_NAV_GROUPS).toBeInstanceOf(Array);
    expect(ADMIN_NAV_GROUPS.length).toBeGreaterThan(0);

    const overview = ADMIN_NAV_GROUPS.find((g) => g.title === "Overview");
    expect(overview).toBeDefined();
    expect(overview?.items).toHaveLength(1);
    expect(overview?.items[0].href).toBe("/admin");
  });

  it("flattens ADMIN_NAV_ITEMS correctly", () => {
    expect(ADMIN_NAV_ITEMS).toBeInstanceOf(Array);
    const totalItems = ADMIN_NAV_GROUPS.reduce((acc, group) => acc + group.items.length, 0);
    expect(ADMIN_NAV_ITEMS.length).toBe(totalItems);
  });

  it("populates ADMIN_HUB_SECTIONS correctly", () => {
    expect(ADMIN_HUB_SECTIONS).toBeInstanceOf(Array);
    
    const plannerOps = ADMIN_HUB_SECTIONS.find((s) => s.title === "Planner operations");
    expect(plannerOps).toBeDefined();
    expect(plannerOps?.items.length).toBe(3); // Plans, Toolbar & features, Analytics
  });

  it("flattens ADMIN_HUB_CARDS correctly", () => {
    expect(ADMIN_HUB_CARDS).toBeInstanceOf(Array);
    const totalHubItems = ADMIN_HUB_SECTIONS.reduce((acc, sec) => acc + sec.items.length, 0);
    expect(ADMIN_HUB_CARDS.length).toBe(totalHubItems);
  });
});
