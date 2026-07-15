/**
 * A4 — seed a visual scene from a persisted `BlockDescriptor`.
 *
 * Geometry authority on open:
 * 1. Explicit `blocks[]` → rect nodes (publish SoT on disk today)
 * 2. Else a single footprint rect so the canvas is never empty
 *
 * Publishing maps the scene back to `blocks` via form adapters so geometry
 * survives `BlockDescriptorSchema` (which has no `parts` field).
 */

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import type { SvgSceneDocument, SvgSceneNode } from "./svgSceneDocument";
import { SCENE_MODEL_VERSION } from "./svgSceneDocument";

function readableLayerName(id: string, index: number): string {
  const withoutGeneratedOrder = id.replace(/^(?:z\d{4}-)+/i, "");
  const rectangleMatch = /^rect-(\d+)$/i.exec(withoutGeneratedOrder);
  if (rectangleMatch) return `Rectangle ${rectangleMatch[1]}`;

  const words = withoutGeneratedOrder
    .split("-")
    .filter(Boolean)
    .map((word) =>
      /^(?:nw|ne|sw|se)$/i.test(word) ? word.toUpperCase() : word.toLowerCase(),
    );
  if (words.length === 0) return `Layer ${index + 1}`;
  words[0] = `${words[0]?.charAt(0).toUpperCase()}${words[0]?.slice(1)}`;
  return words.join(" ");
}

function footprintNode(
  viewBox: { x: number; y: number; width: number; height: number },
): SvgSceneNode {
  const inset = Math.min(viewBox.width, viewBox.height) * 0.1;
  return {
    kind: "rect",
    id: "footprint",
    name: "Footprint",
    locked: false,
    hidden: false,
    style: {
      fillToken: "var(--color-surface-raised)",
      strokeToken: "currentColor",
      lineWeight: 2,
    },
    x: viewBox.x + inset,
    y: viewBox.y + inset,
    width: Math.max(1, viewBox.width - inset * 2),
    height: Math.max(1, viewBox.height - inset * 2),
  };
}

function nodesFromBlocks(descriptor: BlockDescriptor): SvgSceneNode[] {
  const blocks = descriptor.blocks ?? [];
  if (blocks.length === 0) return [];

  return blocks.map((block, index) => {
    const id =
      typeof block.id === "string" && block.id.trim() !== ""
        ? block.id.trim()
        : `block-${index + 1}`;
    const height = block.depth > 0 ? block.depth : (block.height ?? 1);
    return {
      kind: "rect" as const,
      id,
      name: readableLayerName(id, index),
      locked: false,
      hidden: false,
      style: {
        fillToken: "var(--color-surface-raised)",
        strokeToken: "currentColor",
        lineWeight: 2,
      },
      x: block.x,
      y: block.y,
      width: Math.max(1, block.width),
      height: Math.max(1, height),
    };
  });
}

export function sceneFromDescriptor(descriptor: BlockDescriptor): SvgSceneDocument {
  const viewBox = descriptor.viewBox ?? { x: 0, y: 0, width: 600, height: 600 };
  const geometry = descriptor.geometry ?? {
    widthMm: 600,
    depthMm: 600,
    heightMm: 480,
  };

  const fromBlocks = nodesFromBlocks(descriptor);
  const nodes = fromBlocks.length > 0 ? fromBlocks : [footprintNode(viewBox)];

  return {
    modelVersion: SCENE_MODEL_VERSION,
    viewBox: {
      x: viewBox.x,
      y: viewBox.y,
      width: viewBox.width,
      height: viewBox.height,
    },
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
    nodes,
  };
}
