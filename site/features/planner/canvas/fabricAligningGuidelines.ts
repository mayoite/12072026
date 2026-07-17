/**
 * Re-export AligningGuidelines without `fabric/extensions` (that barrel pulls westures).
 */
import type { Canvas } from "fabric";

type AligningGuidelinesOptions = {
  color?: string;
  margin?: number;
  width?: number;
};

type AligningGuidelinesInstance = {
  dispose: () => void;
};

type AligningGuidelinesCtor = new (
  canvas: Canvas,
  options?: AligningGuidelinesOptions,
) => AligningGuidelinesInstance;

// Fabric package exports do not expose this subpath; types are asserted locally.
// @ts-expect-error TS7016 — no declarations for the dist-extensions mjs entry.
import { AligningGuidelines as AligningGuidelinesRuntime } from "../../../../node_modules/fabric/dist-extensions/aligning_guidelines/index.mjs";

export const AligningGuidelines =
  AligningGuidelinesRuntime as AligningGuidelinesCtor;
