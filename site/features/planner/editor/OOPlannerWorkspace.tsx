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
import { usePlannerWorkspaceStore } from "@/features/planner/store/workspaceStore";
import {
  Lazy3DViewer,
  getPlannerViewerControlProps,
} from "@/features/planner/3d/ThreeLazyViewer";
import {
  PlannerCanvasStage,
  type PlannerCanvasStageHandle,
  type CanvasStatusSnapshot,
} from "@/features/planner/project/canvas-stage";
import {
  placeCatalogItemInProject,
  placeWorkstationConfigOnProject,
  placeWorkstationInstancesOnProject,
} from "@/features/planner/project/catalog/placementAction";
import type { WorkstationConfigV0 } from "@/features/planner/project/catalog/workstationSystemV0";
import { workstationConfigKey } from "@/features/planner/project/catalog/workstationSystemV0";
import {
  defaultWorkstationConfiguratorDraftV0,
  isWorkstationV0BatchPlaceCount,
  resolveWorkstationConfigFromDraft,
  takePendingWorkstationConfig,
} from "@/features/planner/project/catalog/workstationConfiguratorV0";
import { placeModularWithGeneratedGlbBrowser } from "@/features/planner/asset-engine/mesh/placeModularWithGeneratedGlbBrowser";
import { shouldPlaceModularWithGeneratedGlb } from "@/features/planner/asset-engine/mesh/shouldPlaceModularWithGeneratedGlb";
import { importPlannerPlannerText } from "@/features/planner/project/shared/export/importUtils";
import { usePlannerWorkspaceAutosave } from "@/features/planner/project/persistence/usePlannerWorkspaceAutosave";
import { setActiveFloor } from "@/features/planner/project/model/operations/pureActions";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";
import { addPlannerWall } from "@/features/planner/project/model/actions/walls";
import {
  addPlannerDoor,
  addPlannerWindow,
} from "@/features/planner/project/model/actions/openings";
import { newEntityId } from "@/features/planner/lib/newEntityId";
import type { PlannerProject } from "@/features/planner/project/model/types";
import { preflightPlannerExport } from "@/features/planner/project/shared/export/exportPreflight";
import {
  downloadJSON,
  downloadSVG,
  downloadPNG,
  downloadPDF,
  downloadDXF,
  downloadWorkstationBoqJSON,
  downloadFurnitureBoqJSON,
  downloadFurnitureBoqCSV,
} from "@/features/planner/project/shared/export/exportUtils";
import {
  buildPlannerFurnitureBoq,
  buildPlannerBoqFilename,
  exportPlannerFurnitureBoqToCsv,
  exportPlannerFurnitureBoqToJson,
} from "@/features/planner/project/shared/export/projectFurnitureBoq";
import {
  summarizeWorkstationBoqV0,
  workstationBoqToQuoteCartItems,
} from "@/features/planner/project/catalog/workstationBoqV0";
import { useQuoteCart } from "@/lib/store/quoteCart";
import { usePlannerSvgCatalog } from "@/features/planner/project/catalog/usePlannerWorkspaceCatalog";
import { CanvasToolRail } from "./CanvasToolRail";
import { CommandPalette } from "./CommandPalette";
import { CommandsPaletteTrigger } from "./CommandsPaletteTrigger";
import { LayersPanel } from "./LayersPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import {
  describePlannerRedoLabel,
  describePlannerUndoLabel,
} from "./plannerHistoryLabels";
import { WorkspaceLeftPanel } from "./WorkspaceLeftPanel";
import { WorkspaceShell } from "./WorkspaceShell";
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
  plannerSaveStatusBarLabel,
  formatSelectionStatus,
  formatSnapStatus,
  formatToolStatus,
} from "./workspaceStatusLabels";
import { summarizeFloorMetrics } from "./workspacePlanMetrics";
import type { PlannerDisplayUnit, PlannerPoint } from "@/features/planner/project/model/types";
import { formatLengthDisplay } from "@/features/planner/project/model/units";
import type { PlannerAccessContext } from "@/features/planner/project/lib/commands/plannerAccessContext";
import type { PlannerEntityCollection } from "@/features/planner/project/model/actions/projectActions";
import type { PaletteCommandHandlers } from "@/features/planner/project/lib/commands/paletteCommands";
import { buildSnapStatusLabel } from "@/features/planner/lib/snapStatusLabel";
import {
  DEFAULT_PLANNER_WORKSPACE_PREFERENCES,
} from "@/features/planner/project/store/workspacePreferences";
import {
  patchPlannerWorkspacePreferences,
  readPlannerWorkspacePreferencesFromStorage,
} from "@/features/planner/project/store/workspacePreferencesStorage";
import { applyLayoutToWorkspace } from "@/features/planner/ai/applyLayoutToWorkspace";
import { extractProjectPlacements } from "@/features/planner/ai/extractProjectPlacements";
import type { WorkspaceAiBridge } from "@/features/planner/ai/workspaceAiBridge";
import { takePlannerStartupIntent } from "@/features/planner/onboarding/projectSetup";

