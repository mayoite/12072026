"use client";

import Link from "next/link";
import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  ToggleButton,
  ToggleButtonGroup,
} from "react-aria-components";

import type { ParametricDisplayUnit } from "./authoringTypes";

export type ParametricEditorTopBarProps = {
  readonly title: string;
  readonly sku: string;
  readonly productTypes: readonly { readonly id: string; readonly label: string }[];
  readonly selectedType: string;
  readonly unit: ParametricDisplayUnit;
  readonly canPublish: boolean;
  readonly status: React.ReactNode;
  readonly onTypeChange: (type: string) => void;
  readonly onUnitChange: (unit: ParametricDisplayUnit) => void;
  readonly onPublish: () => void;
};

export function ParametricEditorTopBar({
  title,
  sku,
  productTypes,
  selectedType,
  unit,
  canPublish,
  status,
  onTypeChange,
  onUnitChange,
  onPublish,
}: ParametricEditorTopBarProps) {
  return (
    <header className="parametric-editor-topbar">
      <div className="min-w-0">
        <Link href="/admin/svg-editor" className="parametric-editor-back-link">
          Inventory
        </Link>
        <h1 className="truncate text-lg font-semibold">{title}</h1>
        <p className="truncate text-sm">{sku}</p>
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-3">
        <Select
          aria-label="Product type"
          selectedKey={selectedType}
          onSelectionChange={(key) => onTypeChange(String(key))}
        >
          <Button className="parametric-editor-type-button">
            <SelectValue />
          </Button>
          <Popover className="parametric-editor-type-popover">
            <ListBox className="parametric-editor-type-listbox">
              {productTypes.map((type) => (
                <ListBoxItem
                  className="parametric-editor-type-option"
                  id={type.id}
                  key={type.id}
                >
                  {type.label}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </Select>
        {status}
        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[unit]}
          onSelectionChange={(keys) => {
            const next = [...keys][0];
            if (next === "mm" || next === "cm") onUnitChange(next);
          }}
          aria-label="Display unit"
          className="flex"
        >
          <ToggleButton id="mm" className="parametric-editor-unit-button">
            mm
          </ToggleButton>
          <ToggleButton id="cm" className="parametric-editor-unit-button">
            cm
          </ToggleButton>
        </ToggleButtonGroup>
        <Button
          className="parametric-editor-publish"
          isDisabled={!canPublish}
          onPress={onPublish}
        >
          Publish
        </Button>
      </div>
    </header>
  );
}
