/**
 * No-code text control (A4). Native text input bound to a string field.
 */

"use client";

import type { SvgEditorFieldMeta } from "../svgEditorFormModel";

export interface TextControlProps {
  readonly id: string;
  readonly meta: SvgEditorFieldMeta;
  readonly value: string;
  readonly issue?: string;
  readonly onChange: (next: string) => void;
}

export function TextControl({ id, meta, value, onChange }: TextControlProps) {
  return (
    <input
      id={id}
      type="text"
      className="admin-field__control"
      value={value}
      placeholder={meta.placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default TextControl;
