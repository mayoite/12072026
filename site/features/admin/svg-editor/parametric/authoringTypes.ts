import type { CanvasToolRailItem } from "@/features/planner/editor/canvasToolRailTypes";
import {
  eraseParametricProductDrawer,
  type ParametricProductDrawer,
  type ParametricProductDrawerRuntime,
} from "@/features/planner/asset-engine/svg/parametric/productDrawer";

export type ParametricDisplayUnit = "mm" | "cm";

export type ParametricFieldDefinition = {
  readonly key: string;
  readonly label: string;
  readonly kind: "number" | "text" | "boolean" | "select";
  readonly unit?: "length";
  readonly options?: readonly { readonly value: string; readonly label: string }[];
  readonly span?: "single" | "full";
};

export type ParametricFormSection = {
  readonly id: string;
  readonly label: string;
  readonly fields: readonly ParametricFieldDefinition[];
};

export type ParametricFieldError = {
  readonly path: string;
  readonly message: string;
};

export type ParametricParseResult<TFields> =
  | { readonly ok: true; readonly fields: TFields }
  | { readonly ok: false; readonly errors: readonly ParametricFieldError[] };

export type ParametricIdentity = {
  readonly name: string;
  readonly sku: string;
  readonly slug: string;
};

export type ParametricAuthoringDefinition<TDisplay, TFields> = {
  readonly type: string;
  readonly drawer: ParametricProductDrawer<TFields>;
  readonly defaultDisplay: (unit?: ParametricDisplayUnit) => TDisplay;
  readonly parseDisplay: (display: TDisplay) => ParametricParseResult<TFields>;
  readonly convertUnit: (
    display: TDisplay,
    nextUnit: ParametricDisplayUnit,
  ) => TDisplay;
  readonly updateDisplay: (
    display: TDisplay,
    key: string,
    value: unknown,
  ) => TDisplay;
  readonly sections: readonly ParametricFormSection[];
  readonly tools: readonly CanvasToolRailItem[];
  readonly identity: {
    readonly read: (display: TDisplay) => ParametricIdentity;
    readonly write: (
      display: TDisplay,
      identity: ParametricIdentity,
    ) => TDisplay;
  };
};

export type ParametricAuthoringDefinitionRuntime = {
  readonly type: string;
  readonly drawer: ParametricProductDrawerRuntime;
  readonly defaultDisplay: (unit?: ParametricDisplayUnit) => unknown;
  readonly parseDisplay: (display: unknown) => ParametricParseResult<unknown>;
  readonly convertUnit: (
    display: unknown,
    nextUnit: ParametricDisplayUnit,
  ) => unknown;
  readonly updateDisplay: (
    display: unknown,
    key: string,
    value: unknown,
  ) => unknown;
  readonly sections: readonly ParametricFormSection[];
  readonly tools: readonly CanvasToolRailItem[];
  readonly identity: {
    readonly read: (display: unknown) => ParametricIdentity;
    readonly write: (
      display: unknown,
      identity: ParametricIdentity,
    ) => unknown;
  };
};

export function defineParametricAuthoringDefinition<TDisplay, TFields>(
  definition: ParametricAuthoringDefinition<TDisplay, TFields>,
): ParametricAuthoringDefinition<TDisplay, TFields> {
  if (definition.type !== definition.drawer.type) {
    throw new Error(
      `Parametric authoring type ${definition.type} does not match drawer ${definition.drawer.type}`,
    );
  }
  return definition;
}

export function eraseParametricAuthoringDefinition<TDisplay, TFields>(
  definition: ParametricAuthoringDefinition<TDisplay, TFields>,
): ParametricAuthoringDefinitionRuntime {
  return {
    type: definition.type,
    drawer: eraseParametricProductDrawer(definition.drawer),
    defaultDisplay: definition.defaultDisplay,
    parseDisplay: (display) => definition.parseDisplay(display as TDisplay),
    convertUnit: (display, nextUnit) =>
      definition.convertUnit(display as TDisplay, nextUnit),
    updateDisplay: (display, key, value) =>
      definition.updateDisplay(display as TDisplay, key, value),
    sections: definition.sections,
    tools: definition.tools,
    identity: {
      read: (display) => definition.identity.read(display as TDisplay),
      write: (display, identity) =>
        definition.identity.write(display as TDisplay, identity),
    },
  };
}
