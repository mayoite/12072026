import { z } from "zod";

import type { LinearDeskFields } from "./linearDeskFields";

export const DeskAssemblyFieldsSchema = z
  .object({
    type: z.literal("desk-assembly"),
    layout: z.enum(["linear", "u"]),
    workstationCount: z.number().int().min(1).max(24),
    runLengthMm: z.number().finite().min(600).max(24_000),
    returnLengthMm: z.number().finite().min(600).max(12_000),
    deskDepthMm: z.number().finite().min(400).max(1200),
    deskHeightMm: z.number().finite().min(400).max(1200),
    aisleMm: z.number().finite().min(800).max(2400),
    powerRail: z.boolean(),
    cableManagement: z.boolean(),
    modesty: z.boolean(),
    partitions: z.boolean(),
    name: z.string().trim().min(1).max(120).optional(),
    sku: z.string().trim().min(1).max(64).optional(),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z][a-z0-9-]{1,63}$/)
      .optional(),
  })
  .superRefine((fields, context) => {
    const backCount =
      fields.layout === "linear"
        ? fields.workstationCount
        : Math.ceil(fields.workstationCount / 2);
    if (fields.runLengthMm / backCount < 600) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["runLengthMm"],
        message: "Run length must provide at least 600 mm per workstation",
      });
    }
    if (fields.layout !== "u") return;
    if (fields.workstationCount < 4) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["workstationCount"],
        message: "U layout requires at least four workstations",
      });
    }
    if (fields.runLengthMm - fields.deskDepthMm * 2 < fields.aisleMm) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["aisleMm"],
        message: "Aisle does not fit between U-layout returns",
      });
    }
    const sideCount = fields.workstationCount - backCount;
    const largestSideCount = Math.ceil(sideCount / 2);
    if (
      largestSideCount > 0 &&
      fields.returnLengthMm / largestSideCount < 600
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnLengthMm"],
        message: "Return length must provide at least 600 mm per workstation",
      });
    }
  });

export type DeskAssemblyFields = z.infer<typeof DeskAssemblyFieldsSchema>;

export function linearDeskFieldsToDeskAssembly(
  fields: LinearDeskFields,
): DeskAssemblyFields {
  return DeskAssemblyFieldsSchema.parse({
    type: "desk-assembly",
    layout: "linear",
    workstationCount: 1,
    runLengthMm: fields.widthMm,
    returnLengthMm: fields.widthMm,
    deskDepthMm: fields.depthMm,
    deskHeightMm: fields.heightMm,
    aisleMm: 1200,
    powerRail: false,
    cableManagement: false,
    modesty: fields.modesty,
    partitions: false,
    name: fields.name,
    sku: fields.sku,
    slug: fields.slug,
  });
}
