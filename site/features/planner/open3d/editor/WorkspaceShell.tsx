"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { useDockingSystem, type PanelId } from "./useDockingSystem";
import { PanelContainer } from "./PanelContainer";
import { TopBar } from "./TopBar";
import type { PlannerAccessContext } from "../lib/commands/plannerAccessContext";
import type { Open3dDisplayUnit } from "../model/types";
import type { Open3dSaveStatus } from "../persistence/useOpen3dWorkspaceAutosave";
import type { Open3dPersistStorage } from "./workspaceStatusLabels";
import type { WorkspacePlanMetrics } from "./workspacePlanMetrics";
import styles from "./workspace.module.css";

export interface WorkspaceShellProps {
  /** Planner access context — guests must not see persist/import/export actions */
  accessContext?: PlannerAccessContext;
  /** Project name to display in header */
  projectName: string;
  /** Initial view mode */
  initialViewMode?: "2d" | "3d";
  /** Controlled view mode (when set, overrides internal state) */
  viewMode?: "2d" | "3d";
  /** Floor list for floor selector */
  floors?: Array<{ id: string; name: string }>;
  /** Currently active floor ID */
  activeFloorId?: string;
  /** Whether project has unsaved changes */
  isModified?: boolean;
  /** Whether latest snapshot is persisted to local IDB (not cloud unless cloudEnabled). */
  isLocalSaved?: boolean;
  /**
   * @deprecated use isLocalSaved — whether latest snapshot is persisted
   * (local IDB until cloud is wired)
   */
  isSynced?: boolean;
  /**
   * Autosave state machine — pass-through to TopBar only.
   * Label copy is owned by the caller via saveStatusLabel (no dual table here).
   */
  saveStatus?: Open3dSaveStatus;
  /** Pre-formatted honest status label (from open3dSaveStatusLabel / caller). */
  saveStatusLabel?: string;
  /** Where the last successful persist landed — pass-through for TopBar data attrs. */
  storage?: Open3dPersistStorage;
  /** When false, UI must not imply account/cloud save. Pass-through only. */
  cloudEnabled?: boolean;
  /** Left panel content */
  leftPanel?: React.ReactNode;
  /** Right panel content */
  rightPanel?: React.ReactNode;
  /** Bottom panel content */
  bottomPanel?: React.ReactNode;
  /** Main canvas/content area */
  children: React.ReactNode;
  /** Called when view mode changes */
  onViewModeChange?: (mode: "2d" | "3d") => void;
  /** Called when floor selection changes */
  onFloorChange?: (floorId: string) => void;
  /** Called when save is triggered */
  onSave?: () => void;
  /** Called when export is triggered */
  onExport?: (format?: string) => void;
  /** Called when import is triggered */
  onImport?: () => void;
  /** Undo/redo controls for top bar */
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  /** Status bar left content */
  statusLeft?: React.ReactNode;
  /** Status bar right content */
  statusRight?: React.ReactNode;
  /** Display unit for measurements */
  displayUnit?: Open3dDisplayUnit;
  /** Called when display unit changes */
  onDisplayUnitChange?: (unit: Open3dDisplayUnit) => void;
  /** When true, shell fills parent height instead of viewport height */
  fillParent?: boolean;
  /** Density mode from workspace prefs (compact | touch) */
  density?: "compact" | "touch";
  /** Forward density toggle (wired from TopBar prefs per task5/GS REC-01) */
  onToggleDensity?: () => void;
  /** Flat plan metrics for status bar contract (E2E + operator glance) */
  planMetrics?: WorkspacePlanMetrics;
}

