import { z } from "zod";

const IdSchema = z.string().regex(/^[a-z][a-z0-9-]{1,63}$/);
const FiniteSchema = z.number().finite();
const PositiveSchema = FiniteSchema.positive();

export const SvgStyleV1Schema = z.object({
  fill: z.string().min(1).optional(),
  stroke: z.string().min(1).optional(),
  opacity: z.number().min(0).max(1).optional(),
  lineWeight: PositiveSchema.optional(),
}).strict();

const CommonPartSchema = z.object({
  id: IdSchema,
  style: SvgStyleV1Schema.optional(),
  visible: z.boolean().default(true),
});

export const SvgPartV1Schema = z.discriminatedUnion("kind", [
  CommonPartSchema.extend({ kind: z.literal("rect"), x: FiniteSchema, y: FiniteSchema, width: PositiveSchema, height: PositiveSchema }),
  CommonPartSchema.extend({ kind: z.literal("circle"), cx: FiniteSchema, cy: FiniteSchema, r: PositiveSchema }),
  CommonPartSchema.extend({ kind: z.literal("line"), x1: FiniteSchema, y1: FiniteSchema, x2: FiniteSchema, y2: FiniteSchema }),
  CommonPartSchema.extend({ kind: z.literal("path"), d: z.string().trim().min(1).max(20_000) }),
  CommonPartSchema.extend({ kind: z.literal("text"), x: FiniteSchema, y: FiniteSchema, text: z.string().max(500) }),
]).and(z.object({ customerEditable: z.boolean().default(false) }));

export const SvgParameterV1Schema = z.object({
  id: IdSchema,
  kind: z.enum(["number", "length", "angle", "color-token", "enum", "boolean", "text", "asset-reference", "material-reference"]),
  label: z.string().trim().min(1).max(120),
  customerEditable: z.boolean().default(false),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]),
  minimum: FiniteSchema.optional(),
  maximum: FiniteSchema.optional(),
  step: PositiveSchema.optional(),
  values: z.array(z.string().min(1)).max(100).optional(),
}).strict();

export const SvgActionV1Schema = z.object({
  id: IdSchema,
  kind: z.enum(["move", "resize", "rotate", "flip", "stretch", "array", "variant-replacement", "visibility-toggle", "snap"]),
  parameterIds: z.array(IdSchema).max(50).default([]),
}).strict();

export const SvgConstraintV1Schema = z.object({
  id: IdSchema,
  kind: z.enum(["minimum", "maximum", "step", "aspect-ratio", "alignment", "containment", "dependency", "visibility", "compatibility"]),
  parameterIds: z.array(IdSchema).max(50).default([]),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
}).strict();

export const SvgVariantV1Schema = z.object({
  id: IdSchema,
  label: z.string().trim().min(1).max(120),
  parameterValues: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
}).strict();

export const SvgMountingV1Schema = z.object({
  plane: z.enum(["floor", "wall", "ceiling", "floating"]),
  anchor: z.object({ x: FiniteSchema, y: FiniteSchema }),
  rotationDegrees: FiniteSchema.default(0),
}).strict();

export const SvgLifecycleV1Schema = z.object({
  status: z.enum(["draft", "review", "published", "deprecated", "archived"]),
  ownerId: z.string().trim().min(1).max(120),
  deprecationMessage: z.string().max(500).optional(),
}).strict();

