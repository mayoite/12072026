"use client";

import { type ChangeEvent, type KeyboardEvent, type ReactNode, useCallback, useRef, useState } from "react";
import {
  CaretDown,
  CornersIn,
  CornersOut,
  Package,
  SlidersHorizontal,
  Stack,
} from "@phosphor-icons/react";
import {
  MenuTrigger,
  Button,
  Menu,
  MenuItem,
  RadioGroup,
  Radio,
} from "react-aria-components";
import type { PlannerAccessContext } from "@/features/planner/project/lib/commands/plannerAccessContext";
import type { PlannerDisplayUnit } from "@/features/planner/project/model/types";
import type { PlannerSaveStatus } from "@/features/planner/project/persistence/usePlannerWorkspaceAutosave";
import type { PanelId } from "./useDockingSystem";
import { PlannerMenuPopover } from "@/features/planner/ui/PlannerMenuPopover";
import {
  LAYOUT_PRESET_LABELS,
  type ChromePackId,
  type ChromePackLayout,
  type ChromePackPlacement,
  type LayoutPresetId,
} from "./workspaceLayout";
import { ChromePackFrame } from "./ChromePackFrame";
import {
  plannerSaveStatusLabel,
  type PlannerPersistStorage,
} from "./workspaceStatusLabels";
import styles from "./workspace.module.css";

/**
 * Prop contract for WorkspaceShell / OOPlanner wiring:
 *
 * Prefer honest save pill via one of:
 * 1. `saveStatusLabel` — parent already resolved plannerSaveStatusLabel text
 * 2. `saveStatus` (+ optional `saveStorage`, `saveCloudEnabled`) — TopBar calls
 *    plannerSaveStatusLabel; guestMode from accessContext === "guest"
 *
 * `isModified` / `isSynced` are fallback for pill status only when saveStatus omitted
 * (never bare "Ready" / "Modified" / /^Saved$/). The pill is the sole save authority —
 * no brand subline duplicate of "Unsaved changes".
 *
 * Chrome: density + spacing + RAC/Phosphor controls only.
 * Do not rewrite save labeling logic here.
 */
export interface TopBarProps {
  accessContext?: PlannerAccessContext;
  projectName: string;
  /** Fallback for pill status when saveStatus omitted (modified → "unsaved"). */
  isModified?: boolean;
  /** Fallback for pill status when saveStatus omitted (synced → "saved"). */
  isSynced?: boolean;
  /**
   * Pre-resolved pill label from plannerSaveStatusLabel (or equivalent).
   * Wins over saveStatus / isModified / isSynced for displayed text.
   */
  saveStatusLabel?: string;
  /** Autosave machine status — drives pill text via plannerSaveStatusLabel when label omitted. */
  saveStatus?: PlannerSaveStatus;
  /** Persist target for data-storage + label table. Default "local". */
  saveStorage?: PlannerPersistStorage;
  /** When false (default), cloud storage is forced to local labeling. */
  saveCloudEnabled?: boolean;
  viewMode: "2d" | "3d";
  floors?: Array<{ id: string; name: string }>;
  activeFloorId?: string;
  displayUnit?: PlannerDisplayUnit;
  onViewModeChange?: (mode: "2d" | "3d") => void;
  onFloorChange?: (floorId: string) => void;
  onDisplayUnitChange?: (unit: PlannerDisplayUnit) => void;
  onSave?: () => void;
  onExport?: (format?: string) => void;
  onImport?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  undoLabel?: string;
  redoLabel?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  activePanel?: Extract<PanelId, "left" | "right"> | null;
  onToggleLeftPanel?: () => void;
  onToggleRightPanel?: () => void;
  /** Bottom Layers panel open (not collapsed / not canvas-maximized). */
  isBottomPanelOpen?: boolean;
  /** Toggle bottom Layers panel — always shown when provided (collapsed by default). */
  onToggleBottomPanel?: () => void;
  isCanvasMaximized?: boolean;
  onToggleCanvasMaximized?: () => void;
  density?: "compact" | "touch";
  onToggleDensity?: () => void;
  gridEnabled?: boolean;
  snapEnabled?: boolean;
  onToggleGrid?: () => void;
  onToggleSnap?: () => void;
  /** Called when the project name is edited inline. */
  onProjectNameChange?: (name: string) => void;
  /** Modular chrome pack placements (history / view / file / prefs / layout). */
  chromePacks?: ChromePackLayout[];
  onChromePlacement?: (
    packId: ChromePackId,
    placement: ChromePackPlacement,
    pos?: { x: number; y: number },
  ) => void;
  onMoveChromePack?: (packId: ChromePackId, x: number, y: number) => void;
  layoutPresetId?: LayoutPresetId | "custom";
  onApplyLayoutPreset?: (presetId: LayoutPresetId) => void;
  onResetLayout?: () => void;
  /** Slim chrome: open a Dockview module by id. */
  onShowDockPanel?: (panelId: "inventory" | "tools" | "properties" | "layers") => void;
  /**
   * slim = Dockview owns modules; TopBar is brand + history + view + save + Layout/overflow.
   * full = legacy chrome packs + desktop Grid/Snap strip.
   */
  chromeMode?: "full" | "slim";
}

