"use client";

import {
  Button,
  Checkbox,
  FieldError,
  Group,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  NumberField,
  Popover,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components";

import type {
  ParametricAuthoringDefinitionRuntime,
  ParametricDisplayUnit,
  ParametricFieldDefinition,
  ParametricFieldError,
} from "./authoringTypes";

export type ParametricPropertiesPanelProps = {
  readonly definition: ParametricAuthoringDefinitionRuntime;
  readonly display: unknown;
  readonly unit: ParametricDisplayUnit;
  readonly errors: readonly ParametricFieldError[];
  readonly onFieldChange: (key: string, value: unknown) => void;
};

function displayRecord(display: unknown): Record<string, unknown> {
  return display && typeof display === "object"
    ? (display as Record<string, unknown>)
    : {};
}

function fieldLabel(field: ParametricFieldDefinition, unit: ParametricDisplayUnit) {
  return field.unit === "length" ? `${field.label} (${unit})` : field.label;
}

export function ParametricPropertiesPanel({
  definition,
  display,
  unit,
  errors,
  onFieldChange,
}: ParametricPropertiesPanelProps) {
  const values = displayRecord(display);
  const errorMap = new Map(errors.map((error) => [error.path, error.message]));

  const renderField = (field: ParametricFieldDefinition) => {
    const label = fieldLabel(field, unit);
    const value = values[field.key];
    const error = errorMap.get(field.key);
    if (field.kind === "number") {
      return (
        <NumberField
          key={field.key}
          className="parametric-properties-field"
          value={typeof value === "number" && Number.isFinite(value) ? value : 0}
          onChange={(next) => onFieldChange(field.key, next)}
          isInvalid={Boolean(error)}
        >
          <Label className="parametric-properties-label">{label}</Label>
          <Group className="parametric-properties-input-group">
            <Input className="parametric-properties-input" aria-label={label} />
            {field.unit === "length" ? (
              <span className="parametric-properties-unit" aria-hidden>
                {unit}
              </span>
            ) : null}
          </Group>
          <FieldError>{error}</FieldError>
        </NumberField>
      );
    }
    if (field.kind === "text") {
      return (
        <TextField
          key={field.key}
          className="parametric-properties-field"
          value={typeof value === "string" ? value : ""}
          onChange={(next) => onFieldChange(field.key, next)}
          isInvalid={Boolean(error)}
        >
          <Label className="parametric-properties-label">{label}</Label>
          <Input className="parametric-properties-input" aria-label={label} />
          <FieldError>{error}</FieldError>
        </TextField>
      );
    }
    if (field.kind === "boolean") {
      return (
        <Checkbox
          key={field.key}
          className="parametric-properties-checkbox"
          isSelected={value === true}
          onChange={(next) => onFieldChange(field.key, next)}
        >
          <span className="parametric-properties-checkbox-mark" aria-hidden>
            ✓
          </span>
          {label}
        </Checkbox>
      );
    }
    return (
      <Select
        key={field.key}
        className="parametric-properties-field"
        selectedKey={typeof value === "string" ? value : null}
        onSelectionChange={(key) => onFieldChange(field.key, String(key))}
        isInvalid={Boolean(error)}
      >
        <Label className="parametric-properties-label">{label}</Label>
        <Button className="parametric-properties-select-button" aria-label={label}>
          <SelectValue />
        </Button>
        <Popover className="parametric-properties-popover">
          <ListBox className="parametric-properties-listbox">
            {(field.options ?? []).map((option) => (
              <ListBoxItem
                key={option.value}
                id={option.value}
                className="parametric-properties-option"
              >
                {option.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
        <FieldError>{error}</FieldError>
      </Select>
    );
  };

  return (
    <section className="parametric-properties-panel" aria-label={`${definition.drawer.label} properties`}>
      <h2 className="parametric-properties-heading">{definition.drawer.label} properties</h2>
      {definition.sections.map((section) => (
        <fieldset key={section.id} className="parametric-properties-section" aria-label={section.label}>
          <legend className="parametric-properties-legend">{section.label}</legend>
          <div className="parametric-properties-fields">{section.fields.map(renderField)}</div>
        </fieldset>
      ))}
    </section>
  );
}
