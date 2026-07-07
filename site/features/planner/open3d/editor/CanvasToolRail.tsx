"use client";

import {
  ArrowsOutSimple,
  Cursor,
  DoorOpen,
  Hand,
  HouseLine,
  Package,
  Ruler,
  Wall,
  type Icon,
} from "@phosphor-icons/react";

import {
  CANVAS_TOOL_LABELS,
  CANVAS_TOOL_SHORTCUTS,
  type PlannerTool,
} from "./canvasTool";
import styles from "./canvas-tool-rail.module.css";

const DRAW_TOOLS: PlannerTool[] = ["room", "wall", "opening", "dimension", "placement"];

const TOOL_ICONS: Record<PlannerTool, Icon> = {
  select: Cursor,
  pan: Hand,
  room: HouseLine,
  wall: Wall,
  opening: DoorOpen,
  dimension: Ruler,
  placement: Package,
  door: DoorOpen,
  window: DoorOpen,
  text: Ruler,
};

export interface CanvasToolRailProps {
  activeTool: PlannerTool;
  onToolChange: (tool: PlannerTool) => void;
  onZoomReset?: () => void;
  disabled?: boolean;
}

export function CanvasToolRail({
  activeTool,
  onToolChange,
  onZoomReset,
  disabled = false,
}: CanvasToolRailProps) {
  const renderTool = (tool: PlannerTool) => {
    const Icon = TOOL_ICONS[tool];
    const label = CANVAS_TOOL_LABELS[tool];
    const shortcut = CANVAS_TOOL_SHORTCUTS[tool];
    return (
      <div key={tool} className={styles.toolWrap}>
        <button
          type="button"
          className={styles.toolBtn}
          data-active={activeTool === tool}
          disabled={disabled}
          aria-pressed={activeTool === tool}
          aria-label={`${label} (${shortcut})`}
          title={`${label} (${shortcut})`}
          onClick={() => onToolChange(tool)}
        >
          <Icon size={18} weight={activeTool === tool ? "fill" : "regular"} aria-hidden />
          <span className={styles.shortcut}>{shortcut}</span>
        </button>
      </div>
    );
  };

  return (
    <nav className={`${styles.rail} pw-tool-rail`} aria-label="Canvas tools">
      <div className={styles.group} role="group" aria-label="Navigation tools">
        {renderTool("select")}
        {renderTool("pan")}
      </div>
      <div className={styles.divider} aria-hidden />
      <div className={styles.group} role="group" aria-label="Drawing tools">
        {DRAW_TOOLS.map(renderTool)}
      </div>
      {onZoomReset ? (
        <>
          <div className={styles.divider} aria-hidden />
          <div className={styles.group} role="group" aria-label="View tools">
            <div className={styles.toolWrap}>
              <button
                type="button"
                className={styles.toolBtn}
                disabled={disabled}
                aria-label="Zoom to fit (0)"
                title="Zoom to fit (0)"
                onClick={onZoomReset}
              >
                <ArrowsOutSimple size={18} aria-hidden />
                <span className={styles.shortcut}>0</span>
              </button>
            </div>
          </div>
        </>
      ) : null}
    </nav>
  );
}
