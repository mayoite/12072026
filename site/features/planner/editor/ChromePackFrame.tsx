"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import type { ChromePackId, ChromePackPlacement } from "./workspaceLayout";
import styles from "./workspace.module.css";

const TEAR_THRESHOLD = 8;

type FloatingChromePackStyle = CSSProperties & {
  "--pw-chrome-pack-x": string;
  "--pw-chrome-pack-y": string;
};

export interface ChromePackFrameProps {
  packId: ChromePackId;
  label: string;
  placement: ChromePackPlacement;
  x: number;
  y: number;
  onPlacementChange: (
    packId: ChromePackId,
    placement: ChromePackPlacement,
    pos?: { x: number; y: number },
  ) => void;
  onMove: (packId: ChromePackId, x: number, y: number) => void;
  children: ReactNode;
}

/**
 * Modular TopBar pack: docked in header, floatable over canvas, or collapsed to overflow.
 */
export function ChromePackFrame({
  packId,
  label,
  placement,
  x,
  y,
  onPlacementChange,
  onMove,
  children,
}: ChromePackFrameProps) {
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    mode: "tear" | "move";
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const handleGripDown = useCallback(
    (event: ReactMouseEvent) => {
      if (event.button !== 0) return;
      if ((event.target as HTMLElement).closest("button:not([data-pack-grip])")) return;
      event.preventDefault();

      if (placement === "floating") {
        dragRef.current = {
          mode: "move",
          startX: event.clientX,
          startY: event.clientY,
          originX: x,
          originY: y,
        };
      } else if (placement === "topbar") {
        dragRef.current = {
          mode: "tear",
          startX: event.clientX,
          startY: event.clientY,
          originX: event.clientX - 20,
          originY: event.clientY - 12,
        };
      } else {
        return;
      }
      setDragging(true);
    },
    [placement, x, y],
  );

  useEffect(() => {
    if (!dragging) return;

    const onMoveEvt = (event: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      if (drag.mode === "tear") {
        const dist = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
        if (dist < TEAR_THRESHOLD) return;
        const nextX = event.clientX - 20;
        const nextY = event.clientY - 12;
        dragRef.current = {
          mode: "move",
          startX: event.clientX,
          startY: event.clientY,
          originX: nextX,
          originY: nextY,
        };
        onPlacementChange(packId, "floating", { x: nextX, y: nextY });
        return;
      }

      onMove(
        packId,
        drag.originX + (event.clientX - drag.startX),
        drag.originY + (event.clientY - drag.startY),
      );
    };

    const onUp = () => {
      setDragging(false);
      dragRef.current = null;
      // Snap back to topbar if released near top edge
      if (placement === "floating" || dragRef.current === null) {
        /* placement may have updated; read from last move via window check */
      }
    };

    const onUpSnap = (event: MouseEvent) => {
      setDragging(false);
      dragRef.current = null;
      if (event.clientY < 52) {
        onPlacementChange(packId, "topbar");
      }
    };

    document.addEventListener("mousemove", onMoveEvt);
    document.addEventListener("mouseup", onUpSnap);
    return () => {
      document.removeEventListener("mousemove", onMoveEvt);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseup", onUpSnap);
    };
  }, [dragging, packId, onMove, onPlacementChange, placement]);

  if (placement === "overflow") {
    return null;
  }

  const isFloating = placement === "floating";

  return (
    <div
      className={`${styles.chromePack} pw-chrome-pack`}
      data-pack={packId}
      data-placement={placement}
      data-dragging={dragging ? "true" : undefined}
      style={
        isFloating
          ? ({
              "--pw-chrome-pack-x": `${x}px`,
              "--pw-chrome-pack-y": `${y}px`,
            } as FloatingChromePackStyle)
          : undefined
      }
      data-testid={`chrome-pack-${packId}`}
    >
      <div className={styles.chromePackChrome}>
        <button
          type="button"
          className={styles.chromePackGrip}
          data-pack-grip="true"
          aria-label={`Move ${label} module`}
          title={
            isFloating
              ? `Drag ${label} · drop near top to dock`
              : `Drag to float ${label}`
          }
          onMouseDown={handleGripDown}
        >
          ⠿
        </button>
        <span className={styles.chromePackLabel}>{label}</span>
        {isFloating ? (
          <button
            type="button"
            className={styles.chromePackBtn}
            onClick={() => onPlacementChange(packId, "topbar")}
            aria-label={`Dock ${label} to top bar`}
          >
            ↩
          </button>
        ) : (
          <>
            <button
              type="button"
              className={styles.chromePackBtn}
              onClick={() =>
                onPlacementChange(packId, "floating", {
                  x: typeof window !== "undefined" ? window.innerWidth * 0.35 : 200,
                  y: 64,
                })
              }
              aria-label={`Float ${label} module`}
            >
              ↗
            </button>
            <button
              type="button"
              className={styles.chromePackBtn}
              onClick={() => onPlacementChange(packId, "overflow")}
              aria-label={`Hide ${label} into Layout menu`}
              title="Move to Layout overflow"
            >
              −
            </button>
          </>
        )}
      </div>
      <div className={styles.chromePackBody}>{children}</div>
    </div>
  );
}
