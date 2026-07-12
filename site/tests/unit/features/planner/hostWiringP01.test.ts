/**
 * P01 host wiring — simplified planner layout (editor / canvas / 3d / project).
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  PRODUCTION_IMPORT_GRAPH,
  open3dHybridRoutes,
  open3dNativeRoutes,
} from "@/features/planner/project/cleanup/importGraphProof";
import {
  OPEN3D_FABRIC_FURNITURE_ENV,
  isOpen3dFabricFurnitureEnabled,
} from "@/features/planner/canvas/fabricFurnitureFlag";

const siteRoot = process.cwd();

function siteFile(...segments: string[]): string {
  return path.join(siteRoot, ...segments);
}

function readSite(...segments: string[]): string {
  return readFileSync(siteFile(...segments), "utf8");
}

describe("P01 host wiring (import graph + source)", () => {
  it("documents guest/canvas hybrid + planner host", () => {
    expect(open3dHybridRoutes()).toEqual(
      expect.arrayContaining(["route-guest", "route-canvas", "workspace-route"]),
    );
    expect(open3dNativeRoutes()).toEqual(expect.arrayContaining(["host-planner"]));
    expect(PRODUCTION_IMPORT_GRAPH.find((n) => n.id === "host-planner")?.imports).toContain(
      "@/features/planner/editor/OOPlannerWorkspace",
    );
  });

  it("live routes use simplified planner chain", () => {
    const guestSrc = readSite("app", "planner", "(workspace)", "guest", "page.tsx");
    const canvasSrc = readSite("app", "planner", "(workspace)", "canvas", "page.tsx");
    const hostSrc = readSite("features", "planner", "ui", "PlannerHost.tsx");
    const routeSrc = readSite("features", "planner", "ui", "PlannerWorkspaceRoute.tsx");

    expect(guestSrc).toMatch(/PlannerWorkspaceRoute/);
    expect(canvasSrc).toMatch(/PlannerWorkspaceRoute/);
    expect(routeSrc).toMatch(/PlannerHost/);
    expect(hostSrc).toMatch(/OOPlannerWorkspace/);
    expect(existsSync(siteFile("features", "planner", "workspace"))).toBe(false);
    expect(existsSync(siteFile("features", "planner", "open3d"))).toBe(false);
    expect(existsSync(siteFile("app", "planner", "open3d"))).toBe(false);
    expect(existsSync(siteFile("features", "planner", "editor", "OOPlannerWorkspace.tsx"))).toBe(
      true,
    );
    expect(existsSync(siteFile("features", "planner", "canvas", "PlannerFabricStage.tsx"))).toBe(
      true,
    );
    expect(existsSync(siteFile("features", "planner", "3d", "ThreeLazyViewer.tsx"))).toBe(true);
    expect(existsSync(siteFile("features", "planner", "project", "model"))).toBe(true);
  });

  it("redirects fabric and open3d URLs to canvas", () => {
    const nextConfig = readSite("config", "build", "next.config.js");
    expect(nextConfig).toMatch(/source:\s*["']\/planner\/fabric["']/);
    expect(nextConfig).toMatch(/destination:\s*["']\/planner\/canvas\/["']/);
    expect(nextConfig).toMatch(/source:\s*["']\/planner\/open3d["']/);
  });

  it("editor mounts PlannerCanvasStage from canvas barrel", () => {
    const workspaceSrc = readSite(
      "features",
      "planner",
      "editor",
      "OOPlannerWorkspace.tsx",
    );
    expect(workspaceSrc).toMatch(/PlannerCanvasStage/);
    expect(workspaceSrc).not.toMatch(/PlannerFabricStage/);
    const stageBarrel = readSite(
      "features",
      "planner",
      "project",
      "canvas-stage",
      "index.ts",
    );
    expect(stageBarrel).toMatch(/PlannerFabricStage as PlannerCanvasStage/);
    expect(stageBarrel).toMatch(/@\/features\/planner\/canvas\/PlannerFabricStage/);
    expect(isOpen3dFabricFurnitureEnabled({})).toBe(false);
    expect(
      isOpen3dFabricFurnitureEnabled({ [OPEN3D_FABRIC_FURNITURE_ENV]: "1" }),
    ).toBe(true);
  });
});
