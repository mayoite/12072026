"use client";

import type { ReactNode } from "react";

export function AdminFieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="admin-field-group">
      <legend className="admin-field-group__legend">{title}</legend>
      {children}
    </fieldset>
  );
}

export function AdminField({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`admin-field${className ? ` ${className}` : ""}`}>
      <span className="admin-field__label">{label}</span>
      {children}
      {hint ? <span className="admin-field__hint">{hint}</span> : null}
    </label>
  );
}

const inputClass = "admin-field__control admin-field__input";

export function AdminTextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input className={className ? `${inputClass} ${className}` : inputClass} {...rest} />;
}

export function AdminNumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      type="number"
      className={className ? `${inputClass} ${className}` : inputClass}
      {...rest}
    />
  );
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  const base = `${inputClass} admin-field__control--textarea-code`;
  return (
    <textarea
      className={className ? `${base} ${className}` : base}
      {...rest}
    />
  );
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props;
  return <select className={className ? `${inputClass} ${className}` : inputClass} {...rest} />;
}

export function AdminCheckbox({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="admin-checkbox">
      <input
        type="checkbox"
        className="admin-checkbox__input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
