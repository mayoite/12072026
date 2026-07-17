"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

import type { PlannerAccessContext } from "@/features/planner/lib/commands/plannerAccessContext";
import type { PlannerDisplayUnit, PlannerFloor } from "@/features/planner/model/types";
import type { PlannerSaveStatus } from "@/features/planner/persistence/usePlannerWorkspaceAutosave";
import { usePlannerWorkspaceStore } from "@/features/planner/cloud-store/workspaceStore";
import { cn } from "@/lib/utils";

import { PlannerHelpPanel } from "@/features/planner/help/PlannerHelpPanel";

import { CanvasToolRail } from "../CanvasToolRail";
import type { PlannerTool } from "../canvasTool";
import { LayersPanel } from "../LayersPanel";
import type { PlannerLayerVisibility } from "../layerVisibility";
import type { PlannerStep } from "../plannerStep";
import { PlannerWorkflowBar } from "../PlannerWorkflowBar";
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
  closePlannerDockPanel,
  ensurePlannerDockPanel,
} from "./plannerDockPresets";
import type { PlannerDockSlots } from "./plannerDockSlots";

function isEditableHelpTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable ||
    Boolean(
      target.closest(
        "input, textarea, select, [contenteditable='true'], [role='textbox'], [role='searchbox'], [role='combobox']",
      ),
    )
  );
}

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
  isOffline?: boolean;
  inventory: ReactNode;
  /** Optional assistant. It is an overlay action, not a dock panel. */
  assistant?: ReactNode;
  /** Step-three validation and commercial handoff. It reuses the properties dock slot. */
  review?: ReactNode;
  properties: ReactNode;
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
  onSketchToPlan?: () => void;
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
  orthogonalLock?: boolean;
  onToggleGrid?: () => void;
  onToggleSnap?: () => void;
  onToggleOrthogonal?: () => void;
  planMetrics?: WorkspacePlanMetrics;
  /** Hide tools dock when in 3D (tools are 2D Fabric). */
  showTools?: boolean;
  /** When true, ensure the properties dock is visible. */
  hasSelection?: boolean;
  /** Active floor for the Layers panel (optional until wired). */
  layersFloor?: PlannerFloor | null;
  layerVisibility?: PlannerLayerVisibility;
  onLayerVisibilityChange?: (next: PlannerLayerVisibility) => void;
}

