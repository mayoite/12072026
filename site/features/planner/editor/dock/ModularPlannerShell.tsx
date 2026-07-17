"use client";

import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from "react";

import type { PlannerAccessContext } from "@/features/planner/project/lib/commands/plannerAccessContext";
import type { PlannerDisplayUnit } from "@/features/planner/project/model/types";
import type { PlannerSaveStatus } from "@/features/planner/project/persistence/usePlannerWorkspaceAutosave";
import { cn } from "@/lib/utils";

import { CanvasToolRail } from "../CanvasToolRail";
import type { PlannerTool } from "../canvasTool";
import { TopBar } from "../TopBar";
import type { LayoutPresetId } from "../workspaceLayout";
import type { PlannerPersistStorage } from "../workspaceStatusLabels";
import type { WorkspacePlanMetrics } from "../workspacePlanMetrics";
import { WorkspaceShell } from "../WorkspaceShell";
import { useIsMobile } from "../../hooks/useIsMobile";
import styles from "../workspace.module.css";
import { PlannerDockHost, type DockviewApi } from "./PlannerDockHost";
import {
  clearPersistedDockLayout,
  ensurePlannerDockPanel,
} from "./plannerDockPresets";
import type { PlannerDockSlots } from "./plannerDockSlots";

export interface ModularPlannerShellProps {
  accessContext?: PlannerAccessContext;
  projectName: string;
  viewMode?: "2d" | "3d";
  floors?: Array<{ id: string; name: string }>;
  activeFloorId?: string;
  isModified?: boolean;
  isLocalSaved?: boolean;
  isSynced?: boolean;
  saveStatus?: PlannerSaveStatus;
  saveStatusLabel?: string;
  storage?: PlannerPersistStorage;
  cloudEnabled?: boolean;
  inventory: ReactNode;
  properties: ReactNode;
  layers: ReactNode;
  /** Main plan stage (Fabric / 3D). Tools rail is separate. */
  children: ReactNode;
  activeTool: PlannerTool;
  onToolChange: (tool: PlannerTool) => void;
  onZoomReset?: () => void;
  onViewModeChange?: (mode: "2d" | "3d") => void;
  onFloorChange?: (floorId: string) => void;
  onProjectNameChange?: (name: string) => void;
  onSave?: () => void;
  onExport?: (format?: string) => void;
  onImport?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  undoLabel?: string;
  redoLabel?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  statusLeft?: ReactNode;
  statusRight?: ReactNode;
  displayUnit?: PlannerDisplayUnit;
  onDisplayUnitChange?: (unit: PlannerDisplayUnit) => void;
  fillParent?: boolean;
  density?: "compact" | "touch";
  onToggleDensity?: () => void;
  gridEnabled?: boolean;
  snapEnabled?: boolean;
  onToggleGrid?: () => void;
  onToggleSnap?: () => void;
  planMetrics?: WorkspacePlanMetrics;
  /** Hide tools dock when in 3D (tools are 2D Fabric). */
  showTools?: boolean;
}

/**
 * Slim TopBar + Dockview modular panels (dockview-react).
 * 2D/3D split elsewhere still uses react-resizable-panels.
 */
