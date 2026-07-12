/**
 * No-code string-list control (A4). Add/remove text chips → string[].
 * Used for `configurable.sizeOptions`.
 */

"use client";

export interface StringListControlProps {
  readonly id: string;
  readonly value: readonly string[];
  readonly placeholder?: string;
  readonly onChange: (next: string[]) => void;
}

export function StringListControl({
  id,
  value,
  placeholder,
  onChange,
}: StringListControlProps) {
  const setItem = (index: number, next: string) => {
    onChange(value.map((item, i) => (i === index ? next : item)));
  };
  const addItem = () => onChange([...value, ""]);
  const removeItem = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="admin-string-list" id={id}>
      {value.map((item, index) => (
        <div key={index} className="admin-string-list__row">
          <input
            type="text"
            className="admin-field__control"
            value={item}
            placeholder={placeholder}
            onChange={(event) => setItem(index, event.target.value)}
          />
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={() => removeItem(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn--outline" onClick={addItem}>
        Add option
      </button>
    </div>
  );
}

export default StringListControl;
