"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import styles from "./workspace.module.css";

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
  /** Called when user clicks undock button */
  onUndock?: () => void;
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
}

interface ResizeState {
  isResizing: boolean;
  edge: "left" | "right" | "top" | "bottom" | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

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

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") {
        if (isDragging) {
          setIsDragging(false);
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

  // Handle title bar drag start
  const handleTitleMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (state !== "floating") return;
      if ((event.target as HTMLElement).closest("button")) return;

      event.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: event.clientX,
        y: event.clientY,
        panelX: x,
        panelY: y,
      });
    },
    [state, x, y],
  );

  // Handle resize edge mouse down
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

  // Handle mouse move (dragging and resizing)
  useEffect(() => {
    if (!isDragging && !resizeState.isResizing) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const deltaX = event.clientX - dragStart.x;
        const deltaY = event.clientY - dragStart.y;
        const newX = dragStart.panelX + deltaX;
        const newY = dragStart.panelY + deltaY;
        onMove?.(newX, newY);
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

    const handleMouseUp = () => {
      setIsDragging(false);
      setResizeState((current) => ({ ...current, isResizing: false }));
    };

    document.addEventListener("mousemove", handleMouseMove as unknown as EventListener);
    document.addEventListener("mouseup", handleMouseUp as unknown as EventListener);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
      document.removeEventListener("mouseup", handleMouseUp as unknown as EventListener);
    };
  }, [isDragging, dragStart, resizeState, onMove, onResize]);

  // Handle focus
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

  const panelStyle: React.CSSProperties = isFloating
    ? {
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        zIndex,
      }
    : {
        width: id === "bottom" ? "100%" : width,
        height: id === "bottom" ? height : "100%",
      };

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
      className={`${styles.panel} ${id === "left" ? styles.panelLeft : ""} ${ id === "right" ? styles.panelRight : "" } ${id === "bottom" ? styles.panelBottom : ""} ${ id === "left" ? "pw-left-panel" : "" }`}
      data-state={state}
      data-panel-id={id}
      data-open={isOpen ? "true" : "false"}
      style={panelStyle}
    >
      {/* Title bar */}
      <div
        ref={titleBarRef}
        className={styles.panelTitleBar}
        data-floating={isFloating ? "true" : "false"}
        onMouseDown={handleTitleMouseDown}
      >
        <h3 className={styles.panelTitle}>{title}</h3>
        <div className={styles.panelActions}>
          {state === "floating" && onDock && (
            <button
              type="button"
              className={styles.panelActionBtn}
              onClick={onDock}
              aria-label="Dock panel"
              title="Dock"
            >
              <DockIcon />
            </button>
          )}
          {state === "docked" && onUndock && (
            <button
              type="button"
              className={styles.panelActionBtn}
              onClick={onUndock}
              aria-label="Undock panel"
              title="Undock"
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
              title="Minimize"
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
              title="Close"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      {/* Resize handles (floating only) */}
      {isFloating && (
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
      )}

      {/* Panel content */}
      <div className={styles.panelContent}>{children}</div>
    </aside>
  );
}

// Simple SVG icons
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
