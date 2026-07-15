import { SvgAiOperationV1Schema, type SvgAiOperationV1 } from "./svgAiSchemasV1";

export function parseSvgAiOperationsV1(input: unknown): readonly SvgAiOperationV1[] {
  if (!Array.isArray(input)) throw new Error("AI operations must be an array");
  return input.map((operation) => SvgAiOperationV1Schema.parse(operation));
}

export function describeSvgAiOperationV1(operation: SvgAiOperationV1): string {
  switch (operation.type) {
    case "insert": return `Insert ${operation.element} #${operation.id}`;
    case "set-attribute": return `Set ${operation.name} on #${operation.targetId}`;
    case "propose-dimensions": return `Propose ${operation.widthMm} x ${operation.depthMm} x ${operation.heightMm} mm`;
    default: return `${operation.type} #${"targetId" in operation ? operation.targetId : operation.groupId}`;
  }
}
