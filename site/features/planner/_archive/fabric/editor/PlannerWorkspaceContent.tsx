/**
 * PlannerWorkspaceContent — orchestrates planner editor hooks and layout chrome.
 *
 * Fabric/session/sketch/canvas seams live in dedicated hooks and bridge modules.
 */

"use client";

import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SidebarSimple as PanelRightClose } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { usePlannerStore } from "@/features/planner/store/plannerStore";
import { PlannerSkeleton } from "@/features/planner/ui/PlannerSkeleton";
import { queueQuickStarterLayout } from "@/features/planner/ai/quickStarterLayout";
import { PlannerMobileDock } from "@/features/planner/editor/PlannerMobileDock";
import { PlannerToolRail, TOOL_GROUPS } from "@/features/planner/editor/PlannerToolRail";
import { plannerToolToToolId } from "@/features/planner/editor/plannerToolFabricBridge";
import { PlannerLeftPanel } from "@/features/planner/editor/PlannerLeftPanel";
import { PlannerTopBar } from "@/features/planner/editor/PlannerTopBar";
import { PlannerSubTopBar } from "@/features/planner/editor/PlannerSubTopBar";
import { PlannerSketchRecoveryPanel } from "@/features/planner/editor/PlannerSketchRecoveryPanel";
import { usePlannerPanels } from "@/features/planner/editor/usePlannerPanels";
import { PlannerChromeHost } from "@/features/planner/editor/chrome/PlannerChromeHost";
import { usePlannerCatalogStore } from "@/features/planner/catalog/catalogStore";
import { usePlannerCatalogHydration } from "@/features/planner/catalog/usePlannerCatalogHydration";
import { CatalogDropFlash } from "@/features/planner/catalog/CatalogDropFlash";
import { CatalogDropGhost } from "@/features/planner/catalog/CatalogDropGhost";
import { PlannerWorkspaceLayout } from "@/features/planner/editor/PlannerWorkspaceLayout";
import { PlannerErrorBoundary } from "@/features/planner/editor/PlannerErrorBoundary";
import { PlannerCanvasStage } from "@/features/planner/editor/PlannerCanvasStage";
import { useTheme } from "@/features/planner/components/WorkspaceThemeProvider";
import {
  useFabricPlanMetrics,
  useFabricSelectionStatus,
} from "@/features/planner/hooks/useFabricPlannerState";
import { usePlannerWorkspaceStore } from "@/features/planner/store/workspaceStore";
import { useIsMobile } from "@/features/planner/hooks/useIsMobile";
import { useKeyboardShortcuts } from "@/features/planner/hooks/useKeyboardShortcuts";
import { PlannerStatusBar } from "@/features/planner/editor/PlannerStatusBar";
import { BottomSheet } from "@/features/planner/ui/BottomSheet";
import { Tooltip } from "@/features/planner/ui/Tooltip";
import { TemplatePickerModal } from "@/features/planner/editor/templates/TemplatePickerModal";
import { ExportModal } from "@/features/planner/editor/ExportModal";
import { getStepLeftTab, type PlannerLeftTab } from "@/features/planner/editor/plannerStepBindings";
import {
  evaluatePlannerStepGates,
  getDisabledPlannerSteps,
} from "@/features/planner/editor/plannerStep";
import { plannerUnitSystemToMeasurementUnit } from "@/features/planner/lib/measurements";
import { buildPlannerDocumentFromEditor } from "@/features/planner/document/plannerDocumentBridge";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { useFloorplan } from "@/features/planner/canvas-fabric";
import { buildSnapStatusLabel } from "@/features/planner/lib/snapStatusLabel";
import { sanitizePlannerPlanName } from "@/features/planner/lib/sessionState";
import { usePlannerSessionHandlers } from "@/features/planner/editor/usePlannerSessionHandlers";
import {
  usePlannerSketchRecovery,
  usePlannerWorkspaceUiState,
} from "@/features/planner/editor/plannerWorkspaceHooks";
import { Fabric2DWith3DSync } from "@/features/planner/editor/plannerWorkspaceFabricBridge";
import {
  usePlannerShellVisible,
  usePlannerWorkspacePreferences,
} from "@/features/planner/editor/usePlannerWorkspacePreferences";
import { usePlannerCatalogPlacement } from "@/features/planner/editor/usePlannerCatalogPlacement";
import { usePlannerCatalogDragDrop } from "@/features/planner/editor/usePlannerCatalogDragDrop";
import { usePlannerFabricDraft } from "@/features/planner/editor/usePlannerFabricDraft";
import { usePlannerWorkspaceTooling } from "@/features/planner/editor/usePlannerWorkspaceTooling";
import {
  usePlannerSelectionPanel,
  usePlannerWorkspaceBootstrap,
} from "@/features/planner/editor/usePlannerWorkspaceBootstrap";

