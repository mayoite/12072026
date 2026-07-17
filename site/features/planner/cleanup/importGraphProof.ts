/**
 * Live route → host graph (Fabric sole planner).
 *
 * No fabric-legacy route nodes. Historical route-fabric-guest / route-fabric-canvas
 * are gone with app planner fabric pages and features/planner/_archive. Legacy URLs
 * redirect only (next.config → /planner/canvas/). routesStillOnFabricStack() stays empty.
 */
export type ImportGraphNode = {
  id: string;
  path: string;
  imports: string[];
  stack: "workspace-hybrid" | "workspace-native" | "iframe-embed" | "shared-site";
};

/** Live production graph only — do not re-add fabric-legacy or open3d page nodes. */
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

/** Always empty: no product fabric-legacy app routes remain. */
export function routesStillOnFabricStack(): string[] {
  return [];
}

/** Guard for tests — no historical fabric-legacy ids may re-enter the live graph. */
export const FORBIDDEN_GRAPH_IDS = [
  "route-fabric-guest",
  "route-fabric-canvas",
  "workspace-route-open3d",
  "route-open3d-pilot",
] as const;

export function plannerNativeRoutes(): string[] {
  return PRODUCTION_IMPORT_GRAPH.filter((n) => n.stack === "workspace-native").map((n) => n.id);
}

export function plannerHybridRoutes(): string[] {
  return PRODUCTION_IMPORT_GRAPH.filter((n) => n.stack === "workspace-hybrid").map((n) => n.id);
}

export function fabricRetirementBlocked(): boolean {
  return false;
}
