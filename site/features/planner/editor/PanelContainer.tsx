"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import styles from "@/app/css/core/locked/planner/workspace-shell.module.css";

export type PanelSide = "left" | "right" | "bottom";

export interface PanelContainerProps {
  /** Unique panel identifier */
  id: PanelSide;
  /** Panel title displayed in title bar */
  title: string;
  /** Current panel state */
  state: "docked" | "floating" | "collapsed";
  /** Panel dimensions */
  width: number;
  height: number;
  /** Panel position (for floating) */
  x: number;
  y: number;
  /** Z-index for stacking */
  zIndex: number;
  /** Whether panel is visible */
  isOpen: boolean;
  /** Panel content */
  children: ReactNode;
  /** Called when user clicks dock button */
  onDock?: () => void;
  /** Called when user clicks undock button (optional tear-off position). */
  onUndock?: (x?: number, y?: number) => void;
  /** Called when user clicks close/collapse button */
  onClose?: () => void;
  /** Called when user clicks minimize button */
  onMinimize?: () => void;
  /** Called when panel position changes */
  onMove?: (x: number, y: number) => void;
  /** Called when panel size changes */
  onResize?: (width: number, height: number) => void;
  /** Called when panel gains focus */
  onFocus?: () => void;
  /** Called when panel loses focus */
  onBlur?: () => void;
  /**
   * Compact chrome: grip + dock actions only (no big title).
   * Use when content already has its own tabs/headers.
   */
  contentOnly?: boolean;
  /** Edge this panel occupies when docked (supports left↔right swap). */
  dockEdge?: "left" | "right" | "bottom";
  /** Live edge-highlight while dragging a floating panel. */
  onDropProbe?: (clientX: number | null, clientY?: number) => void;
  /** On drag end — dock if over an edge zone. Return true if docked. */
  onDropCommit?: (clientX: number, clientY: number) => boolean;
  /** Let the phone overlay CSS own side-panel width and safe-area sizing. */
  responsiveOverlay?: boolean;
}

