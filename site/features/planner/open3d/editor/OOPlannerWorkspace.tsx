"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Lazy3DViewer } from "../3d/ThreeLazyViewer";
import {
  FeasibilityCanvas,
  type FeasibilityCanvasHandle,
  type CanvasStatusSnapshot,
} from "../canvas-fabric/FeasibilityCanvas";
import { placeCatalogItemInProject } from "../catalog/placementAction";
import { importOpen3dProjectJson } from "../persistence/projectJson";
import { parseOpen3dSessionSnapshot } from "../persistence/open3dSession";
import { useOpen3dWorkspaceAutosave } from "../persistence/useOpen3dWorkspaceAutosave";
import { setActiveFloor } from "../model/operations/pureActions";
import { preflightOpen3dExport } from "../shared/export/exportPreflight";
import { downloadJSON, downloadSVG } from "../shared/export/exportUtils";
import { useOpen3dWorkspaceCatalog } from "../catalog/useOpen3dWorkspaceCatalog";
import { CanvasToolRail } from "./CanvasToolRail";
import { CommandPalette } from "./CommandPalette";
import { InventoryPanel } from "./InventoryPanel";
import { LayersPanel } from "./LayersPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { WorkspaceShell } from "./WorkspaceShell";
import type { CanvasTool } from "./canvasTool";
import { DEFAULT_LAYER_VISIBILITY, type Open3dLayerVisibility } from "./layerVisibility";
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
import type { Open3dDisplayUnit, Open3dPoint } from "../model/types";
import type { PlannerAccessContext } from "../lib/commands/plannerAccessContext";
import type { Open3dEntityCollection } from "../model/actions/projectActions";
import type { PaletteCommandHandlers } from "../lib/commands/paletteCommands";

export type OOPlannerWorkspaceProps = {
  guestMode: boolean;
  planId?: string;
};

