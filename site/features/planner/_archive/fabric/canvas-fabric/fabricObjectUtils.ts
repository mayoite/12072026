
import type { FabricObject } from "fabric";

const ANNOTATION_PREFIX = "DRAW:";

export function isFabricAnnotation(obj: FabricObject | null | undefined): boolean {
  return String((obj as { name?: string } | undefined)?.name ?? "").startsWith(ANNOTATION_PREFIX);
}

export function canResizeFabricObject(obj: FabricObject | null | undefined): boolean {
  if (!obj) return false;
  const name = String((obj as { name?: string }).name ?? "");
  if (name.startsWith(ANNOTATION_PREFIX)) return true;
  if (name.startsWith("MISCELLANEOUS")) return true;
  if (name.startsWith("TEXT")) return true;
  return false;
}

export function canEditFabricFill(obj: FabricObject | null | undefined): boolean {
  if (!obj) return false;
  if (canResizeFabricObject(obj)) return true;
  const name = String((obj as { name?: string }).name ?? "");
  return name.startsWith("GROUP") || name === "GROUP";
}

export function applyFabricTransformLocks(obj: FabricObject | null | undefined) {
  if (!obj) return;
  const target = obj as FabricObject & {
    lockScalingX?: boolean;
    lockScalingY?: boolean;
    lockRotation?: boolean;
    hasControls?: boolean;
    hasBorders?: boolean;
    setControlsVisibility?: (v: Record<string, boolean>) => void;
  };
  const resizable = canResizeFabricObject(obj);
  target.lockScalingX = !resizable;
  target.lockScalingY = !resizable;
  target.lockRotation = !resizable;
  target.hasControls = resizable || target.hasControls !== false;
  target.hasBorders = true;
  if (resizable && typeof target.setControlsVisibility === "function") {
    target.setControlsVisibility({
      mt: true,
      mb: true,
      ml: true,
      mr: true,
      tl: true,
      tr: true,
      bl: true,
      br: true,
      mtr: true,
    });
  }
}
