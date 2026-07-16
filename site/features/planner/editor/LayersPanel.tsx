"use client";

import { useCallback, memo } from "react";
import type { PlannerFloor } from "@/features/planner/project/model/types";
import {
  DEFAULT_LAYER_VISIBILITY,
  summarizeFloorLayers,
  toggleLayerVisibility,
  type PlannerLayerCategory,
  type PlannerLayerVisibility,
} from "./layerVisibility";
import styles from "./layers-panel.module.css";

export interface LayersPanelProps {
  floor: PlannerFloor;
  visibility: PlannerLayerVisibility;
  onVisibilityChange: (next: PlannerLayerVisibility) => void;
  selectedElementId?: string | null;
  onSelectElement?: (id: string, category: PlannerLayerCategory) => void;
  /** When embedded in bottom tabs, shell chrome already labels the panel. */
  showHeader?: boolean;
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export const LayersPanel = memo(function LayersPanel({
  floor,
  visibility,
  onVisibilityChange,
  showHeader = true,
}: LayersPanelProps) {
  const categories = summarizeFloorLayers(floor);
  const totalItems = categories.reduce((sum, category) => sum + category.count, 0);
  const allVisible = categories.every((category) => visibility[category.key]);

  const handleToggle = useCallback(
    (category: PlannerLayerCategory) => {
      onVisibilityChange(toggleLayerVisibility(visibility, category));
    },
    [onVisibilityChange, visibility],
  );

  const handleShowAll = useCallback(() => {
    onVisibilityChange({ ...DEFAULT_LAYER_VISIBILITY });
  }, [onVisibilityChange]);

  const handleHideEmpty = useCallback(() => {
    // No-op for empty categories visibility — only toggle non-empty off for focus.
    // Keep empty layers visible defaults; hide populated noise when all visible.
    if (allVisible) {
      const next = { ...visibility };
      for (const category of categories) {
        if (category.count === 0) {
          next[category.key] = false;
        }
      }
      onVisibilityChange(next);
      return;
    }
    onVisibilityChange({ ...DEFAULT_LAYER_VISIBILITY });
  }, [allVisible, categories, onVisibilityChange, visibility]);

  return (
    <section className={styles.layersPanel} aria-label="Layers">
      {showHeader ? (
        <header className={styles.layersPanelHeader}>
          <span className={styles.layersPanelTitle}>Layers</span>
          <span className={styles.layerCountMeta}>{totalItems} items</span>
        </header>
      ) : null}

      <div className={styles.layersToolbar} role="group" aria-label="Layer visibility">
        <button
          type="button"
          className={styles.layersToolbarBtn}
          onClick={handleShowAll}
          aria-label="Show all layers"
        >
          Show all
        </button>
        <button
          type="button"
          className={styles.layersToolbarBtn}
          onClick={handleHideEmpty}
          aria-label={allVisible ? "Hide empty layers" : "Reset layer visibility"}
        >
          {allVisible ? "Hide empty" : "Reset"}
        </button>
      </div>

      <ul className={styles.layersPanelList}>
        {categories.map((category) => {
          const visible = visibility[category.key];
          const empty = category.count === 0;
          return (
            <li
              key={category.key}
              className={styles.layerRow}
              data-hidden={!visible}
              data-empty={empty ? "true" : undefined}
            >
              <button
                type="button"
                className={styles.layerVisibilityBtn}
                data-visible={visible}
                aria-label={`${visible ? "Hide" : "Show"} ${category.label}`}
                aria-pressed={visible}
                onClick={() => handleToggle(category.key)}
              >
                <EyeIcon open={visible} />
              </button>
              <span className={styles.layerLabel}>{category.label}</span>
              <span
                className={styles.layerCount}
                data-empty={empty ? "true" : undefined}
              >
                {category.count}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
});