const Planner3DViewer = dynamic(
  () => import("@/features/planner/3d/Planner3DViewer").then((m) => ({ default: m.Planner3DViewer })),
  { ssr: false },
);
const PropertiesInspector = dynamic(
  () => import("@/features/planner/editor/inspector/PropertiesInspector").then((m) => ({ default: m.PropertiesInspector })),
  { ssr: false, loading: () => null },
);
const LayerVisibilityPanel = dynamic(
  () => import("@/features/planner/editor/LayerVisibilityPanel").then((m) => ({ default: m.LayerVisibilityPanel })),
  { ssr: false, loading: () => null },
);
const LayerManagerPanel = dynamic(
  () => import("@/features/planner/editor/LayerManagerPanel").then((m) => ({ default: m.LayerManagerPanel })),
  { ssr: false, loading: () => null },
);
const PlannerSessionDialog = dynamic(
  () => import("@/features/planner/ui/PlannerSessionDialog").then((m) => ({ default: m.PlannerSessionDialog })),
  { ssr: false, loading: () => null },
);

export type PlannerWorkspaceProps = {
  guestMode?: boolean;
  planId?: string;
};

const PANEL_BUTTON_CLASS = "min-w-[var(--pw-touch-target)] min-h-[var(--pw-touch-target)] focus-visible:ring-2 focus-visible:ring-primary hover:bg-[var(--surface-soft)] rounded-lg transition-colors";

