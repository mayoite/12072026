/**
 * No-code object-array control (A4).
 * Renders one editable row per array item using `itemFields`; supports nested
 * dotted keys (e.g. `offset.x`) and add / remove / reorder. Generic over the
 * row shape so callers keep their typed array (rovingFocus, mountingPoints,
 * blocks, parameterSchema) — no `any`.
 */

"use client";

import type { SvgEditorItemField } from "../svgEditorFormModel";

type Row = Record<string, unknown>;

export interface ObjectArrayControlProps<T extends object> {
  readonly id: string;
  readonly itemFields: readonly SvgEditorItemField[];
  readonly value: readonly T[];
  readonly onChange: (next: T[]) => void;
}

function getPath(row: unknown, path: string): unknown {
  const segments = path.split(".");
  let cursor: unknown = row;
  for (const segment of segments) {
    if (cursor && typeof cursor === "object" && segment in (cursor as Row)) {
      cursor = (cursor as Row)[segment];
    } else {
      return undefined;
    }
  }
  return cursor;
}

function setRowPath(row: Row, path: string, next: unknown): Row {
  const segments = path.split(".");
  const [head, ...rest] = segments;
  if (rest.length === 0) {
    return { ...row, [head]: next };
  }
  const child = (row[head] && typeof row[head] === "object" ? row[head] : {}) as Row;
  return { ...row, [head]: setRowPath(child, rest.join("."), next) };
}

function defaultFor(field: SvgEditorItemField): string | number {
  if (field.kind === "number") return field.min ?? 0;
  if (field.kind === "select") return field.options?.[0]?.value ?? "";
  return "";
}

function makeEmptyRow<T extends object>(itemFields: readonly SvgEditorItemField[]): T {
  let row: Row = {};
  for (const field of itemFields) {
    row = setRowPath(row, field.key, defaultFor(field));
  }
  return row as T;
}

export function ObjectArrayControl<T extends object>({
  id,
  itemFields,
  value,
  onChange,
}: ObjectArrayControlProps<T>) {
  const update = (index: number, field: SvgEditorItemField, raw: string) => {
    const nextValue: string | number =
      field.kind === "number" ? Number(raw) : raw;
    onChange(
      value.map((row, i) =>
        i === index ? (setRowPath(row as Row, field.key, nextValue) as T) : row,
      ),
    );
  };
  const addRow = () => onChange([...value, makeEmptyRow<T>(itemFields)]);
  const removeRow = (index: number) => onChange(value.filter((_, i) => i !== index));
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const [row] = next.splice(index, 1);
    next.splice(target, 0, row);
    onChange(next);
  };

  return (
    <div className="admin-object-array" id={id}>
      {value.map((row, index) => (
        <div key={index} className="admin-object-array__row">
          {itemFields.map((field) => {
            const current = getPath(row, field.key);
            const controlId = `${id}-${index}-${field.key}`;
            return (
              <label key={field.key} className="admin-object-array__field">
                <span className="admin-object-array__label">{field.label}</span>
                {field.kind === "select" ? (
                  <select
                    id={controlId}
                    className="admin-field__control"
                    value={typeof current === "string" ? current : ""}
                    onChange={(event) => update(index, field, event.target.value)}
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={controlId}
                    type={field.kind === "number" ? "number" : "text"}
                    className="admin-field__control"
                    value={
                      typeof current === "number"
                        ? current
                        : typeof current === "string"
                          ? current
                          : ""
                    }
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    onChange={(event) => update(index, field, event.target.value)}
                  />
                )}
              </label>
            );
          })}
          <div className="admin-object-array__actions">
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              aria-label="Move up"
              onClick={() => move(index, -1)}
            >
              ↑
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              aria-label="Move down"
              onClick={() => move(index, 1)}
            >
              ↓
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={() => removeRow(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn--outline" onClick={addRow}>
        Add row
      </button>
    </div>
  );
}

export default ObjectArrayControl;
