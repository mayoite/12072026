/**
 * P01 product-truth host wiring — pure source / import-graph checks only.
 * No full Next page render (those live in routesCoverage / cleanupPhase08).
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  PRODUCTION_IMPORT_GRAPH,
  open3dHybridRoutes,
  open3dNativeRoutes,
} from "@/features/planner/open3d/cleanup/importGraphProof";
import {
  OPEN3D_FABRIC_FURNITURE_ENV,
  isOpen3dFabricFurnitureEnabled,
} from "@/features/planner/canvas-fabric-stage/fabricFurnitureFlag";

const siteRoot = process.cwd();

function siteFile(...segments: string[]): string {
  return path.join(siteRoot, ...segments);
}

function readSite(...segments: string[]): string {
  return readFileSync(siteFile(...segments), "utf8");
}

describe("P01 host wiring (import graph + source)", () => {
  it("documents dual entry: guest/canvas hybrid + open3d pilot native", () => {
    expect(open3dHybridRoutes()).toEqual(
      expect.arrayContaining([
        "route-guest",
        "route-canvas",
        "workspace-route-open3d",
      ]),
    );
    expect(open3dNativeRoutes()).toEqual(
      expect.arrayContaining([
        "route-open3d-pilot",
        "host-open3d",
      ]),
    );
    expect(open3dNativeRoutes()).not.toContain("native-host");

    const guest = PRODUCTION_IMPORT_GRAPH.find((n) => n.id === "route-guest");
    const canvas = PRODUCTION_IMPORT_GRAPH.find((n) => n.id === "route-canvas");
    const pilot = PRODUCTION_IMPORT_GRAPH.find((n) => n.id === "route-open3d-pilot");
    const host = PRODUCTION_IMPORT_GRAPH.find((n) => n.id === "host-open3d");

    expect(guest?.imports).toContain(
      "@/features/planner/ui/Open3dPlannerWorkspaceRoute",
    );
    expect(canvas?.imports).toContain(
      "@/features/planner/ui/Open3dPlannerWorkspaceRoute",
    );
    expect(pilot?.imports).toContain("@/features/planner/ui/Open3dPlannerHost");
    expect(host?.imports).toContain(
      "@/features/planner/open3d/editor/OOPlannerWorkspace",
    );
  });

  it("live route/host sources import the open3d chain (file text, no render)", () => {
    const guestSrc = readSite("app", "planner", "(workspace)", "guest", "page.tsx");
    const canvasSrc = readSite("app", "planner", "(workspace)", "canvas", "page.tsx");
    const open3dSrc = readSite("app", "planner", "open3d", "page.tsx");
    const workspaceRouteSrc = readSite(
      "features",
      "planner",
      "ui",
      "Open3dPlannerWorkspaceRoute.tsx",
    );
    const hostSrc = readSite("features", "planner", "ui", "Open3dPlannerHost.tsx");

    expect(guestSrc).toMatch(/Open3dPlannerWorkspaceRoute/);
    expect(canvasSrc).toMatch(/Open3dPlannerWorkspaceRoute/);
    expect(open3dSrc).toMatch(/Open3dPlannerHost/);
    expect(open3dSrc).not.toMatch(/Open3dPlannerWorkspaceRoute/);
    expect(workspaceRouteSrc).toMatch(/Open3dPlannerHost/);
    expect(hostSrc).toMatch(/OOPlannerWorkspace/);
    expect(hostSrc).not.toMatch(/Open3dNativeHost|open3d\/ui/);
    expect(
      existsSync(siteFile("features", "planner", "open3d", "ui")),
    ).toBe(false);
  });

  it("has no live app/planner fabric page tree; next.config redirects fabric → open3d", () => {
    expect(
      existsSync(siteFile("app", "planner", "(workspace)", "fabric")),
    ).toBe(false);
    expect(existsSync(siteFile("app", "planner", "fabric"))).toBe(false);

    const nextConfig = readSite("config", "build", "next.config.js");
    expect(nextConfig).toMatch(
      /source:\s*["']\/planner\/fabric["'][\s\S]*?destination:\s*["']\/planner\/open3d\/["']/,
    );
    expect(nextConfig).toMatch(
      /source:\s*["']\/planner\/fabric\/:path\*["'][\s\S]*?destination:\s*["']\/planner\/open3d\/["']/,
    );
  });

  it("workspace mounts PlannerCanvasStage as sole live 2-D canvas (Fabric barrel)", () => {
    const workspaceSrc = readSite(
      "features",
      "planner",
      "open3d",
      "editor",
      "OOPlannerWorkspace.tsx",
    );
    expect(workspaceSrc).toMatch(/PlannerCanvasStage/);
    expect(workspaceSrc).not.toMatch(/Open3dFabricStage/);
    expect(workspaceSrc).not.toMatch(/isOpen3dFabricFurnitureEnabled/);
    expect(workspaceSrc).not.toMatch(/FeasibilityCanvas|canvas-feasibility/);

    const stageBarrel = readSite(
      "features",
      "planner",
      "open3d",
      "canvas-stage",
      "index.ts",
    );
    expect(stageBarrel).toMatch(/Open3dFabricStage as PlannerCanvasStage/);
    expect(stageBarrel).toMatch(/@\/features\/planner\/canvas-fabric-stage\//);
    expect(stageBarrel).not.toMatch(/canvas-feasibility|FeasibilityCanvas/);
    expect(stageBarrel).not.toMatch(/open3d\/canvas-fabric-stage/);

    // Legacy env flag module remains for mapper tests; not wired in workspace.
    expect(isOpen3dFabricFurnitureEnabled({})).toBe(false);
    expect(
      isOpen3dFabricFurnitureEnabled({
        [OPEN3D_FABRIC_FURNITURE_ENV]: "1",
      }),
    ).toBe(true);
  });
});
