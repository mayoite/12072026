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
import { Lazy3DViewer } from "../3d/ThreeLazyViewer";
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
import { placeCatalogItemInProject } from "../catalog/placementAction";
import { importOpen3dProjectJson } from "../persistence/projectJson";
import { parseOpen3dSessionSnapshot } from "../persistence/open3dSession";
import { useOpen3dWorkspaceAutosave } from "../persistence/useOpen3dWorkspaceAutosave";
import { setActiveFloor } from "../model/operations/pureActions";
import { createRectangularRoomProject } from "../model/project";
import { preflightOpen3dExport } from "../shared/export/exportPreflight";
import { downloadJSON, downloadSVG } from "../shared/export/exportUtils";
import { useOpen3dSvgCatalog } from "../catalog/useOpen3dWorkspaceCatalog";
import { CanvasToolRail } from "./CanvasToolRail";
import { CommandPalette } from "./CommandPalette";
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

  const setTool = useCallback((tool: PlannerTool) => {
    setActiveTool(tool);
    armedToolRef.current = tool;
    setPendingCatalogItemId(null);
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
    setPendingCatalogItemId(itemId);
    setActiveTool("placement");
    armedToolRef.current = "placement";
    canvasRef.current?.setTool("placement");
  }, []);

  const handlePlaceAtPoint = useCallback(
    (point: Open3dPoint) => {
      if (!pendingCatalogItemId) return;
      const item = catalog.resolveItem(pendingCatalogItemId);
      if (!item) {
        setPendingCatalogItemId(null);
        return;
      }
      workspaceCanvas.updateProject(
        (project) =>
          placeCatalogItemInProject(project, item, null, {
            placedFrom: "click",
            position: point,
          }).result.project,
      );
      setPendingCatalogItemId(null);
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
    autosave.schedulePersist();
    setWorkspaceMessage(guestMode ? "Saving draft…" : "Saving plan…");
  }, [autosave, guestMode]);

  const handleExport = useCallback(
    (format = "json") => {
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
      setWorkspaceMessage(
        `${format.toUpperCase()} export is coming soon — use JSON or SVG for now.`,
      );
    },
    [workspaceCanvas.project],
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
      },
      commit: () => {
        // Enter commits; delegate to canvas for drawing states (task6)
        canvasRef.current?.commit?.();
      },
      zoomReset: () => canvasRef.current?.resetZoom(),
      // fit available for canvas-max / bounds restore (task6)
      fit: () => canvasRef.current?.fitToView?.(),
    }),
    [runRedo, runUndo, setTool, toggleView],
  );

  useWorkspaceKeyboard({
    setTool,
    toggleView,
    openPalette: () => setPaletteOpen(true),
    undo: runUndo,
    redo: runRedo,
    cancel: () => {
      setPendingCatalogItemId(null);
      canvasRef.current?.cancel();
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
            {pendingCatalogItem ? (
              <span className="open3d-status-pill open3d-status-pill--placement">
                Placing{" "}
                {pendingCatalogItem.shortName ?? pendingCatalogItem.name}
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
          <button
            type="button"
            className="open3d-palette-trigger"
            onClick={() => setPaletteOpen(true)}
            aria-label="Open command palette (Ctrl+K)"
          >
            <span className="open3d-palette-trigger__long">Commands (Ctrl+K)</span>
            <span className="open3d-palette-trigger__short">Commands</span>
          </button>
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
                  pendingCatalogPlacement={pendingCatalogItemId !== null}
                  placementItemLabel={
                    pendingCatalogItem?.shortName ??
                    pendingCatalogItem?.name ??
                    null
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
                pendingCatalogPlacement={pendingCatalogItemId !== null}
                placementItemLabel={
                  pendingCatalogItem?.shortName ??
                  pendingCatalogItem?.name ??
                  null
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
          <Lazy3DViewer projectData={workspaceCanvas.project} />
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
