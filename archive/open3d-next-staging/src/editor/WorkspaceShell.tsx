"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { useDockingSystem, type PanelId, type ViewportTier } from "./useDockingSystem";
import { PanelContainer } from "./PanelContainer";
import { TopBar } from "./TopBar";
import type { PlannerAccessContext } from "../lib/commands/plannerAccessContext";
import type { Open3dProject } from "../model/types";
import styles from "./workspace.module.css";

export interface WorkspaceShellProps {
  /** Planner access context — guests must not see persist/import/export actions */
  accessContext?: PlannerAccessContext;
  /** Project name to display in header */
  projectName: string;
  /** Initial view mode */
  initialViewMode?: "2d" | "3d";
  /** Floor list for floor selector */
  floors?: Array<{ id: string; name: string }>;
  /** Currently active floor ID */
  activeFloorId?: string;
  /** Whether project has unsaved changes */
  isModified?: boolean;
  /** Whether project is synced to server */
  isSynced?: boolean;
  /** Left panel content */
  leftPanel?: React.ReactNode;
  /** Right panel content */
  rightPanel?: React.ReactNode;
  /** Bottom panel content */
  bottomPanel?: React.ReactNode;
  /** Main canvas/content area */
  children: React.ReactNode;
  /** Optional donor-compatible initial project payload */
  initialProject?: Open3dProject;
  /** Optional donor-compatible canvas integration toggle */
  enableCanvasIntegration?: boolean;
  /** Called when view mode changes */
  onViewModeChange?: (mode: "2d" | "3d") => void;
  /** Called when floor selection changes */
  onFloorChange?: (floorId: string) => void;
  /** Called when save is triggered */
  onSave?: () => void;
  /** Called when export is triggered */
  onExport?: () => void;
  /** Called when import is triggered */
  onImport?: () => void;
  /** Status bar left content */
  statusLeft?: React.ReactNode;
  /** Status bar right content */
  statusRight?: React.ReactNode;
}

