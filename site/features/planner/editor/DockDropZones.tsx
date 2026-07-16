"use client";

import type { DockEdge } from "./workspaceLayout";
import styles from "./workspace.module.css";

export interface DockDropZonesProps {
  activeEdge: DockEdge | null;
  /** Which edges are valid for the panel currently being dragged. */
  allowedEdges?: DockEdge[];
}

/**
 * Edge drop targets shown while a panel is torn off / floating-dragged.
 */
export function DockDropZones({
  activeEdge,
  allowedEdges = ["left", "right", "bottom"],
}: DockDropZonesProps) {
  const edges: DockEdge[] = ["left", "right", "bottom"];

  return (
    <div className={styles.dropZones} aria-hidden data-testid="dock-drop-zones">
      {edges
        .filter((edge) => allowedEdges.includes(edge))
        .map((edge) => (
          <div
            key={edge}
            className={styles.dropZone}
            data-edge={edge}
            data-active={activeEdge === edge ? "true" : undefined}
          >
            <span className={styles.dropZoneLabel}>
              {edge === "left" ? "Dock left" : edge === "right" ? "Dock right" : "Dock bottom"}
            </span>
          </div>
        ))}
    </div>
  );
}
