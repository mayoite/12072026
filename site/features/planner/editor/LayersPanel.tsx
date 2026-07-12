"use client";

import { useCallback, memo } from "react";
import type { PlannerFloor } from "@/features/planner/project/model/types";
import {
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
}

export const LayersPanel = memo(function LayersPanel({
  floor,
  visibility,
  onVisibilityChange,
}: LayersPanelProps) {
  const categories = summarizeFloorLayers(floor);

  const handleToggle = useCallback(
    (category: PlannerLayerCategory) => {
      onVisibilityChange(toggleLayerVisibility(visibility, category));
    },
    [onVisibilityChange, visibility],
  );

  return (
    <section className={styles.layersPanel} aria-label="Layers">
      <header className={styles.layersPanelHeader}>
        <span>Layers</span>
        <span className={styles.layerCount}>
          {categories.reduce((sum, category) => sum + category.count, 0)} items
        </span>
      </header>
      <div className={styles.layersPanelList}>
        {categories.map((category) => {
          const visible = visibility[category.key];
          return (
            <div
              key={category.key}
              className={styles.layerRow}
              data-hidden={!visible}
            >
              <button
                type="button"
                className={styles.layerVisibilityBtn}
                data-visible={visible}
                aria-label={`${visible ? "Hide" : "Show"} ${category.label}`}
                aria-pressed={visible}
                onClick={() => handleToggle(category.key)}
              >
                {visible ? "◉" : "○"}
              </button>
              <span className={styles.layerLabel}>{category.label}</span>
              <span className={styles.layerCount}>{category.count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
});
