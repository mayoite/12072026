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
  getOpen3dViewerControlProps,
} from "../3d/ThreeLazyViewer";
import {
  FeasibilityCanvas,
  type FeasibilityCanvasHandle,
  type CanvasStatusSnapshot,
} from "../canvas-feasibility/FeasibilityCanvas";
import {
  FurnitureFabricLayer,
  isOpen3dFabricFurnitureEnabled,
  type FurnitureDocumentPoseUpdate,
} from "../canvas-fabric-stage";
import {
  placeCatalogItemInProject,
  placeWorkstationConfigOnProject,
  placeWorkstationInstancesOnProject,
} from "../catalog/placementAction";
import type { WorkstationConfigV0 } from "../catalog/workstationSystemV0";
import { workstationConfigKey } from "../catalog/workstationSystemV0";
import {
  isWorkstationV0BatchPlaceCount,
  takePendingWorkstationConfig,
} from "../catalog/workstationConfiguratorV0";
import { placeModularWithGeneratedGlbBrowser } from "@/features/planner/asset-engine/mesh/placeModularWithGeneratedGlbBrowser";
import { shouldPlaceModularWithGeneratedGlb } from "@/features/planner/asset-engine/mesh/shouldPlaceModularWithGeneratedGlb";
import { importOpen3dProjectJson } from "../persistence/projectJson";
import { parseOpen3dSessionSnapshot } from "../persistence/open3dSession";
import { useOpen3dWorkspaceAutosave } from "../persistence/useOpen3dWorkspaceAutosave";
import { setActiveFloor } from "../model/operations/pureActions";
import { createRectangularRoomProject } from "../model/project";
import { preflightOpen3dExport } from "../shared/export/exportPreflight";
import {
  downloadJSON,
  downloadSVG,
  downloadWorkstationBoqJSON,
} from "../shared/export/exportUtils";
import {
  summarizeWorkstationBoqV0,
  workstationBoqToQuoteCartItems,
} from "../catalog/workstationBoqV0";
import { useQuoteCart } from "@/lib/store/quoteCart";
import { useOpen3dSvgCatalog } from "../catalog/useOpen3dWorkspaceCatalog";
import { CanvasToolRail } from "./CanvasToolRail";
import { CommandPalette } from "./CommandPalette";
import { CommandsPaletteTrigger } from "./CommandsPaletteTrigger";
import { InventoryPanel } from "./InventoryPanel";
import { LayersPanel } from "./LayersPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { WorkspaceShell } from "./WorkspaceShell";
import {
  CANVAS_TOOL_GUIDANCE,
  CANVAS_TOOL_SHORTCUTS,
  type PlannerTool,
} from "./canvasTool";
import {
  DEFAULT_LAYER_VISIBILITY,
  type Open3dLayerVisibility,
} from "./layerVisibility";
import { useWorkspaceKeyboard } from "./useWorkspaceKeyboard";
import { useWorkspaceCanvas } from "./useWorkspaceCanvas";
import {
  applySelectionDelete,
  deleteEntityFromProject,
  resolveSelectedEntity,
  updateEntityInProject,
} from "./workspaceEntityHelpers";
import {
  formatAutosaveStatus,
  formatSelectionStatus,
  formatSnapStatus,
  formatToolStatus,
} from "./workspaceStatusLabels";
import { summarizeFloorMetrics } from "./workspacePlanMetrics";
import type { Open3dDisplayUnit, Open3dPoint } from "../model/types";
import type { PlannerAccessContext } from "../lib/commands/plannerAccessContext";
import type { Open3dEntityCollection } from "../model/actions/projectActions";
import type { PaletteCommandHandlers } from "../lib/commands/paletteCommands";
import {
  parsePlannerWorkspacePreferences,
  DEFAULT_PLANNER_WORKSPACE_PREFERENCES,
} from "../store/workspacePreferences";

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
  const canvasRef = useRef<FeasibilityCanvasHandle>(null);
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

  const autosave = useOpen3dWorkspaceAutosave(
    workspaceCanvas.project,
    guestMode,
    planId,
    { hydrated },
  );
  const catalog = useOpen3dSvgCatalog();
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
  const [activeTool, setActiveTool] = useState<PlannerTool>("wall");
  const [displayUnit, setDisplayUnit] = useState<Open3dDisplayUnit>("cm");
  const [layerVisibility, setLayerVisibility] = useState<Open3dLayerVisibility>(
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

  // Density wired from workspace prefs (not hardcoded); GS: Figma UI3 REC-01 minimize UI, thin sidebars, contextual; benchmark 00 + anti-copy semantic only site/app/css/; fixes critic density/prefs partial + task5
  const [density, setDensity] = useState<"compact" | "touch">(
    DEFAULT_PLANNER_WORKSPACE_PREFERENCES.density,
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("open3d-workspace-preferences");
      const prefs = parsePlannerWorkspacePreferences(
        raw ? JSON.parse(raw) : null,
      );
      setTimeout(() => setDensity(prefs.density), 0);
    } catch {
      // keep default
    }
  }, []);

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

  // Fabric 2B furniture stage — default OFF (NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1 to enable).
  // Walls stay on FeasibilityCanvas; fabric layer is optional overlay for furniture only.
  const fabricFurnitureEnabled = isOpen3dFabricFurnitureEnabled();
  const feasibilityLayerVisibility = useMemo(
    () =>
      fabricFurnitureEnabled
        ? { ...layerVisibility, furniture: false }
        : layerVisibility,
    [fabricFurnitureEnabled, layerVisibility],
  );

  const handleFabricFurnitureModified = useCallback(
    (update: FurnitureDocumentPoseUpdate) => {
      workspaceCanvas.updateProject((project) =>
        updateEntityInProject(project, "furniture", update.entityId, {
          position: update.position,
          rotation: update.rotation,
        }),
      );
    },
    [workspaceCanvas],
  );

  const selectedEntity = useMemo(
    () =>
      resolveSelectedEntity(
        workspaceCanvas.selection,
        workspaceCanvas.activeFloor,
      ),
    [workspaceCanvas.activeFloor, workspaceCanvas.selection],
  );
  const isCanvasEmpty = activeFloor
    ? activeFloor.walls.length === 0 &&
      activeFloor.rooms.length === 0 &&
      activeFloor.doors.length === 0 &&
      activeFloor.windows.length === 0 &&
      activeFloor.furniture.length === 0
    : true;

  const toggleDensity = useCallback(() => {
    setDensity((current) => {
      const next = current === "compact" ? "touch" : "compact";
      try {
        const raw = localStorage.getItem("open3d-workspace-preferences");
        const base = parsePlannerWorkspacePreferences(
          raw ? JSON.parse(raw) : null,
        );
        const updated = { ...base, density: next };
        localStorage.setItem(
          "open3d-workspace-preferences",
          JSON.stringify(updated),
        );
      } catch {
        // ignore storage (matches useDocking pattern)
      }
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
    setWorkspaceMessage("Created a 5 m × 4 m starter room.");
  }, [workspaceCanvas]);

  const handleUpdateEntity = useCallback(
    (
      collection: Open3dEntityCollection,
      id: string,
      updates: Record<string, unknown>,
    ) => {
      workspaceCanvas.updateProject((project) =>
        updateEntityInProject(project, collection, id, updates),
      );
    },
    [workspaceCanvas],
  );

  const handleDeleteEntity = useCallback(
    (collection: Open3dEntityCollection, id: string) => {
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

  const handleInventoryPlace = useCallback((itemId: string) => {
    pendingWorkstationConfigRef.current = null;
    setPendingWorkstationConfig(null);
    setPendingCatalogItemId(itemId);
    setActiveTool("placement");
    armedToolRef.current = "placement";
    canvasRef.current?.setTool("placement");
  }, []);

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
        workspaceCanvas.setSelection({
          type: "furniture",
          ids: placedIds,
        });
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
    (point: Open3dPoint) => {
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
    void autosave.flushPersist();
    setWorkspaceMessage(guestMode ? "Saving draft locally…" : "Saving plan locally…");
  }, [autosave, guestMode]);

  const handleExport = useCallback(
    (format = "json") => {
      // Systems v0 BOQ — qty + footprint + INR list + GST.
      if (format === "boq" || format === "workstation-boq") {
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
          `Exported BOQ: ${summary.totalSeats} seats · ${summary.lines.length} lines · ₹${summary.totalInr.toLocaleString("en-IN")} incl. GST`,
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

      const check = preflightOpen3dExport(workspaceCanvas.project, format);
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
          const restored =
            parseOpen3dSessionSnapshot(raw) ?? importOpen3dProjectJson(raw);
          workspaceCanvas.replaceProject(restored);
          setWorkspaceMessage(`Imported ${file.name}`);
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

  const measurementLabel =
    canvasStatus?.previewLengthMm !== null &&
    canvasStatus?.previewLengthMm !== undefined
      ? `${canvasStatus.previewLengthMm} mm`
      : formatSnapStatus(canvasStatus?.snapKind ?? "none");

  const selectionLabel = formatSelectionStatus(workspaceCanvas.selection);
  const planMetrics = summarizeFloorMetrics(activeFloor);

  if (!hydrated) {
    return (
      <div
        className="open3d-route-host open3d-route-host--loading"
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
    <div className="open3d-workspace-root">
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
        onDisplayUnitChange={setDisplayUnit}
        isModified={autosave.isModified}
        isSynced={autosave.isSynced}
        canUndo={workspaceCanvas.canUndo}
        canRedo={workspaceCanvas.canRedo}
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
        leftPanel={
          <InventoryPanel
            catalogItems={catalog.items}
            isLoading={catalog.isLoading && catalog.items.length === 0}
            catalogStatus={catalog.status}
            onItemPlace={(itemId) => {
              handleInventoryPlace(itemId);
            }}
            onWorkstationConfigPlace={handleWorkstationConfigPlace}
            onWorkstationConfigBatchPlace={handleWorkstationConfigBatchPlace}
          />
        }
        rightPanel={
          <PropertiesPanel
            selectedEntity={selectedEntity}
            displayUnit={displayUnit}
            callbacks={{
              onUpdateEntity: handleUpdateEntity,
              onDeleteEntity: handleDeleteEntity,
              onDeselect: () =>
                workspaceCanvas.setSelection({ type: "none", ids: [] }),
            }}
          />
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
            <span className="open3d-status-pill">
              {CANVAS_TOOL_SHORTCUTS[activeTool]} ·{" "}
              {CANVAS_TOOL_GUIDANCE[activeTool]}
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
            <span className="open3d-status-pill open3d-status-pill--muted">
              {catalog.status === "ready"
                ? "Live catalog"
                : catalog.status === "fallback"
                  ? "Offline catalog"
                  : "Loading catalog…"}
            </span>
            <span className="open3d-status-pill open3d-status-pill--muted">
              {formatAutosaveStatus(autosave.status, guestMode)}
            </span>
          </div>
        }
        statusRight={
          <CommandsPaletteTrigger onOpen={() => setPaletteOpen(true)} />
        }
      >
        {viewMode === "2d" ? (
          <div className="open3d-canvas-with-rail">
            <CanvasToolRail
              activeTool={activeTool}
              onToolChange={setTool}
              onZoomReset={() => canvasRef.current?.resetZoom()}
            />
            {fabricFurnitureEnabled ? (
              <div
                className="open3d-canvas-embedded"
                style={{ position: "relative" }}
              >
                <FeasibilityCanvas
                  ref={canvasRef}
                  variant="embedded"
                  activeTool={activeTool}
                  layerVisibility={feasibilityLayerVisibility}
                  delegateKeyboard
                  workspaceCanvas={workspaceCanvas}
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
                  onStatusChange={setCanvasStatus}
                />
                <FurnitureFabricLayer
                  furniture={activeFloor?.furniture ?? []}
                  transform={canvasStatus?.transform}
                  interactive={activeTool === "select"}
                  onFurnitureModified={handleFabricFurnitureModified}
                />
              </div>
            ) : (
              <FeasibilityCanvas
                ref={canvasRef}
                variant="embedded"
                activeTool={activeTool}
                layerVisibility={layerVisibility}
                delegateKeyboard
                workspaceCanvas={workspaceCanvas}
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
                onStatusChange={setCanvasStatus}
              />
            )}
            <aside className="open3d-tool-guidance" aria-live="polite">
              <strong>{formatToolStatus(activeTool, viewMode)}</strong>
              <span>{CANVAS_TOOL_GUIDANCE[activeTool]}</span>
            </aside>
            {isCanvasEmpty && (
              <section
                className="open3d-first-use"
                aria-label="Start your plan"
              >
                <p className="open3d-first-use__eyebrow">Start your plan</p>
                <h2>Set up the first room</h2>
                <p>
                  Draw freely, begin with a measured room, or import an existing
                  plan.
                </p>
                <div className="open3d-first-use__actions">
                  <button type="button" onClick={() => setTool("wall")}>
                    Draw walls
                  </button>
                  <button type="button" onClick={handleStartTemplate}>
                    Use 5 m × 4 m room
                  </button>
                  <button type="button" onClick={handleImportClick}>
                    Import plan
                  </button>
                </div>
              </section>
            )}
          </div>
        ) : (
          <Lazy3DViewer
            projectData={workspaceCanvas.project}
            {...getOpen3dViewerControlProps()}
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
