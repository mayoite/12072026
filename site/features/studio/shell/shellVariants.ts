import { cva, type VariantProps } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const panelSurface = cva("studio-panel", {
  variants: {
    side: {
      left: "studio-panel--left",
      right: "studio-panel--right",
    },
  },
  defaultVariants: {
    side: "left",
  },
});

export type PanelSurfaceVariants = VariantProps<typeof panelSurface>;

export const toolRailButton = cva("studio-tool-rail-btn");

export type ToolRailButtonVariants = VariantProps<typeof toolRailButton>;
