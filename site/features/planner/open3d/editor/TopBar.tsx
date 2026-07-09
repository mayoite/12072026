"use client";

import { CornersIn, CornersOut } from "@phosphor-icons/react";
import { MenuTrigger, Button, Popover, Menu, MenuItem } from "react-aria-components";
import type { PlannerAccessContext } from "../lib/commands/plannerAccessContext";
import type { Open3dDisplayUnit } from "../model/types";
import type { PanelId } from "./useDockingSystem";
import styles from "./workspace.module.css";

export interface TopBarProps {
  accessContext?: PlannerAccessContext;
  projectName: string;
  isModified?: boolean;
  isSynced?: boolean;
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

export function TopBar({
  accessContext = "authenticated",
  projectName,
  isModified = false,
  isSynced = false,
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

  const unitOptions: Open3dDisplayUnit[] = ["mm", "cm", "m", "in", "ft-in"];
  const activeFloorName = floors.find((f) => f.id === activeFloorId)?.name ?? "Floor";

  return (
    <header className={`pw-topbar ${styles.header}`} aria-label="Planner workspace">
      <div className={styles.brand}>
        <h1 className={styles.brandTitle}>{projectName}</h1>
        {isModified && <span className={styles.brandSub}>Unsaved changes</span>}
      </div>

      <div className={styles.center}>
        <div className={styles.viewToggle} role="radiogroup" aria-label="View mode">
          <button
            type="button"
            className={styles.viewToggleBtn}
            data-active={viewMode === "2d"}
            onClick={() => onViewModeChange?.("2d")}
            aria-checked={viewMode === "2d"}
            role="radio"
          >
            2D
          </button>
          <button
            type="button"
            className={styles.viewToggleBtn}
            data-active={viewMode === "3d"}
            onClick={() => onViewModeChange?.("3d")}
            aria-checked={viewMode === "3d"}
            role="radio"
          >
            3D
          </button>
        </div>

        {floors.length > 0 && (
          <MenuTrigger>
            <Button className={styles.btn} aria-label={`Active floor: ${activeFloorName}`}>
              {activeFloorName}
              <ChevronDownIcon />
            </Button>
            <Popover placement="bottom start">
              <Menu
                className={styles.dropdownMenu}
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
            aria-label={isCanvasMaximized ? "Restore workspace panels" : "Maximize canvas"}
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
          data-modified={isModified}
          data-synced={isSynced && !isModified}
        >
          {isModified ? (
            <>
              <span aria-hidden="true">●</span> Modified
            </>
          ) : isSynced ? (
            <>
              <span aria-hidden="true">✓</span> Saved locally
            </>
          ) : (
            <>
              <span aria-hidden="true">○</span> Ready
            </>
          )}
        </div>

        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onSave?.()}>
          {showGuestActions ? "Save draft" : "Save"}
        </button>

        {showGuestActions && (
          <button type="button" className={styles.btn} onClick={() => onExport?.("json")}>
            Export JSON
          </button>
        )}

        {showPersistenceActions && (
          <>
            <MenuTrigger>
              <Button className={styles.btn}>
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
              <Button className={styles.btn}>
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
                  <MenuItem id="boq" className={styles.dropdownItem}>
                    Export workstation BOQ
                  </MenuItem>
                  <MenuItem id="quote" className={styles.dropdownItem}>
                    Add seats to quote cart
                  </MenuItem>
                  {/* PDF/PNG not shipped — do not list until real export exists */}
                </Menu>
              </Popover>
            </MenuTrigger>
          </>
        )}

        <MenuTrigger>
          <Button className={styles.btn} aria-label="Open preferences menu">
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
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
