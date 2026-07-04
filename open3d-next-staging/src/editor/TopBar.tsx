"use client";

import { useCallback, useState, type MouseEvent } from "react";
import type { PlannerAccessContext } from "../lib/commands/plannerAccessContext";
import type { Open3dDisplayUnit } from "../model/types";
import styles from "./topbar.module.css";

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
  /** Called when export is triggered */
  onExport?: () => void;
  /** Called when import is triggered */
  onImport?: () => void;
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
}: TopBarProps) {
  const showPersistenceActions = accessContext !== "guest";
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [showUnitMenu, setShowUnitMenu] = useState(false);

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

  return (
    <header className={styles.header}>
      {/* Brand / Project name */}
      <div className={styles.brand}>
        <h1 className={styles.brandTitle}>{projectName}</h1>
        {isModified && <span className={styles.brandSub}>Unsaved changes</span>}
      </div>

      {/* Control cluster */}
      <div className={styles.controls}>
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

        {/* Floors dropdown (stub) */}
        {floors.length > 0 && (
          <div className={`${styles.dropdown} ${styles.floorDropdown}`}>
            <button
              type="button"
              className={styles.btn}
              aria-haspopup="listbox"
              aria-expanded={false}
            >
              Floor: {floors.find((f) => f.id === activeFloorId)?.name ?? "Select"}
              <ChevronDownIcon />
            </button>
          </div>
        )}

        {/* Unit dropdown */}
        <div className={`${styles.dropdown} ${styles.unitDropdown}`}>
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
        {/* Save status indicator */}
        <div
          className={styles.saveStatus}
          data-modified={isModified}
          data-synced={isSynced && !isModified}
        >
          {isModified ? (
            <>
              <span>●</span> Modified
            </>
          ) : isSynced ? (
            <>
              <span>✓</span> Saved
            </>
          ) : (
            <>
              <span>○</span> Ready
            </>
          )}
        </div>

        {showPersistenceActions && (
          <>
            {/* Import button */}
            <div className={`${styles.dropdown} ${styles.importDropdown}`}>
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
            <div className={`${styles.dropdown} ${styles.exportDropdown}`}>
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
                    onClick={() => handleMenuItemClick(onExport ?? (() => {}))}
                    role="menuitem"
                  >
                    Export as JSON
                  </button>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => handleMenuItemClick(() => {})}
                    role="menuitem"
                  >
                    Export as PDF
                  </button>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => handleMenuItemClick(() => {})}
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
      {(showExportMenu || showImportMenu || showUnitMenu) && (
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
