"use client";

/**
 * Client-only Fabric stage for planner furniture (Fabric 2B vertical slice).
 * Mounts fabric.Canvas, rebuilds Rects from document furniture with entityId,
 * and emits object:modified as project-mm pose updates. Never persists Fabric JSON.
 */

import { useEffect, useRef } from "react";
import { Canvas, Rect, type FabricObject, type ModifiedEvent } from "fabric";

import type { PlannerFurnitureItem } from "@/features/planner/model/types";
import type { CanvasTransform } from "@/features/planner/lib/geometry/snapping";
import { resolvePaintColor } from "@/features/planner/shared/readThemeColor";
import { PLANNER_COLOR_TOKENS } from "@/features/planner/shared/themeColorTokens";
import {
  DEFAULT_FABRIC_STAGE_TRANSFORM,
  fabricPoseToDocumentUpdate,
  furnitureToFabricPose,
  readFurnitureEntityId,
  writeFurnitureEntityId,
  type FurnitureDocumentPoseUpdate,
} from "./furnitureFabricMapper";
import styles from "./furnitureFabricLayer.module.css";

export type FurnitureFabricLayerProps = {
  furniture: readonly PlannerFurnitureItem[];
  /** Viewport transform; defaults to Fabric stage initial. */
  transform?: CanvasTransform;
  /**
   * When true, furniture Rects accept pointer events (select/drag proof).
   * When false, host is pointer-events:none so the plan canvas keeps ownership.
   */
  interactive?: boolean;
  onFurnitureModified?: (update: FurnitureDocumentPoseUpdate) => void;
};

function resolveFurnitureFill(item: PlannerFurnitureItem): string {
  try {
    return resolvePaintColor(item.color, PLANNER_COLOR_TOKENS.furnitureDefault);
  } catch {
    // Theme may be unavailable in isolated mounts; transparent still mounts.
    return "transparent";
  }
}

export function FurnitureFabricLayer({
  furniture,
  transform = DEFAULT_FABRIC_STAGE_TRANSFORM,
  interactive = false,
  onFurnitureModified,
}: FurnitureFabricLayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const lowerCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const transformRef = useRef(transform);
  const onModifiedRef = useRef(onFurnitureModified);
  const rebuildingRef = useRef(false);
  const interactiveRef = useRef(interactive);

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  useEffect(() => {
    onModifiedRef.current = onFurnitureModified;
  }, [onFurnitureModified]);

  useEffect(() => {
    interactiveRef.current = interactive;
  }, [interactive]);

  // Mount fabric.Canvas once (client only).
  useEffect(() => {
    const lower = lowerCanvasRef.current;
    const host = hostRef.current;
    if (!lower || !host) return;

    const canvas = new Canvas(lower, {
      selection: false,
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      skipTargetFind: false,
      enableRetinaScaling: true,
    });
    fabricRef.current = canvas;

    const handleModified = (event: ModifiedEvent) => {
      if (rebuildingRef.current) return;
      const target = event.target as FabricObject | undefined;
      if (!target) return;
      const entityId = readFurnitureEntityId(target);
      if (!entityId) return;

      const update = fabricPoseToDocumentUpdate(
        {
          entityId,
          left: target.left ?? 0,
          top: target.top ?? 0,
          angle: target.angle ?? 0,
        },
        transformRef.current,
      );
      onModifiedRef.current?.(update);
    };

    canvas.on("object:modified", handleModified);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      canvas.setDimensions({ width, height });
      canvas.requestRenderAll();
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      canvas.off("object:modified", handleModified);
      observer.disconnect();
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Rebuild Rects from document furniture whenever the list / transform / interactivity changes.
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    rebuildingRef.current = true;
    canvas.clear();

    for (const item of furniture) {
      const pose = furnitureToFabricPose(item, transform);
      const rect = new Rect({
        left: pose.left,
        top: pose.top,
        width: pose.width,
        height: pose.height,
        angle: pose.angle,
        originX: "center",
        originY: "center",
        fill: resolveFurnitureFill(item),
        opacity: 0.22,
        strokeWidth: 0,
        selectable: interactive && !pose.locked,
        evented: interactive && !pose.locked,
        hasControls: interactive && !pose.locked,
        hasBorders: interactive && !pose.locked,
        lockScalingX: true,
        lockScalingY: true,
        lockSkewingX: true,
        lockSkewingY: true,
        objectCaching: false,
      });
      writeFurnitureEntityId(rect, pose.entityId);
      canvas.add(rect);
    }

    canvas.selection = false;
    canvas.skipTargetFind = !interactive;
    canvas.requestRenderAll();
    rebuildingRef.current = false;
  }, [furniture, transform, interactive]);

  const hostClassName = interactive
    ? `${styles.host} ${styles.hostInteractive}`
    : styles.host;

  return (
    <div
      ref={hostRef}
      className={hostClassName}
      data-testid="planner-fabric-furniture-layer"
      data-interactive={interactive ? "true" : "false"}
      aria-hidden={interactive ? undefined : true}
    >
      <canvas ref={lowerCanvasRef} className={styles.canvasHost} />
    </div>
  );
}