function resolveSaveStatusFromLegacy(
  isModified: boolean,
  isSynced: boolean,
): PlannerSaveStatus {
  if (isModified) return "unsaved";
  if (isSynced) return "saved";
  return "idle";
}

function saveStatusGlyph(status: PlannerSaveStatus): string {
  switch (status) {
    case "unsaved":
    case "error":
      return "●";
    case "saved":
      return "✓";
    case "saving":
    case "idle":
    default:
      return "○";
  }
}

export function TopBar({
  accessContext = "authenticated",
  projectName,
  isModified = false,
  isSynced = false,
  saveStatusLabel,
  saveStatus,
  saveStorage = "local",
  saveCloudEnabled = false,
  viewMode,
  floors = [],
  activeFloorId,
  displayUnit = "cm",
  onViewModeChange,
  onFloorChange,
  onDisplayUnitChange,
  onSave,
  onExport,
  onImport,
  canUndo = false,
  canRedo = false,
  undoLabel,
  redoLabel,
  onUndo,
  onRedo,
  activePanel = null,
  onToggleLeftPanel,
  onToggleRightPanel,
  isBottomPanelOpen = false,
  onToggleBottomPanel,
  isCanvasMaximized = false,
  onToggleCanvasMaximized,
  density = "compact",
  onToggleDensity,
  gridEnabled = true,
  snapEnabled = true,
  onToggleGrid,
  onProjectNameChange,
  onToggleSnap,
  chromePacks,
  onChromePlacement,
  onMoveChromePack,
  layoutPresetId = "custom",
  onApplyLayoutPreset,
  onResetLayout,
  onShowDockPanel,
  chromeMode = "full",
}: TopBarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(projectName);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleNameStartEdit = useCallback(() => {
    setEditName(projectName);
    setIsEditingName(true);
    requestAnimationFrame(() => nameInputRef.current?.select());
  }, [projectName]);

  const handleNameCommit = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== projectName) {
      onProjectNameChange?.(trimmed);
    }
    setIsEditingName(false);
  }, [editName, projectName, onProjectNameChange]);

  const handleNameKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setEditName(projectName);
      setIsEditingName(false);
    }
  }, [projectName]);
  const showPersistenceActions = accessContext !== "guest";
  const showGuestActions = accessContext === "guest";
  const guestMode = accessContext === "guest";

  const resolvedSaveStatus: PlannerSaveStatus =
    saveStatus ?? resolveSaveStatusFromLegacy(isModified, isSynced);
  const effectiveStorage: PlannerPersistStorage =
    saveCloudEnabled && saveStorage === "cloud" ? "cloud" : "local";
  const resolvedSaveLabel =
    saveStatusLabel ??
    plannerSaveStatusLabel({
      status: resolvedSaveStatus,
      storage: saveStorage,
      lastSavedAt: null,
      cloudEnabled: saveCloudEnabled,
      guestMode,
    });

  const unitOptions: PlannerDisplayUnit[] = ["mm", "cm", "m", "in", "ft-in"];
  const activeFloorName = floors.find((f) => f.id === activeFloorId)?.name ?? "Floor";

  const defaultPacks: ChromePackLayout[] = [
    { id: "history", placement: "topbar", x: 80, y: 56 },
    { id: "view", placement: "topbar", x: 220, y: 56 },
    { id: "file", placement: "topbar", x: 400, y: 56 },
    { id: "prefs", placement: "topbar", x: 560, y: 56 },
    { id: "layout", placement: "topbar", x: 680, y: 56 },
  ];
  const packs = chromePacks ?? defaultPacks;
  const packById = new Map(packs.map((p) => [p.id, p]));
  const resolvePack = (id: ChromePackId): ChromePackLayout => {
    const pack = packById.get(id) ?? defaultPacks.find((candidate) => candidate.id === id);
    if (!pack) {
      throw new Error(`Missing Planner chrome pack: ${id}`);
    }
    return pack;
  };

  const modular = chromeMode === "full" && Boolean(onChromePlacement && onMoveChromePack);
  const wrapPack = (id: ChromePackId, label: string, body: ReactNode) => {
    if (!modular || !onChromePlacement || !onMoveChromePack) return body;
    const pack = resolvePack(id);
    return (
      <ChromePackFrame
        packId={id}
        label={label}
        placement={pack.placement}
        x={pack.x}
        y={pack.y}
        onPlacementChange={onChromePlacement}
        onMove={onMoveChromePack}
      >
        {body}
      </ChromePackFrame>
    );
  };

  const overflowPacks = packs.filter((p) => p.placement === "overflow");
  const presetIds = Object.keys(LAYOUT_PRESET_LABELS) as LayoutPresetId[];

  const saveButtonLabel =
    resolvedSaveStatus === "error"
      ? "Retry save"
      : resolvedSaveStatus === "saving"
        ? "Saving…"
        : showGuestActions
          ? "Save draft"
          : "Save";
  const saveButtonAriaLabel =
    resolvedSaveStatus === "error"
      ? `Retry save — ${resolvedSaveLabel}`
      : resolvedSaveStatus === "saving"
        ? `Saving — ${resolvedSaveLabel}`
        : showGuestActions
          ? "Save draft to this device"
          : "Save project";

  return (
    <header
      className={`pw-topbar ${styles.header}`}
      aria-label="Planner workspace"
      data-density={density}
      data-testid="planner-topbar"
    >
      <div className={styles.brand}>
        {isEditingName ? (
          <input
            ref={nameInputRef}
            className={styles.brandTitleInput}
            value={editName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
            onBlur={handleNameCommit}
            onKeyDown={handleNameKeyDown}
            aria-label="Project name"
            autoFocus
          />
        ) : (
          <h1
            className={styles.brandTitle}
            onClick={handleNameStartEdit}
            onKeyDown={(e: KeyboardEvent<HTMLHeadingElement>) => {
              if (e.key === "Enter" || e.key === " ") handleNameStartEdit();
            }}
            tabIndex={0}
            title="Rename project"
          >
            {projectName}
          </h1>
        )}
        {guestMode ? (
          <span
            className={styles.brandSub}
            title="Guest plans save in this browser only — not to an account"
            data-testid="planner-guest-local-badge"
          >
            Local only
          </span>
        ) : null}
      </div>

      <div className={styles.center}>
        {wrapPack(
          "history",
          "History",
          <div className={styles.historyActions} role="group" aria-label="Canvas history">
            <Button
              className={styles.btn}
              isDisabled={!canUndo}
              aria-label={undoLabel ? `Undo: ${undoLabel}` : "Undo unavailable"}
              onPress={() => onUndo?.()}
            >
              Undo
            </Button>
            <Button
              className={styles.btn}
              isDisabled={!canRedo}
              aria-label={redoLabel ? `Redo: ${redoLabel}` : "Redo unavailable"}
              onPress={() => onRedo?.()}
            >
              Redo
            </Button>
          </div>,
        )}

        <span className={styles.actionDivider} aria-hidden />

        {wrapPack(
          "view",
          "View",
          <div className={styles.viewPack} role="group" aria-label="View controls pack">
            <RadioGroup
              className={styles.viewToggle}
              value={viewMode}
              onChange={(value) => onViewModeChange?.(value as "2d" | "3d")}
              aria-label="View mode"
            >
              <Radio className={styles.viewToggleBtn} value="2d">
                2D
              </Radio>
              <Radio className={styles.viewToggleBtn} value="3d">
                3D
              </Radio>
            </RadioGroup>

            {floors.length > 0 && (
              <MenuTrigger>
                <Button className={styles.btn} aria-label={`Active floor: ${activeFloorName}`}>
                  {activeFloorName}
                  <CaretDown size={12} weight="bold" aria-hidden />
                </Button>
                <PlannerMenuPopover placement="bottom start">
                  <Menu
                    className={styles.dropdownMenu}
                    selectionMode="single"
                    selectedKeys={activeFloorId ? [activeFloorId] : undefined}
                    onAction={(key) => onFloorChange?.(key as string)}
                  >
                    {floors.map((floor) => (
                      <MenuItem
                        key={floor.id}
                        id={floor.id}
                        className={styles.dropdownItem}
                      >
                        {floor.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </PlannerMenuPopover>
              </MenuTrigger>
            )}

            <MenuTrigger>
              <Button className={styles.btn} aria-label={`Display unit: ${displayUnit}`}>
                {displayUnit}
                <CaretDown size={12} weight="bold" aria-hidden />
              </Button>
              <PlannerMenuPopover placement="bottom start">
                <Menu
                  className={styles.dropdownMenu}
                  selectionMode="single"
                  selectedKeys={[displayUnit]}
                  onAction={(key) => onDisplayUnitChange?.(key as PlannerDisplayUnit)}
                >
                  {unitOptions.map((unit) => (
                    <MenuItem
                      key={unit}
                      id={unit}
                      className={styles.dropdownItem}
                    >
                      {unit}
                    </MenuItem>
                  ))}
                </Menu>
              </PlannerMenuPopover>
            </MenuTrigger>
          </div>,
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.actionGroup} role="group" aria-label="View controls">
        {onToggleCanvasMaximized && (
          <Button
            className={`${styles.btn} ${styles.focusButton}`}
            aria-pressed={isCanvasMaximized}
            aria-label={
              isCanvasMaximized
                ? "Restore — restore workspace panels"
                : "Focus — maximize canvas"
            }
            onPress={onToggleCanvasMaximized}
          >
            {isCanvasMaximized ? (
              <CornersIn size={16} aria-hidden />
            ) : (
              <CornersOut size={16} aria-hidden />
            )}
            <span className={styles.canvasModeLabel}>
              {isCanvasMaximized ? "Restore" : "Focus"}
            </span>
          </Button>
        )}

        {(onToggleLeftPanel || onToggleRightPanel) && (
          <div className={styles.mobilePanelActions} role="group" aria-label="Panel toggles">
            {onToggleLeftPanel && (
              <Button
                className={`${styles.btn} ${styles.mobilePanelBtn}`}
                data-active={activePanel === "left" ? "true" : undefined}
                aria-pressed={activePanel === "left"}
                aria-label="Toggle inventory panel"
                onPress={onToggleLeftPanel}
              >
                <Package size={18} aria-hidden />
                <span className={styles.mobilePanelLabel}>Inventory</span>
              </Button>
            )}
            {onToggleRightPanel && (
              <Button
                className={`${styles.btn} ${styles.mobilePanelBtn}`}
                data-active={activePanel === "right" ? "true" : undefined}
                aria-pressed={activePanel === "right"}
                aria-label="Toggle properties panel"
                onPress={onToggleRightPanel}
              >
                <SlidersHorizontal size={18} aria-hidden />
                <span className={styles.mobilePanelLabel}>Properties</span>
              </Button>
            )}
          </div>
        )}

        {onToggleBottomPanel && (
          <Button
            className={styles.btn}
            data-active={isBottomPanelOpen ? "true" : undefined}
            aria-pressed={isBottomPanelOpen}
            aria-label="Toggle layers panel"
            onPress={onToggleBottomPanel}
          >
            <Stack size={18} aria-hidden />
            <span className={styles.mobilePanelLabel}>Layers</span>
          </Button>
        )}

        {(onToggleGrid || onToggleSnap) && chromeMode === "full" && (
          <div
            className={`${styles.gridSnapActions} ${styles.desktopOnly}`}
            role="group"
            aria-label="Canvas grid and snap"
          >
            {onToggleGrid && (
              <Button
                className={styles.btn}
                data-active={gridEnabled ? "true" : undefined}
                aria-pressed={gridEnabled}
                aria-label={gridEnabled ? "Disable grid" : "Enable grid"}
                onPress={onToggleGrid}
              >
                Grid
              </Button>
            )}
            {onToggleSnap && (
              <Button
                className={styles.btn}
                data-active={snapEnabled ? "true" : undefined}
                aria-pressed={snapEnabled}
                aria-label={snapEnabled ? "Disable snap" : "Enable snap"}
                onPress={onToggleSnap}
              >
                Snap
              </Button>
            )}
          </div>
        )}

        </div>

        <span className={styles.actionDivider} aria-hidden />

        <div className={styles.actionGroup} role="group" aria-label="Save status">
        <div
          className={styles.saveStatus}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          data-testid="open3d-save-status"
          data-status={resolvedSaveStatus}
          data-storage={effectiveStorage}
          data-modified={isModified || resolvedSaveStatus === "unsaved"}
          data-synced={
            resolvedSaveStatus === "saved" ||
            (resolvedSaveStatus !== "error" &&
              resolvedSaveStatus !== "unsaved" &&
              resolvedSaveStatus !== "saving" &&
              isSynced &&
              !isModified)
          }
        >
          <span aria-hidden="true">{saveStatusGlyph(resolvedSaveStatus)}</span>{" "}
          {resolvedSaveLabel}
        </div>

        <Button
          className={`${styles.btn} ${
            resolvedSaveStatus === "error" ? styles.btnDanger : styles.btnPrimary
          }`}
          onPress={() => onSave?.()}
          isDisabled={resolvedSaveStatus === "saving"}
          aria-label={saveButtonAriaLabel}
          data-status={resolvedSaveStatus}
          data-testid="planner-save-button"
        >
          {saveButtonLabel}
        </Button>
        </div>

        <span className={styles.actionDivider} aria-hidden />

        {wrapPack(
          "file",
          "File",
          <div className={styles.fileActions} role="group" aria-label="File actions">
            {showGuestActions && (
              <MenuTrigger>
                <Button
                  className={styles.btn}
                  aria-label="Export — download plan or BOQ to this device"
                  data-testid="planner-guest-export"
                >
                  Export
                  <CaretDown size={12} weight="bold" aria-hidden />
                </Button>
                <PlannerMenuPopover placement="bottom end">
                  <Menu
                    className={styles.dropdownMenu}
                    onAction={(key) => onExport?.(key as string)}
                    aria-label="Guest export downloads"
                  >
                    <MenuItem id="json" className={styles.dropdownItem}>
                      Download plan (JSON)
                    </MenuItem>
                    <MenuItem id="svg" className={styles.dropdownItem}>
                      Download plan (SVG)
                    </MenuItem>
                    <MenuItem id="boq-json" className={styles.dropdownItem}>
                      Download BOQ (JSON)
                    </MenuItem>
                    <MenuItem id="boq-csv" className={styles.dropdownItem}>
                      Download BOQ (CSV)
                    </MenuItem>
                  </Menu>
                </PlannerMenuPopover>
              </MenuTrigger>
            )}

            {showPersistenceActions && (
              <>
                <MenuTrigger>
                  <Button className={styles.btn} aria-label="Import — open import menu">
                    Import
                    <CaretDown size={12} weight="bold" aria-hidden />
                  </Button>
                  <PlannerMenuPopover placement="bottom end">
                    <Menu
                      className={styles.dropdownMenu}
                      onAction={(key) => {
                        if (key === "file" && onImport) onImport();
                      }}
                    >
                      <MenuItem id="file" className={styles.dropdownItem}>
                        Import from file...
                      </MenuItem>
                      <MenuItem id="url" className={styles.dropdownItem}>
                        Import from URL...
                      </MenuItem>
                    </Menu>
                  </PlannerMenuPopover>
                </MenuTrigger>

                <MenuTrigger>
                  <Button className={styles.btn} aria-label="Export — open export menu">
                    Export
                    <CaretDown size={12} weight="bold" aria-hidden />
                  </Button>
                  <PlannerMenuPopover placement="bottom end">
                    <Menu
                      className={styles.dropdownMenu}
                      onAction={(key) => onExport?.(key as string)}
                    >
                      <MenuItem id="json" className={styles.dropdownItem}>Export as JSON</MenuItem>
                      <MenuItem id="svg" className={styles.dropdownItem}>Export as SVG</MenuItem>
                      <MenuItem id="png" className={styles.dropdownItem}>Export as PNG</MenuItem>
                      <MenuItem id="pdf" className={styles.dropdownItem}>Export as PDF</MenuItem>
                      <MenuItem id="dxf" className={styles.dropdownItem}>Export as DXF</MenuItem>
                      <MenuItem id="boq-json" className={styles.dropdownItem}>
                        Export BOQ (JSON)
                      </MenuItem>
                      <MenuItem id="boq-csv" className={styles.dropdownItem}>
                        Export BOQ (CSV)
                      </MenuItem>
                      <MenuItem id="workstation-boq" className={styles.dropdownItem}>
                        Export workstation BOQ
                      </MenuItem>
                      <MenuItem id="quote" className={styles.dropdownItem}>
                        Add seats to quote cart
                      </MenuItem>
                    </Menu>
                  </PlannerMenuPopover>
                </MenuTrigger>
              </>
            )}
          </div>,
        )}

        {chromeMode === "full" ? wrapPack(
          "prefs",
          "Density",
          <Button
            className={styles.btn}
            aria-label={`Density — switch to ${density === "touch" ? "compact" : "touch"} spacing`}
            onPress={onToggleDensity}
            data-testid="planner-density-toggle"
          >
            Density
          </Button>,
        ) : null}

        {wrapPack(
          "layout",
          "Layout",
          <MenuTrigger>
            <Button
              className={`${styles.btn} ${styles.layoutTrigger}`}
              aria-label={`Panels and layouts — ${layoutPresetId === "custom" ? "custom" : LAYOUT_PRESET_LABELS[layoutPresetId]}`}
              data-testid="layout-presets-trigger"
            >
              Panels
              <CaretDown size={12} weight="bold" aria-hidden />
            </Button>
            <PlannerMenuPopover placement="bottom end">
              <Menu
                className={styles.dropdownMenu}
                onAction={(key) => {
                  const keyStr = String(key);
                  if (keyStr.startsWith("preset:")) {
                    onApplyLayoutPreset?.(keyStr.slice("preset:".length) as LayoutPresetId);
                    return;
                  }
                  if (keyStr === "reset") {
                    onResetLayout?.();
                    return;
                  }
                  if (keyStr === "toggle:density") {
                    onToggleDensity?.();
                    return;
                  }
                  if (keyStr.startsWith("show:")) {
                    const panelId = keyStr.slice("show:".length) as
                      | "inventory"
                      | "tools"
                      | "properties"
                      | "layers";
                    onShowDockPanel?.(panelId);
                    return;
                  }
                  if (keyStr.startsWith("restore:")) {
                    const packId = keyStr.slice("restore:".length) as ChromePackId;
                    onChromePlacement?.(packId, "topbar");
                  }
                }}
              >
                {presetIds.map((id) => (
                  <MenuItem
                    key={id}
                    id={`preset:${id}`}
                    className={styles.dropdownItem}
                    data-selected={layoutPresetId === id ? "true" : undefined}
                  >
                    {LAYOUT_PRESET_LABELS[id]}
                    {layoutPresetId === id ? " ✓" : ""}
                  </MenuItem>
                ))}
                <MenuItem id="reset" className={styles.dropdownItem}>
                  Reset layout
                </MenuItem>
                {chromeMode === "slim" ? (
                  <MenuItem id="toggle:density" className={styles.dropdownItem}>
                    {density === "touch" ? "Use compact controls" : "Use touch controls"}
                  </MenuItem>
                ) : null}
                {onShowDockPanel ? (
                  <>
                    <MenuItem id="show:inventory" className={styles.dropdownItem}>
                      Open Inventory
                    </MenuItem>
                    <MenuItem id="show:tools" className={styles.dropdownItem}>
                      Open Tools
                    </MenuItem>
                    <MenuItem id="show:properties" className={styles.dropdownItem}>
                      Open Properties
                    </MenuItem>
                    <MenuItem id="show:layers" className={styles.dropdownItem}>
                      Open Layers
                    </MenuItem>
                  </>
                ) : null}
                {overflowPacks.map((pack) => (
                  <MenuItem
                    key={pack.id}
                    id={`restore:${pack.id}`}
                    className={styles.dropdownItem}
                  >
                    Restore {pack.id} module
                  </MenuItem>
                ))}
              </Menu>
            </PlannerMenuPopover>
          </MenuTrigger>,
        )}
      </div>
    </header>
  );
}
