import { z } from "zod";

const BooleanText = z.enum(["true", "false"]).transform((value) => value === "true");
const SvgEditorVersionConfigSchema = z.object({
  ADMIN_SVG_EDITOR_VERSION: z.enum(["v1", "v2"]).default("v2"),
  ADMIN_SVG_EDITOR_LEGACY_READONLY: BooleanText.default("true"),
  PLANNER_SVG_CATALOG_VERSION: z.enum(["v1", "v2"]).default("v2"),
}).strict().superRefine((value, context) => {
  if (value.ADMIN_SVG_EDITOR_VERSION === "v1" && value.ADMIN_SVG_EDITOR_LEGACY_READONLY) {
    context.addIssue({ code: "custom", path: ["ADMIN_SVG_EDITOR_LEGACY_READONLY"], message: "The active V1 editor cannot also be read-only" });
  }
});

export type SvgEditorVersionConfig = z.infer<typeof SvgEditorVersionConfigSchema>;

export function parseSvgEditorVersionConfig(environment: Record<string, string | undefined>): SvgEditorVersionConfig {
  return SvgEditorVersionConfigSchema.parse({
    ADMIN_SVG_EDITOR_VERSION: environment.ADMIN_SVG_EDITOR_VERSION,
    ADMIN_SVG_EDITOR_LEGACY_READONLY: environment.ADMIN_SVG_EDITOR_LEGACY_READONLY,
    PLANNER_SVG_CATALOG_VERSION: environment.PLANNER_SVG_CATALOG_VERSION,
  });
}
