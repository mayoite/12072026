"use client";

/**
 * Systems v0 — pick size / shape / modules then arm place (not fixed 8 SKUs).
 */
import { useMemo, useState, memo } from "react";
import {
  WORKSTATION_V0_SIZE_GRID,
  type WorkstationConfigV0,
  type WorkstationModuleKindV0,
} from "@/features/planner/project/catalog/workstationSystemV0";
import {
  WORKSTATION_V0_BATCH_PLACE_COUNTS,
  WORKSTATION_V0_TOGGLE_MODULES,
  batchPlaceButtonLabel,
  configuratorPreview,
  defaultWorkstationConfiguratorDraftV0,
  isSameSize,
  setConfiguratorShape,
  setConfiguratorSize,
  sizeGridLabel,
  toggleConfiguratorModule,
  type WorkstationConfiguratorDraftV0,
} from "@/features/planner/project/catalog/workstationConfiguratorV0";
import styles from "./workstationConfigurator.module.css";

export type WorkstationConfiguratorPanelProps = {
  /** Arm placement with this resolved config (canvas click places). */
  onPlaceConfig: (config: WorkstationConfigV0) => void;
  /**
   * Immediate grid batch place (2 / 4 / 10 seats) via placeWorkstationInstancesOnProject.
   * When omitted, batch buttons are hidden.
   */
  onPlaceBatchConfig?: (config: WorkstationConfigV0, count: number) => void;
  /** Optional: start collapsed */
  defaultOpen?: boolean;
};

const MODULE_LABELS: Record<WorkstationModuleKindV0, string> = {
  desk: "Desk",
  return: "Return",
  pedestal: "Pedestal",
  panel: "Panel",
  overhead: "Overhead",
};

export const WorkstationConfiguratorPanel = memo(
  function WorkstationConfiguratorPanel({
    onPlaceConfig,
    onPlaceBatchConfig,
    defaultOpen = true,
  }: WorkstationConfiguratorPanelProps) {
    const [open, setOpen] = useState(defaultOpen);
    const [draft, setDraft] = useState<WorkstationConfiguratorDraftV0>(
      defaultWorkstationConfiguratorDraftV0,
    );

    const preview = useMemo(() => configuratorPreview(draft), [draft]);

    return (
      <section
        className={styles.root}
        aria-label="Workstation systems configurator"
      >
        <button
          type="button"
          className={styles.header}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className={styles.title}>Systems configurator</span>
          <span className={styles.chevron} aria-hidden>
            {open ? "▾" : "▸"}
          </span>
        </button>

        {open ? (
          <div className={styles.body}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Shape</legend>
              <div className={styles.row}>
                {(
                  [
                    ["linear", "Linear"],
                    ["l-shape", "L-shape"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      draft.shape === value
                        ? `${styles.chip} ${styles.chipActive}`
                        : styles.chip
                    }
                    aria-pressed={draft.shape === value}
                    onClick={() =>
                      setDraft((d) => setConfiguratorShape(d, value))
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Size (mm)</legend>
              <div className={styles.row}>
                {WORKSTATION_V0_SIZE_GRID.map((size) => {
                  const active = isSameSize(draft.size, size);
                  return (
                    <button
                      key={sizeGridLabel(size)}
                      type="button"
                      className={
                        active
                          ? `${styles.chip} ${styles.chipActive}`
                          : styles.chip
                      }
                      aria-pressed={active}
                      onClick={() => setDraft((d) => setConfiguratorSize(d, size))}
                    >
                      {sizeGridLabel(size)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Modules</legend>
              <div className={styles.row}>
                <span className={`${styles.chip} ${styles.chipLocked}`} title="Always included">
                  Desk
                </span>
                {draft.shape === "l-shape" ? (
                  <span
                    className={`${styles.chip} ${styles.chipLocked}`}
                    title="Required for L-shape"
                  >
                    Return
                  </span>
                ) : null}
                {WORKSTATION_V0_TOGGLE_MODULES.map((mod) => {
                  const on = draft.toggledModules.includes(mod);
                  return (
                    <button
                      key={mod}
                      type="button"
                      className={
                        on ? `${styles.chip} ${styles.chipActive}` : styles.chip
                      }
                      aria-pressed={on}
                      onClick={() =>
                        setDraft((d) => toggleConfiguratorModule(d, mod))
                      }
                    >
                      {MODULE_LABELS[mod]}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className={styles.preview} aria-live="polite">
              <div className={styles.previewLine}>
                <strong>
                  {preview.shapeLabel} · {preview.sizeLabel}
                </strong>
              </div>
              <div className={styles.previewMeta}>
                Footprint {preview.footprint.widthMm}×{preview.footprint.depthMm}{" "}
                mm
              </div>
              <div className={styles.previewMeta}>{preview.modulesLabel}</div>
              {preview.familyVersionId ? (
                <div className={styles.previewMeta}>
                  Family version {preview.familyVersionId}
                </div>
              ) : null}
              {!preview.placeable && preview.placeDisabledReason ? (
                <div className={styles.previewWarn} role="status">
                  {preview.placeDisabledReason}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className={styles.placeBtn}
              disabled={!preview.placeable}
              title={preview.placeDisabledReason ?? undefined}
              onClick={() => onPlaceConfig(preview.config)}
            >
              Place this workstation
            </button>

            {onPlaceBatchConfig ? (
              <div
                className={styles.batchRow}
                role="group"
                aria-label="Place multiple seats"
              >
                {WORKSTATION_V0_BATCH_PLACE_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={styles.batchBtn}
                    disabled={!preview.placeable}
                    title={preview.placeDisabledReason ?? undefined}
                    onClick={() => onPlaceBatchConfig(preview.config, count)}
                  >
                    {batchPlaceButtonLabel(count)}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    );
  },
);
