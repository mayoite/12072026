import { describe, expect, it } from "vitest";

import {
  buildAdminPlansListQuery,
  buildPlannerCanvasHref,
} from "@/features/planner/admin/plannerAdminLinks";

describe("buildPlannerCanvasHref", () => {
  it("returns bare canvas path when plan id is empty or whitespace", () => {
    expect(buildPlannerCanvasHref("")).toBe("/planner/canvas");
    expect(buildPlannerCanvasHref("   ")).toBe("/planner/canvas");
  });

  it("trims and encodes plan ids for the query string", () => {
    expect(buildPlannerCanvasHref("abc-123")).toBe("/planner/canvas?id=abc-123");
    expect(buildPlannerCanvasHref("  plan/with spaces  ")).toBe(
      "/planner/canvas?id=plan%2Fwith%20spaces",
    );
    expect(buildPlannerCanvasHref("a&b=c")).toBe(
      `/planner/canvas?id=${encodeURIComponent("a&b=c")}`,
    );
  });
});

describe("buildAdminPlansListQuery", () => {
  it("applies default limit, sortBy, and sortOrder", () => {
    expect(buildAdminPlansListQuery({})).toBe(
      "/api/admin/plans?limit=50&sortBy=updated_at&sortOrder=desc",
    );
  });

  it("omits page when page is 1 or missing; includes page when > 1", () => {
    expect(buildAdminPlansListQuery({ page: 1 })).toBe(
      "/api/admin/plans?limit=50&sortBy=updated_at&sortOrder=desc",
    );
    expect(buildAdminPlansListQuery({ page: 3 })).toBe(
      "/api/admin/plans?limit=50&page=3&sortBy=updated_at&sortOrder=desc",
    );
  });

  it("omits status when all or unset; includes specific status", () => {
    expect(buildAdminPlansListQuery({ status: "all" })).toBe(
      "/api/admin/plans?limit=50&sortBy=updated_at&sortOrder=desc",
    );
    expect(buildAdminPlansListQuery({ status: "draft" })).toContain(
      "status=draft",
    );
    expect(buildAdminPlansListQuery({ status: "active" })).toContain(
      "status=active",
    );
    expect(buildAdminPlansListQuery({ status: "archived" })).toContain(
      "status=archived",
    );
  });

  it("includes trimmed search and skips blank search", () => {
    expect(buildAdminPlansListQuery({ search: "  " })).toBe(
      "/api/admin/plans?limit=50&sortBy=updated_at&sortOrder=desc",
    );
    expect(buildAdminPlansListQuery({ search: "  acme co  " })).toBe(
      "/api/admin/plans?limit=50&sortBy=updated_at&sortOrder=desc&search=acme+co",
    );
  });

  it("honors explicit sort and limit together", () => {
    expect(
      buildAdminPlansListQuery({
        limit: 25,
        page: 2,
        status: "draft",
        search: "acme",
        sortBy: "created_at",
        sortOrder: "asc",
      }),
    ).toBe(
      "/api/admin/plans?limit=25&page=2&sortBy=created_at&sortOrder=asc&status=draft&search=acme",
    );
  });
});
