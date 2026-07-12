/**
 * No-code select control (A4). Native single-select over meta.options.
 */

"use client";

import type { SvgEditorSelectOption } from "../svgEditorFormModel";

export interface SelectControlProps {
  readonly id: string;
  readonly options: readonly SvgEditorSelectOption[];
  readonly value: string;
  readonly onChange: (next: string) => void;
}

export function SelectControl({ id, options, value, onChange }: SelectControlProps) {
  return (
    <select
      id={id}
      className="admin-field__control"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default SelectControl;