export function WorkspaceShell({
  accessContext = "authenticated",
  projectName,
  initialViewMode = "2d",
  floors = [],
  activeFloorId,
  isModified = false,
  isSynced = false,
  leftPanel,
  rightPanel,
  bottomPanel,
  children,
  initialProject,
  enableCanvasIntegration,
  onViewModeChange,
  onFloorChange,
  onSave,
  onExport,
  onImport,
  statusLeft,
  statusRight,
}: WorkspaceShellProps) {
  const id = useId();
  const [viewMode, setViewMode] = useState<"2d" | "3d">(initialViewMode);

  const {
    panels,
    activePanel,
    focusedPanel,
    viewportTier,
    dock,
    undock,
    toggleCollapse,
    move,
    resize,
    saveLayout,
    setFocusedPanel,
  } = useDockingSystem();

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (mode: "2d" | "3d") => {
      setViewMode(mode);
      onViewModeChange?.(mode);
    },
    [onViewModeChange],
  );

  // Handle panel close - collapse it
  const handlePanelClose = useCallback(
    (id: PanelId) => {
      toggleCollapse(id);
    },
    [toggleCollapse],
  );

  // Handle panel minimize - also collapse
  const handlePanelMinimize = useCallback(
    (id: PanelId) => {
      toggleCollapse(id);
    },
    [toggleCollapse],
  );

  // Handle keyboard focus navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && !event.shiftKey) {
        // Tab through panels
        const panelIds: PanelId[] = ["left", "right", "bottom"];
        const currentIndex = focusedPanel ? panelIds.indexOf(focusedPanel) : -1;

        if (currentIndex >= 0 && currentIndex < panelIds.length - 1) {
          const nextPanel = panelIds[currentIndex + 1];
          if (panels[nextPanel].state !== "collapsed") {
            setFocusedPanel(nextPanel);
            event.preventDefault();
          }
        }
      }

      if (event.key === "Tab" && event.shiftKey) {
        // Shift+Tab backwards
        const panelIds: PanelId[] = ["left", "right", "bottom"];
        const currentIndex = focusedPanel ? panelIds.indexOf(focusedPanel) : 0;

        if (currentIndex > 0) {
          const prevPanel = panelIds[currentIndex - 1];
          if (panels[prevPanel].state !== "collapsed") {
            setFocusedPanel(prevPanel);
            event.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedPanel, panels, setFocusedPanel]);

  // Auto-save layout on changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveLayout();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [panels, saveLayout]);

  useEffect(() => {
    if (initialProject && enableCanvasIntegration) {
      // Donor-compatible props are preserved for future canvas/project wiring.
      // The shell itself remains layout-only for now.
    }
  }, [enableCanvasIntegration, initialProject]);

  const panelTitles: Record<PanelId, string> = {
    left: "Inventory",
    right: "Properties",
    bottom: "Output",
  };

  return (
    <div
      className={styles.shell}
      data-viewport={viewportTier}
      data-panel-active={activePanel}
      id={`workspace-shell-${id.replace(/:/g, "")}`}
    >
      {/* Top bar */}
      <TopBar
        accessContext={accessContext}
        projectName={projectName}
        isModified={isModified}
        isSynced={isSynced}
        viewMode={viewMode}
        floors={floors}
        activeFloorId={activeFloorId}
        onViewModeChange={handleViewModeChange}
        onFloorChange={onFloorChange}
        onSave={onSave}
        onExport={onExport}
        onImport={onImport}
      />

      {/* Main workspace with panels */}
      <div className={styles.workspace} data-viewport={viewportTier}>
        {/* Left panel - Inventory */}
        {leftPanel && (
          <PanelContainer
            id="left"
            title={panelTitles.left}
            state={panels.left.state}
            width={panels.left.width}
            height={0}
            x={panels.left.x}
            y={panels.left.y}
            zIndex={panels.left.zIndex}
            isOpen={panels.left.state !== "collapsed"}
            onUndock={() => undock("left")}
            onDock={() => dock("left")}
            onClose={() => handlePanelClose("left")}
            onMinimize={() => handlePanelMinimize("left")}
            onMove={(x, y) => move("left", x, y)}
            onResize={(w, h) => resize("left", w, h)}
            onFocus={() => setFocusedPanel("left")}
            onBlur={() => setFocusedPanel(null)}
          >
            {leftPanel}
          </PanelContainer>
        )}

        {/* Main canvas area */}
        <main className={styles.canvas} id={`${id.replace(/:/g, "")}-canvas`}>
          {children}
        </main>

        {/* Right panel - Properties */}
        {rightPanel && (
          <PanelContainer
            id="right"
            title={panelTitles.right}
            state={panels.right.state}
            width={panels.right.width}
            height={0}
            x={panels.right.x}
            y={panels.right.y}
            zIndex={panels.right.zIndex}
            isOpen={panels.right.state !== "collapsed"}
            onUndock={() => undock("right")}
            onDock={() => dock("right")}
            onClose={() => handlePanelClose("right")}
            onMinimize={() => handlePanelMinimize("right")}
            onMove={(x, y) => move("right", x, y)}
            onResize={(w, h) => resize("right", w, h)}
            onFocus={() => setFocusedPanel("right")}
            onBlur={() => setFocusedPanel(null)}
          >
            {rightPanel}
          </PanelContainer>
        )}

        {/* Bottom panel - Output */}
        {bottomPanel && (
          <PanelContainer
            id="bottom"
            title={panelTitles.bottom}
            state={panels.bottom.state}
            width={0}
            height={panels.bottom.height}
            x={panels.bottom.x}
            y={panels.bottom.y}
            zIndex={panels.bottom.zIndex}
            isOpen={panels.bottom.state !== "collapsed"}
            onUndock={() => undock("bottom")}
            onDock={() => dock("bottom")}
            onClose={() => handlePanelClose("bottom")}
            onMinimize={() => handlePanelMinimize("bottom")}
            onMove={(x, y) => move("bottom", x, y)}
            onResize={(w, h) => resize("bottom", w, h)}
            onFocus={() => setFocusedPanel("bottom")}
            onBlur={() => setFocusedPanel(null)}
          >
            {bottomPanel}
          </PanelContainer>
        )}
      </div>

      {/* Status bar */}
      <footer className={styles.status}>
        <div className={styles.statusLeft}>
          {statusLeft ?? (
            <>
              <span className={styles.statusItem}>Ready</span>
              <span className={styles.statusItem}>Zoom: 100%</span>
            </>
          )}
        </div>
        <div className={styles.statusRight}>
          {statusRight ?? (
            <>
              <span className={styles.statusItem}>
                {viewportTier === "desktop"
                  ? "Desktop"
                  : viewportTier === "tablet"
                    ? "Tablet"
                    : "Mobile"}{" "}
                view
              </span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
