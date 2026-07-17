/**
 * Transient Fabric paint for furniture distance guides (plan mm → screen).
 * Does not mutate the document.
 */

import { FabricText, Line, type Canvas, type FabricObject } from "fabric";

import {
  computeDistanceGuides,
  type CenteredFurnitureRect,
  type DistanceGuide,
  type WallGuideInput,
} from "@/features/planner/lib/geometry/distanceGuides";
import {
  projectToScreen,
  type CanvasTransform,
} from "@/features/planner/lib/geometry/snapping";
import { formatLengthDisplay } from "@/features/planner/model/units";
import type { PlannerDisplayUnit } from "@/features/planner/model/types";

export type DistanceGuideOverlayHandle = {
  objects: FabricObject[];
};

export function createDistanceGuideOverlayHandle(): DistanceGuideOverlayHandle {
  return { objects: [] };
}

export function clearDistanceGuideOverlay(
  canvas: Canvas | null,
  handle: DistanceGuideOverlayHandle,
): void {
  if (canvas) {
    for (const obj of handle.objects) {
      canvas.remove(obj);
    }
  }
  handle.objects = [];
}

export function syncDistanceGuideOverlay(input: {
  canvas: Canvas;
  handle: DistanceGuideOverlayHandle;
  subject: CenteredFurnitureRect;
  walls: readonly WallGuideInput[];
  neighbors: readonly CenteredFurnitureRect[];
  transform: CanvasTransform;
  stroke: string;
  displayUnit?: PlannerDisplayUnit;
  maxDistanceMm?: number;
  maxGuides?: number;
}): DistanceGuide[] {
  const {
    canvas,
    handle,
    subject,
    walls,
    neighbors,
    transform,
    stroke,
    displayUnit = "mm",
    maxDistanceMm,
    maxGuides,
  } = input;

  clearDistanceGuideOverlay(canvas, handle);

  const guides = computeDistanceGuides(subject, walls, neighbors, {
    maxDistanceMm,
    maxGuides,
    excludeIds: new Set([subject.id]),
  });

  for (const guide of guides) {
    const a = projectToScreen(guide.from, transform);
    const b = projectToScreen(guide.to, transform);
    const line = new Line([a.x, a.y, b.x, b.y], {
      stroke,
      strokeWidth: 1,
      strokeDashArray: [4, 3],
      selectable: false,
      evented: false,
      objectCaching: false,
    });
    const mid = {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    };
    const label = new FabricText(
      formatLengthDisplay(guide.distanceMm, displayUnit),
      {
        left: mid.x,
        top: mid.y - 12,
        fontSize: 11,
        fill: stroke,
        originX: "center",
        originY: "bottom",
        selectable: false,
        evented: false,
        objectCaching: false,
      },
    );
    canvas.add(line, label);
    handle.objects.push(line, label);
  }

  if (guides.length > 0) {
    canvas.requestRenderAll();
  }
  return guides;
}
