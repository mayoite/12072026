"use client";

import { useCallback, useId, useMemo, useState, type ReactNode } from "react";

import type { PlannerAccessContext } from "@/features/planner/project/lib/commands/plannerAccessContext";
import type { PlannerDisplayUnit } from "@/features/planner/project/model/types";
import type { PlannerSaveStatus } from "@/features/planner/project/persistence/usePlannerWorkspaceAutosave";

import { CanvasToolRail } from "../CanvasToolRail";
import type { PlannerTool } from "../canvasTool";
import { TopBar } from "../TopBar";
import type { LayoutPresetId } from "../workspaceLayout";
import type { PlannerPersistStorage } from "../workspaceStatusLabels";
import type { WorkspacePlanMetrics } from "../workspacePlanMetrics";
import styles from "../workspace.module.css";
import { PlannerDockHost } from "./PlannerDockHost";
import {
  PLANNER_DOCKVIEW_STORAGE_KEY,
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
    try {
      localStorage.removeItem(PLANNER_DOCKVIEW_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setLayoutPresetId(preset);
    setLayoutEpoch((n) => n + 1);
  }, []);

  const resetLayout = useCallback(() => {
    applyPreset("default");
  }, [applyPreset]);

  const toolsNode = showTools ? (
    <CanvasToolRail
      activeTool={activeTool}
      onToolChange={onToolChange}
      onZoomReset={onZoomReset}
      dockManaged
    />
  ) : (
    <div className={styles.dockEmptyHint}>Tools available in 2D</div>
  );

  const slots: PlannerDockSlots = useMemo(
    () => ({
      canvas: children,
      inventory,
      properties: properties ?? (
        <div className={styles.dockEmptyHint}>Select an object for properties</div>
      ),
      layers: layers ?? (
        <div className={styles.dockEmptyHint}>No floor layers</div>
      ),
      tools: toolsNode,
    }),
    [children, inventory, properties, layers, toolsNode],
  );

  return (
    <div
      className={styles.shell}
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
        chromeMode="slim"
        {...topBarSaveStatusProps}
      />

      <div className={styles.modularWorkspace}>
        <PlannerDockHost
          slots={slots}
          layoutPresetId={layoutPresetId}
          layoutEpoch={layoutEpoch}
        />
      </div>

      <footer className={`${styles.status} pw-status-bar`} aria-label="Plan status">
        {planMetrics ? (
          <>
            <span>{planMetrics.objects} objects</span>
            <span>{planMetrics.walls} walls</span>
            <span>{planMetrics.furniture} furniture</span>
            {planMetrics.workstationSeats > 0 ? (
              <span>{planMetrics.workstationSeats} seats</span>
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
            >
              {planMetrics.validationErrors > 0
                ? `Quote blocked · ${planMetrics.validationErrors} error${planMetrics.validationErrors > 1 ? "s" : ""}`
                : planMetrics.boqReady
                  ? "Quote ready"
                  : "Add furniture for quote"}
            </span>
            <span>{planMetrics.floorLabel}</span>
          </>
        ) : null}
        <div className={styles.statusLeft}>{statusLeft}</div>
        <div className={styles.statusRight}>{statusRight}</div>
      </footer>
    </div>
  );
}
