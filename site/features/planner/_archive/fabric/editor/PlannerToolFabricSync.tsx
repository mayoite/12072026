"use client";

import { useEffect } from "react";

import { useFloorplan } from "@/features/planner/canvas-fabric";
import { plannerToolToFabricTool } from "@/features/planner/editor/plannerToolFabricBridge";
import { usePlannerStore } from "@/features/planner/store/plannerStore";

/** Push planner store tool selection into Fabric draw mode. */
export function PlannerToolFabricSync() {
  const plannerTool = usePlannerStore((s) => s.tool);
  const { setDrawTool } = useFloorplan();

  useEffect(() => {
    setDrawTool(plannerToolToFabricTool(plannerTool));
  }, [plannerTool, setDrawTool]);

  return null;
}
