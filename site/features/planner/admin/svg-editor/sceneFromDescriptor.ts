/**
 * A4.1 — seed a visual scene from a persisted `BlockDescriptor`.
 *
 * The descriptor is the marketing/portal shape; the studio edits geometry as an
 * `SvgSceneDocument`. This adapter builds a starter scene: viewBox + metadata are
 * mapped across, and if the descriptor carries no editable geometry yet we drop
 * in a single footprint rectangle so the canvas is never empty. Publishing still
 * flows through the existing form → pipeline path; the scene is the authoring
 * surface, not a new persistence format.
 */

import type { BlockDescriptor } from "@/features/planner/open3d/catalog/svg/svgTypes";
import type { SvgSceneDocument, SvgSceneNode } from "./scene/svgSceneDocument";
import { SCENE_MODEL_VERSION } from "./scene/svgSceneDocument";

export function sceneFromDescriptor(descriptor: BlockDescriptor): SvgSceneDocument {
  const viewBox = descriptor.viewBox ?? { x: 0, y: 0, width: 600, height: 600 };
  const geometry = descriptor.geometry ?? { widthMm: 600, depthMm: 600, heightMm: 480 };

  // Starter footprint: an inset rectangle covering ~80% of the artboard.
  const inset = Math.min(viewBox.width, viewBox.height) * 0.1;
  const footprint: SvgSceneNode = {
    kind: "rect",
    id: "footprint",
    name: "Footprint",
    locked: false,
    hidden: false,
    style: { fillToken: "var(--color-surface-raised)", strokeToken: "currentColor", lineWeight: 2 },
    x: viewBox.x + inset,
    y: viewBox.y + inset,
    width: Math.max(1, viewBox.width - inset * 2),
    height: Math.max(1, viewBox.height - inset * 2),
  };

  return {
    modelVersion: SCENE_MODEL_VERSION,
    viewBox: { x: viewBox.x, y: viewBox.y, width: viewBox.width, height: viewBox.height },
    metadata: {
      typeId: descriptor.slug || "new-block",
      name: descriptor.slug || "New block",
      category: "furniture",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "admin",
      physicalDimensionsMm: {
        width: geometry.widthMm,
        depth: geometry.depthMm,
        height: geometry.heightMm,
      },
      accessibilityTitle: `${descriptor.slug || "Block"} symbol`,
    },
    nodes: [footprint],
  };
}
