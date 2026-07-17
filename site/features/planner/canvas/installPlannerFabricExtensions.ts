/**
 * Fabric bundled extensions wired for the live planner stage.
 */
import { AligningGuidelines } from "./fabricAligningGuidelines";
import type { Canvas } from "fabric";
import { PLANNER_COLOR_TOKENS } from "@/features/planner/shared/themeColorTokens";
import { resolvePaintColor } from "@/features/planner/shared/readThemeColor";

export type FabricExtensionHandles = {
  dispose: () => void;
};

function resolveAlignGuideColor(): string | undefined {
  try {
    return resolvePaintColor(undefined, PLANNER_COLOR_TOKENS.alignGuide);
  } catch {
    // Theme tokens may be absent in unit hosts; Fabric keeps its default stroke.
    return undefined;
  }
}

/** Furniture edge/center align guides while dragging. */
export function installPlannerFabricExtensions(
  canvas: Canvas,
): FabricExtensionHandles {
  const color = resolveAlignGuideColor();
  const aligning = new AligningGuidelines(
    canvas,
    color ? { color } : {},
  );

  return {
    dispose: () => {
      aligning.dispose();
    },
  };
}
