import React, { forwardRef } from "react";
import type { CatalogItem } from "../catalog/types";

interface InspectorProps {
  selectedItem?: CatalogItem | null;
  className?: string;
  // External refs for performance-first updates
  positionXRef?: React.RefObject<HTMLInputElement | null>;
  positionYRef?: React.RefObject<HTMLInputElement | null>;
  positionZRef?: React.RefObject<HTMLInputElement | null>;
  rotationYRef?: React.RefObject<HTMLInputElement | null>;
}

export function Inspector({
  selectedItem,
  className = "",
  positionXRef,
  positionYRef,
  positionZRef,
  rotationYRef,
}: InspectorProps) {
  if (!selectedItem) {
    return (
      <div className={`text-sm text-muted ${className}`}>
        No item selected
      </div>
    );
  }

  return (
    <div className={`gap-6 ${className}`}>
      {/* Header Info */}
      <div className="gap-1 border-b border-soft pb-4">
        <h2 className="text-base font-semibold text-heading">{selectedItem.name}</h2>
        <p className="text-xs text-muted">{selectedItem.category}</p>
      </div>

      {/* Properties Grid using CSS Subgrid */}
      <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-3">
        {/* Dimensions - Readonly */}
        <div className="col-span-2 grid grid-cols-subgrid">
          <span className="text-xs font-medium text-muted">Size (W×D×H)</span>
          <div className="text-sm tabular-nums text-heading">
            {selectedItem.dimensions.widthMm} × {selectedItem.dimensions.depthMm} × {selectedItem.dimensions.heightMm} mm
          </div>
        </div>

        {/* Position */}
        <div className="col-span-2 grid grid-cols-subgrid items-start pt-2">
          <span className="mt-1 text-xs font-medium text-muted">Position</span>
          <div className="gap-2">
            <InspectorInput label="X" defaultValue="0" ref={positionXRef} />
            <InspectorInput label="Y" defaultValue="0" ref={positionYRef} />
            <InspectorInput label="Z" defaultValue="0" ref={positionZRef} />
          </div>
        </div>

        {/* Rotation */}
        <div className="col-span-2 grid grid-cols-subgrid items-start pt-2">
          <span className="mt-1 text-xs font-medium text-muted">Rotation</span>
          <div className="gap-2">
            <InspectorInput label="Y°" defaultValue="0" ref={rotationYRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Precision Input Component
interface InspectorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InspectorInput = forwardRef<HTMLInputElement, InspectorInputProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="gap-2">
        <label className="w-4 text-xs font-medium text-subtle">{label}</label>
        <input
          ref={ref}
          type="number"
          step="any"
          aria-label={label}
          className={`h-7 rounded border border-soft px-2 py-1 text-xs tabular-nums text-heading transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
          {...props}
        />
      </div>
    );
  }
);
InspectorInput.displayName = "InspectorInput";
