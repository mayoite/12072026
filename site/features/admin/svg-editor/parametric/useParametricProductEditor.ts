"use client";

import { useCallback, useMemo, useState } from "react";

import type { ParametricPreview } from "@/features/planner/asset-engine/svg/parametric/productDrawer";
import {
  parametricAuthoringRegistry,
  type ParametricAuthoringRegistry,
} from "./parametricAuthoringRegistry";
import type {
  ParametricDisplayUnit,
  ParametricParseResult,
} from "./authoringTypes";

export type ParametricPublishState = "idle" | "confirming" | "publishing" | "error";

export type ParametricViewportCommand = {
  readonly name: string;
  readonly sequence: number;
};

export type UseParametricProductEditorOptions = {
  readonly initialType?: string;
  /** Prefill identity.slug when opening via ?edit= without a full hydrate. */
  readonly initialEditSlug?: string;
  /** Full display hydrate from disk (wins over initialEditSlug). */
  readonly initialDisplay?: unknown;
  readonly registry?: ParametricAuthoringRegistry;
};

function readDisplayUnit(display: unknown): ParametricDisplayUnit {
  if (
    display &&
    typeof display === "object" &&
    "displayUnit" in display &&
    ((display as { displayUnit?: unknown }).displayUnit === "mm" ||
      (display as { displayUnit?: unknown }).displayUnit === "cm")
  ) {
    return (display as { displayUnit: ParametricDisplayUnit }).displayUnit;
  }
  return "cm";
}

export function useParametricProductEditor(
  options: UseParametricProductEditorOptions = {},
) {
  const registry = options.registry ?? parametricAuthoringRegistry;
  const initialType = options.initialType ?? registry.list()[0]?.type;
  if (!initialType) {
    throw new Error("Parametric authoring registry is empty");
  }
  const initialDefinition = registry.require(initialType);
  const [type, setType] = useState(initialType);
  const [display, setDisplay] = useState<unknown>(() => {
    if (options.initialDisplay !== undefined) return options.initialDisplay;
    const base = initialDefinition.defaultDisplay();
    const slug = options.initialEditSlug?.trim();
    if (!slug) return base;
    return initialDefinition.updateDisplay(base, "slug", slug);
  });
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<ParametricPublishState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [viewportCommand, setViewportCommand] = useState<ParametricViewportCommand | null>(null);
  const [gridEnabled, setGridEnabled] = useState(false);

  const definition = registry.require(type);
  const parse = useMemo<ParametricParseResult<unknown>>(
    () => definition.parseDisplay(display),
    [definition, display],
  );
  const preview = useMemo<ParametricPreview | null>(
    () => (parse.ok ? definition.drawer.render(parse.fields) : null),
    [definition, parse],
  );
  const unit = readDisplayUnit(display);

  const selectType = useCallback(
    (nextType: string) => {
      const nextDefinition = registry.require(nextType);
      setType(nextType);
      setDisplay(nextDefinition.defaultDisplay(unit));
      setSelectedToolId(null);
      setSelectedPartId(null);
      setPublishState("idle");
      setMessage(null);
      setGridEnabled(false);
    },
    [registry, unit],
  );

  const updateField = useCallback(
    (key: string, value: unknown) => {
      setDisplay((current: unknown) =>
        definition.updateDisplay(current, key, value),
      );
    },
    [definition],
  );

  const convertUnit = useCallback(
    (nextUnit: ParametricDisplayUnit) => {
      setDisplay((current: unknown) =>
        definition.convertUnit(current, nextUnit),
      );
    },
    [definition],
  );

  const requestViewportCommand = useCallback((name: string) => {
    setViewportCommand((current) => ({
      name,
      sequence: (current?.sequence ?? 0) + 1,
    }));
  }, []);

  const toggleCanvasField = useCallback((field: string) => {
    if (field === "grid") setGridEnabled((current) => !current);
  }, []);

  return {
    type,
    display,
    unit,
    definition,
    sections: definition.sections,
    tools: definition.tools,
    productTypes: registry.list().map((entry) => ({
      id: entry.type,
      label: entry.drawer.label,
    })),
    parse,
    preview,
    selectedToolId,
    selectedPartId,
    publishState,
    message,
    viewportCommand,
    gridEnabled,
    selectType,
    updateField,
    convertUnit,
    selectTool: setSelectedToolId,
    focusPart: setSelectedPartId,
    setPublishState,
    setMessage,
    requestViewportCommand,
    toggleCanvasField,
  };
}
