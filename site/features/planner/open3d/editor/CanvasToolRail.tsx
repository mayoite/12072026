"use client";

import type { LucideIcon } from "lucide-react";
import {
  DoorOpen,
  Hand,
  Maximize2,
  MousePointer2,
  PanelTop,
  Type,
  BrickWall,
} from "lucide-react";

import {
  CANVAS_TOOL_LABELS,
  CANVAS_TOOL_SHORTCUTS,
  type CanvasTool,
} from "./canvasTool";
import styles from "./canvas-tool-rail.module.css";

const DRAW_TOOLS: CanvasTool[] = ["wall", "door", "window", "text"];

const TOOL_ICONS: Record<CanvasTool, LucideIcon> = {
  select: MousePointer2,
  pan: Hand,
  wall: BrickWall,
  door: DoorOpen,
  window: PanelTop,
  text: Type,
};

export interface CanvasToolRailProps {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  onZoomReset?: () => void;
  disabled?: boolean;
}

export function CanvasToolRail({
  activeTool,
  onToolChange,
  onZoomReset,
  disabled = false,
}: CanvasToolRailProps) {
  const renderTool = (tool: CanvasTool) => {
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
          <Icon size={18} strokeWidth={1.75} aria-hidden />
          <span className={styles.shortcut}>{shortcut}</span>
        </button>
      </div>
    );
  };

  return (
    <nav className={styles.rail} aria-label="Canvas tools">
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
                <Maximize2 size={18} strokeWidth={1.75} aria-hidden />
                <span className={styles.shortcut}>0</span>
              </button>
            </div>
          </div>
        </>
      ) : null}
    </nav>
  );
}