export function ModularPlannerShell({
  accessContext = "authenticated",
  projectName,
  viewMode = "2d",
  floors = [],
  activeFloorId,
  isModified = false,
  isLocalSaved,
  isSynced = false,
  saveStatus,
  saveStatusLabel,
  storage,
  cloudEnabled,
  inventory,
  properties,
  layers,
  children,
  activeTool,
  onToolChange,
  onZoomReset,
  onViewModeChange,
  onFloorChange,
  onProjectNameChange,
  onSave,
  onExport,
  onImport,
  canUndo,
  canRedo,
  undoLabel,
  redoLabel,
  onUndo,
  onRedo,
  statusLeft,
  statusRight,
  displayUnit = "cm",
  onDisplayUnitChange,
  fillParent = false,
  density = "compact",
  onToggleDensity,
  gridEnabled = true,
  snapEnabled = true,
  onToggleGrid,
  onToggleSnap,
  planMetrics,
  showTools = true,
}: ModularPlannerShellProps) {
  const id = useId();
  const isMobile = useIsMobile();
  const dockApiRef = useRef<DockviewApi | null>(null);
  const [layoutPresetId, setLayoutPresetId] = useState<LayoutPresetId | "custom">(
    "default",
  );
  const [layoutEpoch, setLayoutEpoch] = useState(0);

  const resolvedLocalSaved = isLocalSaved ?? isSynced;
  const topBarSaveStatusProps = {
    isSynced: resolvedLocalSaved,
    ...(saveStatus !== undefined ? { saveStatus } : {}),
    ...(saveStatusLabel !== undefined ? { saveStatusLabel } : {}),
    ...(storage !== undefined ? { saveStorage: storage } : {}),
    ...(cloudEnabled !== undefined ? { saveCloudEnabled: cloudEnabled } : {}),
  };

  const applyPreset = useCallback((preset: LayoutPresetId) => {
    clearPersistedDockLayout();
    setLayoutPresetId(preset);
    setLayoutEpoch((n) => n + 1);
  }, []);

  const resetLayout = useCallback(() => {
    applyPreset("default");
  }, [applyPreset]);

  const showDockPanel = useCallback(
    (panelId: "inventory" | "tools" | "properties" | "layers") => {
      const api = dockApiRef.current;
      if (!api) return;
      ensurePlannerDockPanel(api, panelId);
      setLayoutPresetId("custom");
    },
    [],
  );

  const handleDockApiReady = useCallback((api: DockviewApi) => {
    dockApiRef.current = api;
  }, []);

  const slots: PlannerDockSlots = useMemo(
    () => ({
      canvas: children,
      inventory,
      properties: properties ?? (
        <div className={styles.dockEmptyHint}>
          <strong>Nothing selected</strong>
          <span>Select a wall, opening, or catalog item to edit its dimensions and placement.</span>
        </div>
      ),
      layers: layers ?? (
        <div className={styles.dockEmptyHint}>
          <strong>No floor layers</strong>
          <span>Layers appear as plan elements are added.</span>
        </div>
      ),
      tools: showTools ? (
        <CanvasToolRail
          activeTool={activeTool}
          onToolChange={onToolChange}
          onZoomReset={onZoomReset}
          gridEnabled={gridEnabled}
          snapEnabled={snapEnabled}
          onToggleGrid={onToggleGrid}
          onToggleSnap={onToggleSnap}
          dockManaged
        />
      ) : (
        <div className={styles.dockEmptyHint}>
          <strong>2D tools paused</strong>
          <span>Switch to 2D to draw walls, place openings, and add inventory.</span>
        </div>
      ),
    }),
    [
      activeTool,
      children,
      inventory,
      layers,
      onToolChange,
      onZoomReset,
      properties,
      showTools,
      gridEnabled,
      snapEnabled,
      onToggleGrid,
      onToggleSnap,
    ],
  );

  if (isMobile) {
    return (
      <WorkspaceShell
        accessContext={accessContext}
        projectName={projectName}
        viewMode={viewMode}
        floors={floors}
        activeFloorId={activeFloorId}
        isModified={isModified}
        isLocalSaved={resolvedLocalSaved}
        saveStatus={saveStatus}
        saveStatusLabel={saveStatusLabel}
        storage={storage}
        cloudEnabled={cloudEnabled}
        leftPanel={slots.inventory}
        rightPanel={slots.properties}
        bottomPanel={slots.layers}
        onViewModeChange={onViewModeChange}
        onFloorChange={onFloorChange}
        onProjectNameChange={onProjectNameChange}
        onSave={onSave}
        onExport={onExport}
        onImport={onImport}
        canUndo={canUndo}
        canRedo={canRedo}
        undoLabel={undoLabel}
        redoLabel={redoLabel}
        onUndo={onUndo}
        onRedo={onRedo}
        statusLeft={statusLeft}
        statusRight={statusRight}
        displayUnit={displayUnit}
        onDisplayUnitChange={onDisplayUnitChange}
        fillParent={fillParent}
        density={density}
        onToggleDensity={onToggleDensity}
        gridEnabled={gridEnabled}
        snapEnabled={snapEnabled}
        onToggleGrid={onToggleGrid}
        onToggleSnap={onToggleSnap}
        planMetrics={planMetrics}
      >
        <div className={styles.mobileCanvasStack}>
          <div className={styles.mobileCanvasStage}>{children}</div>
          {showTools ? (
            <CanvasToolRail
              activeTool={activeTool}
              onToolChange={onToolChange}
              onZoomReset={onZoomReset}
              gridEnabled={gridEnabled}
              snapEnabled={snapEnabled}
              onToggleGrid={onToggleGrid}
              onToggleSnap={onToggleSnap}
              dockManaged
            />
          ) : (
            <div className={styles.mobileToolsUnavailable}>
              Switch to 2D to use drawing tools
            </div>
          )}
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <div
      className={cn(
        styles.shell,
        /* TW4 utilities own the height grid; module keeps chrome tokens/colors */
        fillParent ? "planner-shell-fill" : "planner-shell",
      )}
      data-fill-parent={fillParent ? "true" : undefined}
      data-planner-density={density}
      data-modular-dock="true"
      id={`modular-shell-${id.replace(/:/g, "")}`}
    >
      <TopBar
        accessContext={accessContext}
        projectName={projectName}
        isModified={isModified}
        viewMode={viewMode}
        floors={floors}
        activeFloorId={activeFloorId}
        displayUnit={displayUnit}
        onDisplayUnitChange={onDisplayUnitChange}
        onViewModeChange={onViewModeChange}
        onFloorChange={onFloorChange}
        onProjectNameChange={onProjectNameChange}
        onSave={onSave}
        onExport={onExport}
        onImport={onImport}
        canUndo={canUndo}
        canRedo={canRedo}
        undoLabel={undoLabel}
        redoLabel={redoLabel}
        onUndo={onUndo}
        onRedo={onRedo}
        density={density}
        onToggleDensity={onToggleDensity}
        gridEnabled={gridEnabled}
        snapEnabled={snapEnabled}
        onToggleGrid={onToggleGrid}
        onToggleSnap={onToggleSnap}
        layoutPresetId={layoutPresetId}
        onApplyLayoutPreset={applyPreset}
        onResetLayout={resetLayout}
        onShowDockPanel={showDockPanel}
        chromeMode="slim"
        {...topBarSaveStatusProps}
      />

      <div className={cn(styles.modularWorkspace, "planner-shell-main")}>
        <PlannerDockHost
          slots={slots}
          layoutPresetId={layoutPresetId}
          layoutEpoch={layoutEpoch}
          onApiReady={handleDockApiReady}
        />
      </div>

      <footer className={cn(styles.status, "pw-status-bar")} aria-label="Plan status">
        {planMetrics ? (
          <div className={styles.statusMetrics} data-testid="planner-status-metrics">
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
            <span
              className={
                planMetrics.validationErrors > 0
                  ? styles.boqBlocked
                  : planMetrics.boqReady
                    ? styles.boqReady
                    : styles.boqNotReady
              }
              data-boq-ready={planMetrics.boqReady ? "true" : "false"}
            >
              {planMetrics.validationErrors > 0
                ? `Quote blocked · ${planMetrics.validationErrors} error${planMetrics.validationErrors > 1 ? "s" : ""}`
                : planMetrics.boqReady
                  ? "Quote ready"
                  : "Add furniture for quote"}
            </span>
          </div>
        ) : null}
        <div className={styles.statusLeft}>{statusLeft}</div>
        <div className={styles.statusRight}>{statusRight}</div>
      </footer>
    </div>
  );
}
