"use client";

import { useCallback, useState, type MouseEvent } from "react";
import type { PlannerAccessContext } from "../lib/commands/plannerAccessContext";
import type { Open3dDisplayUnit } from "../model/types";
import styles from "./workspace.module.css";

export interface TopBarProps {
  /** Guest sessions must not expose persist/import/export actions in the UI */
  accessContext?: PlannerAccessContext;
  /** Project name */
  projectName: string;
  /** Whether the project has unsaved changes */
  isModified?: boolean;
  /** Whether the project is synced/saved */
  isSynced?: boolean;
  /** Current view mode */
  viewMode: "2d" | "3d";
  /** Available floors */
  floors?: Array<{ id: string; name: string }>;
  /** Currently active floor ID */
  activeFloorId?: string;
  /** Current display unit */
  displayUnit?: Open3dDisplayUnit;
  /** Called when view mode changes */
  onViewModeChange?: (mode: "2d" | "3d") => void;
  /** Called when floor selection changes */
  onFloorChange?: (floorId: string) => void;
  /** Called when display unit changes */
  onDisplayUnitChange?: (unit: Open3dDisplayUnit) => void;
  /** Called when save is triggered */
  onSave?: () => void;
  /** Called when export is triggered (format: json, svg, png, pdf) */
  onExport?: (format?: string) => void;
  /** Called when import is triggered */
  onImport?: () => void;
  /** Whether undo is available */
  canUndo?: boolean;
  /** Whether redo is available */
  canRedo?: boolean;
  /** Called when undo is triggered */
  onUndo?: () => void;
  /** Called when redo is triggered */
  onRedo?: () => void;
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
}: TopBarProps) {
  const showPersistenceActions = accessContext !== "guest";
  const showGuestActions = accessContext === "guest";
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [showUnitMenu, setShowUnitMenu] = useState(false);
  const [showFloorMenu, setShowFloorMenu] = useState(false);

  const handleExportClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowExportMenu((current) => !current);
    setShowImportMenu(false);
  }, []);

  const handleImportClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowImportMenu((current) => !current);
    setShowExportMenu(false);
  }, []);

  const handleMenuItemClick = useCallback(
    (action: () => void) => {
      action();
      setShowExportMenu(false);
      setShowImportMenu(false);
    },
    [],
  );

  // Close menus when clicking outside
  const handleDocumentClick = useCallback(() => {
    setShowExportMenu(false);
    setShowImportMenu(false);
    setShowUnitMenu(false);
    setShowFloorMenu(false);
  }, []);

  // Unit options
  const unitOptions: Open3dDisplayUnit[] = ["mm", "cm", "m", "in", "ft-in"];

  const handleUnitSelect = useCallback(
    (unit: Open3dDisplayUnit) => {
      onDisplayUnitChange?.(unit);
      setShowUnitMenu(false);
    },
    [onDisplayUnitChange],
  );

  const handleFloorSelect = useCallback(
    (floorId: string) => {
      onFloorChange?.(floorId);
      setShowFloorMenu(false);
    },
    [onFloorChange],
  );

  const activeFloorName = floors.find((f) => f.id === activeFloorId)?.name ?? "Floor";

  return (
    <header className={styles.header}>
      {/* Brand / Project name */}
      <div className={styles.brand}>
        <h1 className={styles.brandTitle}>{projectName}</h1>
        {isModified && <span className={styles.brandSub}>Unsaved changes</span>}
      </div>

      {/* Center area - view controls */}
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

        {/* Floors dropdown */}
        {floors.length > 0 && (
          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.btn}
              onClick={(event) => {
                event.stopPropagation();
                setShowFloorMenu((current) => !current);
                setShowExportMenu(false);
                setShowImportMenu(false);
                setShowUnitMenu(false);
              }}
              aria-haspopup="listbox"
              aria-expanded={showFloorMenu}
              aria-label={`Active floor: ${activeFloorName}`}
            >
              {activeFloorName}
              <ChevronDownIcon />
            </button>
            {showFloorMenu && (
              <div className={styles.dropdownMenu} role="listbox" aria-label="Select floor">
                {floors.map((floor) => (
                  <button
                    key={floor.id}
                    type="button"
                    className={styles.dropdownItem}
                    data-selected={floor.id === activeFloorId}
                    onClick={() => handleFloorSelect(floor.id)}
                    role="option"
                    aria-selected={floor.id === activeFloorId}
                  >
                    {floor.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Unit dropdown */}
        <div className={styles.dropdown}>
          <button
            type="button"
            className={styles.btn}
            onClick={(e) => {
              e.stopPropagation();
              setShowUnitMenu((current) => !current);
              setShowExportMenu(false);
              setShowImportMenu(false);
            }}
            aria-expanded={showUnitMenu}
            aria-haspopup="listbox"
            aria-label={`Display unit: ${displayUnit}`}
          >
            {displayUnit}
            <ChevronDownIcon />
          </button>
          {showUnitMenu && (
            <div className={styles.dropdownMenu} role="listbox" aria-label="Select display unit">
              {unitOptions.map((unit) => (
                <button
                  key={unit}
                  type="button"
                  className={styles.dropdownItem}
                  data-selected={unit === displayUnit}
                  onClick={() => handleUnitSelect(unit)}
                  role="option"
                  aria-selected={unit === displayUnit}
                >
                  {unit}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className={styles.actions}>
        <div className={styles.historyActions} role="group" aria-label="History">
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

        {/* Save status indicator */}
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
              <span aria-hidden="true">✓</span> Saved
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
            {/* Import button */}
            <div className={styles.dropdown}>
              <button
                type="button"
                className={styles.btn}
                onClick={handleImportClick}
                aria-expanded={showImportMenu}
                aria-haspopup="menu"
              >
                Import
                <ChevronDownIcon />
              </button>
              {showImportMenu && (
                <div className={styles.dropdownMenu} role="menu">
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => handleMenuItemClick(onImport ?? (() => {}))}
                    role="menuitem"
                  >
                    Import from file...
                  </button>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => handleMenuItemClick(() => {})}
                    role="menuitem"
                  >
                    Import from URL...
                  </button>
                </div>
              )}
            </div>

            {/* Export button */}
            <div className={styles.dropdown}>
              <button
                type="button"
                className={styles.btn}
                onClick={handleExportClick}
                aria-expanded={showExportMenu}
                aria-haspopup="menu"
              >
                Export
                <ChevronDownIcon />
              </button>
              {showExportMenu && (
                <div className={styles.dropdownMenu} role="menu">
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => handleMenuItemClick(() => onExport?.("json"))}
                    role="menuitem"
                  >
                    Export as JSON
                  </button>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => handleMenuItemClick(() => onExport?.("svg"))}
                    role="menuitem"
                  >
                    Export as SVG
                  </button>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => handleMenuItemClick(() => onExport?.("pdf"))}
                    role="menuitem"
                  >
                    Export as PDF
                  </button>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => handleMenuItemClick(() => onExport?.("png"))}
                    role="menuitem"
                  >
                    Export as PNG
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Click outside handler */}
      {(showExportMenu || showImportMenu || showUnitMenu || showFloorMenu) && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
          }}
          onClick={handleDocumentClick}
          aria-hidden="true"
        />
      )}
    </header>
  );
}

// Simple chevron icon
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