export function PlannerWorkspaceContent({ guestMode = false, planId }: PlannerWorkspaceProps) {
  useTheme();
  const floorplan = useFloorplan();
  const isMobile = useIsMobile();
  const {
    insertObject,
    gridEnabled,
    snapEnabled,
    toggleGrid,
  } = floorplan;

  const shellVisible = usePlannerShellVisible();
  const { viewMode, setViewMode } = usePlannerWorkspacePreferences();
  const {
    isTemplateOpen,
    setIsTemplateOpen,
    isExportOpen,
    setIsExportOpen,
    isSessionOpen,
    setIsSessionOpen,
    toolVisibilityMode,
    handleToolVisibilityModeChange,
  } = usePlannerWorkspaceUiState();

  const panels = usePlannerPanels({ enabled: shellVisible });
  const {
    applyStepLayout,
    closeAll,
    isCompact,
    leftCollapsed,
    rightCollapsed,
    leftOpen,
    leftOpenRaw,
    rightOpen,
    rightOpenRaw,
    setLeftOpen,
    setRightOpen,
    toggleLeft,
    toggleRightCollapsed,
    preferencesHydrated: panelPreferencesHydrated,
  } = panels;
  useKeyboardShortcuts(floorplan, { onEscape: closeAll });

  const isOnline = useOnlineStatus();
  const canvasSurfaceRef = useRef<HTMLDivElement | null>(null);
  const chromeLayerRef = useRef<HTMLDivElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const floorPlanInputRef = useRef<HTMLInputElement | null>(null);

  const plannerStep = usePlannerWorkspaceStore((s) => s.plannerStep);
  const setPlannerStep = usePlannerWorkspaceStore((s) => s.setPlannerStep);
  const workspaceUnitSystem = usePlannerWorkspaceStore((s) => s.unitSystem);
  const layerVisible = usePlannerWorkspaceStore((s) => s.layerVisible);
  const [leftTab, setLeftTab] = useState<PlannerLeftTab>(getStepLeftTab(plannerStep));
  const setPlannerTool = usePlannerStore((s) => s.setTool);
  const plannerTool = usePlannerStore((s) => s.tool);
  const recordRecentPlacement = usePlannerCatalogStore((s) => s.recordRecentPlacement);
  usePlannerCatalogHydration({ enabled: shellVisible });
  const searchParams = useSearchParams();
  const freshRequested = searchParams?.get("fresh") === "1";

  const { placeCatalogIntoFabric } = usePlannerCatalogPlacement(insertObject);
  const fabricDraft = usePlannerFabricDraft({
    layerVisible,
    placeCatalogIntoFabric,
    guestMode,
    planId,
    shellVisible,
  });
  const {
    importDraft: fabricImportDraft,
    exportDraft: fabricExportDraft,
    fabricSerializedDraft,
    setFloorPlanUnderlay: fabricSetFloorPlanUnderlay,
    fitToContent: fabricFitToContent,
    shapeCount,
    status: saveStatus,
    envelopeStatus: saveEnvelopeStatus,
    lastSavedAt,
    restoreSnapshot,
    retrySave,
  } = fabricDraft;

  const measurementUnit = useMemo(
    () => plannerUnitSystemToMeasurementUnit(workspaceUnitSystem),
    [workspaceUnitSystem],
  );
  const snapStatusLabel = useMemo(
    () => buildSnapStatusLabel(snapEnabled, gridEnabled),
    [snapEnabled, gridEnabled],
  );
  const planMetrics = useFabricPlanMetrics();
  const plannerStepGates = useMemo(
    () => evaluatePlannerStepGates(null, planMetrics),
    [planMetrics],
  );
  const disabledSteps = useMemo(
    () => getDisabledPlannerSteps(plannerStepGates),
    [plannerStepGates],
  );
  const selectionStatus = useFabricSelectionStatus();

  const activeDocumentIdRef = useRef<string | null>(planId ?? null);
  const planNameRef = useRef<string>("Workspace Plan");

  const buildCurrentPlannerDocument = useCallback(() => {
    return buildPlannerDocumentFromEditor(null, {
      id: activeDocumentIdRef.current ?? undefined,
      title: sanitizePlannerPlanName(planNameRef.current),
    });
  }, []);

  const session = usePlannerSessionHandlers({
    getCurrentPlannerDocument: buildCurrentPlannerDocument,
    importDraft: fabricImportDraft,
    planId,
    guestMode,
    shapeCount,
    saveStatus,
    fitToContent: fabricFitToContent,
    bootstrapEnabled: shellVisible,
  });

  const {
    planNameOverride,
    setPlanNameOverride,
    activeDocumentId,
    sessionStatusMessage,
    setSessionStatusMessage,
    sessionErrorMessage,
    setSessionErrorMessage,
    sessionBusy,
    draftPlanName,
    authUserId,
    isAdmin,
    plannerManagedProducts,
    handleUpsertManagedProduct,
    handleDeleteManagedProduct,
    handleStartFreshLayout,
    handleSaveCloud: sessionHandleSaveCloud,
    handleSaveDraft: sessionHandleSaveDraft,
    handleSaveAsNewSession: sessionHandleSaveAsNewSession,
    handleLoadPlan,
    handleDeletePlan,
    handleRenamePlan,
    handleImportFileChange,
    handleExportJson: sessionHandleExportJson,
    buildSavedEntries,
  } = session;

  const planName = planNameOverride ?? draftPlanName;

  useEffect(() => {
    activeDocumentIdRef.current = activeDocumentId;
    planNameRef.current = planName;
  }, [activeDocumentId, planName]);

  const currentPlannerDocument = useMemo(() => {
    void fabricSerializedDraft;
    return buildPlannerDocumentFromEditor(null, {
      id: activeDocumentId ?? undefined,
      title: sanitizePlannerPlanName(planName),
    });
  }, [activeDocumentId, fabricSerializedDraft, planName]);

  const handleSaveDraft = useCallback(() => sessionHandleSaveDraft(planName), [sessionHandleSaveDraft, planName]);
  const handleSaveCloud = useCallback(() => sessionHandleSaveCloud(planName), [sessionHandleSaveCloud, planName]);
  const handleSaveAsNewSession = useCallback(
    () => sessionHandleSaveAsNewSession(planName),
    [sessionHandleSaveAsNewSession, planName],
  );
  const handleExportJson = useCallback(
    () => sessionHandleExportJson(buildCurrentPlannerDocument, planName),
    [sessionHandleExportJson, buildCurrentPlannerDocument, planName],
  );

  const plannerSavedEntries = useMemo(
    () => buildSavedEntries(activeDocumentId),
    [buildSavedEntries, activeDocumentId],
  );

  const {
    applyToolBinding,
    handleApplyTemplate,
    handleCatalogItemClick,
    handlePlannerStepChange,
  } = usePlannerWorkspaceTooling({
    applyStepLayout,
    insertObject,
    isTemplateOpen,
    leftOpen,
    placeCatalogIntoFabric,
    recordRecentPlacement,
    setIsTemplateOpen,
    setLeftOpen,
    setLeftTab,
    setPlannerStep,
    setSessionStatusMessage,
    setViewMode,
    shapeCount,
  });

  useEffect(() => {
    if (!panelPreferencesHydrated) return;
    applyStepLayout(plannerStep);
  }, [applyStepLayout, panelPreferencesHydrated, plannerStep]);

  usePlannerSelectionPanel({ isCompact, rightOpen, selectionStatus, setRightOpen });

  usePlannerWorkspaceBootstrap({
    freshRequested,
    handleStartFreshLayout,
    importDraft: fabricImportDraft,
    restoreSnapshot,
    setPlannerTool,
  });

  const catalogDrag = usePlannerCatalogDragDrop({
    canvasSurfaceRef,
    placeCatalogIntoFabric,
    recordRecentPlacement,
  });

  const {
    sketchRecovery,
    handleSketchRetry,
    handleSketchAccept,
    handleSketchReject,
    handleSketchTraceManual,
    handleSketchDismiss,
    handleFloorPlanFileChange,
  } = usePlannerSketchRecovery({
    applyToolBinding,
    exportDraft: fabricExportDraft,
    importDraft: fabricImportDraft,
    setFloorPlanUnderlay: fabricSetFloorPlanUnderlay,
    setSessionStatusMessage,
    setSessionErrorMessage,
  });

  const plannerLeftPanel = useMemo(
    () => (
      <PlannerLeftPanel
        guestMode={guestMode}
        plannerStep={plannerStep}
        panelOpen={leftOpen}
        panelCollapsed={!isCompact && leftCollapsed}
        showPanelToggle={leftOpen}
        onTogglePanel={toggleLeft}
        activeTab={leftTab}
        onTabChange={setLeftTab}
        onItemClick={handleCatalogItemClick}
        onDragStart={catalogDrag.handleCatalogDragStart}
        onDragEnd={catalogDrag.handleCatalogDragEnd}
        unitSystem={measurementUnit}
      />
    ),
    [
      guestMode,
      plannerStep,
      leftOpen,
      leftCollapsed,
      isCompact,
      leftTab,
      measurementUnit,
      handleCatalogItemClick,
      catalogDrag.handleCatalogDragStart,
      catalogDrag.handleCatalogDragEnd,
      toggleLeft,
    ],
  );

  const canvas2D = useMemo(() => <Fabric2DWith3DSync viewMode={viewMode} />, [viewMode]);

  const canvas3D = (
    <Suspense fallback={<PlannerSkeleton />}>
      <div className="pw-viewer-host">
        <PlannerErrorBoundary label="3D Viewer">
          <Planner3DViewer document={currentPlannerDocument} />
        </PlannerErrorBoundary>
      </div>
    </Suspense>
  );

  const handleOpenAiAssist = useCallback(() => {
    setLeftTab("ai-assist");
    setLeftOpen(true);
    if (isCompact) {
      setRightOpen(false);
    }
  }, [isCompact, setLeftOpen, setRightOpen]);

  const handleOpen3dSession = useCallback(() => {
    setViewMode("3d");
    setSessionStatusMessage("Switched to 3D view.");
  }, [setSessionStatusMessage, setViewMode]);

  const handleImportRequest = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const handleFloorPlanUploadRequest = useCallback(() => {
    floorPlanInputRef.current?.click();
  }, []);

  const topBar = (
    <PlannerTopBar
      guestMode={guestMode}
      planName={planName}
      plannerStep={plannerStep}
      disabledSteps={disabledSteps}
      onPlannerStepChange={handlePlannerStepChange}
      saveStatus={saveStatus}
      saveEnvelopeStatus={saveEnvelopeStatus}
      lastSavedAt={lastSavedAt}
      onRetrySave={retrySave}
      onOpenSession={() => setIsSessionOpen(true)}
      onSaveDraft={handleSaveDraft}
      onImport={handleImportRequest}
      onUploadFloorPlan={handleFloorPlanUploadRequest}
      onOpenTemplates={() => setIsTemplateOpen(true)}
      onOpenAi={handleOpenAiAssist}
      isOnline={isOnline}
    />
  );

  const subTopBar = (
    <PlannerSubTopBar
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onOpenExport={() => setIsExportOpen(true)}
    />
  );

  const activeToolId = useMemo(() => plannerToolToToolId(plannerTool), [plannerTool]);
  const mobileTools = useMemo(() => TOOL_GROUPS.flatMap((group) => group.tools), []);
  const mobileToolbar = (
    <PlannerMobileDock
      tools={mobileTools}
      activeTool={activeToolId}
      activePlannerTool={plannerTool}
      onSelect={(toolId, storeTool) => applyToolBinding({ toolId, plannerTool: storeTool })}
    />
  );
  const toolRail = isCompact ? null : (
    <PlannerToolRail
      activeTool={activeToolId}
      activePlannerTool={plannerTool}
      step={plannerStep}
      visibilityMode={toolVisibilityMode}
      onSelect={(toolId, storeTool) => applyToolBinding({ toolId, plannerTool: storeTool })}
    />
  );

  const rightPanelBody = (
    <div className="pw-panel-body" hidden={rightCollapsed}>
      <PropertiesInspector step={plannerStep} />
      {plannerStep === "review" ? <LayerVisibilityPanel /> : null}
      {plannerStep === "review" ? <LayerManagerPanel unitSystem={workspaceUnitSystem} /> : null}
    </div>
  );

  const rightPanel = isMobile ? (
    <BottomSheet open={rightOpen && !rightCollapsed} onClose={() => setRightOpen(false)} title="Properties">
      {rightPanelBody}
    </BottomSheet>
  ) : (
    <aside
      className="pw-right-panel"
      data-open={rightOpen}
      data-collapsed={!isCompact && rightCollapsed ? true : undefined}
      data-step={plannerStep}
      data-selection={selectionStatus ? "active" : undefined}
    >
      <div className="pw-panel-tabs" aria-label="Right panel">
        <p className="pw-panel-tab pwx-panel-tab" data-active>
          Properties
        </p>
        <Tooltip content="Close right panel" side="bottom">
          <button
            type="button"
            className={`pw-panel-collapse pw-icon-btn ${PANEL_BUTTON_CLASS}`}
            onClick={toggleRightCollapsed}
            aria-label="Close right panel"
          >
            <PanelRightClose size={14} strokeWidth={2} aria-hidden />
          </button>
        </Tooltip>
      </div>

      {rightPanelBody}
    </aside>
  );

  const canvasStage = (
    <PlannerCanvasStage
      viewMode={viewMode}
      chromeLayerRef={chromeLayerRef}
      canvasSurfaceRef={canvasSurfaceRef}
      dragItem={catalogDrag.dragItem}
      isCatalogOverCanvas={catalogDrag.isCatalogOverCanvas}
      handleCanvasDragOver={catalogDrag.handleCanvasDragOver}
      handleCanvasDrop={catalogDrag.handleCanvasDrop}
      canvas2D={canvas2D}
      canvas3D={canvas3D}
      shapeCount={shapeCount}
      guestMode={guestMode}
      applyToolBinding={applyToolBinding}
      setIsTemplateOpen={setIsTemplateOpen}
      onQuickLayout={() => queueQuickStarterLayout()}
      onUploadFloorPlan={handleFloorPlanUploadRequest}
      onClose3D={() => setViewMode("2d")}
      plannerChromeHost={<PlannerChromeHost />}
      statusBar={
        <PlannerStatusBar
          metrics={planMetrics}
          selectionStatus={selectionStatus}
          unitSystem={workspaceUnitSystem}
          snapStatusLabel={snapStatusLabel}
          toolVisibilityMode={toolVisibilityMode}
          onToolVisibilityModeChange={handleToolVisibilityModeChange}
          showGrid={gridEnabled}
          onToggleGrid={toggleGrid}
        />
      }
    />
  );

  return (
    <>
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        className=""
        onChange={(e) => handleImportFileChange(e, planName)}
      />
      <input
        ref={floorPlanInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className=""
        onChange={handleFloorPlanFileChange}
      />
      <PlannerWorkspaceLayout
        topBar={topBar}
        subTopBar={subTopBar}
        toolRail={toolRail}
        mobileToolbar={mobileToolbar}
        leftPanel={plannerLeftPanel}
        rightPanel={rightPanel}
        canvasArea={canvasStage}
        isCompact={isCompact}
        plannerStep={plannerStep}
        leftOpenRaw={leftOpenRaw}
        rightOpenRaw={rightOpenRaw}
        leftCollapsed={leftCollapsed}
        rightCollapsed={rightCollapsed}
        isCanvasDragging={false}
        closeAll={closeAll}
        isOnline={isOnline}
        templateModal={
          <TemplatePickerModal
            isOpen={isTemplateOpen}
            onClose={() => setIsTemplateOpen(false)}
            onApply={handleApplyTemplate}
          />
        }
        sessionDialog={
          <PlannerSessionDialog
            open={isSessionOpen}
            onOpenChange={setIsSessionOpen}
            planName={planName}
            onPlanNameChange={setPlanNameOverride}
            plans={plannerSavedEntries}
            isAuthenticated={!!authUserId}
            isBusy={sessionBusy}
            statusMessage={sessionStatusMessage}
            errorMessage={sessionErrorMessage}
            canOpen3d={shapeCount > 0}
            isAdmin={isAdmin}
            managedProducts={plannerManagedProducts}
            onSaveCloud={handleSaveCloud}
            onSaveDraft={handleSaveDraft}
            onSaveAsNewSession={handleSaveAsNewSession}
            onLoadPlan={handleLoadPlan}
            onDeletePlan={handleDeletePlan}
            onRenamePlan={handleRenamePlan}
            onImport={handleImportRequest}
            onExportJson={handleExportJson}
            onOpen3d={handleOpen3dSession}
            onUpsertManagedProduct={handleUpsertManagedProduct}
            onDeleteManagedProduct={handleDeleteManagedProduct}
            onStartFreshLayout={handleStartFreshLayout}
            onDismissError={() => setSessionErrorMessage(null)}
            isOnline={isOnline}
          />
        }
        dragOverlay={
          <>
            <PlannerSketchRecoveryPanel
              recovery={sketchRecovery}
              onTraceManual={handleSketchTraceManual}
              onRetry={handleSketchRetry}
              onAccept={handleSketchAccept}
              onReject={() => void handleSketchReject()}
              onDismiss={handleSketchDismiss}
            />
            {catalogDrag.dragItem && catalogDrag.ghostPos && catalogDrag.ghostFootprint ? (
              <CatalogDropGhost
                item={catalogDrag.dragItem}
                x={catalogDrag.ghostPos.x}
                y={catalogDrag.ghostPos.y}
                width={catalogDrag.ghostFootprint.w}
                height={catalogDrag.ghostFootprint.h}
                valid={catalogDrag.isCatalogOverCanvas}
              />
            ) : null}
            {catalogDrag.dropFlash ? (
              <CatalogDropFlash x={catalogDrag.dropFlash.x} y={catalogDrag.dropFlash.y} />
            ) : null}
          </>
        }
        exportModal={
          isExportOpen ? (
            <ExportModal
              isOpen={isExportOpen}
              onClose={() => setIsExportOpen(false)}
            />
          ) : null
        }
      />
    </>
  );
}
