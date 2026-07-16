"use client";

import { useState, type ReactNode } from "react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { useIsMobile } from "@/features/planner/hooks/useIsMobile";
import { BottomSheet } from "@/features/planner/ui/BottomSheet";

interface SplitViewLayoutProps {
  view: "2d" | "3d" | "split";
  children2D: ReactNode;
  children3D: ReactNode;
  onClose3D?: () => void;
}

/**
 * Keep both engines mounted so Fabric state, tools, and 3D sync stay alive across view switches.
 * Only visibility/layout changes — never unmount the 2D canvas when entering 3D.
 */
export function SplitViewLayout({ view, children2D, children3D, onClose3D }: SplitViewLayoutProps) {
  const isMobile = useIsMobile();
  const [hasActivated3D, setHasActivated3D] = useState(view !== "2d");

  if (view !== "2d" && !hasActivated3D) {
    setHasActivated3D(true);
  }

  const shouldRender3D = hasActivated3D;

  if (isMobile && view === "3d") {
    return (
      <div className="pw-view-stack">
        {children2D}
        <BottomSheet open onClose={onClose3D ?? (() => undefined)} title="3D View">
          <div className="h-[calc(90dvh-56px)]">
            {shouldRender3D ? children3D : null}
          </div>
        </BottomSheet>
      </div>
    );
  }

  if (view === "split") {
    if (isMobile) {
      return (
        <div className="pw-view-stack">
          {children2D}
          <BottomSheet open onClose={onClose3D ?? (() => undefined)} title="3D View">
            <div className="h-[calc(90dvh-56px)]">
              {shouldRender3D ? children3D : null}
            </div>
          </BottomSheet>
        </div>
      );
    }

    return (
      <PanelGroup orientation="horizontal" className="pw-split-view">
        <Panel defaultSize={60} minSize={30} className="pw-split-pane pw-split-pane--2d min-w-[18.75rem]">
          {children2D}
        </Panel>
        <PanelResizeHandle className="pw-split-divider w-1 shrink-0 cursor-col-resize bg-muted hover:bg-hover" />
        <Panel defaultSize={40} minSize={30} className="pw-split-pane pw-split-pane--3d min-w-[300px]">
          {shouldRender3D ? children3D : null}
        </Panel>
      </PanelGroup>
    );
  }

  return (
    <div className="pw-view-stack">
      <div
        className="pw-view-stack__pane pw-view-stack__pane--2d"
        data-active={view === "2d" || undefined}
        aria-hidden={view !== "2d" ? "true" : "false"}
      >
        {children2D}
      </div>
      <div
        className="pw-view-stack__pane pw-view-stack__pane--3d"
        data-active={view === "3d" || undefined}
        aria-hidden={view !== "3d" ? "true" : "false"}
      >
        {shouldRender3D ? children3D : null}
      </div>
    </div>
  );
}
