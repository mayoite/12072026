import { useEffect, useState, type ReactNode } from "react";
import { SplitViewLayout } from "@/features/planner/shared/components/SplitViewLayout";
import { PlannerEmptyCanvas } from "@/features/planner/ui/PlannerEmptyCanvas";
import type { CatalogItem } from "@/features/planner/catalog/catalogTypes";

import type { PlannerToolBinding } from "@/features/planner/editor/plannerKeyboardShortcuts";

export interface PlannerCanvasStageProps {
  viewMode: "2d" | "3d" | "split";
  chromeLayerRef: React.RefObject<HTMLDivElement | null>;
  canvasSurfaceRef: React.RefObject<HTMLDivElement | null>;
  dragItem: CatalogItem | null;
  isCatalogOverCanvas: boolean;
  handleCanvasDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleCanvasDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  canvas2D: ReactNode;
  canvas3D: ReactNode;
  shapeCount: number;
  guestMode: boolean;
  applyToolBinding: (binding: PlannerToolBinding) => void;
  setIsTemplateOpen: (open: boolean) => void;
  onQuickLayout?: () => void;
  onUploadFloorPlan?: () => void;
  onClose3D?: () => void;
  plannerChromeHost: ReactNode;
  toolRail?: ReactNode;
  statusBar: ReactNode;
}

export function PlannerCanvasStage({
  viewMode,
  chromeLayerRef,
  canvasSurfaceRef,
  dragItem,
  isCatalogOverCanvas,
  handleCanvasDragOver,
  handleCanvasDrop,
  canvas2D,
  canvas3D,
  shapeCount,
  guestMode,
  applyToolBinding,
  setIsTemplateOpen,
  onQuickLayout,
  onUploadFloorPlan,
  onClose3D,
  plannerChromeHost,
  toolRail,
  statusBar,
}: PlannerCanvasStageProps) {
  const [emptyCanvasDismissed, setEmptyCanvasDismissed] = useState(false);

  useEffect(() => {
    if (shapeCount > 0) {
      setEmptyCanvasDismissed(false);
    }
  }, [shapeCount]);

  return (
    <section className="pw-canvas-stage inset-x-0 top-12 bottom-16 md:static">
      <div className="pw-canvas-stage-inner md:flex-row" style={{ touchAction: "none" }}>
        {toolRail}
        <section className="pw-canvas-area" aria-label="Workspace canvas">
        <div className="pw-canvas-body" data-view-mode={viewMode}>
          <div ref={chromeLayerRef} className="pw-canvas-chrome-layer">
            {plannerChromeHost}
          </div>

          <div
            ref={canvasSurfaceRef}
            className="pw-canvas-surface"
            data-catalog-drop={dragItem && isCatalogOverCanvas ? "active" : undefined}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
          >
            <div
              className="pw-canvas-engine pw-fabric-container"
              data-testid="planner-2d-canvas"
            >
              <SplitViewLayout
                view={viewMode}
                children2D={canvas2D}
                children3D={canvas3D}
                onClose3D={onClose3D}
              />
            </div>
            {viewMode === "2d" && shapeCount === 0 && !emptyCanvasDismissed ? (
              <PlannerEmptyCanvas
                guestMode={guestMode}
                allowCanvasDragThrough
                onDrawWalls={() => {
                  setEmptyCanvasDismissed(true);
                  applyToolBinding({ toolId: "planner-wall", plannerTool: "wall" });
                }}
                onOpenTemplates={() => setIsTemplateOpen(true)}
                onQuickLayout={onQuickLayout}
                onUploadFloorPlan={onUploadFloorPlan}
              />
            ) : null}
          </div>
        </div>
        {statusBar}
      </section>
      </div>
    </section>
  );
}