const STEP_PRESET: Record<PlannerStep, LayoutPresetId> = {
  draw: "default",
  place: "catalog",
  review: "review",
};

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
  isOffline,
  inventory,
  assistant,
  review,
  properties,
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
  onSketchToPlan,
  canUndo,
  canRedo,
  undoLabel,
  redoLabel,
  onUndo,
  onRedo,
  statusLeft,
  statusRight,
  displayUnit = "mm",
  onDisplayUnitChange,
  fillParent = false,
  density = "compact",
  onToggleDensity,
  gridEnabled = true,
  snapEnabled = true,
  orthogonalLock = false,
  onToggleGrid,
  onToggleSnap,
  onToggleOrthogonal,
  planMetrics,
  showTools = true,
  hasSelection = false,
  layersFloor = null,
  layerVisibility,
  onLayerVisibilityChange,
}: ModularPlannerShellProps) {
  const id = useId();
  const isMobile = useIsMobile();
  const dockApiRef = useRef<DockviewApi | null>(null);
  // Seed canvas-first dock once via initializers (no setState-in-effect).
  const [layoutPresetId, setLayoutPresetId] = useState<LayoutPresetId | "custom">(
    () => {
      clearPersistedDockLayout();
      return STEP_PRESET.draw;
    },
  );
  const [layoutEpoch, setLayoutEpoch] = useState(0);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const plannerStep = usePlannerWorkspaceStore((state) => state.plannerStep);
  const setPlannerStep = usePlannerWorkspaceStore((state) => state.setPlannerStep);

  const openHelp = useCallback(() => {
    setAssistantOpen(false);
    setHelpOpen(true);
  }, []);

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
  }, []);

  const toggleHelp = useCallback(() => {
    setHelpOpen((open) => {
      if (open) return false;
      setAssistantOpen(false);
      return true;
    });
  }, []);

  const openAssistant = useCallback(() => {
    setHelpOpen(false);
    setAssistantOpen(true);
  }, []);

  // F1 / ? open Help; Escape closes Help or AI overlay first (capture so canvas cancel waits).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (helpOpen || assistantOpen)) {
        event.preventDefault();
        event.stopPropagation();
        setHelpOpen(false);
        setAssistantOpen(false);
        return;
      }

      if (isEditableHelpTarget(event.target)) return;

      if (event.key === "F1") {
        event.preventDefault();
        openHelp();
        return;
      }

      // "?" key — static help, not AI
      if (event.key === "?" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        openHelp();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [assistantOpen, helpOpen, openHelp]);

  const helpOverlay =
    helpOpen ? (
      <aside
        className={styles.assistantOverlay}
        aria-label="Help panel"
        data-testid="planner-help-overlay"
        role="dialog"
        aria-modal="false"
        aria-labelledby="planner-help-heading"
      >
        <button
          type="button"
          className={styles.assistantClose}
          onClick={closeHelp}
          data-testid="planner-help-overlay-close"
        >
          Close help
        </button>
        <PlannerHelpPanel accessContext={accessContext} onClose={closeHelp} />
      </aside>
    ) : null;

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
    applyPreset(STEP_PRESET[plannerStep]);
  }, [applyPreset, plannerStep]);

  const changePlannerStep = useCallback(
    (step: PlannerStep) => {
      setPlannerStep(step);
      applyPreset(STEP_PRESET[step]);
      if (step === "draw") onToolChange("wall");
      if (step !== "draw") onToolChange("select");
    },
    [applyPreset, onToolChange, setPlannerStep],
  );

  const showDockPanel = useCallback(
    (panelId: "inventory" | "tools" | "properties") => {
      const api = dockApiRef.current;
      if (!api) return;
      ensurePlannerDockPanel(api, panelId);
      setLayoutPresetId("custom");
    },
    [],
  );

  // Open properties on selection; collapse when empty so the panel does not eat canvas (PF-21).
  // Review step always keeps the right dock for BOQ / validation.
  useEffect(() => {
    if (isMobile) return;
    const api = dockApiRef.current;
    if (plannerStep === "review") {
      showDockPanel("properties");
      return;
    }
    if (hasSelection) {
      showDockPanel("properties");
      return;
    }
    if (api) {
      closePlannerDockPanel(api, "properties");
    }
  }, [hasSelection, isMobile, plannerStep, showDockPanel]);

  const handleDockApiReady = useCallback((api: DockviewApi) => {
    dockApiRef.current = api;
    // Apply selection/review visibility once dock mounts.
    if (plannerStep === "review" || hasSelection) {
      ensurePlannerDockPanel(api, "properties");
    } else {
      closePlannerDockPanel(api, "properties");
    }
  }, [hasSelection, plannerStep]);

  const slots: PlannerDockSlots = useMemo(
    () => ({
      canvas: <div className={styles.planCanvasInset}>{children}</div>,
      inventory,
      properties:
        plannerStep === "review"
          ? (review ?? (
              <div className={styles.dockEmptyHint}>
                <strong>Review</strong>
                <span>Validation and quote actions appear when the plan is ready.</span>
              </div>
            ))
          : (properties ?? (
              <div className={styles.dockEmptyHint}>
                <strong>Nothing selected</strong>
                <span>
                  Select a wall, opening, or catalog item to edit its dimensions
                  and placement.
                </span>
              </div>
            )),
      tools: showTools ? (
        <div className={styles.dockEmptyHint}>
          <strong>Tools live on the plan</strong>
          <span>Drawing tools sit on the left rail. Open Inventory or Properties from the top bar when needed.</span>
        </div>
      ) : (
        <div className={styles.dockEmptyHint}>
          <strong>2D tools paused</strong>
          <span>Switch to 2D to draw walls, place openings, and add inventory.</span>
        </div>
      ),
    }),
    [
      children,
      inventory,
      plannerStep,
      properties,
      review,
      showTools,
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
        isOffline={isOffline}
        leftPanel={slots.inventory}
        rightPanel={slots.properties}
        onViewModeChange={onViewModeChange}
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
        chromeMode="slim"
        isHelpOpen={helpOpen}
        onToggleHelp={toggleHelp}
      >
        <div
          className={styles.mobileCanvasStack}
          data-mobile-shell="true"
          data-testid="planner-mobile-shell"
        >
          <PlannerWorkflowBar
            currentStep={plannerStep}
            onStepChange={changePlannerStep}
            onOpenAssistant={assistant ? openAssistant : undefined}
            planMetrics={planMetrics}
            accessContext={accessContext}
          />
          <div
            className={styles.mobileCanvasStage}
            data-mobile-chrome="canvas"
            data-testid="planner-mobile-canvas"
          >
            {children}
            {helpOverlay}
            {assistantOpen && assistant ? (
              <aside className={styles.assistantOverlay} aria-label="AI assistant panel">
                <button
                  type="button"
                  className={styles.assistantClose}
                  onClick={() => setAssistantOpen(false)}
                >
                  Close AI assist
                </button>
                {assistant}
              </aside>
            ) : null}
          </div>
          {showTools ? (
            <div
              className={styles.mobileBottomChrome}
              data-mobile-chrome="bottom"
              data-testid="planner-mobile-bottom-chrome"
              role="region"
              aria-label="Canvas tools"
            >
              <CanvasToolRail
                activeTool={activeTool}
                onToolChange={onToolChange}
                onZoomReset={onZoomReset}
                gridEnabled={gridEnabled}
                snapEnabled={snapEnabled}
                orthogonalLock={orthogonalLock}
                onToggleGrid={onToggleGrid}
                onToggleSnap={onToggleSnap}
                onToggleOrthogonal={onToggleOrthogonal}
                dockManaged
              />
            </div>
          ) : (
            <div
              className={styles.mobileToolsUnavailable}
              data-mobile-chrome="bottom"
              data-testid="planner-mobile-bottom-chrome"
            >
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
      data-planner-surface="paper"
      data-modular-dock="true"
      data-chrome-mode="slim"
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
        onSketchToPlan={onSketchToPlan}
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
        isOffline={isOffline}
        isBottomPanelOpen={layersOpen}
        onToggleBottomPanel={
          layersFloor && layerVisibility && onLayerVisibilityChange
            ? () => setLayersOpen((open) => !open)
            : undefined
        }
        isHelpOpen={helpOpen}
        onToggleHelp={toggleHelp}
        {...topBarSaveStatusProps}
      />

      <div className={cn(styles.modularWorkspace, "planner-shell-main")}>
        <PlannerWorkflowBar
          currentStep={plannerStep}
          onStepChange={changePlannerStep}
          onOpenAssistant={assistant ? openAssistant : undefined}
          planMetrics={planMetrics}
          accessContext={accessContext}
        />
        <div className={styles.dockWithRail} data-testid="planner-canvas-stage">
          {showTools ? (
            <CanvasToolRail
              activeTool={activeTool}
              onToolChange={onToolChange}
              onZoomReset={onZoomReset}
              gridEnabled={gridEnabled}
              snapEnabled={snapEnabled}
              orthogonalLock={orthogonalLock}
              onToggleGrid={onToggleGrid}
              onToggleSnap={onToggleSnap}
              onToggleOrthogonal={onToggleOrthogonal}
              pinned
            />
          ) : null}
          <div className={styles.dockStage}>
            <PlannerDockHost
              slots={slots}
              layoutPresetId={layoutPresetId}
              layoutEpoch={layoutEpoch}
              onApiReady={handleDockApiReady}
            />
            {layersOpen && layersFloor && layerVisibility && onLayerVisibilityChange ? (
              <aside className={styles.layersOverlay} aria-label="Layers">
                <LayersPanel
                  floor={layersFloor}
                  visibility={layerVisibility}
                  onVisibilityChange={onLayerVisibilityChange}
                />
              </aside>
            ) : null}
            {helpOverlay}
            {assistantOpen && assistant ? (
              <aside className={styles.assistantOverlay} aria-label="AI assistant panel">
                <button
                  type="button"
                  className={styles.assistantClose}
                  onClick={() => setAssistantOpen(false)}
                >
                  Close AI assist
                </button>
                {assistant}
              </aside>
            ) : null}
          </div>
        </div>
      </div>

      <footer className={cn(styles.status, "pw-status-bar")} aria-label="Plan status">
        {planMetrics ? (
          <div
            className={styles.statusMetrics}
            data-testid="planner-status-metrics"
            data-guest-chrome={accessContext === "guest" ? "true" : undefined}
          >
            {/* Guest: quote-ready message only — skip dense object census. */}
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
          </div>
        ) : null}
        <div className={styles.statusLeft}>{statusLeft}</div>
        <div className={styles.statusRight}>{statusRight}</div>
      </footer>
    </div>
  );
}
