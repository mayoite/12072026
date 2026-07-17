"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { usePlannerWorkspaceStore } from "@/features/planner/cloud-store/workspaceStore";
import {
  Lazy3DViewer,
  getPlannerViewerControlProps,
} from "@/features/planner/3d/ThreeLazyViewer";
import {
  PlannerCanvasStage,
  type PlannerCanvasStageHandle,
  type CanvasStatusSnapshot,
} from "@/features/planner/canvas";
import {
  placeCatalogItemInProject,
  placeWorkstationConfigOnProject,
  placeWorkstationInstancesOnProject,
} from "@/features/planner/catalog/placementAction";
import type { WorkstationConfigV0 } from "@/features/planner/catalog/workstationSystemV0";
import { workstationConfigKey } from "@/features/planner/catalog/workstationSystemV0";
import {
  defaultWorkstationConfiguratorDraftV0,
  isWorkstationV0BatchPlaceCount,
  resolveWorkstationConfigFromDraft,
  takePendingWorkstationConfig,
} from "@/features/planner/catalog/workstationConfiguratorV0";
import { placeModularWithGeneratedGlbBrowser } from "@/features/planner/asset-engine/mesh/placeModularWithGeneratedGlbBrowser";
import { shouldPlaceModularWithGeneratedGlb } from "@/features/planner/asset-engine/mesh/shouldPlaceModularWithGeneratedGlb";
import { importPlannerPlannerText } from "@/features/planner/shared/export/importUtils";
import { usePlannerWorkspaceAutosave } from "@/features/planner/persistence/usePlannerWorkspaceAutosave";
import {
  addLinearDimension,
  addRectangularRoom,
  setActiveFloor,
  setBackgroundImage,
  updateBackgroundImage,
} from "@/features/planner/model/operations/pureActions";
import {
  advanceUnderlayCalibratePick,
  calibrateMmPerPixelFromImageWidth,
  calibrateMmPerPixelFromPlanSegment,
  defaultUnderlayMmPerPixel,
  resolveUnderlayMmPerPixel,
  type UnderlayCalibratePickSession,
} from "@/features/planner/lib/underlayCalibrate";
import { layoutGridPositions } from "@/features/planner/lib/geometry/gridLayout";
import {
  resolveConflict,
  type ConflictResolutionChoice,
} from "@/features/planner/persistence/cloudPlanHydration";
import type { OfflinePlan } from "@/features/planner/cloud-store/offlineStorage";
import {
  PlannerSyncConflictDialog,
  type SyncConflictDetails,
} from "./PlannerSyncConflictDialog";
import { createPlannerProject } from "@/features/planner/model/project";
import { addPlannerWall, movePlannerWallEndpointConnected } from "@/features/planner/model/actions/walls";
import {
  addPlannerDoor,
  addPlannerWindow,
  updatePlannerOpening,
} from "@/features/planner/model/actions/openings";
import {
  DEFAULT_DOOR_WIDTH_MM,
  DEFAULT_WINDOW_WIDTH_MM,
  openingPlacementRejectMessage,
  type OpeningPlacementRejectReason,
} from "@/features/planner/lib/geometry/openingPlacement";
import { newEntityId } from "@/features/planner/lib/newEntityId";
import type { PlannerProject } from "@/features/planner/model/types";
import { preflightPlannerExport } from "@/features/planner/shared/export/exportPreflight";
import {
  downloadJSON,
  downloadSVG,
  downloadPNG,
  downloadPDF,
  downloadDXF,
  downloadWorkstationBoqJSON,
  downloadFurnitureBoqJSON,
  downloadFurnitureBoqCSV,
} from "@/features/planner/shared/export/exportUtils";
import {
  buildPlannerFurnitureBoq,
  buildPlannerBoqFilename,
  exportPlannerFurnitureBoqToCsv,
  exportPlannerFurnitureBoqToJson,
  PLANNER_FURNITURE_BOQ_PRICING_NOTE,
} from "@/features/planner/shared/export/projectFurnitureBoq";
import {
  furnitureBoqToHandoffPayload,
  furnitureBoqToPdfRows,
  furnitureBoqToQuoteCartItems,
} from "@/features/planner/shared/export/furnitureBoqBridge";
import { exportBoqOnly } from "@/features/planner/shared/export/brandedPdfExport";
import { summarizeWorkstationBoqV0 } from "@/features/planner/catalog/workstationBoqV0";
import { useQuoteCart } from "@/lib/store/quoteCart";
import {
  CONVERSION_EVENTS,
  trackConversionEvent,
} from "@/lib/analytics/conversionContract";
import type {
  HandoffContactDraft,
  ReviewBoqLinePreview,
} from "./ReviewQuotePanel";
import { usePlannerSvgCatalog } from "@/features/planner/catalog/usePlannerWorkspaceCatalog";
import { CommandPalette } from "./CommandPalette";
import { CommandsPaletteTrigger } from "./CommandsPaletteTrigger";
import workspaceStyles from "./workspace.module.css";
import { PropertiesPanel } from "./PropertiesPanel";
import {
  ExactRoomPanel,
  type ExactRoomDimensions,
} from "./ExactRoomPanel";
import { ReviewQuotePanel } from "./ReviewQuotePanel";
import {
  SketchToPlanDialog,
  type SketchToPlanUiState,
} from "./SketchToPlanDialog";
import { applySketchWallObjects } from "@/features/planner/ai/applySketchWallObjects";
import {
  getSketchRecoveryMessage,
  type SketchToPlanResponse,
} from "@/features/planner/ai/sketchToPlanShared";
import { browserApiFetch } from "@/lib/api/browserApi";
import { readPlannerApiError } from "@/features/planner/lib/plannerApiError";
import {
  buildLockedUnderlayFromFloorPlan,
  FLOOR_PLAN_FILE_ACCEPT,
  readFloorPlanImageFile,
  SKETCH_TO_PLAN_FILE_ACCEPT,
} from "@/features/planner/lib/floorPlanImageImport";
import type { SketchRecoveryReason } from "@/features/shared/api/schemas";
import type { ValidationIssue } from "@/features/planner/lib/validation/types";
import {
  describePlannerRedoLabel,
  describePlannerUndoLabel,
} from "./plannerHistoryLabels";
import { WorkspaceLeftPanel } from "./WorkspaceLeftPanel";
import { ModularPlannerShell } from "./dock/ModularPlannerShell";
import {
  type PlannerTool,
} from "./canvasTool";
import {
  DEFAULT_LAYER_VISIBILITY,
  type PlannerLayerVisibility,
} from "./layerVisibility";
import { useWorkspaceKeyboard } from "./useWorkspaceKeyboard";
import {
  useWorkspaceCanvas,
  type CanvasSelection,
} from "./useWorkspaceCanvas";
import {
  applySelectionDelete,
  deleteEntityFromProject,
  resolveSelectedEntity,
  selectionAfterBatchPlace,
  updateEntityInProject,
} from "./workspaceEntityHelpers";
import {
  plannerSaveStatusLabel,
  formatSelectionStatus,
  formatSnapStatus,
  formatToolStatus,
} from "./workspaceStatusLabels";
import { summarizeFloorMetrics } from "./workspacePlanMetrics";
import { useValidation } from "./useValidation";
import {
  alignEntities,
  distributeEntities,
  spaceEntitiesWithExactGap,
  minEdgeFromCenter,
  centerFromMinEdge,
  type PositionedEntity,
} from "@/features/planner/lib/geometry/alignDistribute";
import type { PlannerDisplayUnit, PlannerPoint } from "@/features/planner/model/types";
import { formatLengthDisplay } from "@/features/planner/model/units";
import type { PlannerAccessContext } from "@/features/planner/lib/commands/plannerAccessContext";
import type { PlannerEntityCollection } from "@/features/planner/model/actions/projectActions";
import type { PaletteCommandHandlers } from "@/features/planner/lib/commands/paletteCommands";
import {
  DEFAULT_PLANNER_WORKSPACE_PREFERENCES,
} from "@/features/planner/store/workspacePreferences";
import {
  patchPlannerWorkspacePreferences,
  readPlannerWorkspacePreferencesFromStorage,
} from "@/features/planner/store/workspacePreferencesStorage";
import { applyLayoutToWorkspace } from "@/features/planner/ai/applyLayoutToWorkspace";
import { AIAssistDrawer } from "@/features/planner/ai/AIAssistDrawer";
import { extractProjectPlacements } from "@/features/planner/ai/extractProjectPlacements";
import type { WorkspaceAiBridge } from "@/features/planner/ai/workspaceAiBridge";
import { takePlannerStartupIntent } from "@/features/planner/onboarding/projectSetup";

export type OOPlannerWorkspaceProps = {
  guestMode: boolean;
  planId?: string;
  ownerId?: string;
};

