import { describe, expect, it } from "vitest";

import {

  DEMO_MODEL_ASSETS,

  PRODUCT_CATALOG_POLICY,

  assertProductAssetsStayOffGit,

  listCdnEligibleRuntimeAssets,

} from "@/features/planner/open3d/cleanup/assetClassification";

import {

  PRODUCTION_IMPORT_GRAPH,

  fabricRetirementBlocked,

  open3dNativeRoutes,

  routesStillOnFabricStack,

} from "@/features/planner/open3d/cleanup/importGraphProof";



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

  it("keeps live guest/canvas on Fabric until native passes external deploy gates", () => {
    const fabricRoutes = routesStillOnFabricStack();
    expect(fabricRoutes).toContain("route-guest");
    expect(fabricRoutes).toContain("route-canvas");
    expect(fabricRetirementBlocked()).toBe(true);
  });



  it("keeps explicit Fabric fallback routes on legacy stack", () => {

    const fabricRoutes = routesStillOnFabricStack();

    expect(fabricRoutes).toContain("route-fabric-guest");

    expect(fabricRoutes).toContain("route-fabric-canvas");

  });



  it("records open3d pilot route on native stack only", () => {
    const native = open3dNativeRoutes();
    expect(native).toContain("route-open3d-pilot");
    expect(native).toContain("native-host");
    expect(native).not.toContain("route-guest");
    expect(native).not.toContain("route-canvas");
  });



  it("preserves iframe embed node until explicit retirement", () => {

    const embed = PRODUCTION_IMPORT_GRAPH.find((n) => n.stack === "iframe-embed");

    expect(embed?.path).toContain("vendor/open3d-floorplan/embed");

  });

});

