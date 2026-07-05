import { z } from "zod";

export type SvgFieldKind = "text" | "number" | "select" | "radio";

export interface SvgFieldMetadata {
  readonly path: string;
  readonly label: string;
  readonly kind: SvgFieldKind;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly step?: number;
  readonly options?: readonly string[];
  readonly help?: string;
}

export interface GeneratedPuckField {
  readonly type: SvgFieldKind;
  readonly label: string;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly options?: ReadonlyArray<{ label: string; value: string }>;
  readonly helperText?: string;
}

export const SVG_FIELD_METADATA = [
  { path: "name", label: "Name", kind: "text" },
  { path: "category", label: "Category", kind: "text" },
  { path: "physicalDimensionsMm.width", label: "Width (mm)", kind: "number", minimum: 1, step: 1 },
  { path: "physicalDimensionsMm.depth", label: "Depth (mm)", kind: "number", minimum: 1, step: 1 },
  { path: "physicalDimensionsMm.height", label: "Height (mm)", kind: "number", minimum: 1, step: 1 },
  { path: "lifecycle.status", label: "Status", kind: "select", options: ["draft", "review", "published", "deprecated", "archived"] },
] as const satisfies readonly SvgFieldMetadata[];

export const SvgFieldMetadataSchema = z.object({
  path: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(["text", "number", "select", "radio"]),
  minimum: z.number().finite().optional(),
  maximum: z.number().finite().optional(),
  step: z.number().positive().optional(),
  options: z.array(z.string().min(1)).optional(),
  help: z.string().min(1).optional(),
}).strict();

export function generatePuckFields(
  metadata: readonly SvgFieldMetadata[],
): Readonly<Record<string, GeneratedPuckField>> {
  return Object.freeze(Object.fromEntries(metadata.map((raw) => {
    const field = SvgFieldMetadataSchema.parse(raw);
    return [field.path, Object.freeze({
      type: field.kind,
      label: field.label,
      ...(field.minimum === undefined ? {} : { min: field.minimum }),
      ...(field.maximum === undefined ? {} : { max: field.maximum }),
      ...(field.step === undefined ? {} : { step: field.step }),
      ...(field.options === undefined ? {} : {
        options: field.options.map((value) => ({ label: value, value })),
      }),
      ...(field.help === undefined ? {} : { helperText: field.help }),
    })];
  })));
}

export const SVG_PUCK_FIELDS = generatePuckFields(SVG_FIELD_METADATA);