export function OOPlannerWorkspace({
  guestMode,
  planId,
  ownerId,
}: OOPlannerWorkspaceProps) {
  const accessContext: PlannerAccessContext = guestMode
    ? "guest"
    : "authenticated";
  const projectName = planId ? `Plan ${planId}` : "Untitled plan";
  const canvasRef = useRef<PlannerCanvasStageHandle>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const sketchInputRef = useRef<HTMLInputElement>(null);
  const underlayInputRef = useRef<HTMLInputElement>(null);
  const [sketchUi, setSketchUi] = useState<SketchToPlanUiState>({ status: "idle" });
  const workspaceCanvas = useWorkspaceCanvas({
    projectName,
  });
  const handleProjectNameChange = useCallback(
    (name: string) => {
      workspaceCanvas.updateProject((project) => ({
        ...project,
        name,
      }));
    },
    [workspaceCanvas],
  );
  const addQuoteItem = useQuoteCart((state) => state.addItem);
  const [handoffBusy, setHandoffBusy] = useState(false);
  const [lastHandoffReference, setLastHandoffReference] = useState<string | null>(
    null,
  );
  const handoffIdempotencyKeyRef = useRef<string | null>(null);
  // Do not enable autosave until the persisted document has been restored.
  // React Strict Mode replays effects in development; treating the default
  // project as hydrated can otherwise overwrite a saved draft before the
  // asynchronous IndexedDB read completes.
  const [hydrated, setHydrated] = useState(false);
  const replaceProjectRef = useRef(workspaceCanvas.replaceProject);
  useLayoutEffect(() => {
    replaceProjectRef.current = workspaceCanvas.replaceProject;
  });

  const autosave = usePlannerWorkspaceAutosave(
    workspaceCanvas.project,
    guestMode,
    planId,
    { hydrated, ownerId },
  );
  const catalog = usePlannerSvgCatalog();
  const restoreSnapshotRef = useRef(autosave.restoreSnapshot);
  useLayoutEffect(() => {
    restoreSnapshotRef.current = autosave.restoreSnapshot;
  });

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const restored = await restoreSnapshotRef.current();
      if (cancelled) return;

      if (restored) {
        replaceProjectRef.current(restored);
        setHydrated(true);
        return;
      }

      const { pendingBootstrapLayout, setPendingBootstrapLayout } =
        usePlannerWorkspaceStore.getState();
      if (pendingBootstrapLayout) {
        replaceProjectRef.current(
          applyLayoutToWorkspace(
            createPlannerProject({ name: projectName || "Starter plan" }),
            pendingBootstrapLayout,
            catalog.resolveItem,
          ),
        );
        setPendingBootstrapLayout(null);
      }
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [catalog.resolveItem, guestMode, planId, projectName]);

  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

  useEffect(() => {
    if (viewMode !== "2d") return;
    const frame = requestAnimationFrame(() => {
      canvasRef.current?.fitToView?.();
    });
    return () => cancelAnimationFrame(frame);
  }, [viewMode]);
  const [activeTool, setActiveTool] = useState<PlannerTool>("select");
  const [underlayCalibrateSession, setUnderlayCalibrateSession] =
    useState<UnderlayCalibratePickSession | null>(null);
  const [displayUnit, setDisplayUnit] = useState<PlannerDisplayUnit>(
    DEFAULT_PLANNER_WORKSPACE_PREFERENCES.units,
  );
  const [layerVisibility, setLayerVisibility] = useState<PlannerLayerVisibility>(
    DEFAULT_LAYER_VISIBILITY,
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pendingCatalogItemId, setPendingCatalogItemId] = useState<
    string | null
  >(null);
  const [pendingWorkstationConfig, setPendingWorkstationConfig] =
    useState<WorkstationConfigV0 | null>(null);
  /** Consume-once arm — state alone races on double pointer-up before re-render. */
  const pendingWorkstationConfigRef = useRef<WorkstationConfigV0 | null>(null);
  const [canvasStatus, setCanvasStatus] = useState<CanvasStatusSnapshot | null>(
    null,
  );
  const [workspaceMessage, setWorkspaceMessage] = useState<string | null>(null);
  const armedToolRef = useRef<PlannerTool>("select");

  useEffect(() => {
    const intent = takePlannerStartupIntent(guestMode, planId);
    if (intent !== "import-trace") return;
    const frame = window.requestAnimationFrame(() => {
      setWorkspaceMessage("Import or trace selected. Use File, then Import Plan JSON.");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [guestMode, planId]);

  // Density/grid/snap wired from workspace prefs (not hardcoded).
  const [density, setDensity] = useState<"compact" | "touch">(
    DEFAULT_PLANNER_WORKSPACE_PREFERENCES.density,
  );
  const [gridEnabled, setGridEnabled] = useState(
    DEFAULT_PLANNER_WORKSPACE_PREFERENCES.gridEnabled,
  );
  const [snapEnabled, setSnapEnabled] = useState(
    DEFAULT_PLANNER_WORKSPACE_PREFERENCES.snapEnabled,
  );
  const [orthogonalLock, setOrthogonalLock] = useState(false);
  const [syncConflict, setSyncConflict] = useState<{
    local: OfflinePlan;
    cloud: OfflinePlan;
    details: SyncConflictDetails;
  } | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefs = readPlannerWorkspacePreferencesFromStorage();
    if (!prefs) return;
    setTimeout(() => {
      setDensity(prefs.density);
      setGridEnabled(prefs.gridEnabled);
      setSnapEnabled(prefs.snapEnabled);
      setDisplayUnit(prefs.units);
    }, 0);
  }, []);

  // Phone: prefer touch density when no stored preference forces compact.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const narrow = window.matchMedia("(max-width: 48rem)");
    const apply = () => {
      if (!narrow.matches) return;
      const prefs = readPlannerWorkspacePreferencesFromStorage();
      if (prefs?.density) return;
      setDensity("touch");
    };
    apply();
    narrow.addEventListener("change", apply);
    return () => narrow.removeEventListener("change", apply);
  }, []);

  const handleDisplayUnitChange = useCallback((unit: PlannerDisplayUnit) => {
    setDisplayUnit(unit);
    patchPlannerWorkspacePreferences({ units: unit });
  }, []);

  // Playwright reads live wall geometry via this hook (see plannerCanvasHelpers).
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.webdriver) return;
    const w = window as unknown as { __plannerLiveProject?: PlannerProject };
    w.__plannerLiveProject = workspaceCanvas.project;
    return () => {
      delete w.__plannerLiveProject;
    };
  }, [workspaceCanvas.project]);

  const undoLabel = useMemo(
    () => describePlannerUndoLabel(workspaceCanvas.history),
    [workspaceCanvas.history],
  );
  const redoLabel = useMemo(
    () => describePlannerRedoLabel(workspaceCanvas.history),
    [workspaceCanvas.history],
  );

  const pendingCatalogItem = useMemo(
    () =>
      pendingCatalogItemId
        ? catalog.resolveItem(pendingCatalogItemId)
        : undefined,
    [catalog, pendingCatalogItemId],
  );

  const activeFloor =
    workspaceCanvas.project.floors.find(
      (floor) => floor.id === workspaceCanvas.project.activeFloorId,
    ) ?? workspaceCanvas.project.floors[0];

  const validationResult = useValidation(activeFloor);
  const workspaceSelection = workspaceCanvas.selection;
  const multiSelection = useMemo(() => {
    const selection = workspaceSelection;
    if (selection.type === "none" || selection.ids.length <= 1) return null;
    return { type: selection.type, count: selection.ids.length };
  }, [workspaceSelection]);

  const hasUnderlay = Boolean(
    workspaceCanvas.activeFloor.backgroundImage?.dataUrl,
  );

  const selectedEntity = useMemo(() => {
    if (workspaceCanvas.selection.ids.length !== 1) return null;
    return resolveSelectedEntity(
      workspaceCanvas.selection,
      workspaceCanvas.activeFloor,
    );
  }, [workspaceCanvas.activeFloor, workspaceCanvas.selection]);
  const selectedHostWallLengthMm = useMemo(() => {
    if (
      !selectedEntity ||
      (selectedEntity.collection !== "doors" && selectedEntity.collection !== "windows")
    ) {
      return undefined;
    }
    const entity = selectedEntity.entity as { wallId: string };
    const wall = activeFloor?.walls.find((candidate) => candidate.id === entity.wallId);
    return wall
      ? Math.hypot(wall.end.x - wall.start.x, wall.end.y - wall.start.y)
      : undefined;
  }, [activeFloor, selectedEntity]);
  const isCanvasEmpty = activeFloor
    ? activeFloor.walls.length === 0 &&
      activeFloor.rooms.length === 0 &&
      activeFloor.doors.length === 0 &&
      activeFloor.windows.length === 0 &&
      activeFloor.furniture.length === 0
    : true;

  const workspaceAiBridge = useMemo<WorkspaceAiBridge>(
    () => ({
      placementCount: extractProjectPlacements(activeFloor).length,
      getPlacements: () => extractProjectPlacements(activeFloor),
      applyLayout: (layout) => {
        workspaceCanvas.updateProject((project) =>
          applyLayoutToWorkspace(project, layout, catalog.resolveItem),
        );
        setWorkspaceMessage("Applied AI layout.");
        canvasRef.current?.fitToView?.();
      },
      replaceCatalogMatch: (furnitureId, catalogItemId) => {
        const item = catalog.resolveItem(catalogItemId);
        if (!item) return;
        workspaceCanvas.updateProject((project) => {
          const floor =
            project.floors.find((f) => f.id === project.activeFloorId) ??
            project.floors[0];
          const existing = floor?.furniture.find((f) => f.id === furnitureId);
          if (!existing) return project;
          const without = deleteEntityFromProject(project, "furniture", furnitureId);
          const placed = placeCatalogItemInProject(without, item, null, {
            placedFrom: "api",
            position: existing.position,
            rotation: existing.rotation,
          });
          return placed.result.project;
        });
        setWorkspaceMessage(`Updated catalog match to ${item.shortName ?? item.name}.`);
      },
      fitCanvas: () => canvasRef.current?.fitToView?.(),
    }),
    [activeFloor, catalog, workspaceCanvas],
  );

  const toggleDensity = useCallback(() => {
    setDensity((current) => {
      const next = current === "compact" ? "touch" : "compact";
      patchPlannerWorkspacePreferences({ density: next });
      return next;
    });
  }, []);

  const toggleGrid = useCallback(() => {
    setGridEnabled((current) => {
      const next = !current;
      patchPlannerWorkspacePreferences({ gridEnabled: next });
      return next;
    });
  }, []);

  const toggleSnap = useCallback(() => {
    setSnapEnabled((current) => {
      const next = !current;
      patchPlannerWorkspacePreferences({ snapEnabled: next });
      return next;
    });
  }, []);

  const toggleOrthogonalLock = useCallback(() => {
    setOrthogonalLock((current) => {
      const next = !current;
      setWorkspaceMessage(
        next
          ? "Orthogonal lock on — walls snap to 90° (Shift still works)."
          : "Orthogonal lock off — hold Shift for 90°.",
      );
      return next;
    });
  }, []);

  const handleArrayEntities = useCallback(
    (columns: number, gapMm: number) => {
      const { selection } = workspaceCanvas;
      if (selection.type !== "furniture" || selection.ids.length < 1) return;
      const floor = workspaceCanvas.activeFloor;
      const items = selection.ids
        .map((id) => floor.furniture.find((f) => f.id === id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
      if (items.length < 1) return;
      const widthMm = items[0]?.width ?? 600;
      const depthMm = items[0]?.depth ?? 600;
      const origin = {
        x: Math.min(...items.map((i) => i.position.x)),
        y: Math.min(...items.map((i) => i.position.y)),
      };
      const cells = layoutGridPositions(items.length, widthMm, depthMm, {
        columns: Math.max(1, Math.floor(columns)),
        gapMm: Math.max(0, gapMm),
        originMm: origin,
      });
      workspaceCanvas.updateProject((project) => {
        let p = project;
        items.forEach((item, index) => {
          const cell = cells[index];
          if (!cell) return;
          p = updateEntityInProject(p, "furniture", item.id, {
            position: { x: cell.xMm, y: cell.yMm },
          });
        });
        return p;
      });
      setWorkspaceMessage(
        `Arrayed ${items.length} items · ${Math.max(1, Math.floor(columns))} columns · ${gapMm} mm gap`,
      );
    },
    [workspaceCanvas],
  );

  const handleResolveSyncConflict = useCallback(
    (choice: ConflictResolutionChoice) => {
      if (!syncConflict) return;
      // Pure choice is recorded; live host local autosave remains the working document
      // until cloud hydrate loads OfflinePlan.document into the project model.
      resolveConflict(syncConflict.local, syncConflict.cloud, choice);
      setSyncConflict(null);
      setWorkspaceMessage(
        choice === "local"
          ? "Kept local plan. Cloud version was not applied."
          : "Kept cloud plan choice recorded. Reload cloud plan to replace the canvas.",
      );
    },
    [syncConflict],
  );

  const applyUnderlayFromSketch = useCallback(
    (underlay: { dataUrl: string; width: number; height: number }) => {
      const mmPerPixel = defaultUnderlayMmPerPixel(underlay.width, 10_000);
      workspaceCanvas.updateProject((project) =>
        setBackgroundImage(project, {
          dataUrl: underlay.dataUrl,
          position: { x: 0, y: 0 },
          scale: 1,
          opacity: 0.4,
          rotation: 0,
          locked: true,
          imageWidthPx: underlay.width,
          imageHeightPx: underlay.height,
          mmPerPixel,
        }).project,
      );
    },
    [workspaceCanvas],
  );

  const handleCalibrateUnderlay = useCallback(
    (knownLengthMm: number) => {
      const bg = workspaceCanvas.activeFloor.backgroundImage;
      if (!bg?.imageWidthPx) {
        setWorkspaceMessage("No underlay to calibrate. Accept a sketch first.");
        return;
      }
      const mmPerPixel = calibrateMmPerPixelFromImageWidth(
        bg.imageWidthPx,
        knownLengthMm,
      );
      if (mmPerPixel === null) {
        setWorkspaceMessage("Could not calibrate underlay.");
        return;
      }
      try {
        workspaceCanvas.updateProject((project) =>
          updateBackgroundImage(project, { mmPerPixel, scale: 1 }).project,
        );
        setUnderlayCalibrateSession(null);
        setWorkspaceMessage(
          `Underlay calibrated: image width = ${knownLengthMm} mm.`,
        );
      } catch {
        setWorkspaceMessage("Could not calibrate underlay.");
      }
    },
    [workspaceCanvas],
  );

  const handleStartTwoPointCalibrate = useCallback(
    (knownLengthMm: number) => {
      const bg = workspaceCanvas.activeFloor.backgroundImage;
      if (!bg?.dataUrl) {
        setWorkspaceMessage("No underlay to calibrate. Accept a sketch first.");
        return;
      }
      if (!Number.isFinite(knownLengthMm) || knownLengthMm <= 0) {
        setWorkspaceMessage("Enter a positive known distance before picking points.");
        return;
      }
      setUnderlayCalibrateSession({ phase: "pick-a", knownLengthMm });
      setActiveTool("select");
      armedToolRef.current = "select";
      setWorkspaceMessage(
        `Underlay 2-point calibrate: click first point (known ${knownLengthMm} mm).`,
      );
    },
    [workspaceCanvas],
  );

  const handleCancelTwoPointCalibrate = useCallback(() => {
    setUnderlayCalibrateSession(null);
    setWorkspaceMessage("Underlay 2-point calibrate cancelled.");
  }, []);

  const handleUnderlayCalibratePoint = useCallback(
    (point: { x: number; y: number }) => {
      if (!underlayCalibrateSession) return;
      const next = advanceUnderlayCalibratePick(underlayCalibrateSession, point);
      if (next.kind === "need-second") {
        setUnderlayCalibrateSession(next.session);
        setWorkspaceMessage(
          `Underlay 2-point calibrate: click second point (known ${next.session.knownLengthMm} mm).`,
        );
        return;
      }

      const bg = workspaceCanvas.activeFloor.backgroundImage;
      if (!bg?.dataUrl) {
        setUnderlayCalibrateSession(null);
        setWorkspaceMessage("No underlay to calibrate.");
        return;
      }
      const imageWidthPx = Math.max(1, bg.imageWidthPx ?? 1);
      const currentMmPerPixel = resolveUnderlayMmPerPixel(imageWidthPx, bg.mmPerPixel);
      const mmPerPixel = calibrateMmPerPixelFromPlanSegment({
        pointA: next.pointA,
        pointB: next.pointB,
        knownLengthMm: next.knownLengthMm,
        underlay: {
          position: bg.position,
          mmPerPixel: currentMmPerPixel,
          scale: bg.scale,
        },
      });
      setUnderlayCalibrateSession(null);
      if (mmPerPixel === null) {
        setWorkspaceMessage(
          "Could not calibrate underlay — pick two distinct points on the reference.",
        );
        return;
      }
      try {
        workspaceCanvas.updateProject((project) =>
          updateBackgroundImage(project, { mmPerPixel, scale: 1 }).project,
        );
        setWorkspaceMessage(
          `Underlay calibrated from 2 points: segment = ${next.knownLengthMm} mm.`,
        );
      } catch {
        setWorkspaceMessage("Could not calibrate underlay.");
      }
    },
    [underlayCalibrateSession, workspaceCanvas],
  );

  const handleStartTemplate = useCallback(() => {
    setActiveTool("room");
    armedToolRef.current = "room";
    setWorkspaceMessage("Enter exact room dimensions.");
  }, []);

  const handleCreateExactRoom = useCallback(
    ({ widthMm, depthMm, wallThicknessMm }: ExactRoomDimensions) => {
      workspaceCanvas.updateProject((project) => {
        const floor =
          project.floors.find((candidate) => candidate.id === project.activeFloorId) ??
          project.floors[0];
        const points = floor?.walls.flatMap((wall) => [wall.start, wall.end]) ?? [];
        const start = points.length
          ? {
              x: Math.max(...points.map((point) => point.x)) + 1000,
              y: Math.min(...points.map((point) => point.y)),
            }
          : { x: 0, y: 0 };
        return addRectangularRoom(
          project,
          start,
          { x: start.x + widthMm, y: start.y + depthMm },
          { idFactory: newEntityId, wallThicknessMm },
        ).project;
      });
      setActiveTool("select");
      armedToolRef.current = "select";
      setWorkspaceMessage(
        `Created exact room ${formatLengthDisplay(widthMm, displayUnit)} × ${formatLengthDisplay(depthMm, displayUnit)}.`,
      );
      queueMicrotask(() => canvasRef.current?.fitToView());
    },
    [displayUnit, workspaceCanvas],
  );

  const handleUpdateEntity = useCallback(
    (
      collection: PlannerEntityCollection,
      id: string,
      updates: Record<string, unknown>,
    ) => {
      if (collection === "doors" || collection === "windows") {
        try {
          const next = updatePlannerOpening(
            workspaceCanvas.project,
            collection,
            id,
            updates,
          );
          workspaceCanvas.updateProject(() => next);
        } catch (error) {
          setWorkspaceMessage(
            error instanceof Error ? error.message : "Opening could not be updated.",
          );
        }
        return;
      }
      workspaceCanvas.dispatch({ type: "update", collection, id, updates });
    },
    [workspaceCanvas],
  );

  const handleToggleLock = useCallback(
    (collection: PlannerEntityCollection, id: string) => {
      workspaceCanvas.updateProject((project) => {
        const floor =
          project.floors.find((f) => f.id === project.activeFloorId) ??
          project.floors[0];
        const items = floor[collection] as Array<{ id: string; locked?: boolean }>;
        const entity = items.find((item) => item.id === id);
        if (!entity) return project;
        return updateEntityInProject(project, collection, id, {
          locked: !entity.locked,
        });
      });
      // Panel chrome clicks clear Fabric selection — keep inspector on the locked entity.
      const selectionType: CanvasSelection["type"] | undefined =
        collection === "walls"
          ? "wall"
          : collection === "doors"
            ? "door"
            : collection === "windows"
              ? "window"
              : collection === "furniture"
                ? "furniture"
                : collection === "rooms"
                  ? "room"
                  : undefined;
      if (selectionType) {
        const nextSelection: CanvasSelection = {
          type: selectionType,
          ids: [id],
        };
        workspaceCanvas.setSelection(nextSelection);
        // Fabric clears activeObject when panel chrome is clicked — restore after that event.
        queueMicrotask(() => {
          workspaceCanvas.setSelection(nextSelection);
        });
      }
    },
    [workspaceCanvas],
  );

  const handleWallDrawn = useCallback(
    (start: PlannerPoint, end: PlannerPoint, input?: { thicknessMm?: number }) => {
      workspaceCanvas.updateProject((project) =>
        addPlannerWall(
          project,
          { start, end, thickness: input?.thicknessMm },
          newEntityId,
        ),
      );
      setWorkspaceMessage(
        "Wall added. Next segment starts from this endpoint — Escape to stop.",
      );
    },
    [workspaceCanvas],
  );

  const handleWallEndpointMoved = useCallback(
    (
      wallId: string,
      endpoint: "start" | "end",
      position: PlannerPoint,
    ) => {
      workspaceCanvas.updateProject((project) =>
        movePlannerWallEndpointConnected(
          project,
          wallId,
          endpoint,
          position,
          newEntityId,
        ),
      );
    },
    [workspaceCanvas],
  );

  const handleDimensionPlaced = useCallback(
    (start: PlannerPoint, end: PlannerPoint) => {
      try {
        workspaceCanvas.updateProject((project) =>
          addLinearDimension(project, start, end, { idFactory: newEntityId })
            .project,
        );
        setWorkspaceMessage("Dimension annotation added.");
      } catch (error) {
        setWorkspaceMessage(
          error instanceof Error ? error.message : "Could not add dimension.",
        );
      }
    },
    [workspaceCanvas],
  );

  const handleOpeningPlaced = useCallback(
    (wallId: string, position: number, kind: "door" | "window" = "door") => {
      try {
        if (kind === "window") {
          const next = addPlannerWindow(
            workspaceCanvas.project,
            {
              wallId,
              position,
              width: DEFAULT_WINDOW_WIDTH_MM,
              height: 1200,
              sillHeight: 900,
              type: "standard",
            },
            newEntityId,
          );
          workspaceCanvas.updateProject(() => next);
          setWorkspaceMessage("Window added.");
        } else {
          const next = addPlannerDoor(
            workspaceCanvas.project,
            {
              wallId,
              position,
              width: DEFAULT_DOOR_WIDTH_MM,
              height: 2100,
              type: "single",
              swingDirection: "left",
              flipSide: false,
            },
            newEntityId,
          );
          workspaceCanvas.updateProject(() => next);
          setWorkspaceMessage("Door added.");
        }
      } catch (error) {
        setWorkspaceMessage(
          error instanceof Error ? error.message : "Opening could not be placed.",
        );
        return;
      }
      setActiveTool("select");
      armedToolRef.current = "select";
    },
    [workspaceCanvas],
  );

  const handleOpeningRejected = useCallback((reason: OpeningPlacementRejectReason) => {
    setWorkspaceMessage(openingPlacementRejectMessage(reason));
  }, []);

  const handleOpeningRepositioned = useCallback(
    (collection: "doors" | "windows", id: string, position: number) => {
      try {
        const next = updatePlannerOpening(
          workspaceCanvas.project,
          collection,
          id,
          { position },
        );
        workspaceCanvas.updateProject(() => next);
      } catch (error) {
        setWorkspaceMessage(
          error instanceof Error
            ? error.message
            : "Opening could not be moved.",
        );
      }
    },
    [workspaceCanvas],
  );

  const handleFurnitureModified = useCallback(
    (update: { entityId: string; position: PlannerPoint; rotation: number }) => {
      workspaceCanvas.updateProject((project) =>
        updateEntityInProject(project, "furniture", update.entityId, {
          position: update.position,
          rotation: update.rotation,
        }),
      );
    },
    [workspaceCanvas],
  );

  const handleCanvasSelection = useCallback(
    (
      selection: {
        type: Exclude<CanvasSelection["type"], "none">;
        id: string;
      } | null,
    ) => {
      workspaceCanvas.setSelection(
        selection
          ? { type: selection.type, ids: [selection.id] }
          : { type: "none", ids: [] },
      );
    },
    [workspaceCanvas],
  );

  const handleDeleteEntity = useCallback(
    (collection: PlannerEntityCollection, id: string) => {
      workspaceCanvas.updateProject((project) =>
        deleteEntityFromProject(project, collection, id),
      );
      workspaceCanvas.setSelection({ type: "none", ids: [] });
    },
    [workspaceCanvas],
  );

  const handleDuplicateEntity = useCallback(
    (collection: PlannerEntityCollection, id: string) => {
      workspaceCanvas.dispatch({
        type: "duplicate",
        collection,
        id,
        newId: newEntityId(),
      } as const);
    },
    [workspaceCanvas],
  );

  /** Delete / Backspace — one history step for the whole selection. */
  const deleteSelection = useCallback(() => {
    const { selection } = workspaceCanvas;
    if (selection.type === "none" || selection.ids.length === 0) return;
    workspaceCanvas.updateProject((project) =>
      applySelectionDelete(project, selection),
    );
    workspaceCanvas.setSelection({ type: "none", ids: [] });
  }, [workspaceCanvas]);

  /** Ctrl+D — duplicate each selected entity. */
  const duplicateSelection = useCallback(() => {
    const { selection } = workspaceCanvas;
    if (selection.type === "none" || selection.ids.length === 0) return;
    for (const id of selection.ids) {
      const resolved = resolveSelectedEntity(
        { type: selection.type, ids: [id] },
        workspaceCanvas.activeFloor,
      );
      if (!resolved) continue;
      workspaceCanvas.dispatch({
        type: "duplicate",
        collection: resolved.collection,
        id,
        newId: newEntityId(),
      } as const);
    }
  }, [workspaceCanvas]);

  /** Arrow keys — nudge selected furniture without dragging. */
  const nudgeSelection = useCallback(
    (dxMm: number, dyMm: number) => {
      const { selection } = workspaceCanvas;
      if (selection.type !== "furniture" || selection.ids.length === 0) return;
      workspaceCanvas.updateProject((project) => {
        let next = project;
        for (const id of selection.ids) {
          const floor =
            next.floors.find((entry) => entry.id === next.activeFloorId) ??
            next.floors[0];
          const item = floor?.furniture.find((furniture) => furniture.id === id);
          if (!item) continue;
          next = updateEntityInProject(next, "furniture", id, {
            position: {
              x: item.position.x + dxMm,
              y: item.position.y + dyMm,
            },
          });
        }
        return next;
      });
    },
    [workspaceCanvas],
  );

  const collectSelectedFurnitureMinEdge = useCallback((): PositionedEntity[] => {
    const { selection } = workspaceCanvas;
    const floor = workspaceCanvas.activeFloor;
    const entities: PositionedEntity[] = [];
    for (const id of selection.ids) {
      const item = floor.furniture.find((f) => f.id === id);
      if (!item) continue;
      const widthMm = item.width ?? 600;
      const depthMm = item.depth ?? 600;
      const min = minEdgeFromCenter(item.position.x, item.position.y, widthMm, depthMm);
      entities.push({
        id: item.id,
        xMm: min.xMm,
        yMm: min.yMm,
        widthMm,
        depthMm,
      });
    }
    return entities;
  }, [workspaceCanvas]);

  const applyFurnitureMinEdgeUpdates = useCallback(
    (entities: readonly PositionedEntity[], updates: readonly { id: string; xMm: number; yMm: number }[]) => {
      const sizeById = new Map(entities.map((e) => [e.id, e]));
      workspaceCanvas.updateProject((project) => {
        let p = project;
        for (const u of updates) {
          const ent = sizeById.get(u.id);
          if (!ent) continue;
          const center = centerFromMinEdge(u.xMm, u.yMm, ent.widthMm, ent.depthMm);
          p = updateEntityInProject(p, "furniture", u.id, {
            position: { x: center.cxMm, y: center.cyMm },
          });
        }
        return p;
      });
    },
    [workspaceCanvas],
  );

  const handleAlignEntities = useCallback(
    (axis: "x" | "y", anchor: "min" | "center" | "max") => {
      const { selection } = workspaceCanvas;
      if (selection.type === "none" || selection.ids.length < 2) return;
      const entities = collectSelectedFurnitureMinEdge();
      if (entities.length < 2) return;
      const updates = alignEntities(entities, axis, anchor);
      applyFurnitureMinEdgeUpdates(entities, updates);
    },
    [applyFurnitureMinEdgeUpdates, collectSelectedFurnitureMinEdge, workspaceCanvas],
  );

  const handleDistributeEntities = useCallback(
    (axis: "x" | "y") => {
      const { selection } = workspaceCanvas;
      if (selection.type === "none" || selection.ids.length < 3) return;
      const entities = collectSelectedFurnitureMinEdge();
      if (entities.length < 3) return;
      const updates = distributeEntities(entities, axis);
      applyFurnitureMinEdgeUpdates(entities, updates);
    },
    [applyFurnitureMinEdgeUpdates, collectSelectedFurnitureMinEdge, workspaceCanvas],
  );

  const handleSpaceEntities = useCallback(
    (axis: "x" | "y", gapMm: number) => {
      const { selection } = workspaceCanvas;
      if (selection.type !== "furniture" || selection.ids.length < 2) return;
      const entities = collectSelectedFurnitureMinEdge();
      if (entities.length < 2) return;
      const updates = spaceEntitiesWithExactGap(entities, axis, gapMm);
      applyFurnitureMinEdgeUpdates(entities, updates);
      setWorkspaceMessage(
        `Spaced ${entities.length} items · ${axis.toUpperCase()} · ${Math.round(gapMm)} mm gap`,
      );
    },
    [applyFurnitureMinEdgeUpdates, collectSelectedFurnitureMinEdge, workspaceCanvas],
  );

  const setTool = useCallback((tool: PlannerTool) => {
    setActiveTool(tool);
    armedToolRef.current = tool;
    setPendingCatalogItemId(null);
    pendingWorkstationConfigRef.current = null;
    setPendingWorkstationConfig(null);
    canvasRef.current?.setTool(tool);
  }, []);

  const toggleView = useCallback(() => {
    setViewMode((current) => (current === "2d" ? "3d" : "2d"));
  }, []);

  const runUndo = useCallback(() => {
    workspaceCanvas.undo();
    canvasRef.current?.cancel();
  }, [workspaceCanvas]);

  const runRedo = useCallback(() => {
    workspaceCanvas.redo();
    canvasRef.current?.cancel();
  }, [workspaceCanvas]);

  const handleInventoryPlace = useCallback(
    (itemId: string) => {
      pendingWorkstationConfigRef.current = null;
      setPendingWorkstationConfig(null);
      setPendingCatalogItemId(itemId);
      setActiveTool("placement");
      armedToolRef.current = "placement";
      canvasRef.current?.setTool("placement");
      const item = catalog.resolveItem(itemId);
      const label = item?.shortName ?? item?.name ?? itemId;
      // Same honesty as workstation arm: Place is two-step (arm → canvas click).
      setWorkspaceMessage(`Click canvas to place ${label}`);
    },
    [catalog],
  );

  const handleWorkstationConfigPlace = useCallback(
    (config: WorkstationConfigV0) => {
      setPendingCatalogItemId(null);
      pendingWorkstationConfigRef.current = config;
      setPendingWorkstationConfig(config);
      setActiveTool("placement");
      armedToolRef.current = "placement";
      canvasRef.current?.setTool("placement");
      setWorkspaceMessage(
        `Click canvas to place ${workstationConfigKey(config)}`,
      );
    },
    [],
  );

  /** P-UI-4: arm default linear workstation place from empty-state CTA. */
  const handleStartPlaceWorkstation = useCallback(() => {
    const config = resolveWorkstationConfigFromDraft(
      defaultWorkstationConfiguratorDraftV0(),
    );
    handleWorkstationConfigPlace(config);
  }, [handleWorkstationConfigPlace]);

  /** Immediate grid batch place from configurator (2 / 4 / 10 seats). */
  const handleWorkstationConfigBatchPlace = useCallback(
    (config: WorkstationConfigV0, count: number) => {
      if (!isWorkstationV0BatchPlaceCount(count)) {
        setWorkspaceMessage("Batch place supports 2, 4, or 10 seats only.");
        return;
      }
      // Clear any armed single-place so canvas click cannot double-fire.
      pendingWorkstationConfigRef.current = null;
      setPendingWorkstationConfig(null);
      setPendingCatalogItemId(null);

      let placedIds: string[] = [];
      workspaceCanvas.updateProject((project) => {
        // Offset next batch below existing furniture so re-clicks do not stack.
        const floor =
          project.floors.find((f) => f.id === project.activeFloorId) ??
          project.floors[0];
        let originY = 0;
        if (floor && floor.furniture.length > 0) {
          let maxBottom = 0;
          for (const item of floor.furniture) {
            const bottom = item.position.y + (item.depth ?? 0);
            if (bottom > maxBottom) maxBottom = bottom;
          }
          originY = maxBottom + 400;
        }
        const result = placeWorkstationInstancesOnProject(
          project,
          config,
          count,
          {
            originMm: { x: 0, y: originY },
            columns: Math.min(count, 5),
          },
        );
        const ids = result.action.payload?.ids;
        if (Array.isArray(ids)) {
          placedIds = ids.filter((id): id is string => typeof id === "string");
        }
        return result.project;
      });

      if (placedIds.length > 0) {
        // W3: single-id selection only — multi-id + Delete wipes entire batch.
        workspaceCanvas.setSelection(selectionAfterBatchPlace(placedIds));
        setActiveTool("select");
        armedToolRef.current = "select";
        canvasRef.current?.setTool("select");
      }
      setWorkspaceMessage(
        `Placed ${placedIds.length || count}× ${workstationConfigKey(config)}`,
      );
    },
    [workspaceCanvas],
  );

  const handlePlaceAtPoint = useCallback(
    (point: PlannerPoint) => {
      // Systems configurator path — free size/shape/modules combo.
      // Consume-once via ref so double pointer-up before re-render cannot double-place.
      const armedConfig = takePendingWorkstationConfig(
        pendingWorkstationConfigRef,
      );
      if (armedConfig) {
        setPendingWorkstationConfig(null);
        let placedId: string | null = null;
        workspaceCanvas.updateProject((project) => {
          const placed = placeWorkstationConfigOnProject(
            project,
            armedConfig,
            point,
          );
          placedId =
            typeof placed.action.payload?.id === "string"
              ? placed.action.payload.id
              : null;
          return placed.project;
        });
        if (placedId) {
          workspaceCanvas.setSelection({ type: "furniture", ids: [placedId] });
          setActiveTool("select");
          armedToolRef.current = "select";
          canvasRef.current?.setTool("select");
        }
        setWorkspaceMessage(`Placed ${workstationConfigKey(armedConfig)}`);
        return;
      }

      if (!pendingCatalogItemId) return;
      const item = catalog.resolveItem(pendingCatalogItemId);
      if (!item) {
        setPendingCatalogItemId(null);
        return;
      }

      // cabinet-v0 only: write+stamp so G8 can load; other items stay procedural.
      if (shouldPlaceModularWithGeneratedGlb(item)) {
        const catalogItem = item;
        const baseProject = workspaceCanvas.project;
        setPendingCatalogItemId(null);
        setWorkspaceMessage(
          `Placing ${catalogItem.shortName ?? catalogItem.name} (GLB)…`,
        );
        void (async () => {
          try {
            const result = await placeModularWithGeneratedGlbBrowser(
              baseProject,
              catalogItem,
              point,
              // Try persistent generated GLB (Supabase) when configured; core falls
              // back to procedural mesh if the write API returns not_configured.
              { placedFrom: "click", writeToPublic: true },
            );
            workspaceCanvas.updateProject(() => result.project);
            const placedId =
              typeof result.furnitureId === "string"
                ? result.furnitureId
                : null;
            if (placedId) {
              workspaceCanvas.setSelection({
                type: "furniture",
                ids: [placedId],
              });
              setActiveTool("select");
              armedToolRef.current = "select";
              canvasRef.current?.setTool("select");
            }
            setWorkspaceMessage(
              result.stamped
                ? `Placed ${catalogItem.shortName ?? catalogItem.name} (GLB ready)`
                : `Placed ${catalogItem.shortName ?? catalogItem.name} (procedural; GLB write skipped)`,
            );
          } catch (err) {
            // Fall back to procedural place so inventory never dead-ends.
            let placedId: string | null = null;
            workspaceCanvas.updateProject((project) => {
              const placed = placeCatalogItemInProject(
                project,
                catalogItem,
                null,
                { placedFrom: "click", position: point },
              );
              placedId =
                typeof placed.result.action.payload?.id === "string"
                  ? placed.result.action.payload.id
                  : placed.snapshot.placementId;
              return placed.result.project;
            });
            if (placedId) {
              workspaceCanvas.setSelection({
                type: "furniture",
                ids: [placedId],
              });
              setActiveTool("select");
              armedToolRef.current = "select";
              canvasRef.current?.setTool("select");
            }
            setWorkspaceMessage(
              `Placed ${catalogItem.shortName ?? catalogItem.name} (procedural fallback)`,
            );
            console.warn(
              "[OOPlannerWorkspace] modular GLB place failed; procedural fallback",
              err,
            );
          }
        })();
        return;
      }

      let placedId: string | null = null;
      workspaceCanvas.updateProject((project) => {
        const placed = placeCatalogItemInProject(project, item, null, {
          placedFrom: "click",
          position: point,
        });
        placedId =
          typeof placed.result.action.payload?.id === "string"
            ? placed.result.action.payload.id
            : typeof placed.snapshot.placementId === "string"
              ? placed.snapshot.placementId
              : null;
        return placed.result.project;
      });
      setPendingCatalogItemId(null);
      if (placedId) {
        workspaceCanvas.setSelection({ type: "furniture", ids: [placedId] });
        setActiveTool("select");
        armedToolRef.current = "select";
        canvasRef.current?.setTool("select");
      }
      setWorkspaceMessage(`Placed ${item.shortName ?? item.name}`);
    },
    [pendingCatalogItemId, workspaceCanvas, catalog],
  );

  const handleFloorChange = useCallback(
    (floorId: string) => {
      workspaceCanvas.updateProject(
        (project) => setActiveFloor(project, floorId).project,
      );
    },
    [workspaceCanvas],
  );

  const handleSave = useCallback(() => {
    void (async () => {
      // Align with TopBar single save map — do not dual "Saving…" strings.
      setWorkspaceMessage(guestMode ? "Saving draft…" : "Saving…");
      try {
        await autosave.flushPersist();
        setWorkspaceMessage(guestMode ? "Draft saved on this device" : "Saved on this device");
      } catch {
        setWorkspaceMessage("Save failed");
      }
    })();
  }, [autosave, guestMode]);

  const handleExport = useCallback(
    (format = "json") => {
      const downloadVerb = guestMode ? "Downloaded" : "Exported";

      // Cloud storage export (member) — Supabase Storage via service route.
      if (format === "cloud-json" || format === "cloud-boq-csv") {
        if (guestMode) {
          setWorkspaceMessage("Cloud export requires member sign-in.");
          return;
        }
        void (async () => {
          try {
            let body = "";
            let filename = "plan-export.json";
            let contentType = "application/json";
            if (format === "cloud-boq-csv") {
              const summary = buildPlannerFurnitureBoq(workspaceCanvas.project);
              if (summary.totalItems === 0) {
                setWorkspaceMessage("No furniture to export for BOQ (place items first).");
                return;
              }
              body = exportPlannerFurnitureBoqToCsv(summary);
              filename = buildPlannerBoqFilename(workspaceCanvas.project, "csv");
              contentType = "text/csv";
            } else {
              body = `${JSON.stringify(workspaceCanvas.project, null, 2)}\n`;
              filename = `${(workspaceCanvas.project.name || "plan")
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "") || "plan"}.json`;
            }
            const response = await browserApiFetch("/api/planner/export/cloud", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                planId: workspaceCanvas.project.id,
                filename,
                contentType,
                body,
              }),
            });
            if (!response.ok) {
              setWorkspaceMessage(
                await readPlannerApiError(response, "Cloud export failed."),
              );
              return;
            }
            const payload = (await response.json()) as {
              success?: boolean;
              publicUrl?: string;
            };
            if (!payload.success) {
              setWorkspaceMessage("Cloud export failed.");
              return;
            }
            setWorkspaceMessage(
              payload.publicUrl
                ? `Saved to cloud storage.`
                : "Saved export to cloud storage.",
            );
          } catch (err) {
            setWorkspaceMessage(
              err instanceof Error ? err.message : "Cloud export failed.",
            );
          }
        })();
        return;
      }

      // First-class project furniture BOQ (JSON / CSV) — all placed furniture.
      if (format === "boq" || format === "boq-json" || format === "boq-csv") {
        const summary = buildPlannerFurnitureBoq(workspaceCanvas.project);
        if (summary.totalItems === 0) {
          setWorkspaceMessage("No furniture to export for BOQ (place items first).");
          return;
        }
        if (format === "boq-csv") {
          const filename = buildPlannerBoqFilename(workspaceCanvas.project, "csv");
          downloadFurnitureBoqCSV(exportPlannerFurnitureBoqToCsv(summary), filename);
          setWorkspaceMessage(
            `${downloadVerb} BOQ CSV: ${summary.totalItems} items · ${summary.totalLines} lines · ₹${summary.totalInr.toLocaleString("en-IN")} incl. GST (demo list prices)`,
          );
          return;
        }
        const filename = buildPlannerBoqFilename(workspaceCanvas.project, "json");
        downloadFurnitureBoqJSON(exportPlannerFurnitureBoqToJson(summary), filename);
        setWorkspaceMessage(
          `${downloadVerb} BOQ JSON: ${summary.totalItems} items · ${summary.totalLines} lines · ₹${summary.totalInr.toLocaleString("en-IN")} incl. GST (demo list prices)` +
            (summary.unpricedItemCount > 0
              ? ` · ${summary.unpricedItemCount} unpriced`
              : ""),
        );
        return;
      }

      // Specialty systems-v0 workstation dump only. Customer BOQ / quote / handoff
      // use buildPlannerFurnitureBoq (see boq-json / boq-csv / quote / boq-pdf).
      if (format === "workstation-boq") {
        const summary = summarizeWorkstationBoqV0(workspaceCanvas.project);
        if (summary.totalInstances === 0) {
          setWorkspaceMessage("No workstation seats to export (place systems v0 first).");
          return;
        }
        const slug = (workspaceCanvas.project.name || "plan")
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "plan";
        const filename = `${slug}-workstation-boq-v0.json`;
        downloadWorkstationBoqJSON(summary, filename);
        setWorkspaceMessage(
          `Exported specialty workstation BOQ (not the full furniture BOQ): ${summary.totalSeats} seats · ${summary.lines.length} lines · ₹${summary.totalInr.toLocaleString("en-IN")} incl. GST (demo list — not approved commercial)`,
        );
        return;
      }

      if (format === "quote" || format === "boq-pdf") {
        const summary = buildPlannerFurnitureBoq(workspaceCanvas.project);
        if (summary.totalItems === 0) {
          setWorkspaceMessage("No furniture to quote. Place catalog items first.");
          return;
        }
        if (format === "boq-pdf") {
          void exportBoqOnly(
            workspaceCanvas.project.name || "Workspace Plan",
            furnitureBoqToPdfRows(summary),
            { brandName: "One&Only" },
          )
            .then(() => {
              trackConversionEvent(CONVERSION_EVENTS.BOQ_GENERATED, {
                productCount: summary.totalItems,
                source: "planner-branded-pdf",
                locale: "en",
              });
              setWorkspaceMessage(
                `${downloadVerb} branded BOQ PDF: ${summary.totalItems} items · demo list prices (not approved commercial)`,
              );
            })
            .catch(() => {
              setWorkspaceMessage("Branded BOQ PDF export failed.");
            });
          return;
        }
        const items = furnitureBoqToQuoteCartItems(summary);
        for (const item of items) {
          addQuoteItem({ id: item.id, name: item.name, qty: item.qty });
        }
        trackConversionEvent(CONVERSION_EVENTS.BOQ_GENERATED, {
          productCount: summary.totalItems,
          source: "planner-quote-cart",
          locale: "en",
        });
        setWorkspaceMessage(
          `Added ${summary.totalItems} furniture items to quote cart · ${items.length} lines` +
            (summary.unpricedItemCount > 0
              ? ` · ${summary.unpricedItemCount} unpriced (demo honesty)`
              : ` · ₹${summary.totalInr.toLocaleString("en-IN")} demo list incl. GST`),
        );
        return;
      }

      const check = preflightPlannerExport(workspaceCanvas.project, format);
      if (check.status !== "ready") {
        setWorkspaceMessage(
          check.messages[0] ?? `Export unavailable for ${format}`,
        );
        return;
      }
      if (format === "json") {
        downloadJSON(workspaceCanvas.project, check.filename);
        setWorkspaceMessage(`${downloadVerb} ${check.filename}`);
        return;
      }
      if (format === "svg") {
        const ok = downloadSVG(workspaceCanvas.project, undefined, check.filename);
        setWorkspaceMessage(
          ok
            ? `${downloadVerb} ${check.filename}`
            : "SVG export failed. The floor has no drawable geometry.",
        );
        return;
      }
      if (format === "png") {
        void downloadPNG(
          document.createElement("canvas"),
          workspaceCanvas.project,
          check.filename,
        ).then((ok) => {
          setWorkspaceMessage(
            ok
              ? `${downloadVerb} ${check.filename}`
              : "PNG export failed. Try SVG export or reduce plan size.",
          );
        });
        return;
      }
      if (format === "pdf") {
        void downloadPDF(workspaceCanvas.project, undefined, check.filename).then(
          (ok) => {
            setWorkspaceMessage(
              ok
                ? `${downloadVerb} ${check.filename}`
                : "PDF export failed. Try SVG export or reduce plan size.",
            );
          },
        );
        return;
      }
      if (format === "dxf") {
        void downloadDXF(workspaceCanvas.project, check.filename).then((ok) => {
          setWorkspaceMessage(
            ok
              ? `${downloadVerb} ${check.filename}`
              : "DXF export failed. Check that the floor has walls or furniture.",
          );
        });
        return;
      }
      setWorkspaceMessage(
        check.messages[0] ?? `Export unavailable for ${format}`,
      );
    },
    [workspaceCanvas, addQuoteItem, guestMode],
  );

  const handleSendToOando = useCallback(
    async (
      contact: HandoffContactDraft,
      options: { confirmDemoPricing: true },
    ) => {
      if (guestMode) {
        setWorkspaceMessage("Sign in as a member to send the BOQ to Oando.");
        return;
      }
      if (options.confirmDemoPricing !== true) {
        setWorkspaceMessage(
          "Confirm that demo list prices are not approved commercial quotes before sending.",
        );
        return;
      }
      if (validationResult.errors > 0) {
        setWorkspaceMessage("Resolve validation errors before sending to Oando.");
        return;
      }
      const summary = buildPlannerFurnitureBoq(workspaceCanvas.project);
      if (summary.totalItems === 0) {
        setWorkspaceMessage("Place furniture before sending a BOQ.");
        return;
      }

      if (!handoffIdempotencyKeyRef.current) {
        handoffIdempotencyKeyRef.current =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `handoff-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      }
      const idempotencyKey = handoffIdempotencyKeyRef.current;
      const projectId = workspaceCanvas.project.id || planId || "untitled";

      trackConversionEvent(CONVERSION_EVENTS.HANDOFF_INTENT, {
        projectId,
        channel: "planner-api",
        locale: "en",
      });

      setHandoffBusy(true);
      setWorkspaceMessage("Sending BOQ to Oando…");
      try {
        const response = await browserApiFetch("/api/planner/handoff", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            idempotencyKey,
            // Only the Review checkbox can set this true — never invent confirmation.
            confirmDemoPricing: options.confirmDemoPricing,
            contact: {
              name: contact.name.trim(),
              company: contact.company.trim() || undefined,
              email: contact.email.trim() || undefined,
              phone: contact.phone.trim() || undefined,
              notes: contact.notes.trim() || undefined,
            },
            boq: furnitureBoqToHandoffPayload(summary),
          }),
        });

        if (!response.ok) {
          const message = await readPlannerApiError(
            response,
            "Handoff failed.",
          );
          trackConversionEvent(CONVERSION_EVENTS.HANDOFF_FAILURE, {
            projectId,
            channel: "planner-api",
            reason: String(response.status),
            locale: "en",
          });
          setWorkspaceMessage(message);
          return;
        }

        const body = (await response.json()) as {
          success?: boolean;
          referenceId?: string;
          message?: string;
          idempotentReplay?: boolean;
        };
        const referenceId =
          typeof body.referenceId === "string" ? body.referenceId : "";
        if (referenceId) setLastHandoffReference(referenceId);
        // New successful send gets a fresh key so a later edit can be a new submission.
        if (!body.idempotentReplay) {
          handoffIdempotencyKeyRef.current = null;
        }
        trackConversionEvent(CONVERSION_EVENTS.HANDOFF_SUCCESS, {
          projectId,
          channel: "planner-api",
          locale: "en",
        });
        setWorkspaceMessage(
          body.message?.trim() ||
            (referenceId
              ? `BOQ sent to Oando. Reference ${referenceId}`
              : "BOQ sent to Oando."),
        );
      } catch {
        trackConversionEvent(CONVERSION_EVENTS.HANDOFF_FAILURE, {
          projectId,
          channel: "planner-api",
          reason: "network",
          locale: "en",
        });
        setWorkspaceMessage(
          "Network error while sending. Your draft is still on this device.",
        );
      } finally {
        setHandoffBusy(false);
      }
    },
    [guestMode, planId, validationResult.errors, workspaceCanvas.project],
  );

  const handleImportClick = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const handleSketchToPlanClick = useCallback(() => {
    sketchInputRef.current?.click();
  }, []);

  const handleUploadUnderlayClick = useCallback(() => {
    underlayInputRef.current?.click();
  }, []);

  /** Place JPG/PNG/WebP/GIF/SVG as locked canvas underlay (no AI conversion). */
  const handleUnderlayFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      try {
        const image = await readFloorPlanImageFile(file);
        const draft = buildLockedUnderlayFromFloorPlan(image);
        workspaceCanvas.updateProject((project) =>
          setBackgroundImage(project, draft).project,
        );
        setWorkspaceMessage(
          `Reference underlay placed from ${image.fileName}. Calibrate scale from Properties if needed.`,
        );
        requestAnimationFrame(() => {
          canvasRef.current?.fitToView?.();
        });
      } catch (error) {
        setWorkspaceMessage(
          error instanceof Error
            ? error.message
            : "Could not place that reference underlay.",
        );
      }
    },
    [workspaceCanvas],
  );

  const dismissSketchUi = useCallback(() => {
    setSketchUi({ status: "idle" });
  }, []);

  const handleSketchFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      setSketchUi({ status: "converting", fileName: file.name });
      try {
        const image = await readFloorPlanImageFile(file);
        if (!/^data:image\/(png|jpe?g|webp);base64,/i.test(image.dataUrl)) {
          setSketchUi({
            status: "fallback",
            fileName: file.name,
            reason: "unsupported_input",
            message: getSketchRecoveryMessage("unsupported_input"),
          });
          return;
        }

        const response = await browserApiFetch("/api/planner/sketch-to-plan", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            imageDataUrl: image.dataUrl,
            fileName: file.name,
            prompt: "Convert this floor sketch into editable walls in millimetres.",
            includeRooms: true,
          }),
        });

        const body = (await response.json().catch(() => null)) as
          | {
              success?: boolean;
              status?: string;
              objects?: SketchToPlanResponse["objects"];
              warnings?: string[];
              reason?: SketchRecoveryReason;
              message?: string;
              error?: string;
            }
          | null;

        if (!response.ok) {
          const apiMessage = await readPlannerApiError(
            response,
            "Sketch conversion failed.",
          );
          setSketchUi({
            status: "error",
            fileName: file.name,
            message:
              body?.message ??
              body?.error ??
              apiMessage,
          });
          setWorkspaceMessage(body?.message ?? body?.error ?? apiMessage);
          return;
        }

        const underlay = {
          dataUrl: image.dataUrl,
          width: image.width,
          height: image.height,
        };

        if (body?.status === "fallback") {
          setSketchUi({
            status: "fallback",
            fileName: file.name,
            reason: body.reason ?? "server_error",
            message:
              body.message ??
              getSketchRecoveryMessage(body.reason ?? "server_error"),
            underlay,
          });
          return;
        }

        if (body?.status === "preview" && Array.isArray(body.objects)) {
          setSketchUi({
            status: "preview",
            fileName: file.name,
            objects: body.objects,
            warnings: body.warnings ?? [],
            underlay,
          });
          return;
        }

        setSketchUi({
          status: "error",
          fileName: file.name,
          message: "Sketch conversion returned an unexpected response.",
        });
      } catch (error) {
        setSketchUi({
          status: "error",
          fileName: file.name,
          message:
            error instanceof Error
              ? error.message
              : "Could not read or convert that sketch.",
        });
      }
    },
    [],
  );

  const acceptSketchGeometry = useCallback(() => {
    if (sketchUi.status !== "preview") return;
    const walls = sketchUi.objects.filter(
      (object): object is Extract<SketchToPlanResponse["objects"][number], { type: "wall" }> =>
        object.type === "wall",
    );
    const underlay = sketchUi.underlay;
    workspaceCanvas.updateProject((project) => {
      let next = applySketchWallObjects(project, walls, newEntityId);
      if (underlay) {
        const mmPerPixel = defaultUnderlayMmPerPixel(underlay.width, 10_000);
        next = setBackgroundImage(next, {
          dataUrl: underlay.dataUrl,
          position: { x: 0, y: 0 },
          scale: 1,
          opacity: 0.4,
          rotation: 0,
          locked: true,
          imageWidthPx: underlay.width,
          imageHeightPx: underlay.height,
          mmPerPixel,
        }).project;
      }
      return next;
    });
    setWorkspaceMessage(
      `Accepted ${walls.length} wall${walls.length === 1 ? "" : "s"} from ${sketchUi.fileName}` +
        (underlay ? " · sketch kept as underlay" : "") +
        ". Undo to reverse.",
    );
    setSketchUi({ status: "idle" });
    requestAnimationFrame(() => {
      canvasRef.current?.fitToView?.();
    });
  }, [sketchUi, workspaceCanvas]);

  const placeSketchUnderlayOnly = useCallback(() => {
    if (sketchUi.status !== "fallback" && sketchUi.status !== "preview") return;
    const underlay = sketchUi.underlay;
    if (!underlay) return;
    applyUnderlayFromSketch(underlay);
    setWorkspaceMessage(
      `Placed underlay from ${sketchUi.fileName}. Calibrate scale from Properties if needed.`,
    );
    setSketchUi({ status: "idle" });
    requestAnimationFrame(() => {
      canvasRef.current?.fitToView?.();
    });
  }, [applyUnderlayFromSketch, sketchUi]);

  const rejectSketchGeometry = useCallback(() => {
    if (sketchUi.status === "preview") {
      setWorkspaceMessage(`Rejected sketch conversion for ${sketchUi.fileName}.`);
    }
    setSketchUi({ status: "idle" });
  }, [sketchUi]);

  const handleValidationFocus = useCallback(
    (issue: ValidationIssue) => {
      if (issue.objectIds.length > 0) {
        workspaceCanvas.setSelection({
          type: "furniture",
          ids: [...issue.objectIds],
        });
      }
      if (issue.focusMm) {
        canvasRef.current?.focusOnPoint(issue.focusMm.x, issue.focusMm.y);
      }
    },
    [workspaceCanvas],
  );

  const handleImportFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const raw = String(reader.result ?? "");
          const result = importPlannerPlannerText(raw);
          if (!result.success || !result.project) {
            const firstError = result.errors.find((error) => error.severity === "error");
            setWorkspaceMessage(
              firstError?.message ??
                "Could not import that file. Use an Open3D plan JSON export.",
            );
            return;
          }
          workspaceCanvas.replaceProject(result.project);
          setWorkspaceMessage(`Imported ${file.name}`);
          requestAnimationFrame(() => {
            canvasRef.current?.fitToView?.();
          });
        } catch {
          setWorkspaceMessage(
            "Could not import that file. Use an Open3D plan JSON export.",
          );
        }
      };
      reader.readAsText(file);
    },
    [workspaceCanvas],
  );

  useEffect(() => {
    if (!workspaceMessage) return;
    const timeoutId = window.setTimeout(() => setWorkspaceMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [workspaceMessage]);

  const paletteHandlers = useMemo<PaletteCommandHandlers>(
    () => ({
      setTool,
      toggleView,
      openPalette: () => setPaletteOpen(true),
      undo: runUndo,
      redo: runRedo,
      cancel: () => {
        setPendingCatalogItemId(null);
        canvasRef.current?.cancel();
        workspaceCanvas.setSelection({ type: "none", ids: [] });
      },
      commit: () => {
        // Enter commits; delegate to canvas for drawing states (task6)
        canvasRef.current?.commit?.();
      },
      zoomReset: () => canvasRef.current?.resetZoom(),
      // fit available for canvas-max / bounds restore (task6)
      fit: () => canvasRef.current?.fitToView?.(),
    }),
    [runRedo, runUndo, setTool, toggleView, workspaceCanvas],
  );

  useWorkspaceKeyboard({
    setTool,
    toggleView,
    openPalette: () => setPaletteOpen(true),
    undo: runUndo,
    redo: runRedo,
    deleteSelection,
    duplicateSelection,
    nudgeSelection,
    cancel: () => {
      setPendingCatalogItemId(null);
      canvasRef.current?.cancel();
      workspaceCanvas.setSelection({ type: "none", ids: [] });
    },
    commit: () => {
      // delegate to canvas commit for drawing (wall/room/dim); numeric handled in props (task6)
      canvasRef.current?.commit?.();
    },
    beginTemporaryPan: () => {
      canvasRef.current?.setTool("pan");
      setActiveTool("pan");
    },
    endTemporaryPan: () => {
      const armedTool = armedToolRef.current;
      setActiveTool(armedTool);
      canvasRef.current?.setTool(armedTool);
    },
  });

  // Only show snap/measure when the canvas is actively reporting — not always-on prefs noise.
  const measurementLabel =
    canvasStatus?.previewLengthMm !== null &&
    canvasStatus?.previewLengthMm !== undefined
      ? formatLengthDisplay(canvasStatus.previewLengthMm, displayUnit)
      : canvasStatus?.snapKind && canvasStatus.snapKind !== "none"
        ? formatSnapStatus(canvasStatus.snapKind)
        : null;

  const selectionLabel = formatSelectionStatus(workspaceCanvas.selection);
  const planMetrics = summarizeFloorMetrics(activeFloor, validationResult.errors);

  /**
   * Live commercial preview for Review — same builder as handleExport / handoff.
   * No invented prices: unitNote is honesty-only ("demo list" | "unpriced").
   * Panel displays at most 8 lines; full list length drives "+N more".
   */
  const reviewBoqPreview = useMemo(() => {
    const summary = buildPlannerFurnitureBoq(workspaceCanvas.project);
    const boqLines: ReviewBoqLinePreview[] = summary.lines.map((line) => ({
      name: line.name,
      quantity: line.quantity,
      unitNote: line.priced ? "demo list" : "unpriced",
    }));
    return {
      pricingMode: summary.pricingMode,
      unpricedItemCount: summary.unpricedItemCount,
      boqLines,
    };
  }, [workspaceCanvas.project]);

  // Prefer autosave honesty exports (storage / cloudEnabled / isLocalSaved).
  // cloudEnabled stays false today — label table must never imply account save.
  const saveStorage = autosave.storage ?? "local";
  const saveCloudEnabled = autosave.cloudEnabled ?? false;
  const isLocalSaved = autosave.isLocalSaved ?? autosave.isSynced;
  /** TopBar is the only visible save authority. */
  const saveStatusLabel = plannerSaveStatusLabel({
    status: autosave.status,
    storage: saveStorage,
    lastSavedAt: autosave.lastSavedAt,
    cloudEnabled: saveCloudEnabled,
    guestMode,
    isOffline: autosave.isOffline,
  });
  const showGuestPlaceHint =
    guestMode &&
    planMetrics.furniture === 0 &&
    !pendingCatalogItem &&
    !pendingWorkstationConfig;

  if (!hydrated) {
    return (
      <div
        className="planner-route-host open3d-route-host planner-route-host--loading"
        aria-busy="true"
        aria-label="Loading planner"
      >
        <div className="open3d-loading-shell" role="status">
          <div className="open3d-loading-shell__bar" />
          <div className="open3d-loading-shell__bar open3d-loading-shell__bar--short" />
          <p>Restoring your floor plan…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="planner-workspace-root open3d-workspace-root planner-fill">
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        aria-label="Import project file"
        onChange={handleImportFile}
      />
      <input
        ref={sketchInputRef}
        type="file"
        accept={SKETCH_TO_PLAN_FILE_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        aria-label="Upload sketch for Sketch to plan"
        onChange={(event) => {
          void handleSketchFile(event);
        }}
      />
      <input
        ref={underlayInputRef}
        type="file"
        accept={FLOOR_PLAN_FILE_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        aria-label="Upload reference floor plan image or SVG underlay"
        data-testid="planner-underlay-file-input"
        onChange={(event) => {
          void handleUnderlayFile(event);
        }}
      />
      <SketchToPlanDialog
        state={sketchUi}
        onAccept={acceptSketchGeometry}
        onReject={rejectSketchGeometry}
        onDismiss={dismissSketchUi}
        onPlaceUnderlayOnly={placeSketchUnderlayOnly}
      />
      <PlannerSyncConflictDialog
        open={Boolean(syncConflict)}
        details={syncConflict?.details}
        onKeepLocal={() => handleResolveSyncConflict("local")}
        onKeepCloud={() => handleResolveSyncConflict("cloud")}
        onDismiss={() => setSyncConflict(null)}
      />
      <ModularPlannerShell
        accessContext={accessContext}
        projectName={workspaceCanvas.project.name}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        displayUnit={displayUnit}
        onDisplayUnitChange={handleDisplayUnitChange}
        isModified={autosave.isModified}
        isLocalSaved={isLocalSaved}
        isSynced={isLocalSaved}
        saveStatus={autosave.status}
        saveStatusLabel={saveStatusLabel}
        storage={saveStorage}
        cloudEnabled={saveCloudEnabled}
        isOffline={autosave.isOffline}
        canUndo={workspaceCanvas.canUndo}
        canRedo={workspaceCanvas.canRedo}
        undoLabel={undoLabel}
        redoLabel={redoLabel}
        onUndo={runUndo}
        onRedo={runRedo}
        onProjectNameChange={handleProjectNameChange}
        onSave={handleSave}
        onExport={(format) => handleExport(format ?? "json")}
        onImport={handleImportClick}
        onSketchToPlan={handleSketchToPlanClick}
        onFloorChange={handleFloorChange}
        floors={workspaceCanvas.project.floors.map((floor) => ({
          id: floor.id,
          name: floor.name,
        }))}
        activeFloorId={workspaceCanvas.project.activeFloorId}
        fillParent
        density={density}
        onToggleDensity={toggleDensity}
        gridEnabled={gridEnabled}
        snapEnabled={snapEnabled}
        orthogonalLock={orthogonalLock}
        onToggleGrid={toggleGrid}
        onToggleSnap={toggleSnap}
        onToggleOrthogonal={toggleOrthogonalLock}
        activeTool={activeTool}
        onToolChange={setTool}
        onZoomReset={() => canvasRef.current?.fitToView()}
        showTools={viewMode === "2d"}
        hasSelection={Boolean(selectedEntity || multiSelection || hasUnderlay || underlayCalibrateSession)}
        layersFloor={activeFloor ?? null}
        layerVisibility={layerVisibility}
        onLayerVisibilityChange={setLayerVisibility}
        inventory={
          <WorkspaceLeftPanel
            catalogItems={catalog.items}
            isLoading={catalog.isLoading && catalog.items.length === 0}
            catalogStatus={catalog.status}
            onItemPlace={handleInventoryPlace}
            onWorkstationConfigPlace={handleWorkstationConfigPlace}
            onWorkstationConfigBatchPlace={handleWorkstationConfigBatchPlace}
            displayUnit={displayUnit}
          />
        }
        assistant={
          <AIAssistDrawer
            embedded
            defaultExpanded
            defaultTab="chat"
            workspaceBridge={workspaceAiBridge}
            panelFill
          />
        }
        review={
          <ReviewQuotePanel
            validation={validationResult}
            furnitureCount={planMetrics.furniture}
            workstationSeats={planMetrics.workstationSeats}
            pricingNote={PLANNER_FURNITURE_BOQ_PRICING_NOTE}
            guestMode={guestMode}
            handoffBusy={handoffBusy}
            lastHandoffReference={lastHandoffReference}
            pricingMode={reviewBoqPreview.pricingMode}
            unpricedItemCount={reviewBoqPreview.unpricedItemCount}
            boqLines={reviewBoqPreview.boqLines}
            onDownloadBoqCsv={() => handleExport("boq-csv")}
            onDownloadBoqPdf={() => handleExport("boq-pdf")}
            onAddAllToQuote={() => handleExport("quote")}
            onSendToOando={handleSendToOando}
            onFocusIssue={handleValidationFocus}
          />
        }
        properties={
          selectedEntity || multiSelection || hasUnderlay || underlayCalibrateSession ? (
            <PropertiesPanel
              selectedEntity={selectedEntity}
              multiSelection={multiSelection}
              displayUnit={displayUnit}
              hostWallLengthMm={selectedHostWallLengthMm}
              underlayCalibratePhase={underlayCalibrateSession?.phase ?? null}
                callbacks={{
                  onUpdateEntity: handleUpdateEntity,
                  onDeleteEntity: handleDeleteEntity,
                  onToggleLock: handleToggleLock,
                  onDuplicateEntity: handleDuplicateEntity,
                  onAlignEntities: handleAlignEntities,
                  onDistributeEntities: handleDistributeEntities,
                  onArrayEntities: handleArrayEntities,
                  onSpaceEntities: handleSpaceEntities,
                  onCalibrateUnderlay: handleCalibrateUnderlay,
                  onStartTwoPointCalibrate: handleStartTwoPointCalibrate,
                  onCancelTwoPointCalibrate: handleCancelTwoPointCalibrate,
                  onDeselect: () =>
                    workspaceCanvas.setSelection({ type: "none", ids: [] }),
                }}
            />
          ) : null
        }
        planMetrics={planMetrics}
        statusLeft={
          <div className="open3d-status-track" tabIndex={0}>
            <span className="open3d-status-pill open3d-status-pill--accent">
              {formatToolStatus(activeTool, viewMode)}
            </span>
            {measurementLabel ? (
              <span className="open3d-status-pill">{measurementLabel}</span>
            ) : null}
            {canvasStatus ? (
              <span className="open3d-status-pill">
                Zoom {canvasStatus.zoomPercent}%
              </span>
            ) : null}
            {selectionLabel ? (
              <span className="open3d-status-pill open3d-status-pill--accent">
                {selectionLabel}
              </span>
            ) : null}
            {pendingCatalogItem || pendingWorkstationConfig ? (
              <span className="open3d-status-pill open3d-status-pill--placement">
                Placing{" "}
                {pendingWorkstationConfig
                  ? workstationConfigKey(pendingWorkstationConfig)
                  : (pendingCatalogItem?.shortName ??
                    pendingCatalogItem?.name ??
                    "item")}
              </span>
            ) : null}
            {showGuestPlaceHint ? (
              <span
                className="open3d-status-pill open3d-status-pill--accent"
                data-testid="open3d-guest-place-hint"
              >
                Place workstation · library
              </span>
            ) : null}
            {catalog.status !== "ready" ? (
              <span className="open3d-status-pill open3d-status-pill--muted">
                {catalog.status === "fallback"
                  ? "Offline catalog"
                  : "Loading catalog…"}
              </span>
            ) : null}
            {validationResult.issues.length > 0 ? (
              <span
                className={`open3d-status-pill open3d-status-pill--accent ${workspaceStyles.validationPill}`}
              >
                {validationResult.errors > 0
                  ? `${validationResult.errors} error${validationResult.errors > 1 ? "s" : ""}`
                  : `${validationResult.issues.length} issue${validationResult.issues.length > 1 ? "s" : ""}`}
              </span>
            ) : null}
          </div>
        }
        statusRight={
          <CommandsPaletteTrigger onOpen={() => setPaletteOpen(true)} />
        }
      >
        {viewMode === "2d" ? (
          <div
            className="open3d-canvas-with-rail"
            data-tool={activeTool}
            data-dock-canvas="true"
            data-pending-placement={
              pendingCatalogItemId !== null || pendingWorkstationConfig !== null
                ? "true"
                : undefined
            }
          >
            <PlannerCanvasStage
              ref={canvasRef}
              activeTool={activeTool}
              layerVisibility={layerVisibility}
              workspaceCanvas={workspaceCanvas}
              activeFloor={activeFloor}
              gridEnabled={gridEnabled}
              snapEnabled={snapEnabled}
              orthogonalLock={orthogonalLock}
              displayUnit={displayUnit}
              pendingCatalogPlacement={
                pendingCatalogItemId !== null ||
                pendingWorkstationConfig !== null
              }
              placementItemLabel={
                pendingWorkstationConfig
                  ? workstationConfigKey(pendingWorkstationConfig)
                  : (pendingCatalogItem?.shortName ??
                    pendingCatalogItem?.name ??
                    null)
              }
              onPlaceAtPoint={handlePlaceAtPoint}
              onWallDrawn={handleWallDrawn}
              onDimensionPlaced={handleDimensionPlaced}
              underlayCalibrateActive={Boolean(underlayCalibrateSession)}
              underlayCalibrateAnchor={
                underlayCalibrateSession?.phase === "pick-b"
                  ? underlayCalibrateSession.pointA
                  : null
              }
              onUnderlayCalibratePoint={handleUnderlayCalibratePoint}
              onOpeningPlaced={handleOpeningPlaced}
              onOpeningRejected={handleOpeningRejected}
              onOpeningRepositioned={handleOpeningRepositioned}
              onSelectionChange={handleCanvasSelection}
              onFurnitureModified={handleFurnitureModified}
              onWallEndpointMoved={handleWallEndpointMoved}
              onStatusChange={setCanvasStatus}
            />
            {activeTool === "room" ? (
              <ExactRoomPanel
                key={displayUnit}
                displayUnit={displayUnit}
                onCreate={handleCreateExactRoom}
                onCancel={() => setTool("select")}
              />
            ) : null}
            {/* Tool guidance: rail tooltips. Empty card only when zero geometry. */}
            {isCanvasEmpty && (
              <section
                className="open3d-first-use"
                aria-label="Start the office plan"
                data-testid="planner-first-use"
              >
                <p className="open3d-first-use__eyebrow">
                  {guestMode
                    ? "Guest · local draft in this browser"
                    : "Office layout"}
                </p>
                <h2>Start the floor plan</h2>
                <p>
                  {guestMode
                    ? "Upload a floor plan (JPG, PNG, or SVG), draw walls, or place a workstation from the library."
                    : "Upload a reference underlay, draw walls, or place a workstation — then refine and export."}
                </p>
                <div className="open3d-first-use__actions">
                  <button
                    type="button"
                    onClick={handleUploadUnderlayClick}
                    data-testid="planner-upload-underlay"
                  >
                    Upload reference
                  </button>
                  <button type="button" onClick={() => setTool("wall")}>
                    Draw walls
                  </button>
                  <button type="button" onClick={handleStartPlaceWorkstation}>
                    Place workstation
                  </button>
                </div>
              </section>
            )}
            {/* Seed walls hide the empty card — non-geometry place hint for guests. */}
            {showGuestPlaceHint && !isCanvasEmpty && viewMode === "2d" ? (
              <p
                className="open3d-canvas-placement-hint"
                role="status"
                data-testid="open3d-guest-place-banner"
              >
                Guest · place a workstation from the library
              </p>
            ) : null}
          </div>
        ) : (
          <Lazy3DViewer
            projectData={workspaceCanvas.project}
            {...getPlannerViewerControlProps()}
          />
        )}
      </ModularPlannerShell>
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        handlers={paletteHandlers}
      />
      <span className="sr-only" aria-live="polite">
        {workspaceMessage ??
          `Undo ${workspaceCanvas.canUndo ? "available" : "unavailable"}; redo ${
            workspaceCanvas.canRedo ? "available" : "unavailable"
          }.`}
      </span>
      {workspaceMessage ? (
        <div
          className="open3d-workspace-toast"
          role="status"
          aria-live="polite"
          data-testid="planner-workspace-toast"
        >
          <p className="open3d-workspace-toast__text">{workspaceMessage}</p>
          <button
            type="button"
            className="open3d-workspace-toast__dismiss"
            aria-label="Dismiss message"
            onClick={() => setWorkspaceMessage(null)}
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}
