"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ArrowsOutSimple,
  Cursor,
  DoorOpen,
  GridFour,
  Hand,
  HouseLine,
  Magnet,
  Package,
  Ruler,
  Square,
  TextT,
  Wall,
  type Icon,
} from "@phosphor-icons/react";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
} from "react-aria-components";

import {
  CANVAS_TOOL_REQUIREMENT,
  CANVAS_TOOL_SHORTCUTS,
  RAIL_DEFERRED_TOOLS,
  RAIL_DRAW_TOOLS,
  RAIL_NAV_TOOLS,
  toolAccessibleName,
  type PlannerTool,
} from "./canvasTool";
import { useWorkspaceChrome } from "./workspaceChromeContext";
import { useIsMobile } from "@/features/planner/hooks/useIsMobile";
import {
  clamp,
  DEFAULT_RAIL_LAYOUT,
  PLANNER_TOOL_RAIL_DOCK_KEY,
  railSnapFromPoint,
  type RailLayoutConfig,
} from "./workspaceLayout";
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

const DRAG_UNDOCK_THRESHOLD_PX = 8;

function readLocalRail(): RailLayoutConfig {
  if (typeof window === "undefined") return { ...DEFAULT_RAIL_LAYOUT };
  try {
    const raw = localStorage.getItem(PLANNER_TOOL_RAIL_DOCK_KEY);
    if (!raw) return { ...DEFAULT_RAIL_LAYOUT };
    const parsed = JSON.parse(raw) as Partial<RailLayoutConfig>;
    return { ...DEFAULT_RAIL_LAYOUT, ...parsed } as RailLayoutConfig;
  } catch {
    return { ...DEFAULT_RAIL_LAYOUT };
  }
}

export interface CanvasToolRailProps {
  activeTool: PlannerTool;
  onToolChange: (tool: PlannerTool) => void;
  onZoomReset?: () => void;
  gridEnabled?: boolean;
  snapEnabled?: boolean;
  onToggleGrid?: () => void;
  onToggleSnap?: () => void;
  disabled?: boolean;
  /** When true, Dockview owns float/dock — hide local layout chrome. */
  dockManaged?: boolean;
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
  return (
    <ToggleButton
      id={tool}
      className={styles.toolBtn}
      isDisabled={disabled}
      aria-label={name}
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
            weight={selected || isSelected ? "fill" : deferred ? "light" : "regular"}
            aria-hidden
          />
          <span className={styles.shortcut} aria-hidden>
            {shortcut}
          </span>
          {deferred ? (
            <span className={styles.deferredDot} aria-hidden data-deferred-marker="true" />
          ) : null}
        </span>
      )}
    </ToggleButton>
  );
}

function ViewToggle({
  label,
  enabled,
  onPress,
  icon: IconComponent,
  testId,
  disabled,
}: {
  label: "Grid" | "Snap";
  enabled: boolean;
  onPress: () => void;
  icon: Icon;
  testId: string;
  disabled: boolean;
}) {
  return (
    <Button
      className={styles.toolBtn}
      isDisabled={disabled}
      aria-label={`${enabled ? "Disable" : "Enable"} ${label}`}
      aria-pressed={enabled}
      onPress={onPress}
      data-selected={enabled ? "true" : undefined}
      data-testid={testId}
    >
      {({ isFocusVisible, isPressed }) => (
        <span
          className={styles.toolFace}
          data-selected={enabled ? "true" : undefined}
          data-focus-visible={isFocusVisible ? "true" : undefined}
          data-pressed={isPressed ? "true" : undefined}
        >
          <IconComponent size={16} weight={enabled ? "fill" : "regular"} aria-hidden />
        </span>
      )}
    </Button>
  );
}

