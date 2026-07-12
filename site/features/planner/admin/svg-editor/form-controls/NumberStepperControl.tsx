/**
 * No-code number stepper control (A4).
 * Native number input + −/+ buttons; clamps to meta.min/max; shows unit suffix.
 */

"use client";

import type { SvgEditorFieldMeta } from "../svgEditorFormModel";

export interface NumberStepperControlProps {
  readonly id: string;
  readonly meta: Pick<SvgEditorFieldMeta, "min" | "max" | "step" | "unit">;
  readonly value: number;
  readonly onChange: (next: number) => void;
}

function clamp(value: number, min?: number, max?: number): number {
  let out = value;
  if (typeof min === "number" && out < min) out = min;
  if (typeof max === "number" && out > max) out = max;
  return out;
}

export function NumberStepperControl({
  id,
  meta,
  value,
  onChange,
}: NumberStepperControlProps) {
  const step = meta.step ?? 1;

  const emit = (raw: number) => {
    if (Number.isFinite(raw)) {
      onChange(clamp(raw, meta.min, meta.max));
    }
  };

  return (
    <span className="admin-number-stepper">
      <button
        type="button"
        className="admin-btn admin-btn--outline admin-number-stepper__btn"
        aria-label="Decrease"
        onClick={() => emit(value - step)}
      >
        −
      </button>
      <input
        id={id}
        type="number"
        className="admin-field__control admin-number-stepper__input"
        value={Number.isFinite(value) ? value : ""}
        min={meta.min}
        max={meta.max}
        step={step}
        onChange={(event) => emit(Number(event.target.value))}
      />
      {meta.unit ? <span className="admin-number-stepper__unit">{meta.unit}</span> : null}
      <button
        type="button"
        className="admin-btn admin-btn--outline admin-number-stepper__btn"
        aria-label="Increase"
        onClick={() => emit(value + step)}
      >
        +
      </button>
    </span>
  );
}

export default NumberStepperControl;
