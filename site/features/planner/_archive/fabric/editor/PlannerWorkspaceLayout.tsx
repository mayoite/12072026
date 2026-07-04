import type { ReactNode } from "react";
import type { PlannerStep } from "@/features/planner/editor/plannerStep";
import { Z } from "@/lib/z-index";

export interface PlannerWorkspaceLayoutProps {
  topBar: ReactNode;
  subTopBar?: ReactNode;
  toolRail?: ReactNode;
  mobileToolbar?: ReactNode;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  canvasArea: ReactNode;
  sessionDialog: ReactNode;
  templateModal: ReactNode;
  exportModal: ReactNode;
  dragOverlay: ReactNode;
  isCompact: boolean;
  plannerStep: PlannerStep;
  leftOpenRaw: boolean;
  rightOpenRaw: boolean;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  isCanvasDragging: boolean;
  closeAll: () => void;
  isOnline?: boolean;
}

export function PlannerWorkspaceLayout({
  topBar,
  subTopBar,
  toolRail,
  mobileToolbar,
  leftPanel,
  rightPanel,
  canvasArea,
  sessionDialog,
  templateModal,
  exportModal,
  dragOverlay,
  isCompact,
  plannerStep,
  leftOpenRaw,
  rightOpenRaw,
  leftCollapsed,
  rightCollapsed,
  isCanvasDragging,
  closeAll,
  isOnline = true,
}: PlannerWorkspaceLayoutProps) {
  return (
    <div className="pw-shell" data-offline={!isOnline ? "true" : undefined}>
      <h1 className="sr-only">Workspace Planner</h1>
      {!isOnline && (
        <div
          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white text-xs font-semibold py-2 px-4 flex items-center justify-between shadow-md border-b border-orange-600/20 relative motion-reduce:animate-none animate-pulse"
          style={{ zIndex: Z.toast }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>
              Offline Mode: Saving changes to transactionally-safe IndexedDB. Changes will sync to cloud when connection is restored.
            </span>
          </div>
          <button 
            type="button" 
            onClick={() => window.location.reload()} 
            className="bg-white/20 hover:bg-white/30 text-white rounded px-2.5 py-0.5 text-[0.625rem] uppercase font-bold transition-all border border-white/20"
          >
            Check Status
          </button>
        </div>
      )}
      <div
        className={`pw-workspace flex-col${isCompact ? " pw-workspace--compact" : ""} lg:grid lg:h-dvh lg:grid-rows-[48px_1fr] lg:grid-cols-[var(--pw-rail-w)_var(--planner-left-panel-col)_minmax(0,1fr)_var(--planner-right-panel-col)] lg:transition-[grid-template-columns] lg:duration-200 lg:ease-in-out`}
        data-step={plannerStep}
        data-left-collapsed={!isCompact && leftCollapsed ? true : undefined}
        data-right-collapsed={!isCompact && rightCollapsed ? true : undefined}
        data-canvas-dragging={isCanvasDragging || undefined}
        style={{
          ["--planner-left-panel-col" as string]: !isCompact && leftCollapsed ? "0" : "var(--pw-left-w)",
          ["--planner-right-panel-col" as string]: !isCompact && rightCollapsed ? "0px" : "var(--pw-right-w)",
        }}
      >
        <div className="lg:col-span-full lg:row-start-1 lg:h-12 lg:min-h-0 lg:overflow-hidden">
          {topBar}
        </div>

        {isCompact && (leftOpenRaw || rightOpenRaw) ? (
          <button
            type="button"
            className="pw-panel-backdrop"
            aria-label="Close panel"
            onClick={closeAll}
          />
        ) : null}

        <div className="hidden lg:col-start-1 lg:row-start-2 lg:flex lg:w-[var(--pw-rail-w)] lg:min-w-0 lg:overflow-hidden">
          {toolRail}
        </div>
        
        <div className="contents lg:block lg:col-start-2 lg:row-start-2 lg:min-w-0 lg:overflow-y-auto lg:border-r lg:border-[color:var(--border-soft)] lg:panel-scroll">
          {leftPanel}
        </div>

        <div className="contents lg:col-start-3 lg:row-start-2 lg:flex lg:min-w-0 lg:flex-col lg:overflow-hidden lg:relative">
          {subTopBar}
          {canvasArea}
        </div>

        <div className="contents lg:block lg:col-start-4 lg:row-start-2 lg:min-w-0 lg:overflow-y-auto lg:border-l lg:border-[color:var(--border-soft)] lg:panel-scroll">
          {rightPanel}
        </div>

        {isCompact && mobileToolbar}
      </div>

      {templateModal}
      {sessionDialog}
      {dragOverlay}
      {exportModal}
    </div>
  );
}
