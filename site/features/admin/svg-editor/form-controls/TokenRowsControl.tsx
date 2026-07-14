/**
 * No-code theme-token rows control (A4).
 * Each row is a {key,value} pair chosen from curated semantic options — NO free
 * text, so a `#hex` literal is unreachable through the UI.
 */

"use client";

import type { SvgEditorFieldMeta } from "../svgEditorFormModel";
import type { FormTokenRow } from "../svgEditorFormState";

export interface TokenRowsControlProps {
  readonly id: string;
  readonly meta: Pick<SvgEditorFieldMeta, "tokenKeyOptions" | "tokenValueOptions">;
  readonly value: readonly FormTokenRow[];
  readonly onChange: (next: FormTokenRow[]) => void;
}

export function TokenRowsControl({ id, meta, value, onChange }: TokenRowsControlProps) {
  const keyOptions = meta.tokenKeyOptions ?? [];
  const valueOptions = meta.tokenValueOptions ?? [];

  const setRow = (index: number, patch: Partial<FormTokenRow>) => {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };
  const addRow = () => {
    const firstKey = keyOptions[0]?.value ?? "currentColor";
    const firstValue = valueOptions[0]?.value ?? "currentColor";
    onChange([...value, { key: firstKey, value: firstValue }]);
  };
  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-token-rows" id={id}>
      {value.map((row, index) => (
        <div key={index} className="admin-token-row">
          <select
            className="admin-field__control"
            aria-label="Token key"
            value={row.key}
            onChange={(event) => setRow(index, { key: event.target.value })}
          >
            {keyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="admin-field__control"
            aria-label="Token value"
            value={row.value}
            onChange={(event) => setRow(index, { value: event.target.value })}
          >
            {valueOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={() => removeRow(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn--outline" onClick={addRow}>
        Add token
      </button>
    </div>
  );
}

export default TokenRowsControl;
