"use client";

import { useCallback, useEffect, useId, useMemo, useState, type CSSProperties } from "react";
import { useDockingSystem, type PanelId } from "./useDockingSystem";
import { PanelContainer } from "./PanelContainer";
import { DockDropZones } from "./DockDropZones";
import { TopBar } from "./TopBar";
import { WorkspaceChromeProvider } from "./workspaceChromeContext";
import type { PlannerAccessContext } from "@/features/planner/lib/commands/plannerAccessContext";
import type { PlannerDisplayUnit } from "@/features/planner/model/types";
import type { PlannerSaveStatus } from "@/features/planner/persistence/usePlannerWorkspaceAutosave";
import type { PlannerPersistStorage } from "./workspaceStatusLabels";
import type { WorkspacePlanMetrics } from "./workspacePlanMetrics";
import styles from "@/app/css/core/locked/planner/workspace-shell.module.css";

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
  saveStatus?: PlannerSaveStatus;
  /** Pre-formatted honest status label (from plannerSaveStatusLabel / caller). */
  saveStatusLabel?: string;
  /** Where the last successful persist landed — pass-through for TopBar data attrs. */
  storage?: PlannerPersistStorage;
  /** When false, UI must not imply account/cloud save. Pass-through only. */
  cloudEnabled?: boolean;
  isOffline?: boolean;
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
  /** Called when the project name is edited inline. */
  onProjectNameChange?: (name: string) => void;
  onSave?: () => void;
  /** Called when export is triggered */
  onExport?: (format?: string) => void;
  /** Called when import is triggered */
  onImport?: () => void;
  onSketchToPlan?: () => void;
  /** Undo/redo controls for top bar */
  canUndo?: boolean;
  canRedo?: boolean;
  undoLabel?: string;
  redoLabel?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  /** Status bar left content */
  statusLeft?: React.ReactNode;
  /** Status bar right content */
  statusRight?: React.ReactNode;
  /** Display unit for measurements */
  displayUnit?: PlannerDisplayUnit;
  /** Called when display unit changes */
  onDisplayUnitChange?: (unit: PlannerDisplayUnit) => void;
  /** When true, shell fills parent height instead of viewport height */
  fillParent?: boolean;
  /** Density mode from workspace prefs (compact | touch) */
  density?: "compact" | "touch";
  /** Forward density toggle (wired from TopBar prefs per task5/GS REC-01) */
  onToggleDensity?: () => void;
  gridEnabled?: boolean;
  snapEnabled?: boolean;
  onToggleGrid?: () => void;
  onToggleSnap?: () => void;
  /** Flat plan metrics for status bar contract (E2E + operator glance) */
  planMetrics?: WorkspacePlanMetrics;
  /**
   * slim = mobile / modular density (More menu; no full chrome packs).
   * full = legacy packs + desktop Grid/Snap strip.
   * Mobile Modular path must pass slim so the top bar stays deliberate.
   */
  chromeMode?: "full" | "slim";
  /** In-workspace Help panel (static guides — not AI). */
  isHelpOpen?: boolean;
  onToggleHelp?: () => void;
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
  isOffline,
  leftPanel,
  rightPanel,
  bottomPanel,
  children,
  onProjectNameChange,
  onViewModeChange,
  onFloorChange,
  onSave,
  onExport,
  onImport,
  onSketchToPlan,
  canUndo,
  canRedo,
  undoLabel,
  redoLabel,
  onUndo,
  onRedo,
  statusLeft,
  statusRight,
  // Align with DEFAULT_PLANNER_WORKSPACE_PREFERENCES.units (display only; calc stays mm).
  displayUnit = "cm",
  onDisplayUnitChange,
  fillParent = false,
  density = "compact",
  onToggleDensity,
  // Panel ratio defaults leave ≥65% canvas (catalogue 0.17 + properties 0.17).
  gridEnabled = true,
  snapEnabled = true,
  onToggleGrid,
  onToggleSnap,
  planMetrics,
  chromeMode = "full",
  isHelpOpen = false,
  onToggleHelp,
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
    chrome,
    rail,
    presetId,
    activeDropEdge,
    dropActive,
    activePanel,
    viewportTier,
    dock,
    undock,
    toggleCollapse,
    move,
    setDropProbe,
    commitDrop,
    resize,
    saveLayout,
    applyPreset,
    reset,
    setChromePlacement,
    moveChromePack,
    setRailLayout,
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

  // Tab/Shift+Tab: native focus order only. Do not preventDefault Tab here —
  // a prior panel-cycle handler set focusedPanel without focusing the panel DOM
  // and trapped keyboard users inside inventory/properties chrome (WCAG 2.1.2).
  // focusedPanel still updates via PanelContainer onFocus/onBlur.

  // Auto-save layout on changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveLayout();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [panels, chrome, rail, presetId, saveLayout]);

  const chromeContextValue = useMemo(
    () => ({
      chrome,
      rail,
      presetId,
      applyPreset,
      setChromePlacement,
      moveChromePack,
      setRailLayout,
      resetLayout: reset,
    }),
    [
      chrome,
      rail,
      presetId,
      applyPreset,
      setChromePlacement,
      moveChromePack,
      setRailLayout,
      reset,
    ],
  );

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
    left: "Inventory",
    right: "Properties",
    bottom: "Layers",
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

  /** Toggle bottom Layers panel (collapsed by default; TopBar control for discoverability). */
  const handleBottomPanelToggle = useCallback(() => {
    toggleCollapse("bottom");
  }, [toggleCollapse]);

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
    ...(isOffline !== undefined ? { isOffline } : {}),
  };

  const bottomPanelOpen =
    Boolean(bottomPanel) &&
    panels.bottom.state !== "collapsed" &&
    !isCanvasMaximized;

  return (
    <WorkspaceChromeProvider value={chromeContextValue}>
    <div
      className={styles.shell}
      data-viewport={dataViewport}
      data-panel-active={activePanel}
      data-canvas-maximized={isCanvasMaximized}
      data-bottom-panel-open={bottomPanelOpen ? "true" : undefined}
      data-fill-parent={fillParent ? "true" : undefined}
      data-planner-density={density}
      data-planner-surface="studio"
      data-layout-preset={presetId}
      data-chrome-mode={chromeMode}
      /* Phone: shell grid is auto | minmax(0,1fr) | auto — workspace row grows canvas */
      data-phone-canvas-grow={viewportTier === "small" ? "true" : undefined}
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
        onProjectNameChange={onProjectNameChange}
        onSave={onSave}
        onExport={onExport}
        onImport={onImport}
        onSketchToPlan={onSketchToPlan}
        canUndo={canUndo}
        canRedo={canRedo}
        undoLabel={undoLabel}
        redoLabel={redoLabel}
        onUndo={onUndo}
        onRedo={onRedo}
        activePanel={(viewportTier === "small" && (activePanel === "left" || activePanel === "right")) ? activePanel : null}
        onToggleLeftPanel={leftPanel ? () => handleSidePanelToggle("left") : undefined}
        onToggleRightPanel={rightPanel ? () => handleSidePanelToggle("right") : undefined}
        isBottomPanelOpen={bottomPanelOpen}
        onToggleBottomPanel={bottomPanel ? handleBottomPanelToggle : undefined}
        isCanvasMaximized={isCanvasMaximized}
        onToggleCanvasMaximized={handleCanvasMaximizedToggle}
        density={density}
        onToggleDensity={onToggleDensity}
        gridEnabled={gridEnabled}
        snapEnabled={snapEnabled}
        onToggleGrid={onToggleGrid}
        onToggleSnap={onToggleSnap}
        layoutPresetId={presetId}
        onApplyLayoutPreset={applyPreset}
        onResetLayout={reset}
        chromeMode={chromeMode}
        isHelpOpen={isHelpOpen}
        onToggleHelp={onToggleHelp}
        {...topBarSaveStatusProps}
      />

      {/* Main workspace with panels */}
      <div
        className={`pw-workspace ${styles.workspace}`}
        data-viewport={dataViewport}
        data-bottom-panel-open={bottomPanelOpen ? "true" : undefined}
        style={
          bottomPanelOpen
            ? ({
                ["--ws-bottom-panel-h" as string]: `${panels.bottom.height}px`,
              } as CSSProperties)
            : undefined
        }
      >
        {/* small-screen .panelBackdrop + activePanel (from useDockingSystem) + mobile actions via TopBar.
         * Resolves PLAN-FAIL-0414. GS: design §7, benchmark BP-04/BP-05 + Figma minimize + anti-copy (no donor).
         * CSS locked in app/css/core/locked/planner/workspace-shell.module.css + planner-responsive.css. Canonical ref: editor/ + puck registry for admin UI.
         */}
        {viewportTier === "small" && (activePanel === "left" || activePanel === "right") && (
          <button
            type="button"
            className={styles.panelBackdrop}
            aria-label="Dismiss side panel"
            onClick={() => setActivePanel(null)}
          />
        )}

        {dropActive ? (
          <DockDropZones
            activeEdge={activeDropEdge}
            allowedEdges={["left", "right", "bottom"]}
          />
        ) : null}

        {/* Left panel - Library */}
        {leftPanel && (
          <PanelContainer
            id="left"
            title={panelTitles.left}
            contentOnly
            state={panels.left.state}
            dockEdge={panels.left.dockEdge}
            width={panels.left.width}
            /* Docked: PanelContainer uses height 100% CSS. Floating: docking sets ~400 on undock. */
            height={panels.left.height}
            x={panels.left.x}
            y={panels.left.y}
            zIndex={panels.left.zIndex}
            isOpen={resolvePanelOpen("left")}
            onUndock={(x, y) => undock("left", x, y)}
            onDock={() => dock("left")}
            onClose={() => handlePanelCollapse("left")}
            onMinimize={() => handlePanelCollapse("left")}
            onMove={(x, y) => move("left", x, y)}
            onResize={(w, h) => resize("left", w, h)}
            onDropProbe={setDropProbe}
            onDropCommit={(cx, cy) => commitDrop("left", cx, cy) !== null}
            onFocus={() => setFocusedPanel("left")}
            onBlur={() => setFocusedPanel(null)}
            responsiveOverlay={viewportTier === "small"}
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
            dockEdge={panels.right.dockEdge}
            width={panels.right.width}
            /* Docked: PanelContainer uses height 100% CSS. Floating: docking sets ~400 on undock. */
            height={panels.right.height}
            x={panels.right.x}
            y={panels.right.y}
            zIndex={panels.right.zIndex}
            isOpen={resolvePanelOpen("right")}
            onUndock={(x, y) => undock("right", x, y)}
            onDock={() => dock("right")}
            onClose={() => handlePanelCollapse("right")}
            onMinimize={() => handlePanelCollapse("right")}
            onMove={(x, y) => move("right", x, y)}
            onResize={(w, h) => resize("right", w, h)}
            onDropProbe={setDropProbe}
            onDropCommit={(cx, cy) => commitDrop("right", cx, cy) !== null}
            onFocus={() => setFocusedPanel("right")}
            onBlur={() => setFocusedPanel(null)}
            responsiveOverlay={viewportTier === "small"}
          >
            {rightPanel}
          </PanelContainer>
        )}

        {/* Bottom panel - Layers */}
        {bottomPanel && (
          <PanelContainer
            id="bottom"
            title={panelTitles.bottom}
            contentOnly
            state={panels.bottom.state}
            dockEdge={panels.bottom.dockEdge}
            width={0}
            height={panels.bottom.height}
            x={panels.bottom.x}
            y={panels.bottom.y}
            zIndex={panels.bottom.zIndex}
            isOpen={resolvePanelOpen("bottom")}
            onUndock={(x, y) => undock("bottom", x, y)}
            onDock={() => dock("bottom")}
            onClose={() => handlePanelCollapse("bottom")}
            onMinimize={() => handlePanelCollapse("bottom")}
            onMove={(x, y) => move("bottom", x, y)}
            onResize={(w, h) => resize("bottom", w, h)}
            onDropProbe={setDropProbe}
            onDropCommit={(cx, cy) => commitDrop("bottom", cx, cy) !== null}
            onFocus={() => setFocusedPanel("bottom")}
            onBlur={() => setFocusedPanel(null)}
          >
            {bottomPanel}
          </PanelContainer>
        )}
      </div>

      {/* Status bar — plan metrics + tool track only. Save lives solely in TopBar. */}
      <footer
        className={`${styles.status} pw-status-bar`}
        aria-label="Plan status"
        data-save-authority="topbar"
      >
        {planMetrics ? (
          <div
            className={styles.statusMetrics}
            data-testid="planner-status-metrics"
            data-guest-chrome={accessContext === "guest" ? "true" : undefined}
          >
            {/* Guest (mobile + legacy shell): quote-ready message only — skip dense object census. */}
            {accessContext !== "guest" ? (
              <span>
                {planMetrics.objects} objects
                {planMetrics.walls > 0 ? ` · ${planMetrics.walls} walls` : ""}
                {planMetrics.furniture > 0
                  ? ` · ${planMetrics.furniture} furniture`
                  : ""}
                {planMetrics.workstationSeats > 0
                  ? ` · ${planMetrics.workstationSeats} seats`
                  : ""}
              </span>
            ) : null}
            <span
              className={
                planMetrics.validationErrors > 0
                  ? styles.boqBlocked
                  : planMetrics.boqReady
                    ? styles.boqReady
                    : styles.boqNotReady
              }
              data-boq-ready={planMetrics.boqReady ? "true" : "false"}
              data-testid="planner-status-quote"
            >
              {planMetrics.validationErrors > 0
                ? `Quote blocked · ${planMetrics.validationErrors} error${planMetrics.validationErrors > 1 ? "s" : ""}`
                : planMetrics.boqReady
                  ? "Quote ready"
                  : "Add furniture for quote"}
            </span>
            {accessContext !== "guest" && planMetrics.floorLabel ? (
              <span className={styles.statusSecondaryMetric}>{planMetrics.floorLabel}</span>
            ) : null}
          </div>
        ) : null}
        {/* No fake "Canvas ready" / layout-tier defaults — parent supplies real tool track. */}
        <div className={styles.statusLeft}>{statusLeft ?? null}</div>
        <div className={styles.statusRight}>{statusRight ?? null}</div>
      </footer>
    </div>
    </WorkspaceChromeProvider>
  );
}
