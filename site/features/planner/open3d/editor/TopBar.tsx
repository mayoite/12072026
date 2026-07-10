"use client";

import { CornersIn, CornersOut } from "@phosphor-icons/react";
import {
  MenuTrigger,
  Button,
  Popover,
  Menu,
  MenuItem,
  RadioGroup,
  Radio,
} from "react-aria-components";
import type { PlannerAccessContext } from "../lib/commands/plannerAccessContext";
import type { Open3dDisplayUnit } from "../model/types";
import type { Open3dSaveStatus } from "../persistence/useOpen3dWorkspaceAutosave";
import type { PanelId } from "./useDockingSystem";
import {
  open3dSaveStatusLabel,
  type Open3dPersistStorage,
} from "./workspaceStatusLabels";
import styles from "./workspace.module.css";

/**
 * Prop contract for WorkspaceShell / OOPlanner wiring (next agent):
 *
 * Prefer honest save pill via one of:
 * 1. `saveStatusLabel` — parent already resolved open3dSaveStatusLabel text
 * 2. `saveStatus` (+ optional `saveStorage`, `saveCloudEnabled`) — TopBar calls
 *    open3dSaveStatusLabel; guestMode from accessContext === "guest"
 *
 * `isModified` / `isSynced` remain optional fallback only:
 * - brand subline "Unsaved changes" when isModified
 * - pill maps modified→unsaved, synced→saved, else→idle through the helper
 *   (never bare "Ready" / "Modified" / /^Saved$/)
 */
export interface TopBarProps {
  accessContext?: PlannerAccessContext;
  projectName: string;
  /** Brand subline only when true; also fallback for pill status when saveStatus omitted. */
  isModified?: boolean;
  /** Fallback for pill status when saveStatus omitted (synced → "saved"). */
  isSynced?: boolean;
  /**
   * Pre-resolved pill label from open3dSaveStatusLabel (or equivalent).
   * Wins over saveStatus / isModified / isSynced for displayed text.
   */
  saveStatusLabel?: string;
  /** Autosave machine status — drives pill text via open3dSaveStatusLabel when label omitted. */
  saveStatus?: Open3dSaveStatus;
  /** Persist target for data-storage + label table. Default "local". */
  saveStorage?: Open3dPersistStorage;
  /** When false (default), cloud storage is forced to local labeling. */
  saveCloudEnabled?: boolean;
  viewMode: "2d" | "3d";
  floors?: Array<{ id: string; name: string }>;
  activeFloorId?: string;
  displayUnit?: Open3dDisplayUnit;
  onViewModeChange?: (mode: "2d" | "3d") => void;
  onFloorChange?: (floorId: string) => void;
  onDisplayUnitChange?: (unit: Open3dDisplayUnit) => void;
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
  isCanvasMaximized?: boolean;
  onToggleCanvasMaximized?: () => void;
  density?: "compact" | "touch";
  onToggleDensity?: () => void;
}

function resolveSaveStatusFromLegacy(
  isModified: boolean,
  isSynced: boolean,
): Open3dSaveStatus {
  if (isModified) return "unsaved";
  if (isSynced) return "saved";
  return "idle";
}

function saveStatusGlyph(status: Open3dSaveStatus): string {
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
  isCanvasMaximized = false,
  onToggleCanvasMaximized,
  density = "compact",
  onToggleDensity,
}: TopBarProps) {
  const showPersistenceActions = accessContext !== "guest";
  const showGuestActions = accessContext === "guest";
  const guestMode = accessContext === "guest";

  const resolvedSaveStatus: Open3dSaveStatus =
    saveStatus ?? resolveSaveStatusFromLegacy(isModified, isSynced);
  const effectiveStorage: Open3dPersistStorage =
    saveCloudEnabled && saveStorage === "cloud" ? "cloud" : "local";
  const resolvedSaveLabel =
    saveStatusLabel ??
    open3dSaveStatusLabel({
      status: resolvedSaveStatus,
      storage: saveStorage,
      lastSavedAt: null,
      cloudEnabled: saveCloudEnabled,
      guestMode,
    });

  const unitOptions: Open3dDisplayUnit[] = ["mm", "cm", "m", "in", "ft-in"];
  const activeFloorName = floors.find((f) => f.id === activeFloorId)?.name ?? "Floor";

  return (
    <header className={`pw-topbar ${styles.header}`} aria-label="Planner workspace">
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
              <ChevronDownIcon />
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
            <ChevronDownIcon />
          </Button>
          <Popover placement="bottom start">
            <Menu
              className={styles.dropdownMenu}
              selectionMode="single"
              selectedKeys={[displayUnit]}
              onAction={(key) => onDisplayUnitChange?.(key as Open3dDisplayUnit)}
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
          <button
            type="button"
            className={styles.btn}
            aria-pressed={isCanvasMaximized}
            aria-label={
              isCanvasMaximized
                ? "Restore — restore workspace panels"
                : "Focus — maximize canvas"
            }
            onClick={onToggleCanvasMaximized}
          >
            {isCanvasMaximized ? <CornersIn aria-hidden="true" /> : <CornersOut aria-hidden="true" />}
            <span className={styles.canvasModeLabel}>
              {isCanvasMaximized ? "Restore" : "Focus"}
            </span>
          </button>
        )}

        {(onToggleLeftPanel || onToggleRightPanel) && (
          <div className={styles.mobilePanelActions} role="group" aria-label="Panel toggles">
            {onToggleLeftPanel && (
              <button
                type="button"
                className={`${styles.btn} ${styles.mobilePanelBtn}`}
                data-active={activePanel === "left"}
                aria-pressed={activePanel === "left"}
                aria-label="Toggle inventory panel"
                onClick={onToggleLeftPanel}
              >
                Inventory
              </button>
            )}
            {onToggleRightPanel && (
              <button
                type="button"
                className={`${styles.btn} ${styles.mobilePanelBtn}`}
                data-active={activePanel === "right"}
                aria-pressed={activePanel === "right"}
                aria-label="Toggle properties panel"
                onClick={onToggleRightPanel}
              >
                Properties
              </button>
            )}
          </div>
        )}

        <div className={styles.historyActions} role="group" aria-label="Canvas history">
          <button
            type="button"
            className={styles.btn}
            disabled={!canUndo}
            aria-label="Undo"
            onClick={() => onUndo?.()}
          >
            Undo
          </button>
          <button
            type="button"
            className={styles.btn}
            disabled={!canRedo}
            aria-label="Redo"
            onClick={() => onRedo?.()}
          >
            Redo
          </button>
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

        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onSave?.()}>
          {showGuestActions ? "Save draft" : "Save"}
        </button>

        {/* Guest: honest export surface (JSON + BOQ). No Import / quote-cart / ERP. */}
        {showGuestActions && (
          <MenuTrigger>
            <Button className={styles.btn} aria-label="Export — open export menu">
              Export
              <ChevronDownIcon />
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
                <ChevronDownIcon />
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
                <ChevronDownIcon />
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
            <ChevronDownIcon />
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

function ChevronDownIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
