import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { existsSync } from "node:fs";
import path from "node:path";

import {
  DEMO_MODEL_ASSETS,
  PRODUCT_CATALOG_POLICY,
  assertProductAssetsStayOffGit,
  listCdnEligibleRuntimeAssets,
} from "@/features/planner/cleanup/assetClassification";
import {
  FORBIDDEN_GRAPH_IDS,
  PRODUCTION_IMPORT_GRAPH,
  fabricRetirementBlocked,
  plannerHybridRoutes,
  routesStillOnFabricStack,
} from "@/features/planner/cleanup/importGraphProof";

vi.mock("@/lib/auth/plannerSession", () => ({
  getOptionalPlannerUser: vi.fn(async () => ({
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "member@example.com",
  })),
}));

vi.mock("@/features/planner/ui/PlannerWorkspaceRoute", () => ({
  PlannerWorkspaceRoute: ({ guestMode, planId }: { guestMode?: boolean; planId?: string }) =>
    createElement(
      "div",
      { "data-testid": "planner-workspace-route" },
      guestMode ? "guest" : "member",
      planId ? ` ${planId}` : "",
    ),
}));

vi.mock("@/features/planner/ui/PlannerHost", () => ({
  PlannerHost: ({ guestMode, planId }: { guestMode?: boolean; planId?: string }) =>
    createElement(
      "div",
      { "data-testid": "planner-host" },
      guestMode ? "guest" : "member",
      planId ? ` ${planId}` : "",
    ),
}));

describe("Phase 08 asset classification", () => {
  it("keeps product catalog assets off git public paths", () => {
    expect(assertProductAssetsStayOffGit(PRODUCT_CATALOG_POLICY)).toBe(true);

    for (const demo of DEMO_MODEL_ASSETS) {
      expect(demo.productionAllowed).toBe(false);
    }
  });

  it("lists runtime textures eligible for CDN copy only", () => {
    const eligible = listCdnEligibleRuntimeAssets();
    expect(eligible.length).toBeGreaterThan(0);
    for (const asset of eligible) {
      // Classified CDN slot is /cdn/planner/canvas/ (public/open3d remains legacy empty slot)
      expect(asset.cdnDestination).toMatch(/^\/cdn\/planner\/canvas\//);
      expect(asset.ownership).toBe("runtime-editor-cdn");
    }
  });
});

describe("Phase 08 import graph proof", () => {
  afterEach(() => {
    cleanup();
  });

  it("wires the live guest and canvas routes to PlannerWorkspaceRoute", async () => {
    const guestPlanId = "550e8400-e29b-41d4-a716-4466554400aa";
    const canvasPlanId = "550e8400-e29b-41d4-a716-4466554400bb";
    const { default: PlannerGuestPage } = await import("@/app/planner/(workspace)/guest/page");
    const { default: PlannerCanvasPage } = await import("@/app/planner/(workspace)/canvas/page");

    render(
      await PlannerGuestPage({ searchParams: Promise.resolve({ id: guestPlanId }) }),
    );
    expect(screen.getByTestId("planner-workspace-route")).toHaveTextContent("guest");
    expect(screen.getByTestId("planner-workspace-route")).toHaveTextContent(guestPlanId);

    cleanup();

    render(
      await PlannerCanvasPage({
        searchParams: Promise.resolve({ id: canvasPlanId }),
      }),
    );
    expect(screen.getByTestId("planner-workspace-route")).toHaveTextContent(canvasPlanId);
  });

  it("has no pilot /planner/open3d page module (redirect-only in next.config)", () => {
    const open3dPage = path.resolve(process.cwd(), "app/planner/open3d/page.tsx");
    expect(existsSync(open3dPage)).toBe(false);
  });

  it("preserves iframe embed node until explicit retirement", () => {
    const embed = PRODUCTION_IMPORT_GRAPH.find((n) => n.stack === "iframe-embed");
    expect(embed?.path).toContain("vendor/open3d-floorplan/embed");
  });

  it("records live hybrid routes; fabric-legacy stack empty (archive deleted)", () => {
    expect(plannerHybridRoutes()).toEqual(
      expect.arrayContaining(["route-guest", "route-canvas", "workspace-route"]),
    );
    expect(routesStillOnFabricStack()).toEqual([]);
    expect(fabricRetirementBlocked()).toBe(false);
    const ids = PRODUCTION_IMPORT_GRAPH.map((n) => n.id);
    for (const forbidden of FORBIDDEN_GRAPH_IDS) {
      expect(ids).not.toContain(forbidden);
    }
    expect(ids.some((id) => id.includes("fabric-legacy") || id.startsWith("route-fabric"))).toBe(
      false,
    );
  });
});
