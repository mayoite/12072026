import { z } from "zod";

export const SVG_AI_PROTOCOL_VERSION = 1 as const;
const StableId = z.string().regex(/^[A-Za-z][\w:.-]{0,127}$/);
const FiniteNumber = z.number().finite().min(-1_000_000).max(1_000_000);
const SafeAttribute = z.enum([
  "d", "fill", "stroke", "stroke-width", "opacity", "x", "y", "x1", "y1", "x2", "y2",
  "cx", "cy", "r", "rx", "ry", "width", "height", "transform", "font-size", "text-anchor",
]);

const BaseOperation = z.object({ version: z.literal(SVG_AI_PROTOCOL_VERSION) }).strict();
export const SvgAiOperationV1Schema = z.discriminatedUnion("type", [
  BaseOperation.extend({ type: z.literal("insert"), parentId: StableId.nullable(), element: z.enum(["path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "g", "text"]), id: StableId, attributes: z.record(SafeAttribute, z.string()) }).strict(),
  BaseOperation.extend({ type: z.literal("set-attribute"), targetId: StableId, name: SafeAttribute, value: z.string().max(10_000) }).strict(),
  BaseOperation.extend({ type: z.literal("move"), targetId: StableId, x: FiniteNumber, y: FiniteNumber }).strict(),
  BaseOperation.extend({ type: z.literal("resize"), targetId: StableId, width: FiniteNumber.positive(), height: FiniteNumber.positive() }).strict(),
  BaseOperation.extend({ type: z.literal("rotate"), targetId: StableId, degrees: FiniteNumber }).strict(),
  BaseOperation.extend({ type: z.literal("duplicate"), targetId: StableId, newId: StableId }).strict(),
  BaseOperation.extend({ type: z.literal("remove"), targetId: StableId }).strict(),
  BaseOperation.extend({ type: z.literal("group"), targetIds: z.array(StableId).min(1).max(100), groupId: StableId }).strict(),
  BaseOperation.extend({ type: z.literal("ungroup"), targetId: StableId }).strict(),
  BaseOperation.extend({ type: z.literal("reorder"), targetId: StableId, position: z.enum(["front", "back", "forward", "backward"]) }).strict(),
  BaseOperation.extend({ type: z.literal("rename"), targetId: StableId, newId: StableId }).strict(),
  BaseOperation.extend({ type: z.literal("propose-dimensions"), widthMm: FiniteNumber.positive(), depthMm: FiniteNumber.positive(), heightMm: FiniteNumber.positive() }).strict(),
]);

export const SvgAiRequestV1Schema = z.object({
  version: z.literal(SVG_AI_PROTOCOL_VERSION),
  mode: z.enum(["edit", "audit"]),
  prompt: z.string().trim().min(1).max(4_000),
  scope: z.discriminatedUnion("type", [
    z.object({ type: z.literal("selection"), elementIds: z.array(StableId).min(1).max(100) }).strict(),
    z.object({ type: z.literal("document") }).strict(),
  ]),
  svg: z.string().min(1).max(1_000_000),
  dimensionsMm: z.object({ width: FiniteNumber.positive(), depth: FiniteNumber.positive(), height: FiniteNumber.positive() }).strict(),
  baseChecksum: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();

export const SvgAiResponseV1Schema = z.object({
  version: z.literal(SVG_AI_PROTOCOL_VERSION),
  summary: z.string().max(2_000),
  baseChecksum: z.string().regex(/^[a-f0-9]{64}$/),
  operations: z.array(SvgAiOperationV1Schema).max(200),
  findings: z.array(z.object({ severity: z.enum(["info", "warning", "error"]), message: z.string().max(2_000), elementId: StableId.nullable() }).strict()).max(200),
  provider: z.string().min(1).max(100),
  model: z.string().min(1).max(200),
}).strict();

export type SvgAiRequestV1 = z.infer<typeof SvgAiRequestV1Schema>;
export type SvgAiResponseV1 = z.infer<typeof SvgAiResponseV1Schema>;
export type SvgAiOperationV1 = z.infer<typeof SvgAiOperationV1Schema>;
