/**
 * Linear desk product fields (canonical mm).
 * Client forms edit mm or cm; convert with planner units helpers before parse.
 */

import { z } from "zod";

export const LinearDeskDisplayUnitSchema = z.enum(["mm", "cm"]);
export type LinearDeskDisplayUnit = z.infer<typeof LinearDeskDisplayUnitSchema>;

export const LinearDeskFieldsSchema = z
  .object({
    type: z.literal("linear-desk"),
    /** Plan width (mm). */
    widthMm: z.number().finite().min(600).max(3000),
    /** Plan depth (mm). */
    depthMm: z.number().finite().min(400).max(1200),
    /** Overall height for BOQ / 3D later (mm). Plan draw may ignore. */
    heightMm: z.number().finite().min(400).max(1200).default(750),
    /** Worksurface strip depth on plan (mm). */
    topThicknessMm: z.number().finite().min(40).max(200).default(120),
    /** Each pedestal width (mm). */
    pedestalWidthMm: z.number().finite().min(80).max(400).default(200),
    /** Inset from left/right outer edge to pedestal (mm). */
    pedestalInsetMm: z.number().finite().min(40).max(400).default(120),
    /** Inset from front of desk (after top band) before pedestals start (mm). */
    pedestalTopGapMm: z.number().finite().min(0).max(400).default(40),
    /** Inset from back edge under pedestals (mm). */
    pedestalBackInsetMm: z.number().finite().min(0).max(400).default(80),
    /** 0 = no pedestals; 2 = dual pedestals (sample-desk language). */
    pedestalCount: z.union([z.literal(0), z.literal(2)]).default(2),
    /** Optional modesty panel between pedestals. */
    modesty: z.boolean().default(false),
    // Empty strings from forms → undefined (optional, not "too small")
    seriesId: z.preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z.string().trim().min(1).max(64).optional(),
    ),
    name: z.preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z.string().trim().min(1).max(120).optional(),
    ),
    sku: z.preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z.string().trim().min(1).max(64).optional(),
    ),
    slug: z.preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z
        .string()
        .trim()
        .regex(/^[a-z][a-z0-9-]{1,63}$/)
        .optional(),
    ),
  })
  .superRefine((value, ctx) => {
    if (value.pedestalCount === 0) return;
    const minWidth =
      value.pedestalInsetMm * 2 + value.pedestalWidthMm * 2 + 40;
    if (value.widthMm < minWidth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["widthMm"],
        message: `widthMm too small for dual pedestals (need ≥ ${minWidth} mm)`,
      });
    }
    const usedDepth =
      value.topThicknessMm +
      value.pedestalTopGapMm +
      40 +
      value.pedestalBackInsetMm;
    if (value.depthMm < usedDepth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["depthMm"],
        message: `depthMm too small for top + pedestals (need ≥ ${usedDepth} mm)`,
      });
    }
  });

export type LinearDeskFields = z.infer<typeof LinearDeskFieldsSchema>;

export function parseLinearDeskFields(raw: unknown): LinearDeskFields {
  return LinearDeskFieldsSchema.parse(raw);
}
