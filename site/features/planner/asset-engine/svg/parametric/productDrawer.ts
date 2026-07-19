import type { z } from "zod";

export type ParametricProductCapabilities = {
  readonly selectableParts: boolean;
  readonly measurable: boolean;
  readonly supportsGrid: boolean;
  readonly supportsSnap: boolean;
};

export type ParametricPreviewPath = {
  readonly id: string;
  readonly d: string;
  readonly fill: string | "none";
  readonly stroke: string;
  readonly strokeWidth: number;
};

export type ParametricPreviewPart = {
  readonly id: string;
  readonly role: string;
  readonly paths: readonly ParametricPreviewPath[];
};

export type ParametricPreview = {
  readonly svg: string;
  readonly viewBox: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly widthMm: number;
  readonly depthMm: number;
  readonly parts: readonly ParametricPreviewPart[];
};

export type ParametricProductDrawer<TFields> = {
  readonly type: string;
  readonly label: string;
  readonly schema: z.ZodType<TFields>;
  readonly defaults: () => TFields;
  readonly capabilities: ParametricProductCapabilities;
  readonly render: (fields: TFields) => ParametricPreview;
};

export type ParametricProductDrawerRuntime = {
  readonly type: string;
  readonly label: string;
  readonly capabilities: ParametricProductCapabilities;
  readonly defaults: () => unknown;
  readonly parse: (raw: unknown) => unknown;
  readonly render: (raw: unknown) => ParametricPreview;
};

export function defineParametricProductDrawer<TFields>(
  drawer: ParametricProductDrawer<TFields>,
): ParametricProductDrawer<TFields> {
  return drawer;
}

export function eraseParametricProductDrawer<TFields>(
  drawer: ParametricProductDrawer<TFields>,
): ParametricProductDrawerRuntime {
  return {
    type: drawer.type,
    label: drawer.label,
    capabilities: drawer.capabilities,
    defaults: drawer.defaults,
    parse: (raw) => drawer.schema.parse(raw),
    render: (raw) => drawer.render(drawer.schema.parse(raw)),
  };
}
