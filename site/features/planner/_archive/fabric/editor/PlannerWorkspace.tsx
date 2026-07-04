/**
 * PlannerWorkspace — unified workspace planner editor shell entry point.
 *
 * Session, sketch, canvas, and export seams are composed in PlannerWorkspaceContent
 * and dedicated hook modules under `editor/`.
 */

"use client";

import { PlannerToolFabricSync } from "@/features/planner/editor/PlannerToolFabricSync";
import { FloorplanProvider } from "@/features/planner/canvas-fabric";
import { FabricGridBridge } from "@/features/planner/editor/plannerWorkspaceFabricBridge";
import {
  PlannerWorkspaceContent,
  type PlannerWorkspaceProps,
} from "@/features/planner/editor/PlannerWorkspaceContent";

export type { PlannerWorkspaceProps };

export function PlannerWorkspace(props: PlannerWorkspaceProps) {
  return (
    <FloorplanProvider>
      <FabricGridBridge />
      <PlannerToolFabricSync />
      <PlannerWorkspaceContent {...props} />
    </FloorplanProvider>
  );
}