export type OOPlannerWorkspaceProps = {
  guestMode: boolean;
  planId?: string;
};

export function OOPlannerWorkspace({
  guestMode,
  planId,
}: OOPlannerWorkspaceProps) {
  const accessContext: PlannerAccessContext = guestMode
    ? "guest"
    : "authenticated";
  const projectName = planId ? `Plan ${planId}` : "Untitled plan";
  const canvasRef = useRef<PlannerCanvasStageHandle>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const workspaceCanvas = useWorkspaceCanvas({
    projectName,
    initialProject: guestMode
      ? createRectangularRoomProject({
          name: projectName,
          widthMm: 5000,
          depthMm: 4000,
        })
      : undefined,
  });
  const addQuoteItem = useQuoteCart((state) => state.addItem);
  // Immediate hydrated: avoids blocking render/restore waterfall; first paint uses default project, restore applies async if present.
  const [hydrated] = useState(true);
  const replaceProjectRef = useRef(workspaceCanvas.replaceProject);
  useLayoutEffect(() => {
    replaceProjectRef.current = workspaceCanvas.replaceProject;
  });

  const autosave = usePlannerWorkspaceAutosave(
    workspaceCanvas.project,
    guestMode,
    planId,
    { hydrated },
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
        return;
      }

      const { pendingBootstrapLayout, setPendingBootstrapLayout } =
        usePlannerWorkspaceStore.getState();
      if (!pendingBootstrapLayout) return;

      const { room } = pendingBootstrapLayout;
      replaceProjectRef.current(
        createRectangularRoomProject({
          name: room?.label || projectName || "Starter plan",
          widthMm: room?.widthMm ?? 5000,
          depthMm: room?.depthMm ?? 4000,
        }),
      );
      setPendingBootstrapLayout(null);
    })();

    return () => {
      cancelled = true;
    };
  }, [guestMode, planId, projectName]);

  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

  useEffect(() => {
    if (viewMode !== "2d") return;
    const frame = requestAnimationFrame(() => {
      canvasRef.current?.fitToView?.();
    });
    return () => cancelAnimationFrame(frame);
  }, [viewMode]);
  const [activeTool, setActiveTool] = useState<PlannerTool>("wall");
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
  const armedToolRef = useRef<PlannerTool>("wall");

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

  const workspaceSelection = workspaceCanvas.selection;
  const multiSelection = useMemo(() => {
    const selection = workspaceSelection;
    if (selection.type === "none" || selection.ids.length <= 1) return null;
    return { type: selection.type, count: selection.ids.length };
  }, [workspaceSelection]);

  const selectedEntity = useMemo(() => {
    if (workspaceCanvas.selection.ids.length !== 1) return null;
    return resolveSelectedEntity(
      workspaceCanvas.selection,
      workspaceCanvas.activeFloor,
    );
  }, [workspaceCanvas.activeFloor, workspaceCanvas.selection]);
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

  const handleStartTemplate = useCallback(() => {
    workspaceCanvas.replaceProject(
      createRectangularRoomProject({
        name: workspaceCanvas.project.name,
        widthMm: 5000,
        depthMm: 4000,
      }),
    );
    setWorkspaceMessage("Created a 5 × 4 m starter room.");
  }, [workspaceCanvas]);

  const handleUpdateEntity = useCallback(
    (
      collection: PlannerEntityCollection,
      id: string,
      updates: Record<string, unknown>,
    ) => {
      workspaceCanvas.dispatch({
        type: "update",
        collection,
        id,
        updates,
      });
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
    (start: PlannerPoint, end: PlannerPoint) => {
      workspaceCanvas.updateProject((project) =>
        addPlannerWall(project, { start, end }, newEntityId),
      );
      setActiveTool("select");
      armedToolRef.current = "select";
      setWorkspaceMessage("Wall added.");
    },
    [workspaceCanvas],
  );

  const handleOpeningPlaced = useCallback(
    (wallId: string, position: number, kind: "door" | "window" = "door") => {
      if (kind === "window") {
        workspaceCanvas.updateProject((project) =>
          addPlannerWindow(
            project,
            {
              wallId,
              position,
              width: 1200,
              height: 1200,
              sillHeight: 900,
              type: "standard",
            },
            newEntityId,
          ),
        );
        setWorkspaceMessage("Window added.");
      } else {
        workspaceCanvas.updateProject((project) =>
          addPlannerDoor(
            project,
            {
              wallId,
              position,
              width: 900,
              height: 2100,
              type: "single",
              swingDirection: "left",
              flipSide: false,
            },
            newEntityId,
          ),
        );
        setWorkspaceMessage(kind === "door" ? "Door added." : "Opening added.");
      }
      setActiveTool("select");
      armedToolRef.current = "select";
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
    (selection: { type: "wall" | "furniture"; id: string } | null) => {
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

  /** Delete / Backspace — one history step for the whole selection. */
  const deleteSelection = useCallback(() => {
    const { selection } = workspaceCanvas;
    if (selection.type === "none" || selection.ids.length === 0) return;
    workspaceCanvas.updateProject((project) =>
      applySelectionDelete(project, selection),
    );
    workspaceCanvas.setSelection({ type: "none", ids: [] });
  }, [workspaceCanvas]);

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
      setWorkspaceMessage(
        guestMode ? "Saving draft locally…" : "Saving plan locally…",
      );
      try {
        await autosave.flushPersist();
        // Honest local-only success copy (cloudEnabled stays false — no account strings).
        setWorkspaceMessage(
          guestMode ? "Draft saved locally" : "Plan saved locally",
        );
      } catch {
        setWorkspaceMessage("Local save failed");
      }
    })();
  }, [autosave, guestMode]);

  const handleExport = useCallback(
    (format = "json") => {
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
            `Exported BOQ CSV: ${summary.totalItems} items · ${summary.totalLines} lines · ₹${summary.totalInr.toLocaleString("en-IN")} incl. GST (demo list prices)`,
          );
          return;
        }
        const filename = buildPlannerBoqFilename(workspaceCanvas.project, "json");
        downloadFurnitureBoqJSON(exportPlannerFurnitureBoqToJson(summary), filename);
        setWorkspaceMessage(
          `Exported BOQ JSON: ${summary.totalItems} items · ${summary.totalLines} lines · ₹${summary.totalInr.toLocaleString("en-IN")} incl. GST (demo list prices)` +
            (summary.unpricedItemCount > 0
              ? ` · ${summary.unpricedItemCount} unpriced`
              : ""),
        );
        return;
      }

      // Systems v0 workstation BOQ — qty + footprint + INR list + GST.
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
          `Exported workstation BOQ: ${summary.totalSeats} seats · ${summary.lines.length} lines · ₹${summary.totalInr.toLocaleString("en-IN")} incl. GST`,
        );
        return;
      }

      if (format === "quote") {
        const summary = summarizeWorkstationBoqV0(workspaceCanvas.project);
        if (summary.totalInstances === 0) {
          setWorkspaceMessage("No workstation seats for quote (place systems v0 first).");
          return;
        }
        const items = workstationBoqToQuoteCartItems(summary);
        for (const item of items) {
          addQuoteItem({ id: item.id, name: item.name, qty: item.qty });
        }
        setWorkspaceMessage(
          `Added ${summary.totalSeats} seats to quote cart · ₹${summary.totalInr.toLocaleString("en-IN")} incl. GST (${items.length} lines)`,
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
        setWorkspaceMessage(`Exported ${check.filename}`);
        return;
      }
      if (format === "svg") {
        downloadSVG(workspaceCanvas.project);
        setWorkspaceMessage(`Exported ${check.filename}`);
        return;
      }
      if (format === "png") {
        void downloadPNG(
          document.createElement("canvas"),
          workspaceCanvas.project,
          check.filename,
        ).then(() => {
          setWorkspaceMessage(`Exported ${check.filename}`);
        });
        return;
      }
      if (format === "pdf") {
        void downloadPDF(workspaceCanvas.project, undefined, check.filename).then(
          () => {
            setWorkspaceMessage(`Exported ${check.filename}`);
          },
        );
        return;
      }
      if (format === "dxf") {
        void downloadDXF(workspaceCanvas.project, check.filename).then(() => {
          setWorkspaceMessage(`Exported ${check.filename}`);
        });
        return;
      }
      // Unreachable for ready formats; preflight blocks png/pdf/dxf as unsupported.
      setWorkspaceMessage(
        check.messages[0] ?? `Export unavailable for ${format}`,
      );
    },
    [workspaceCanvas.project, addQuoteItem],
  );

  const handleImportClick = useCallback(() => {
    importInputRef.current?.click();
  }, []);

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

  const snapPrefsLabel = buildSnapStatusLabel(snapEnabled, gridEnabled);
  const measurementLabel =
    canvasStatus?.previewLengthMm !== null &&
    canvasStatus?.previewLengthMm !== undefined
      ? formatLengthDisplay(canvasStatus.previewLengthMm, displayUnit)
      : canvasStatus?.snapKind && canvasStatus.snapKind !== "none"
        ? formatSnapStatus(canvasStatus.snapKind)
        : `Snap: ${snapPrefsLabel}`;

  const selectionLabel = formatSelectionStatus(workspaceCanvas.selection);
  const planMetrics = summarizeFloorMetrics(activeFloor);

  // Prefer autosave honesty exports (storage / cloudEnabled / isLocalSaved).
  // cloudEnabled stays false today — label table must never imply account save.
  const saveStorage = autosave.storage ?? "local";
  const saveCloudEnabled = autosave.cloudEnabled ?? false;
  const isLocalSaved = autosave.isLocalSaved ?? autosave.isSynced;
  /** Full copy for TopBar; compact strip for footer (avoids dual save essay). */
  const saveStatusLabel = plannerSaveStatusLabel({
    status: autosave.status,
    storage: saveStorage,
    lastSavedAt: autosave.lastSavedAt,
    cloudEnabled: saveCloudEnabled,
    guestMode,
  });
  const saveStatusBarLabel = plannerSaveStatusBarLabel({
    status: autosave.status,
    storage: saveStorage,
    lastSavedAt: autosave.lastSavedAt,
    cloudEnabled: saveCloudEnabled,
    guestMode,
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
    <div className="planner-workspace-root open3d-workspace-root">
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
      <WorkspaceShell
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
        canUndo={workspaceCanvas.canUndo}
        canRedo={workspaceCanvas.canRedo}
        undoLabel={undoLabel}
        redoLabel={redoLabel}
        onUndo={runUndo}
        onRedo={runRedo}
        onSave={handleSave}
        onExport={(format) => handleExport(format ?? "json")}
        onImport={handleImportClick}
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
        onToggleGrid={toggleGrid}
        onToggleSnap={toggleSnap}
        leftPanel={
          <WorkspaceLeftPanel
            catalogItems={catalog.items}
            isLoading={catalog.isLoading && catalog.items.length === 0}
            catalogStatus={catalog.status}
            onItemPlace={handleInventoryPlace}
            onWorkstationConfigPlace={handleWorkstationConfigPlace}
            onWorkstationConfigBatchPlace={handleWorkstationConfigBatchPlace}
            workspaceBridge={workspaceAiBridge}
            displayUnit={displayUnit}
          />
        }
        rightPanel={
          selectedEntity || multiSelection ? (
            <PropertiesPanel
              selectedEntity={selectedEntity}
              multiSelection={multiSelection}
              displayUnit={displayUnit}
              callbacks={{
                onUpdateEntity: handleUpdateEntity,
                onDeleteEntity: handleDeleteEntity,
                onToggleLock: handleToggleLock,
                onDeselect: () =>
                  workspaceCanvas.setSelection({ type: "none", ids: [] }),
              }}
            />
          ) : null
        }
        bottomPanel={
          activeFloor ? (
            <LayersPanel
              floor={activeFloor}
              visibility={layerVisibility}
              onVisibilityChange={setLayerVisibility}
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
            <span
              className="open3d-status-pill open3d-status-pill--muted"
              data-testid="open3d-save-status-bar"
              data-status={autosave.status}
              data-storage={saveCloudEnabled ? saveStorage : "local"}
            >
              {saveStatusBarLabel}
            </span>
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
            data-pending-placement={
              pendingCatalogItemId !== null || pendingWorkstationConfig !== null
                ? "true"
                : undefined
            }
          >
            <CanvasToolRail
              activeTool={activeTool}
              onToolChange={setTool}
              onZoomReset={() => canvasRef.current?.fitToView()}
            />
            <PlannerCanvasStage
              ref={canvasRef}
              activeTool={activeTool}
              layerVisibility={layerVisibility}
              workspaceCanvas={workspaceCanvas}
              activeFloor={activeFloor}
              gridEnabled={gridEnabled}
              snapEnabled={snapEnabled}
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
              onOpeningPlaced={handleOpeningPlaced}
              onSelectionChange={handleCanvasSelection}
              onFurnitureModified={handleFurnitureModified}
              onStatusChange={setCanvasStatus}
            />
            {/* Tool guidance: rail tooltips. Empty card only when zero geometry. */}
            {isCanvasEmpty && (
              <section
                className="open3d-first-use"
                aria-label="Start the office plan"
              >
                <p className="open3d-first-use__eyebrow">
                  {guestMode
                    ? "Guest · place from library"
                    : "Office layout"}
                </p>
                <h2>Start the floor plan</h2>
                <p>
                  {guestMode
                    ? "Place a workstation from the library, or draw walls to shape the room."
                    : "Draw walls, drop a starter room, or place a workstation then click the plan."}
                </p>
                <div className="open3d-first-use__actions">
                  <button type="button" onClick={() => setTool("wall")}>
                    Draw walls
                  </button>
                  <button type="button" onClick={handleStartTemplate}>
                    Starter room 5 × 4 m
                  </button>
                  <button type="button" onClick={handleStartPlaceWorkstation}>
                    Place workstation
                  </button>
                  {/* Guest TopBar has no Import — keep empty-state CTAs honest. */}
                  {!guestMode ? (
                    <button type="button" onClick={handleImportClick}>
                      Import plan
                    </button>
                  ) : null}
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
      </WorkspaceShell>
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
    </div>
  );
}
