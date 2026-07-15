import { describeSvgAiOperationV1 } from "./svgAiOperationsV1";
import { applySvgAiOperations } from "./applySvgAiOperations";
import type { SvgAiOperationV1 } from "./svgAiSchemasV1";

async function checksum(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function previewSvgAiOperations(input: { readonly svg: string; readonly operations: readonly SvgAiOperationV1[] }) {
  const afterSvg = applySvgAiOperations(input.svg, input.operations);
  return {
    beforeSvg: input.svg,
    afterSvg,
    resultChecksum: await checksum(afterSvg),
    operationDescriptions: input.operations.map(describeSvgAiOperationV1),
    diagnostics: [] as const,
  };
}