interface ResizeState {
  isResizing: boolean;
  edge: "left" | "right" | "top" | "bottom" | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

type PanelGeometryStyle = CSSProperties & {
  "--pw-panel-x"?: string;
  "--pw-panel-y"?: string;
  "--pw-panel-width"?: string;
  "--pw-panel-height": string;
  "--pw-panel-z"?: string;
};

const DRAG_UNDOCK_THRESHOLD_PX = 8;

export function PanelContainer({
  id,
  title,
  state,
  width,
  height,
  x,
  y,
  zIndex,
  isOpen,
  children,
  onDock,
  onUndock,
  onClose,
  onMinimize,
  onMove,
  onResize,
  onFocus,
  onBlur,
  contentOnly = false,
  dockEdge,
  onDropProbe,
  onDropCommit,
  responsiveOverlay = false,
}: PanelContainerProps) {
  const panelRef = useRef<HTMLElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panelX: 0, panelY: 0 });
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    edge: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });
  /** Drag started while docked — undock once pointer moves past threshold. */
  const pendingUndockRef = useRef<{
    startClientX: number;
    startClientY: number;
  } | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") {
        if (isDragging) {
          setIsDragging(false);
          pendingUndockRef.current = null;
          return;
        }
        if (resizeState.isResizing) {
          setResizeState((current) => ({ ...current, isResizing: false }));
          return;
        }
        onClose?.();
      }
    },
    [isDragging, resizeState.isResizing, onClose],
  );

  const handleTitleMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest("button")) return;
      if (event.button !== 0) return;

      event.preventDefault();

      if (state === "floating") {
        setIsDragging(true);
        setDragStart({
          x: event.clientX,
          y: event.clientY,
          panelX: x,
          panelY: y,
        });
        return;
      }

      // Docked: drag title bar to tear off into a floating panel
      if (state === "docked" && onUndock) {
        pendingUndockRef.current = {
          startClientX: event.clientX,
          startClientY: event.clientY,
        };
        setIsDragging(true);
        setDragStart({
          x: event.clientX,
          y: event.clientY,
          panelX: event.clientX - 40,
          panelY: event.clientY - 16,
        });
      }
    },
    [state, x, y, onUndock],
  );

  const handleTitleDoubleClick = useCallback(() => {
    if (state === "floating" && onDock) {
      onDock();
      onDropProbe?.(null);
    }
  }, [state, onDock, onDropProbe]);

  const handleResizeMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>, edge: ResizeState["edge"]) => {
      event.preventDefault();
      event.stopPropagation();

      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;

      setResizeState({
        isResizing: true,
        edge,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: rect.width,
        startHeight: rect.height,
      });
    },
    [],
  );

  useEffect(() => {
    if (!isDragging && !resizeState.isResizing) return;

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      if (isDragging) {
        const pending = pendingUndockRef.current;
        if (pending && onUndock) {
          const dx = event.clientX - pending.startClientX;
          const dy = event.clientY - pending.startClientY;
          if (Math.hypot(dx, dy) >= DRAG_UNDOCK_THRESHOLD_PX) {
            pendingUndockRef.current = null;
            onUndock(event.clientX - 40, event.clientY - 16);
            const nextX = event.clientX - 40;
            const nextY = event.clientY - 16;
            setDragStart({
              x: event.clientX,
              y: event.clientY,
              panelX: nextX,
              panelY: nextY,
            });
            onMove?.(nextX, nextY);
            onDropProbe?.(event.clientX, event.clientY);
            return;
          }
          return;
        }

        const deltaX = event.clientX - dragStart.x;
        const deltaY = event.clientY - dragStart.y;
        onMove?.(dragStart.panelX + deltaX, dragStart.panelY + deltaY);
        onDropProbe?.(event.clientX, event.clientY);
      }

      if (resizeState.isResizing && resizeState.edge) {
        const deltaX = event.clientX - resizeState.startX;
        const deltaY = event.clientY - resizeState.startY;

        let newWidth = resizeState.startWidth;
        let newHeight = resizeState.startHeight;

        if (resizeState.edge === "right") {
          newWidth = resizeState.startWidth + deltaX;
        } else if (resizeState.edge === "left") {
          newWidth = resizeState.startWidth - deltaX;
        } else if (resizeState.edge === "bottom") {
          newHeight = resizeState.startHeight + deltaY;
        } else if (resizeState.edge === "top") {
          newHeight = resizeState.startHeight - deltaY;
        }

        onResize?.(Math.max(200, newWidth), Math.max(150, newHeight));
      }
    };

    const handleMouseUp = (event: globalThis.MouseEvent) => {
      if (isDragging && !pendingUndockRef.current) {
        const docked = onDropCommit?.(event.clientX, event.clientY) ?? false;
        if (!docked) onDropProbe?.(null);
      } else {
        onDropProbe?.(null);
      }
      setIsDragging(false);
      pendingUndockRef.current = null;
      setResizeState((current) => ({ ...current, isResizing: false }));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    dragStart,
    resizeState,
    onMove,
    onResize,
    onUndock,
    onDropProbe,
    onDropCommit,
  ]);

  const handleFocus = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  if (!isOpen || state === "collapsed") {
    return null;
  }

  const isFloating = state === "floating";
  const isDocked = state === "docked";

  const panelStyle: PanelGeometryStyle = isFloating
    ? {
        "--pw-panel-x": `${x}px`,
        "--pw-panel-y": `${y}px`,
        "--pw-panel-width": `${width}px`,
        "--pw-panel-height": `${height}px`,
        "--pw-panel-z": String(zIndex),
      }
    : {
        "--pw-panel-width":
          id === "bottom" ? "100%" : responsiveOverlay ? undefined : `${width}px`,
        "--pw-panel-height": id === "bottom" ? `${height}px` : "100%",
      };

  /** Canvas-facing edge when docked (follows dockEdge, not panel id). */
  const effectiveEdge = dockEdge ?? (id === "bottom" ? "bottom" : id);
  const dockedResizeEdge =
    effectiveEdge === "left"
      ? "right"
      : effectiveEdge === "right"
        ? "left"
        : effectiveEdge === "bottom"
          ? "top"
          : null;

  return (
    <aside
      ref={panelRef}
      id={`panel-${id}`}
      role="region"
      aria-label={`${title} panel`}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`${styles.panel} ${id === "left" ? `${styles.panelLeft} pw-left-panel` : ""} ${id === "right" ? `${styles.panelRight} pw-right-panel` : ""} ${id === "bottom" ? styles.panelBottom : ""}`}
      data-state={state}
      data-panel-id={id}
      data-dock-edge={dockEdge ?? (id === "bottom" ? "bottom" : id)}
      data-open={isOpen ? "true" : "false"}
      data-floating={isFloating ? "true" : "false"}
      data-content-only={contentOnly ? "true" : undefined}
      data-dragging={isDragging ? "true" : undefined}
      style={panelStyle}
    >
      <div
        ref={titleBarRef}
        className={contentOnly ? styles.panelChromeStrip : styles.panelTitleBar}
        data-floating={isFloating ? "true" : "false"}
        data-content-only={contentOnly ? "true" : undefined}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={handleTitleDoubleClick}
        title={
          isFloating
            ? `Drag to move · drop on edge to dock · double-click to dock ${title}`
            : onUndock
              ? `Drag to float ${title}, or use Undock`
              : undefined
        }
      >
        <span className={styles.panelGrip} aria-hidden data-testid={`panel-grip-${id}`}>
          <GripIcon />
        </span>
        {!contentOnly ? (
          <h2 className={styles.panelTitle}>
            {title}
            {isFloating ? (
              <span className={styles.panelModeBadge}>Floating</span>
            ) : null}
          </h2>
        ) : (
          <span className={styles.panelChromeLabel}>
            {title}
            {isFloating ? (
              <span className={styles.panelModeBadge}>Floating</span>
            ) : null}
          </span>
        )}
        <div className={styles.panelActions}>
          {state === "floating" && onDock && (
            <button
              type="button"
              className={styles.panelActionBtn}
              onClick={onDock}
              aria-label="Dock panel"
              title={`Dock ${title} to workspace edge`}
            >
              <DockIcon />
            </button>
          )}
          {state === "docked" && onUndock && (
            <button
              type="button"
              className={styles.panelActionBtn}
              onClick={() => onUndock()}
              aria-label="Undock panel"
              title={`Float ${title} over canvas`}
            >
              <UndockIcon />
            </button>
          )}
          {onMinimize && (
            <button
              type="button"
              className={styles.panelActionBtn}
              onClick={onMinimize}
              aria-label="Minimize panel"
              title={`Minimize ${title}`}
            >
              <MinimizeIcon />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className={styles.panelActionBtn}
              onClick={onClose}
              aria-label="Close panel"
              title={`Close ${title}`}
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      {/* Floating: all edges. Docked: canvas-facing edge only. */}
      {isFloating ? (
        <>
          <div
            className={`${styles.resizeHandle} ${styles.resizeHandleVertical} ${styles.resizeHandleRight}`}
            data-resizing={resizeState.isResizing && resizeState.edge === "right"}
            onMouseDown={(e) => handleResizeMouseDown(e, "right")}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panel width"
          />
          <div
            className={`${styles.resizeHandle} ${styles.resizeHandleVertical} ${styles.resizeHandleLeft}`}
            data-resizing={resizeState.isResizing && resizeState.edge === "left"}
            onMouseDown={(e) => handleResizeMouseDown(e, "left")}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panel width"
          />
          <div
            className={`${styles.resizeHandle} ${styles.resizeHandleHorizontal} ${styles.resizeHandleBottom}`}
            data-resizing={resizeState.isResizing && resizeState.edge === "bottom"}
            onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize panel height"
          />
          <div
            className={`${styles.resizeHandle} ${styles.resizeHandleHorizontal} ${styles.resizeHandleTop}`}
            data-resizing={resizeState.isResizing && resizeState.edge === "top"}
            onMouseDown={(e) => handleResizeMouseDown(e, "top")}
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize panel height"
          />
        </>
      ) : null}

      {isDocked && dockedResizeEdge && onResize ? (
        <div
          className={`${styles.resizeHandle} ${
            dockedResizeEdge === "top"
              ? styles.resizeHandleHorizontal
              : styles.resizeHandleVertical
          } ${
            dockedResizeEdge === "right"
              ? styles.resizeHandleRight
              : dockedResizeEdge === "left"
                ? styles.resizeHandleLeft
                : styles.resizeHandleTop
          }`}
          data-resizing={resizeState.isResizing && resizeState.edge === dockedResizeEdge}
          data-docked-resize="true"
          onMouseDown={(e) => handleResizeMouseDown(e, dockedResizeEdge)}
          role="separator"
          aria-orientation={dockedResizeEdge === "top" ? "horizontal" : "vertical"}
          aria-label={
            dockedResizeEdge === "top" ? "Resize panel height" : "Resize panel width"
          }
        />
      ) : null}

      <div className={styles.panelContent}>{children}</div>
    </aside>
  );
}

function GripIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden>
      <circle cx="3" cy="2" r="1.25" />
      <circle cx="7" cy="2" r="1.25" />
      <circle cx="3" cy="7" r="1.25" />
      <circle cx="7" cy="7" r="1.25" />
      <circle cx="3" cy="12" r="1.25" />
      <circle cx="7" cy="12" r="1.25" />
    </svg>
  );
}

function DockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
    </svg>
  );
}

function UndockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <path d="M4 10V6a2 2 0 012-2h12v12h-4" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 14h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
