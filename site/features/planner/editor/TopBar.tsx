"use client";

import { CaretDown, CornersIn, CornersOut } from "@phosphor-icons/react";
import {
  MenuTrigger,
  Button,
  Popover,
  Menu,
  MenuItem,
  RadioGroup,
  Radio,
} from "react-aria-components";
import type { PlannerAccessContext } from "@/features/planner/project/lib/commands/plannerAccessContext";
import type { PlannerDisplayUnit } from "@/features/planner/project/model/types";
import type { PlannerSaveStatus } from "@/features/planner/project/persistence/usePlannerWorkspaceAutosave";
import type { PanelId } from "./useDockingSystem";
import {
  plannerSaveStatusLabel,
  type PlannerPersistStorage,
} from "./workspaceStatusLabels";
import styles from "./workspace.module.css";

/**
 * Prop contract for WorkspaceShell / OOPlanner wiring (next agent):
 *
 * Prefer honest save pill via one of:
 * 1. `saveStatusLabel` — parent already resolved plannerSaveStatusLabel text
 * 2. `saveStatus` (+ optional `saveStorage`, `saveCloudEnabled`) — TopBar calls
 *    plannerSaveStatusLabel; guestMode from accessContext === "guest"
 *
 * `isModified` / `isSynced` remain optional fallback only:
 * - brand subline "Unsaved changes" when isModified
 * - pill maps modified→unsaved, synced→saved, else→idle through the helper
 *   (never bare "Ready" / "Modified" / /^Saved$/)
 *
 * Chrome (this seat): density + spacing + RAC/Phosphor controls only.
 * Do not rewrite save labeling logic here.
 */
export interface TopBarProps {
  accessContext?: PlannerAccessContext;
  projectName: string;
  /** Brand subline only when true; also fallback for pill status when saveStatus omitted. */
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
}: TopBarProps) {
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

  return (
    <header
      className={`pw-topbar ${styles.header}`}
      aria-label="Planner workspace"
      data-density={density}
      data-testid="planner-topbar"
    >
      <div className={styles.brand}>
        <h1 className={styles.brandTitle}>{projectName}</h1>
        {isModified && <span className={styles.brandSub}>Unsaved changes</span>}
      </div>

      <div className={styles.center}>
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
            <Popover placement="bottom start">
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
            </Popover>
          </MenuTrigger>
        )}

        <MenuTrigger>
          <Button className={styles.btn} aria-label={`Display unit: ${displayUnit}`}>
            {displayUnit}
            <CaretDown size={12} weight="bold" aria-hidden />
          </Button>
          <Popover placement="bottom start">
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
          </Popover>
        </MenuTrigger>
      </div>

      <div className={styles.actions}>
        {onToggleCanvasMaximized && (
          <Button
            className={styles.btn}
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
                Inventory
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
                Properties
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
            Layers
          </Button>
        )}

        <div className={styles.historyActions} role="group" aria-label="Canvas history">
          <Button
            className={styles.btn}
            isDisabled={!canUndo}
            aria-label="Undo"
            onPress={() => onUndo?.()}
          >
            Undo
          </Button>
          <Button
            className={styles.btn}
            isDisabled={!canRedo}
            aria-label="Redo"
            onPress={() => onRedo?.()}
          >
            Redo
          </Button>
        </div>

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
            (isSynced && !isModified) || resolvedSaveStatus === "saved"
          }
        >
          <span aria-hidden="true">{saveStatusGlyph(resolvedSaveStatus)}</span>{" "}
          {resolvedSaveLabel}
        </div>

        <Button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onPress={() => onSave?.()}
        >
          {showGuestActions ? "Save draft" : "Save"}
        </Button>

        {/* Guest: honest export surface (JSON + BOQ). No Import / quote-cart / ERP. */}
        {showGuestActions && (
          <MenuTrigger>
            <Button className={styles.btn} aria-label="Export — open export menu">
              Export
              <CaretDown size={12} weight="bold" aria-hidden />
            </Button>
            <Popover placement="bottom end">
              <Menu
                className={styles.dropdownMenu}
                onAction={(key) => onExport?.(key as string)}
              >
                <MenuItem id="json" className={styles.dropdownItem}>
                  Export as JSON
                </MenuItem>
                <MenuItem id="boq-json" className={styles.dropdownItem}>
                  Export BOQ (JSON)
                </MenuItem>
                <MenuItem id="boq-csv" className={styles.dropdownItem}>
                  Export BOQ (CSV)
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        )}

        {showPersistenceActions && (
          <>
            <MenuTrigger>
              <Button className={styles.btn} aria-label="Import — open import menu">
                Import
                <CaretDown size={12} weight="bold" aria-hidden />
              </Button>
              <Popover placement="bottom end">
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
              </Popover>
            </MenuTrigger>

            <MenuTrigger>
              <Button className={styles.btn} aria-label="Export — open export menu">
                Export
                <CaretDown size={12} weight="bold" aria-hidden />
              </Button>
              <Popover placement="bottom end">
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
              </Popover>
            </MenuTrigger>
          </>
        )}

        <MenuTrigger>
          <Button className={styles.btn} aria-label="Prefs — open preferences menu">
            Prefs
            <CaretDown size={12} weight="bold" aria-hidden />
          </Button>
          <Popover placement="bottom end">
            <Menu
              className={styles.dropdownMenu}
              onAction={(key) => {
                if (key === "density") onToggleDensity?.();
              }}
            >
              <MenuItem id="density" className={styles.dropdownItem}>
                Toggle density ({density === "touch" ? "compact" : "touch"})
              </MenuItem>
              <MenuItem id="grid" className={styles.dropdownItem}>Toggle grid</MenuItem>
              <MenuItem id="snap" className={styles.dropdownItem}>Toggle snap</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      </div>
    </header>
  );
}
