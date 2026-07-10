"use client";

import { ArrowsOutSimple, Cursor, DoorOpen, Hand, HouseLine, Package, Ruler, Wall, type Icon } from "@phosphor-icons/react";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";

import {
  CANVAS_TOOL_LABELS,
  CANVAS_TOOL_SHORTCUTS,
  type PlannerTool,
} from "./canvasTool";
import styles from "./canvas-tool-rail.module.css";

const NAV_TOOLS: PlannerTool[] = ["select", "pan"];
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

function toolToggle(tool: PlannerTool, activeTool: PlannerTool, disabled: boolean) {
  const IconComponent = TOOL_ICONS[tool];
  const label = CANVAS_TOOL_LABELS[tool];
  const shortcut = CANVAS_TOOL_SHORTCUTS[tool];

  return (
    <ToggleButton
      key={tool}
      id={tool}
      className={styles.toolBtn}
      isDisabled={disabled}
      aria-label={`${label} (${shortcut})`}
    >
      <IconComponent size={18} weight={activeTool === tool ? "fill" : "regular"} aria-hidden />
      <span className={styles.shortcut}>{shortcut}</span>
    </ToggleButton>
  );
}

export function CanvasToolRail({
  activeTool,
  onToolChange,
  onZoomReset,
  disabled = false,
}: CanvasToolRailProps) {
  const navSelectedKeys = NAV_TOOLS.includes(activeTool) ? [activeTool] : [];
  const drawSelectedKeys = DRAW_TOOLS.includes(activeTool) ? [activeTool] : [];

  return (
    <nav className={`${styles.rail} pw-tool-rail`} aria-label="Canvas tools">
      <ToggleButtonGroup
        className={styles.group}
        aria-label="Navigation tools"
        selectionMode="single"
        disallowEmptySelection={navSelectedKeys.length > 0}
        selectedKeys={navSelectedKeys}
        onSelectionChange={(keys) => {
          const next = [...keys][0];
          if (typeof next === "string") onToolChange(next as PlannerTool);
        }}
        isDisabled={disabled}
      >
        {NAV_TOOLS.map((tool) => toolToggle(tool, activeTool, disabled))}
      </ToggleButtonGroup>

      <div className={styles.divider} aria-hidden />

      <ToggleButtonGroup
        className={styles.group}
        aria-label="Drawing tools"
        selectionMode="single"
        disallowEmptySelection={drawSelectedKeys.length > 0}
        selectedKeys={drawSelectedKeys}
        onSelectionChange={(keys) => {
          const next = [...keys][0];
          if (typeof next === "string") onToolChange(next as PlannerTool);
        }}
        isDisabled={disabled}
      >
        {DRAW_TOOLS.map((tool) => toolToggle(tool, activeTool, disabled))}
      </ToggleButtonGroup>

      {onZoomReset ? (
        <>
          <div className={styles.divider} aria-hidden />
          <div className={styles.group} role="group" aria-label="View tools">
            <button
              type="button"
              className={styles.toolBtn}
              disabled={disabled}
              aria-label="Zoom to fit (0)"
              onClick={onZoomReset}
            >
              <ArrowsOutSimple size={18} aria-hidden />
              <span className={styles.shortcut}>0</span>
            </button>
          </div>
        </>
      ) : null}
    </nav>
  );
}
