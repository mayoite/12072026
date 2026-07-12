import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createElement } from "react";

import {
  DEMO_MODEL_ASSETS,
  PRODUCT_CATALOG_POLICY,
  assertProductAssetsStayOffGit,
  listCdnEligibleRuntimeAssets,
} from "@/features/planner/project/cleanup/assetClassification";
import {
  PRODUCTION_IMPORT_GRAPH,
  fabricRetirementBlocked,
  open3dHybridRoutes,
  routesStillOnFabricStack,
} from "@/features/planner/project/cleanup/importGraphProof";

vi.mock("@/features/planner/ui/PlannerWorkspaceRoute", () => ({
  PlannerWorkspaceRoute: ({ guestMode, planId }: { guestMode?: boolean; planId?: string }) =>
    createElement(
      "div",
      { "data-testid": "open3d-workspace-route" },
      guestMode ? "guest" : "member",
      planId ? ` ${planId}` : "",
    ),
}));

vi.mock("@/features/planner/ui/PlannerWorkspaceRoute", () => ({
  PlannerWorkspaceRoute: ({ guestMode, planId }: { guestMode?: boolean; planId?: string }) =>
    createElement(
      "div",
      { "data-testid": "fabric-workspace-route" },
      guestMode ? "guest" : "member",
      planId ? ` ${planId}` : "",
    ),
}));

vi.mock("@/features/planner/ui/PlannerHost", () => ({
  PlannerHost: ({ guestMode, planId }: { guestMode?: boolean; planId?: string }) =>
    createElement(
      "div",
      { "data-testid": "open3d-pilot-route" },
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

      expect(asset.cdnDestination).toMatch(/^\/cdn\/planner\/open3d\//);

      expect(asset.ownership).toBe("runtime-editor-cdn");

    }

  });

});



describe("Phase 08 import graph proof", () => {

  afterEach(() => {
    cleanup();
  });

  it("wires the live guest and canvas routes to the hybrid open3d workspace", async () => {
    const { default: PlannerGuestPage } = await import("@/app/planner/(workspace)/guest/page");
    const { default: PlannerCanvasPage } = await import("@/app/planner/(workspace)/canvas/page");

    render(await PlannerGuestPage({ searchParams: Promise.resolve({}) }));
    expect(screen.getByTestId("open3d-workspace-route")).toHaveTextContent("guest");

    cleanup();

    render(
      await PlannerCanvasPage({
        searchParams: Promise.resolve({ id: "live-plan" }),
      }),
    );
    expect(screen.getByTestId("open3d-workspace-route")).toHaveTextContent("live-plan");
  });

  it("keeps /planner/open3d on the pilot host route", async () => {
    const { default: Open3dPage } = await import("@/app/planner/open3d/page");

    render(
      await Open3dPage({
        searchParams: Promise.resolve({ id: "pilot-plan" }),
      }),
    );
    expect(screen.getByTestId("open3d-pilot-route")).toHaveTextContent("pilot-plan");
  });



  it("preserves iframe embed node until explicit retirement", () => {

    const embed = PRODUCTION_IMPORT_GRAPH.find((n) => n.stack === "iframe-embed");

    expect(embed?.path).toContain("vendor/open3d-floorplan/embed");

  });

  it("records live hybrid routes; fabric-legacy stack empty (archive deleted)", () => {
    expect(open3dHybridRoutes()).toEqual(
      expect.arrayContaining(["route-guest", "route-canvas", "workspace-route-open3d"]),
    );
    expect(routesStillOnFabricStack()).toEqual([]);
    expect(fabricRetirementBlocked()).toBe(false);
  });

});