export function WorkspaceShell({
  accessContext = "authenticated",
  projectName,
  initialViewMode = "2d",
  viewMode: controlledViewMode,
  floors = [],
  activeFloorId,
  isModified = false,
  isLocalSaved,
  isSynced = false,
  saveStatus,
  saveStatusLabel,
  storage,
  cloudEnabled,
  leftPanel,
  rightPanel,
  bottomPanel,
  children,
  onViewModeChange,
  onFloorChange,
  onSave,
  onExport,
  onImport,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  statusLeft,
  statusRight,
  displayUnit = "cm",
  onDisplayUnitChange,
  fillParent = false,
  density = "compact",
  onToggleDensity,
  planMetrics,
}: WorkspaceShellProps) {
  const id = useId();
  const [internalViewMode, setInternalViewMode] = useState<"2d" | "3d">(initialViewMode);
  const [isCanvasMaximized, setIsCanvasMaximized] = useState(false);
  // P0.3 / A3: omit data-viewport until after mount so SSR HTML matches first client paint
  // (tier is also SSR-stable in useDockingSystem; attribute is deferred as belt-and-suspenders).
  const [viewportAttrReady, setViewportAttrReady] = useState(false);
  const viewMode = controlledViewMode ?? internalViewMode;

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
    setActivePanel,
    setFocusedPanel,
  } = useDockingSystem();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setViewportAttrReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (mode: "2d" | "3d") => {
      if (controlledViewMode === undefined) {
        setInternalViewMode(mode);
      }
      onViewModeChange?.(mode);
    },
    [controlledViewMode, onViewModeChange],
  );

  // Handle panel collapse (covers both close and minimize; small viewport special-case + active reset + toggle)
  const handlePanelCollapse = useCallback(
    (id: PanelId) => {
      if (viewportTier === "small" && (id === "left" || id === "right")) {
        setActivePanel(null);
        return;
      }
      if (activePanel === id) {
        setActivePanel(null);
      }
      toggleCollapse(id);
    },
    [activePanel, setActivePanel, toggleCollapse, viewportTier],
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
    if (viewportTier !== "small" && activePanel !== null) {
      setActivePanel(null);
    }
  }, [activePanel, setActivePanel, viewportTier]);

  useEffect(() => {
    if (activePanel && panels[activePanel].state === "collapsed") {
      setActivePanel(null);
    }
  }, [activePanel, panels, setActivePanel]);

  const panelTitles: Record<PanelId, string> = {
    left: "Library",
    right: "Properties",
    bottom: "Output",
  };

  const handleSidePanelToggle = useCallback(
    (id: Extract<PanelId, "left" | "right">) => {
      if (panels[id].state === "collapsed") {
        toggleCollapse(id);
      }
      setActivePanel((current) => (current === id ? null : id));
    },
    [panels, setActivePanel, toggleCollapse],
  );

  const resolvePanelOpen = useCallback(
    (id: PanelId) => {
      if (isCanvasMaximized) {
        return false;
      }
      if (panels[id].state === "collapsed") {
        return false;
      }
      if (viewportTier !== "small" || id === "bottom") {
        return true;
      }
      return activePanel === id;
    },
    [activePanel, isCanvasMaximized, panels, viewportTier],
  );

  const handleCanvasMaximizedToggle = useCallback(() => {
    setActivePanel(null);
    setIsCanvasMaximized((current) => !current);
  }, [setActivePanel]);

  // Undefined until mount → attribute absent on SSR + hydrate; real tier after measure.
  const dataViewport = viewportAttrReady ? viewportTier : undefined;

  // Prefer isLocalSaved; fall back to legacy isSynced. No label table — labels come from caller.
  const resolvedLocalSaved = isLocalSaved ?? isSynced;

  // Map shell names → TopBar contract (saveStorage / saveCloudEnabled).
  const topBarSaveStatusProps = {
    isSynced: resolvedLocalSaved,
    ...(saveStatus !== undefined ? { saveStatus } : {}),
    ...(saveStatusLabel !== undefined ? { saveStatusLabel } : {}),
    ...(storage !== undefined ? { saveStorage: storage } : {}),
    ...(cloudEnabled !== undefined ? { saveCloudEnabled: cloudEnabled } : {}),
  };

  return (
    <div
      className={styles.shell}
      data-viewport={dataViewport}
      data-panel-active={activePanel}
      data-canvas-maximized={isCanvasMaximized}
      data-fill-parent={fillParent ? "true" : undefined}
      data-planner-density={density}
      id={`workspace-shell-${id.replace(/:/g, "")}`}
    >
      {/* Top bar */}
      <TopBar
        accessContext={accessContext}
        projectName={projectName}
        isModified={isModified}
        viewMode={viewMode}
        floors={floors}
        activeFloorId={activeFloorId}
        displayUnit={displayUnit}
        onDisplayUnitChange={onDisplayUnitChange}
        onViewModeChange={handleViewModeChange}
        onFloorChange={onFloorChange}
        onSave={onSave}
        onExport={onExport}
        onImport={onImport}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        activePanel={(viewportTier === "small" && (activePanel === "left" || activePanel === "right")) ? activePanel : null}
        onToggleLeftPanel={leftPanel ? () => handleSidePanelToggle("left") : undefined}
        onToggleRightPanel={rightPanel ? () => handleSidePanelToggle("right") : undefined}
        isCanvasMaximized={isCanvasMaximized}
        onToggleCanvasMaximized={handleCanvasMaximizedToggle}
        density={density}
        onToggleDensity={onToggleDensity}
        {...topBarSaveStatusProps}
      />

      {/* Main workspace with panels */}
      <div className={styles.workspace} data-viewport={dataViewport}>
        {/* small-screen .panelBackdrop + activePanel (from useDockingSystem) + mobile actions via TopBar.
         * Resolves PLAN-FAIL-0414. GS: design §7, benchmark BP-04/BP-05 + Figma minimize + anti-copy (no donor).
         * CSS locked in workspace.module.css + planner-responsive.css. Canonical ref: open3d/editor/ + puck registry for admin UI.
         */}
        {viewportTier === "small" && (activePanel === "left" || activePanel === "right") && (
          <button
            type="button"
            className={styles.panelBackdrop}
            aria-label="Dismiss side panel"
            onClick={() => setActivePanel(null)}
          />
        )}

        {/* Left panel - Inventory */}
        {leftPanel && (
          <PanelContainer
            id="left"
            title={panelTitles.left}
            contentOnly
            state={panels.left.state}
            width={panels.left.width}
            height={0}
            x={panels.left.x}
            y={panels.left.y}
            zIndex={panels.left.zIndex}
            isOpen={resolvePanelOpen("left")}
            onUndock={() => undock("left")}
            onDock={() => dock("left")}
            onClose={() => handlePanelCollapse("left")}
            onMinimize={() => handlePanelCollapse("left")}
            onMove={(x, y) => move("left", x, y)}
            onResize={(w, h) => resize("left", w, h)}
            onFocus={() => setFocusedPanel("left")}
            onBlur={() => setFocusedPanel(null)}
          >
            {leftPanel}
          </PanelContainer>
        )}

        {/* Canvas area (not a landmark — page layout owns the single main) */}
        <div className={styles.canvas} id={`${id.replace(/:/g, "")}-canvas`}>
          {children}
        </div>

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
            isOpen={resolvePanelOpen("right")}
            onUndock={() => undock("right")}
            onDock={() => dock("right")}
            onClose={() => handlePanelCollapse("right")}
            onMinimize={() => handlePanelCollapse("right")}
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
            isOpen={resolvePanelOpen("bottom")}
            onUndock={() => undock("bottom")}
            onDock={() => dock("bottom")}
            onClose={() => handlePanelCollapse("bottom")}
            onMinimize={() => handlePanelCollapse("bottom")}
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
      <footer className={`${styles.status} pw-status-bar`}>
        {planMetrics ? (
          <>
            <span>{planMetrics.objects} objects</span>
            <span>{planMetrics.walls} walls</span>
            <span>{planMetrics.furniture} furniture</span>
            {planMetrics.workstationSeats > 0 ? (
              <span>{planMetrics.workstationSeats} seats</span>
            ) : null}
            <span>Floor {planMetrics.floorLabel}</span>
          </>
        ) : null}
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
