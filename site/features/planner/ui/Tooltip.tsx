"use client";

import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import type { ReactElement } from "react";

import { Z } from "@/lib/z-index";

export type TooltipSide = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  content: string;
  shortcut?: string;
  side?: TooltipSide;
  children: ReactElement;
}

export function Tooltip({
  content,
  shortcut,
  side = "right",
  children,
}: TooltipProps) {
  return (
    <ArkTooltip.Root openDelay={200} closeDelay={100} positioning={{ placement: side, offset: { mainAxis: 8 } }}>
      <ArkTooltip.Trigger asChild>{children}</ArkTooltip.Trigger>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content
          className="md:block animate-in fade-in-0 zoom-in-95 rounded bg-inverse px-2 py-1.5 text-xs"
          style={{ zIndex: Z.tooltip }}
        >
          <span className="inline-flex gap-2">
            <span>{content}</span>
            {shortcut ? (
              <kbd className="rounded bg-white/15 px-1 py-0.5 text-[0.625rem] leading-none">
                {shortcut}
              </kbd>
            ) : null}
          </span>
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </ArkTooltip.Root>
  );
}