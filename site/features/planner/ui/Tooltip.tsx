"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
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
    <RadixTooltip.Provider delayDuration={200}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={8}
            className="hidden md:block animate-in fade-in-0 zoom-in-95 rounded bg-gray-900 px-2 py-1.5 text-xs text-white"
            style={{ zIndex: Z.tooltip }}
          >
            <span className="inline-flex items-center gap-2">
              <span>{content}</span>
              {shortcut ? (
                <kbd className="rounded bg-white/15 px-1 py-0.5 text-[0.625rem] leading-none text-white">
                  {shortcut}
                </kbd>
              ) : null}
            </span>
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