export const SvgBlockDefinitionV1Schema = z.object({
  schemaVersion: z.literal(1),
  typeId: IdSchema,
  name: z.string().trim().min(1).max(160),
  sku: z.string().trim().min(1).max(120).optional(),
  category: z.string().trim().min(1).max(120),
  tags: z.array(z.string().trim().min(1).max(80)).max(50).default([]),
  lifecycle: SvgLifecycleV1Schema,
  viewBox: z.object({ x: FiniteSchema, y: FiniteSchema, width: PositiveSchema, height: PositiveSchema }).strict(),
  physicalDimensionsMm: z.object({ width: PositiveSchema, depth: PositiveSchema, height: PositiveSchema }).strict(),
  parts: z.array(SvgPartV1Schema).min(1).max(1_000),
  parameters: z.array(SvgParameterV1Schema).max(200).default([]),
  actions: z.array(SvgActionV1Schema).max(200).default([]),
  constraints: z.array(SvgConstraintV1Schema).max(500).default([]),
  variants: z.array(SvgVariantV1Schema).max(100).default([]),
  mounting: z.array(SvgMountingV1Schema).max(20).default([]),
  accessibility: z.object({ title: z.string().trim().min(1).max(200), description: z.string().max(1_000).optional() }).strict(),
}).strict().superRefine((definition, context) => {
  const parameterIds = new Set(definition.parameters.map(({ id }) => id));
  const duplicate = <T extends { id: string }>(items: T[], path: string) => {
    const seen = new Set<string>();
    for (const [index, item] of items.entries()) {
      if (seen.has(item.id)) {
        context.addIssue({ code: "custom", path: [path, index, "id"], message: `duplicate id "${item.id}"` });
      }
      seen.add(item.id);
    }
  };
  duplicate(definition.parts, "parts");
  duplicate(definition.parameters, "parameters");
  duplicate(definition.actions, "actions");
  duplicate(definition.constraints, "constraints");
  duplicate(definition.variants, "variants");
  for (const [index, reference] of definition.actions.entries()) {
    for (const parameterId of reference.parameterIds) {
      if (!parameterIds.has(parameterId)) {
        context.addIssue({
          code: "custom",
          path: ["actions", index, "parameterIds"],
          message: `unknown parameter "${parameterId}"`,
        });
      }
    }
  }
  for (const [index, reference] of definition.constraints.entries()) {
    for (const parameterId of reference.parameterIds) {
      if (!parameterIds.has(parameterId)) {
        context.addIssue({ code: "custom", path: ["constraints", index, "parameterIds"], message: `unknown parameter "${parameterId}"` });
      }
    }
  }
  for (const [index, variant] of definition.variants.entries()) {
    for (const parameterId of Object.keys(variant.parameterValues)) {
      if (!parameterIds.has(parameterId)) {
        context.addIssue({ code: "custom", path: ["variants", index, "parameterValues", parameterId], message: `unknown parameter "${parameterId}"` });
      }
    }
  }
});

export const BlockDefinitionV1Schema = SvgBlockDefinitionV1Schema;

export const BlockInstanceV1Schema = z.object({
  definitionTypeId: IdSchema,
  definitionVersion: z.number().int().positive(),
  parameterValues: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  variantId: IdSchema.optional(),
}).strict();

export const CompositionDocumentV1Schema = z.object({
  schemaVersion: z.literal(1),
  id: IdSchema,
  revision: z.number().int().nonnegative(),
  roots: z.array(BlockInstanceV1Schema).max(500),
}).strict();

const ChecksumSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const PublishedRevisionV1Schema = z.object({
  schemaVersion: z.literal(1),
  revisionId: IdSchema,
  definitionTypeId: IdSchema,
  definitionVersion: z.number().int().positive(),
  compilerVersion: z.string().min(1),
  sourceRevision: z.number().int().nonnegative(),
  artifactChecksums: z.object({
    descriptor: ChecksumSchema,
    svg: ChecksumSchema,
    png: ChecksumSchema,
    thumbnails: z.record(z.string(), ChecksumSchema),
  }).strict(),
  validation: z.object({
    valid: z.literal(true),
    diagnostics: z.array(z.object({
      code: z.string().min(1),
      severity: z.enum(["error", "warning"]),
      path: z.string(),
      message: z.string().min(1),
    }).strict()),
  }).strict(),
  actorId: z.string().min(1),
  publishedAt: z.string().datetime(),
  reason: z.string().trim().min(1).max(500),
}).strict().readonly();

export type SvgBlockDefinitionV1 = z.infer<typeof SvgBlockDefinitionV1Schema>;
export type BlockInstanceV1 = z.infer<typeof BlockInstanceV1Schema>;
export type CompositionDocumentV1 = z.infer<typeof CompositionDocumentV1Schema>;
export type PublishedRevisionV1 = z.infer<typeof PublishedRevisionV1Schema>;