export function OOPlannerWorkspace({ guestMode, planId }: OOPlannerWorkspaceProps) {
  const accessContext: PlannerAccessContext = guestMode ? "guest" : "authenticated";
  const projectName = planId ? `Plan ${planId}` : "Untitled plan";
  const canvasRef = useRef<FeasibilityCanvasHandle>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const workspaceCanvas = useWorkspaceCanvas({ projectName });
  const [hydrated, setHydrated] = useState(false);
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
  const catalog = useOpen3dWorkspaceCatalog();
  const restoreSnapshotRef = useRef(autosave.restoreSnapshot);
  useLayoutEffect(() => {
    restoreSnapshotRef.current = autosave.restoreSnapshot;
  });

  useEffect(() => {
    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (!cancelled) setHydrated(true);
    }, 4000);

    void restoreSnapshotRef
      .current()
      .then((restored) => {
        if (cancelled || !restored) return;
        replaceProjectRef.current(restored);
      })
      .finally(() => {
        if (!cancelled) {
          window.clearTimeout(timeoutId);
          setHydrated(true);
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [guestMode, planId]);

  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [activeTool, setActiveTool] = useState<CanvasTool>("wall");
  const [displayUnit, setDisplayUnit] = useState<Open3dDisplayUnit>("cm");
  const [layerVisibility, setLayerVisibility] = useState<Open3dLayerVisibility>(
    DEFAULT_LAYER_VISIBILITY,
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pendingCatalogItemId, setPendingCatalogItemId] = useState<string | null>(null);
  const [canvasStatus, setCanvasStatus] = useState<CanvasStatusSnapshot | null>(null);
  const [workspaceMessage, setWorkspaceMessage] = useState<string | null>(null);

  const pendingCatalogItem = useMemo(
    () => (pendingCatalogItemId ? catalog.resolveItem(pendingCatalogItemId) : undefined),
    [catalog, pendingCatalogItemId],
  );

  const activeFloor =
    workspaceCanvas.project.floors.find(
      (floor) => floor.id === workspaceCanvas.project.activeFloorId,
    ) ?? workspaceCanvas.project.floors[0];

  const selectedEntity = useMemo(
    () => resolveSelectedEntity(workspaceCanvas.selection, workspaceCanvas.activeFloor),
    [workspaceCanvas.activeFloor, workspaceCanvas.selection],
  );

  const handleUpdateEntity = useCallback(
    (collection: Open3dEntityCollection, id: string, updates: Record<string, unknown>) => {
      workspaceCanvas.updateProject((project) =>
        updateEntityInProject(project, collection, id, updates),
      );
    },
    [workspaceCanvas],
  );

  const handleDeleteEntity = useCallback(
    (collection: Open3dEntityCollection, id: string) => {
      workspaceCanvas.updateProject((project) => deleteEntityFromProject(project, collection, id));
      workspaceCanvas.setSelection({ type: "none", ids: [] });
    },
    [workspaceCanvas],
  );

  const setTool = useCallback((tool: CanvasTool) => {
    setActiveTool(tool);
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
    setActiveTool("select");
    canvasRef.current?.setTool("select");
  }, []);

  const handlePlaceAtPoint = useCallback(
    (point: Open3dPoint) => {
      if (!pendingCatalogItemId) return;
      const item = catalog.resolveItem(pendingCatalogItemId);
      if (!item) {
        setPendingCatalogItemId(null);
        return;
      }
      workspaceCanvas.updateProject((project) =>
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
      workspaceCanvas.updateProject((project) => setActiveFloor(project, floorId).project);
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
        setWorkspaceMessage(check.messages[0] ?? `Export unavailable for ${format}`);
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
      setWorkspaceMessage(`${format.toUpperCase()} export is coming soon — use JSON or SVG for now.`);
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
          const restored = parseOpen3dSessionSnapshot(raw) ?? importOpen3dProjectJson(raw);
          workspaceCanvas.replaceProject(restored);
          setWorkspaceMessage(`Imported ${file.name}`);
        } catch {
          setWorkspaceMessage("Could not import that file. Use an Open3D plan JSON export.");
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
      zoomReset: () => canvasRef.current?.resetZoom(),
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
  });

  const measurementLabel =
    canvasStatus?.previewLengthMm !== null && canvasStatus?.previewLengthMm !== undefined
      ? `${canvasStatus.previewLengthMm} mm`
      : formatSnapStatus(canvasStatus?.snapKind ?? "none");

  const selectionLabel = formatSelectionStatus(workspaceCanvas.selection);

  if (!hydrated) {
    return (
      <div className="open3d-route-host open3d-route-host--loading" aria-busy="true" aria-label="Loading planner">
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
        floors={workspaceCanvas.project.floors.map((floor) => ({ id: floor.id, name: floor.name }))}
        activeFloorId={workspaceCanvas.project.activeFloorId}
        fillParent
        leftPanel={
          <InventoryPanel
            catalogItems={catalog.items}
            isLoading={catalog.isLoading}
            onItemPlace={(itemId) => handleInventoryPlace(itemId)}
          />
        }
        rightPanel={
          <PropertiesPanel
            selectedEntity={selectedEntity}
            displayUnit={displayUnit}
            callbacks={{
              onUpdateEntity: handleUpdateEntity,
              onDeleteEntity: handleDeleteEntity,
              onDeselect: () => workspaceCanvas.setSelection({ type: "none", ids: [] }),
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
        statusLeft={
          <div className="open3d-status-track">
            <span className="open3d-status-pill open3d-status-pill--accent">
              {formatToolStatus(activeTool, viewMode)}
            </span>
            {measurementLabel ? (
              <span className="open3d-status-pill">{measurementLabel}</span>
            ) : null}
            {canvasStatus ? (
              <span className="open3d-status-pill">Zoom {canvasStatus.zoomPercent}%</span>
            ) : null}
            {selectionLabel ? (
              <span className="open3d-status-pill open3d-status-pill--accent">{selectionLabel}</span>
            ) : null}
            {pendingCatalogItem ? (
              <span className="open3d-status-pill open3d-status-pill--placement">
                Placing {pendingCatalogItem.shortName ?? pendingCatalogItem.name}
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
          <button type="button" className="open3d-palette-trigger" onClick={() => setPaletteOpen(true)}>
            Commands (Ctrl+K)
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
            <FeasibilityCanvas
              ref={canvasRef}
              variant="embedded"
              activeTool={activeTool}
              layerVisibility={layerVisibility}
              delegateKeyboard
              workspaceCanvas={workspaceCanvas}
              pendingCatalogPlacement={pendingCatalogItemId !== null}
              placementItemLabel={pendingCatalogItem?.shortName ?? pendingCatalogItem?.name ?? null}
              onPlaceAtPoint={handlePlaceAtPoint}
              onStatusChange={setCanvasStatus}
            />
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