function ToolGroup({
  tools,
  label,
  activeTool,
  onToolChange,
  disabled,
  orientation,
}: {
  tools: readonly PlannerTool[];
  label: string;
  activeTool: PlannerTool;
  onToolChange: (tool: PlannerTool) => void;
  disabled: boolean;
  orientation: "vertical" | "horizontal";
}) {
  const selectedKeys = tools.includes(activeTool) ? [activeTool] : [];

  return (
    <ToggleButtonGroup
      className={styles.group}
      data-orientation={orientation}
      aria-label={label}
      orientation={orientation}
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

type RailModuleId = "nav" | "draw" | "deferred" | "view";

type FloatingToolModuleStyle = CSSProperties & {
  "--pw-tool-module-x": string;
  "--pw-tool-module-y": string;
};

type FloatingToolRailStyle = CSSProperties & {
  "--pw-tool-rail-x": string;
  "--pw-tool-rail-y": string;
};

/**
 * RAC canvas tool rail — dockable left/top, floatable, optional split modules.
 */
export function CanvasToolRail({
  activeTool,
  onToolChange,
  onZoomReset,
  gridEnabled = true,
  snapEnabled = true,
  onToggleGrid,
  onToggleSnap,
  disabled = false,
  dockManaged = false,
}: CanvasToolRailProps) {
  const chrome = useWorkspaceChrome();
  const isMobile = useIsMobile();
  const [localRail, setLocalRail] = useState<RailLayoutConfig>(DEFAULT_RAIL_LAYOUT);
  const rail = chrome?.rail ?? localRail;

  const setRail = useCallback(
    (patch: Partial<RailLayoutConfig>) => {
      if (chrome?.setRailLayout) {
        chrome.setRailLayout(patch);
        return;
      }
      setLocalRail((current) => {
        const next = { ...current, ...patch };
        try {
          localStorage.setItem(PLANNER_TOOL_RAIL_DOCK_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [chrome],
  );

  useEffect(() => {
    if (chrome) return;
    const frame = window.requestAnimationFrame(() => {
      setLocalRail(readLocalRail());
    });
    return () => window.cancelAnimationFrame(frame);
  }, [chrome]);

  // Sync local fallback when presets write storage from shell
  useEffect(() => {
    if (chrome) return;
    const onStorage = (event: StorageEvent) => {
      if (event.key === PLANNER_TOOL_RAIL_DOCK_KEY) setLocalRail(readLocalRail());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [chrome]);

  const [dragging, setDragging] = useState(false);
  const [detached, setDetached] = useState<Partial<Record<RailModuleId, { x: number; y: number }>>>(
    {},
  );
  const dragRef = useRef<{
    mode: "tear-off" | "move";
    startClientX: number;
    startClientY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const isFloating = rail.state === "floating";
  // Dockview is a vertical CAD rail on wide screens and a horizontal strip on phones.
  const orientation: "vertical" | "horizontal" = dockManaged
    ? isMobile
      ? "horizontal"
      : "vertical"
    : rail.state === "docked" && rail.edge === "top"
      ? "horizontal"
      : rail.orientation;
  const dockedTop = !dockManaged && rail.state === "docked" && rail.edge === "top";

  const dockLeft = useCallback(() => {
    setRail({
      state: "docked",
      edge: "left",
      orientation: "vertical",
    });
    setDetached({});
  }, [setRail]);

  const dockTop = useCallback(() => {
    setRail({
      state: "docked",
      edge: "top",
      orientation: "horizontal",
    });
    setDetached({});
  }, [setRail]);

  const undock = useCallback(
    (x?: number, y?: number) => {
      setRail({
        state: "floating",
        x:
          typeof x === "number"
            ? x
            : typeof window !== "undefined"
              ? clamp(window.innerWidth * 0.08, 12, 120)
              : DEFAULT_RAIL_LAYOUT.x,
        y:
          typeof y === "number"
            ? y
            : typeof window !== "undefined"
              ? clamp(window.innerHeight * 0.12, 56, 160)
              : DEFAULT_RAIL_LAYOUT.y,
      });
    },
    [setRail],
  );

  const handleChromeMouseDown = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      if ((event.target as HTMLElement).closest("button")) return;
      event.preventDefault();

      if (rail.state === "floating") {
        dragRef.current = {
          mode: "move",
          startClientX: event.clientX,
          startClientY: event.clientY,
          originX: rail.x,
          originY: rail.y,
        };
      } else {
        dragRef.current = {
          mode: "tear-off",
          startClientX: event.clientX,
          startClientY: event.clientY,
          originX: event.clientX - 20,
          originY: event.clientY - 12,
        };
      }
      setDragging(true);
    },
    [rail],
  );

  useEffect(() => {
    if (!dragging) return;

    const onMove = (event: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      if (drag.mode === "tear-off") {
        const dist = Math.hypot(
          event.clientX - drag.startClientX,
          event.clientY - drag.startClientY,
        );
        if (dist < DRAG_UNDOCK_THRESHOLD_PX) return;
        const nextX = clamp(event.clientX - 20, 8, window.innerWidth - 64);
        const nextY = clamp(event.clientY - 12, 48, window.innerHeight - 120);
        dragRef.current = {
          mode: "move",
          startClientX: event.clientX,
          startClientY: event.clientY,
          originX: nextX,
          originY: nextY,
        };
        setRail({
          state: "floating",
          x: nextX,
          y: nextY,
          orientation: "vertical",
        });
        return;
      }

      const nextX = clamp(
        drag.originX + (event.clientX - drag.startClientX),
        8,
        window.innerWidth - 64,
      );
      const nextY = clamp(
        drag.originY + (event.clientY - drag.startClientY),
        48,
        window.innerHeight - 120,
      );
      setRail({ state: "floating", x: nextX, y: nextY });
    };

    const onUp = (event: MouseEvent) => {
      setDragging(false);
      dragRef.current = null;
      const snap = railSnapFromPoint(event.clientX, event.clientY, window.innerWidth);
      if (snap?.state === "docked") {
        setRail({
          state: "docked",
          edge: snap.edge,
          orientation: snap.orientation,
        });
        setDetached({});
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [dragging, setRail]);

  const renderGroups = (asSplit: boolean) => {
    const groups: Array<{
      id: RailModuleId;
      tools: readonly PlannerTool[];
      label: string;
    }> = [
      { id: "nav", tools: RAIL_NAV_TOOLS, label: "Navigation tools" },
      { id: "draw", tools: RAIL_DRAW_TOOLS, label: "Drawing tools" },
      { id: "deferred", tools: RAIL_DEFERRED_TOOLS, label: "Coming soon" },
    ];

    return (
      <>
        {groups.map((group, index) => {
          const splitPos = detached[group.id];
          const splitFloating = asSplit && splitPos;

          const body = (
            <div
              key={group.id}
              className={`${styles.railModule} pw-tool-rail-module`}
              data-module={group.id}
              data-split={splitFloating ? "true" : undefined}
              style={
                splitFloating
                  ? ({
                      "--pw-tool-module-x": `${splitPos.x}px`,
                      "--pw-tool-module-y": `${splitPos.y}px`,
                    } as FloatingToolModuleStyle)
                  : undefined
              }
            >
              {asSplit ? (
                <div className={styles.railModuleChrome}>
                  <button
                    type="button"
                    className={styles.railDockBtn}
                    onClick={() => {
                      if (splitFloating) {
                        setDetached((current) => {
                          const next = { ...current };
                          delete next[group.id];
                          return next;
                        });
                      } else {
                        setDetached((current) => ({
                          ...current,
                          [group.id]: {
                            x: 24 + index * 72,
                            y: 120 + index * 40,
                          },
                        }));
                        setRail({ state: "floating", splitGroups: true });
                      }
                    }}
                  >
                    {splitFloating ? "Join" : "Split"}
                  </button>
                </div>
              ) : null}
              <ToolGroup
                tools={group.tools}
                label={group.label}
                activeTool={activeTool}
                onToolChange={onToolChange}
                disabled={disabled}
                orientation={orientation}
              />
            </div>
          );

          return (
            <div key={group.id}>
              {index > 0 && !splitFloating ? (
                <div className={styles.divider} aria-hidden data-orientation={orientation} />
              ) : null}
              {body}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <Toolbar
      className={`${styles.rail} pw-tool-rail`}
      aria-label="Canvas tools"
      orientation={orientation}
      data-testid="canvas-tool-rail"
      data-rac-toolbar="true"
      data-dock-state={rail.state}
      data-dock-edge={rail.edge}
      data-orientation={orientation}
      data-floating={isFloating ? "true" : undefined}
      data-docked-top={dockedTop ? "true" : undefined}
      data-split={rail.splitGroups ? "true" : undefined}
      data-dock-managed={dockManaged ? "true" : undefined}
      style={
        !dockManaged && isFloating
          ? ({
              "--pw-tool-rail-x": `${rail.x}px`,
              "--pw-tool-rail-y": `${rail.y}px`,
            } as FloatingToolRailStyle)
          : undefined
      }
    >
      {!dockManaged ? (
      <div
        className={styles.railChrome}
        data-floating={isFloating ? "true" : undefined}
        data-orientation={orientation}
        onMouseDown={handleChromeMouseDown}
        title={
          isFloating
            ? "Drag tools · drop left/top edge to dock"
            : "Drag to float tools"
        }
      >
        <span className={styles.railGrip} aria-hidden>
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <circle cx="3" cy="2" r="1.2" />
            <circle cx="7" cy="2" r="1.2" />
            <circle cx="3" cy="6" r="1.2" />
            <circle cx="7" cy="6" r="1.2" />
            <circle cx="3" cy="10" r="1.2" />
            <circle cx="7" cy="10" r="1.2" />
          </svg>
        </span>
        <MenuTrigger>
          <Button
            className={styles.railMenuBtn}
            aria-label="Tool rail layout"
            data-testid="canvas-tool-rail-menu"
          >
            ⋯
          </Button>
          <Popover placement="right top" className={styles.railMenuPopover}>
            <Menu
              className={styles.railMenu}
              onAction={(key) => {
                const id = String(key);
                if (id === "float") undock();
                if (id === "left") dockLeft();
                if (id === "top") dockTop();
                if (id === "orient") {
                  setRail({
                    orientation: orientation === "vertical" ? "horizontal" : "vertical",
                    state: "floating",
                  });
                }
                if (id === "split") {
                  setRail({ splitGroups: !rail.splitGroups, state: "floating" });
                }
              }}
            >
              {!isFloating ? (
                <MenuItem id="float" className={styles.railMenuItem}>
                  Float over canvas
                </MenuItem>
              ) : null}
              {isFloating || dockedTop ? (
                <MenuItem id="left" className={styles.railMenuItem} data-testid="canvas-tool-rail-dock">
                  Dock left
                </MenuItem>
              ) : null}
              <MenuItem id="top" className={styles.railMenuItem} data-testid="canvas-tool-rail-dock-top">
                Dock top
              </MenuItem>
              <MenuItem id="orient" className={styles.railMenuItem} data-testid="canvas-tool-rail-orient">
                {orientation === "vertical" ? "Make horizontal" : "Make vertical"}
              </MenuItem>
              <MenuItem id="split" className={styles.railMenuItem} data-testid="canvas-tool-rail-split">
                {rail.splitGroups ? "Join tool groups" : "Split tool groups"}
              </MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      </div>
      ) : null}

      <span className={styles.srOnly}>
        Canvas drawing tools.
        {!dockManaged
          ? " Drag the grip to float. Drop on left or top edge to dock."
          : null}
      </span>

      {renderGroups(dockManaged ? false : rail.splitGroups)}

      {onZoomReset || onToggleGrid || onToggleSnap ? (
        <>
          <div className={styles.divider} aria-hidden data-orientation={orientation} />
          <div className={styles.group} role="group" aria-label="View tools" data-orientation={orientation}>
            {onZoomReset ? (
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
            ) : null}
            {onToggleGrid ? (
              <ViewToggle
                label="Grid"
                enabled={gridEnabled}
                onPress={onToggleGrid}
                icon={GridFour}
                testId="canvas-tool-grid"
                disabled={disabled}
              />
            ) : null}
            {onToggleSnap ? (
              <ViewToggle
                label="Snap"
                enabled={snapEnabled}
                onPress={onToggleSnap}
                icon={Magnet}
                testId="canvas-tool-snap"
                disabled={disabled}
              />
            ) : null}
          </div>
        </>
      ) : null}
    </Toolbar>
  );
}
