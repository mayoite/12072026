/**
 * No-code multi-select control (A4). Checkbox group over meta.options; value is
 * a string[]. Enforcement of a minimum is soft (surfaces the field issue rather
 * than hard-blocking the toggle).
 */

"use client";

import type { SvgEditorSelectOption } from "../svgEditorFormModel";

export interface MultiSelectControlProps {
  readonly id: string;
  readonly options: readonly SvgEditorSelectOption[];
  readonly value: readonly string[];
  readonly onChange: (next: string[]) => void;
}

export function MultiSelectControl({
  id,
  options,
  value,
  onChange,
}: MultiSelectControlProps) {
  const toggle = (optionValue: string, checked: boolean) => {
    const set = new Set(value);
    if (checked) {
      set.add(optionValue);
    } else {
      set.delete(optionValue);
    }
    // Preserve option order for a stable payload.
    onChange(options.map((o) => o.value).filter((v) => set.has(v)));
  };

  return (
    <div className="admin-multiselect" id={id} role="group">
      {options.map((option) => {
        const checked = value.includes(option.value);
        return (
          <label key={option.value} className="admin-multiselect__option">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => toggle(option.value, event.target.checked)}
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export default MultiSelectControl;
