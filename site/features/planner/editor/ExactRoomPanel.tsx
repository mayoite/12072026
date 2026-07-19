"use client";

import { useState, type FormEvent } from "react";

import type { PlannerDisplayUnit } from "@/features/planner/model/types";
import {
  formatLengthInput,
  parseLengthInput,
} from "@/features/planner/model/units";

import styles from "@/app/css/core/locked/planner/workspace-shell.module.css";

export interface ExactRoomDimensions {
  widthMm: number;
  depthMm: number;
  wallThicknessMm: number;
}

interface ExactRoomPanelProps {
  displayUnit: PlannerDisplayUnit;
  onCreate: (dimensions: ExactRoomDimensions) => void;
  onCancel: () => void;
}

function defaultValue(valueMm: number, unit: PlannerDisplayUnit): string {
  return formatLengthInput(valueMm, unit);
}

export function ExactRoomPanel({
  displayUnit,
  onCreate,
  onCancel,
}: ExactRoomPanelProps) {
  const [width, setWidth] = useState(() => defaultValue(5000, displayUnit));
  const [depth, setDepth] = useState(() => defaultValue(4000, displayUnit));
  const [thickness, setThickness] = useState(() => defaultValue(150, displayUnit));
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const widthMm = parseLengthInput(width, displayUnit);
    const depthMm = parseLengthInput(depth, displayUnit);
    const wallThicknessMm = parseLengthInput(thickness, displayUnit);

    if (
      widthMm === null ||
      depthMm === null ||
      wallThicknessMm === null ||
      widthMm < 1000 ||
      depthMm < 1000 ||
      wallThicknessMm < 50 ||
      wallThicknessMm > 1000
    ) {
      setError("Width and depth must be at least 1 m. Wall thickness must be 50–1000 mm.");
      return;
    }

    setError(null);
    onCreate({ widthMm, depthMm, wallThicknessMm });
  };

  return (
    <form className={styles.exactRoomPanel} onSubmit={submit} aria-label="Create exact room">
      <div className={styles.exactRoomHeading}>
        <strong>Create exact room</strong>
        <span>Canonical geometry is stored in millimetres.</span>
      </div>
      <label className={styles.exactRoomField}>
        <span>Width ({displayUnit})</span>
        <input
          value={width}
          onChange={(event) => setWidth(event.target.value)}
          inputMode="decimal"
          autoFocus
        />
      </label>
      <label className={styles.exactRoomField}>
        <span>Depth ({displayUnit})</span>
        <input
          value={depth}
          onChange={(event) => setDepth(event.target.value)}
          inputMode="decimal"
        />
      </label>
      <label className={styles.exactRoomField}>
        <span>Wall ({displayUnit})</span>
        <input
          value={thickness}
          onChange={(event) => setThickness(event.target.value)}
          inputMode="decimal"
        />
      </label>
      <div className={styles.exactRoomActions}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.exactRoomPrimary}>Create room</button>
      </div>
      {error ? <p className={styles.exactRoomError} role="alert">{error}</p> : null}
    </form>
  );
}
