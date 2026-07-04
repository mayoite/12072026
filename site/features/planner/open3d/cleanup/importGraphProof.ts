/**
 * Phase 08 import-graph proof — documents live route → host → planner stack.
 * Used before any Fabric/iframe retirement per plannnerplan/08-cleanup-archive-and-evidence-gates.md.
 */

export type ImportGraphNode = {
  id: string;
  path: string;
  imports: string[];
  stack: "fabric-legacy" | "open3d-hybrid" | "open3d-native" | "iframe-embed" | "shared-site";
};

/**
 * Production route import graph (2026-07-04).
 * Live guest/canvas mount the hybrid Open3D workspace route; explicit /planner/fabric/* routes remain legacy fallback.
 */
export const PRODUCTION_IMPORT_GRAPH: readonly ImportGraphNode[] = [
  {
    id: "route-guest",
    path: "site/app/planner/(workspace)/guest/page.tsx",
    imports: ["@/features/planner/ui/Open3dPlannerWorkspaceRoute"],
    stack: "open3d-hybrid",
  },
  {
    id: "route-canvas",
    path: "site/app/planner/(workspace)/canvas/page.tsx",
    imports: ["@/features/planner/ui/Open3dPlannerWorkspaceRoute"],
    stack: "open3d-hybrid",
  },
  {
    id: "workspace-route-open3d",
    path: "site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx",
    imports: ["@/features/planner/ui/Open3dPlannerHost"],
    stack: "open3d-hybrid",
  },
  {
    id: "route-fabric-guest",
    path: "site/app/planner/(workspace)/fabric/guest/page.tsx",
    imports: ["@/features/planner/ui/PlannerWorkspaceRoute"],
    stack: "fabric-legacy",
  },
  {
    id: "route-fabric-canvas",
    path: "site/app/planner/(workspace)/fabric/canvas/page.tsx",
    imports: ["@/features/planner/ui/PlannerWorkspaceRoute"],
    stack: "fabric-legacy",
  },
  {
    id: "route-open3d-pilot",
    path: "site/app/planner/open3d/page.tsx",
    imports: ["@/features/planner/ui/Open3dPlannerHost"],
    stack: "open3d-native",
  },
  {
    id: "host-open3d",
    path: "site/features/planner/ui/Open3dPlannerHost.tsx",
    imports: ["@/features/planner/open3d/ui/Open3dNativeHost"],
    stack: "open3d-native",
  },
  {
    id: "native-host",
    path: "site/features/planner/open3d/ui/Open3dNativeHost.tsx",
    imports: ["@/features/planner/open3d/editor/OOPlannerWorkspace"],
    stack: "open3d-native",
  },
  {
    id: "iframe-embed-vendor",
    path: "site/public/vendor/open3d-floorplan/embed/",
    imports: [],
    stack: "iframe-embed",
  },
] as const;

export function routesStillOnFabricStack(): string[] {
  return PRODUCTION_IMPORT_GRAPH.filter((n) => n.stack === "fabric-legacy").map((n) => n.id);
}

export function open3dNativeRoutes(): string[] {
  return PRODUCTION_IMPORT_GRAPH.filter((n) => n.stack === "open3d-native").map((n) => n.id);
}

export function open3dHybridRoutes(): string[] {
  return PRODUCTION_IMPORT_GRAPH.filter((n) => n.stack === "open3d-hybrid").map((n) => n.id);
}

/** Phase 08 exit: Fabric retirement is still blocked while explicit fallback routes exist. */
export function fabricRetirementBlocked(): boolean {
  return PRODUCTION_IMPORT_GRAPH.some((n) => n.stack === "fabric-legacy");
}
