"use client";

import * as React from "react";
import { TooltipTrigger, Tooltip, Button as RACButton } from "react-aria-components";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface RestrictedActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function RestrictedActionButton({ children, className, ...props }: RestrictedActionButtonProps) {
  return (
    <TooltipTrigger delay={200} closeDelay={100}>
      <RACButton className="inline-block cursor-not-allowed border-0 bg-transparent p-0">
        <Button
          {...props}
          aria-disabled="true"
          className={`pointer-events-none flex items-center gap-2 opacity-50 ${className || ""}`}
          tabIndex={-1}
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
          {children}
        </Button>
      </RACButton>
      <Tooltip placement="top" offset={4} className="z-50 overflow-hidden rounded-md bg-[var(--surface-strong)] px-3 py-1.5 text-xs text-[var(--text-on-strong)] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
        Sign in to unlock
      </Tooltip>
    </TooltipTrigger>
  );
}