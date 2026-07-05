import { z } from "zod";

export const PlannerPanelIdSchema = z.enum([
  "catalogue",
  "layers",
  "properties",
  "project",
  "help",
]);

export type PlannerPanelId = z.infer<typeof PlannerPanelIdSchema>;

export const PlannerWorkspacePreferencesV1Schema = z.object({
  version: z.literal(1),
  density: z.enum(["compact", "touch"]),
  lastView: z.enum(["2d", "3d"]),
  units: z.enum(["mm", "cm", "m", "in", "ft-in"]),
  gridEnabled: z.boolean(),
  snapEnabled: z.boolean(),
  deviceTier: z.enum(["desktop", "tablet", "small"]),
  panelRatios: z.object({
    catalogue: z.number().min(0.15).max(0.4),
    properties: z.number().min(0.15).max(0.4),
  }),
  collapsedPanels: z.array(PlannerPanelIdSchema),
});

export type PlannerWorkspacePreferencesV1 = z.infer<
  typeof PlannerWorkspacePreferencesV1Schema
>;

export const DEFAULT_PLANNER_WORKSPACE_PREFERENCES: PlannerWorkspacePreferencesV1 = {
  version: 1,
  density: "compact",
  lastView: "2d",
  units: "cm",
  gridEnabled: true,
  snapEnabled: true,
  deviceTier: "desktop",
  panelRatios: {
    catalogue: 0.17,
    properties: 0.17,
  },
  collapsedPanels: [],
};

/** Invalid preferences recover independently and never mutate planner documents. */
export function parsePlannerWorkspacePreferences(
  input: unknown,
): PlannerWorkspacePreferencesV1 {
  const parsed = PlannerWorkspacePreferencesV1Schema.safeParse(input);
  if (parsed.success) return parsed.data;

  return {
    ...DEFAULT_PLANNER_WORKSPACE_PREFERENCES,
    panelRatios: { ...DEFAULT_PLANNER_WORKSPACE_PREFERENCES.panelRatios },
    collapsedPanels: [],
  };
}
