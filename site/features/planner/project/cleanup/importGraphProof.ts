/**
 * Live route → host graph (Fabric sole planner).
 */
export type ImportGraphNode = {
  id: string;
  path: string;
  imports: string[];
  stack: "workspace-hybrid" | "workspace-native" | "iframe-embed" | "shared-site";
};

export const PRODUCTION_IMPORT_GRAPH: readonly ImportGraphNode[] = [
  {
    id: "route-guest",
    path: "site/app/planner/(workspace)/guest/page.tsx",
    imports: ["@/features/planner/ui/PlannerWorkspaceRoute"],
    stack: "workspace-hybrid",
  },
  {
    id: "route-canvas",
    path: "site/app/planner/(workspace)/canvas/page.tsx",
    imports: ["@/features/planner/ui/PlannerWorkspaceRoute"],
    stack: "workspace-hybrid",
  },
  {
    id: "workspace-route",
    path: "site/features/planner/ui/PlannerWorkspaceRoute.tsx",
    imports: ["@/features/planner/ui/PlannerHost"],
    stack: "workspace-hybrid",
  },
  {
    id: "host-planner",
    path: "site/features/planner/ui/PlannerHost.tsx",
    imports: ["@/features/planner/editor/OOPlannerWorkspace"],
    stack: "workspace-native",
  },
  {
    id: "iframe-embed-vendor",
    path: "site/public/vendor/open3d-floorplan/embed/",
    imports: [],
    stack: "iframe-embed",
  },
] as const;

export function routesStillOnFabricStack(): string[] {
  return [];
}

export function open3dNativeRoutes(): string[] {
  return PRODUCTION_IMPORT_GRAPH.filter((n) => n.stack === "workspace-native").map((n) => n.id);
}

export function open3dHybridRoutes(): string[] {
  return PRODUCTION_IMPORT_GRAPH.filter((n) => n.stack === "workspace-hybrid").map((n) => n.id);
}

export function fabricRetirementBlocked(): boolean {
  return false;
}
