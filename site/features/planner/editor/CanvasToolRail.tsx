"use client";

import {
  ArrowsOutSimple,
  Cursor,
  DoorOpen,
  Hand,
  HouseLine,
  Package,
  Ruler,
  Square,
  TextT,
  Wall,
  type Icon,
} from "@phosphor-icons/react";
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  TooltipTrigger,
} from "react-aria-components";

import {
  CANVAS_TOOL_REQUIREMENT,
  CANVAS_TOOL_SHORTCUTS,
  RAIL_DRAW_TOOLS,
  RAIL_NAV_TOOLS,
  isLiveGeometryTool,
  toolAccessibleName,
  toolTooltipText,
  type PlannerTool,
} from "./canvasTool";
import styles from "./canvas-tool-rail.module.css";

const TOOL_ICONS: Record<PlannerTool, Icon> = {
  select: Cursor,
  pan: Hand,
  room: HouseLine,
  wall: Wall,
  opening: DoorOpen,
  dimension: Ruler,
  placement: Package,
  door: DoorOpen,
  window: Square,
  text: TextT,
};

export interface CanvasToolRailProps {
  activeTool: PlannerTool;
  onToolChange: (tool: PlannerTool) => void;
  onZoomReset?: () => void;
  disabled?: boolean;
}

function ToolToggle({
  tool,
  activeTool,
  disabled,
}: {
  tool: PlannerTool;
  activeTool: PlannerTool;
  disabled: boolean;
}) {
  const IconComponent = TOOL_ICONS[tool];
  const shortcut = CANVAS_TOOL_SHORTCUTS[tool];
  const deferred = CANVAS_TOOL_REQUIREMENT[tool] === "deferred";
  const selected = activeTool === tool;
  const name = toolAccessibleName(tool);
  const tip = toolTooltipText(tool);

  return (
    <TooltipTrigger delay={400} closeDelay={100}>
      <ToggleButton
        id={tool}
        className={styles.toolBtn}
        isDisabled={disabled}
        aria-label={name}
        aria-description={deferred ? tip : undefined}
        data-deferred={deferred ? "true" : undefined}
        data-tier={CANVAS_TOOL_REQUIREMENT[tool]}
        data-testid={`canvas-tool-${tool}`}
      >
        {({ isSelected, isFocusVisible }) => (
          <span
            className={styles.toolFace}
            data-selected={isSelected || selected ? "true" : undefined}
            data-focus-visible={isFocusVisible ? "true" : undefined}
          >
            <IconComponent
              size={16}
              weight={
                selected || isSelected
                  ? "fill"
                  : deferred
                    ? "light"
                    : "regular"
              }
              aria-hidden
            />
            <span className={styles.shortcut} aria-hidden>
              {shortcut}
            </span>
            {deferred ? (
              <span
                className={styles.deferredDot}
                aria-hidden
                data-deferred-marker="true"
                title="Deferred — not full geometry"
              />
            ) : null}
          </span>
        )}
      </ToggleButton>
      <Tooltip
        className={styles.tooltip}
        placement="right"
        data-tool-tier={CANVAS_TOOL_REQUIREMENT[tool]}
      >
        <span className={styles.tooltipTitle}>{name}</span>
        <span className={styles.tooltipBody}>{tip}</span>
        {deferred ? (
          <span className={styles.tooltipMeta} data-tier="deferred">
            Deferred — arms only, no full geometry yet
          </span>
        ) : isLiveGeometryTool(tool) ? (
          <span className={styles.tooltipMeta} data-tier="live">
            Live on Fabric canvas
          </span>
        ) : null}
      </Tooltip>
    </TooltipTrigger>
  );
}

function ToolGroup({
  tools,
  label,
  activeTool,
  onToolChange,
  disabled,
}: {
  tools: readonly PlannerTool[];
  label: string;
  activeTool: PlannerTool;
  onToolChange: (tool: PlannerTool) => void;
  disabled: boolean;
}) {
  const selectedKeys = tools.includes(activeTool) ? [activeTool] : [];

  return (
    <ToggleButtonGroup
      className={styles.group}
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection={selectedKeys.length > 0}
      selectedKeys={selectedKeys}
      onSelectionChange={(keys) => {
        const next = [...keys][0];
        if (typeof next === "string") onToolChange(next as PlannerTool);
      }}
      isDisabled={disabled}
      data-testid={`canvas-tool-group-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {tools.map((tool) => (
        <ToolToggle key={tool} tool={tool} activeTool={activeTool} disabled={disabled} />
      ))}
    </ToggleButtonGroup>
  );
}

/**
 * RAC canvas tool rail — sole interactive plan chrome for tools.
 * Maps + tiers from canvasTool.ts; React Aria only (no lucide).
 */
export function CanvasToolRail({
  activeTool,
  onToolChange,
  onZoomReset,
  disabled = false,
}: CanvasToolRailProps) {
  return (
    <nav
      className={`${styles.rail} pw-tool-rail`}
      aria-label="Canvas tools"
      data-testid="canvas-tool-rail"
      data-rac-toolbar="true"
    >
      <span className={styles.srOnly}>
        Canvas drawing tools. Live tools change the plan. Deferred tools arm only.
      </span>

      <ToolGroup
        tools={RAIL_NAV_TOOLS}
        label="Navigation tools"
        activeTool={activeTool}
        onToolChange={onToolChange}
        disabled={disabled}
      />

      <div className={styles.divider} aria-hidden />

      <ToolGroup
        tools={RAIL_DRAW_TOOLS}
        label="Drawing tools"
        activeTool={activeTool}
        onToolChange={onToolChange}
        disabled={disabled}
      />

      {onZoomReset ? (
        <>
          <div className={styles.divider} aria-hidden />
          <div className={styles.group} role="group" aria-label="View tools">
            <TooltipTrigger delay={400} closeDelay={100}>
              <Button
                className={styles.toolBtn}
                isDisabled={disabled}
                aria-label="Zoom to fit"
                onPress={onZoomReset}
                data-testid="canvas-tool-zoom-fit"
              >
                {({ isFocusVisible, isPressed }) => (
                  <span
                    className={styles.toolFace}
                    data-focus-visible={isFocusVisible ? "true" : undefined}
                    data-pressed={isPressed ? "true" : undefined}
                  >
                    <ArrowsOutSimple size={16} aria-hidden />
                  </span>
                )}
              </Button>
              <Tooltip className={styles.tooltip} placement="right">
                <span className={styles.tooltipTitle}>Zoom to fit</span>
                <span className={styles.tooltipBody}>
                  Reset canvas view transform (bounds fit when available).
                </span>
              </Tooltip>
            </TooltipTrigger>
          </div>
        </>
      ) : null}
    </nav>
  );
}
