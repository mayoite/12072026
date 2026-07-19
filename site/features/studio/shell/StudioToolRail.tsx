"use client";

import { type ReactNode } from "react";
import { Button, Toolbar } from "react-aria-components";

import { cn, toolRailButton } from "./shellVariants";

export interface StudioToolRailItem {
  id: string;
  label: string;
  icon: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
}

export interface StudioToolRailProps {
  items: StudioToolRailItem[];
  "aria-label"?: string;
  className?: string;
}

export function StudioToolRail({
  items,
  "aria-label": ariaLabel = "Tools",
  className,
}: StudioToolRailProps) {
  return (
    <Toolbar
      orientation="vertical"
      aria-label={ariaLabel}
      className={cn("studio-tool-rail", className)}
    >
      {items.map((item) => (
        <Button
          key={item.id}
          aria-label={item.label}
          aria-pressed={item.isActive ?? undefined}
          isDisabled={item.isDisabled}
          onPress={item.onPress}
          data-active={item.isActive ? "true" : undefined}
          className={toolRailButton()}
        >
          <span className="studio-tool-rail-icon" aria-hidden="true">
            {item.icon}
          </span>
        </Button>
      ))}
    </Toolbar>
  );
}
