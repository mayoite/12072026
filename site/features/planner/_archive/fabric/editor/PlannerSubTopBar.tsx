"use client";


import { FabricCanvasSubToolbar } from "@/features/planner/canvas-fabric/FabricCanvasSubToolbar";
import { ZoomControl } from "@/features/planner/canvas-fabric/components/ZoomControl";
import { useFloorplan } from "@/features/planner/canvas-fabric";
import { Tooltip } from "@/features/planner/ui/Tooltip";
import { Box } from "lucide-react";

const TOOLBAR_BUTTON_CLASS = "min-w-[2.75rem] min-h-[2.75rem] focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-gray-100 rounded-lg transition-colors";

interface PlannerSubTopBarProps {
  viewMode: "2d" | "3d" | "split";
  onViewModeChange: (mode: "2d" | "3d" | "split") => void;
  onOpenExport?: () => void;
}

export function PlannerSubTopBar({
  viewMode,
  onViewModeChange,
  onOpenExport,
}: PlannerSubTopBarProps) {
  const { zoom, setZoom } = useFloorplan();

  return (
    <div className="pw-subtopbar-shell" role="toolbar" aria-label="Canvas view toolbar">


      {viewMode !== "3d" ? <FabricCanvasSubToolbar onExport={onOpenExport} /> : null}

      <div className="pw-subtopbar pw-subtopbar--view" data-coach="view-toggle" role="group" aria-label="View and zoom controls">
        <Tooltip content={viewMode === "split" ? "Close 3D View" : "Open 3D View"} side="bottom">
          <button
            type="button"
            className={`hidden md:block pw-segment-btn ${TOOLBAR_BUTTON_CLASS}`}
            data-active={viewMode === "split"}
            aria-pressed={viewMode === "split"}
            onClick={() => onViewModeChange(viewMode === "split" ? "2d" : "split")}
          >
            <span className="inline-flex items-center gap-1.5">
              <Box size={14} aria-hidden />
              3D View
            </span>
          </button>
        </Tooltip>
        <div className="pw-segment pw-segment--compact">
          {(["2d", "3d", "split"] as const).map((mode) => (
            <Tooltip key={mode} content={`${mode === "2d" ? "2D" : mode === "3d" ? "3D" : "Split"} view`} side="bottom">
              <button
                type="button"
                onClick={() => onViewModeChange(mode)}
                className={`pw-segment-btn ${TOOLBAR_BUTTON_CLASS}`}
                data-active={viewMode === mode}
                aria-pressed={viewMode === mode}
              >
                {mode === "2d" ? "2D" : mode === "3d" ? "3D" : "Split"}
              </button>
            </Tooltip>
          ))}
        </div>
        <ZoomControl zoom={zoom} onZoomChange={setZoom} />
      </div>
    </div>
  );
}
