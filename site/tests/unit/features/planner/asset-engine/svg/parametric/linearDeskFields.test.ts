import { describe, expect, it } from "vitest";
import {
  LinearDeskFieldsSchema,
  parseLinearDeskFields,
} from "@/features/planner/asset-engine/svg/parametric/linearDeskFields";

const baseValid = {
  type: "linear-desk" as const,
  widthMm: 1600,
  depthMm: 800,
};

describe("linearDeskFields", () => {
  it("parses defaults for optional geometry fields", () => {
    const fields = parseLinearDeskFields(baseValid);
    expect(fields.heightMm).toBe(750);
    expect(fields.topThicknessMm).toBe(120);
    expect(fields.pedestalWidthMm).toBe(200);
    expect(fields.pedestalInsetMm).toBe(120);
    expect(fields.pedestalTopGapMm).toBe(40);
    expect(fields.pedestalBackInsetMm).toBe(80);
    expect(fields.pedestalCount).toBe(2);
    expect(fields.modesty).toBe(false);
  });

  it("accepts pedestalCount 0 without dual-pedestal width check", () => {
    const fields = parseLinearDeskFields({
      type: "linear-desk",
      widthMm: 600,
      depthMm: 400,
      pedestalCount: 0,
    });
    expect(fields.pedestalCount).toBe(0);
    expect(fields.widthMm).toBe(600);
  });

  it("rejects width too small for dual pedestals", () => {
    // min dual width = 2*120 + 2*200 + 40 = 680; 600 is in range but fails fit
    const result = LinearDeskFieldsSchema.safeParse({
      type: "linear-desk",
      widthMm: 600,
      depthMm: 800,
      pedestalCount: 2,
      pedestalWidthMm: 200,
      pedestalInsetMm: 120,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const widthIssue = result.error.issues.find((i) => i.path[0] === "widthMm");
      expect(widthIssue?.message).toMatch(/dual pedestals/i);
    }
  });

  it("rejects depth too small for top + pedestals", () => {
    // depth min range is 400; fit needs top+gap+40+back = 120+40+40+200 = 400 → push backInset
    const result = LinearDeskFieldsSchema.safeParse({
      type: "linear-desk",
      widthMm: 1600,
      depthMm: 400,
      pedestalCount: 2,
      topThicknessMm: 120,
      pedestalTopGapMm: 40,
      pedestalBackInsetMm: 220,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const depthIssue = result.error.issues.find((i) => i.path[0] === "depthMm");
      expect(depthIssue?.message).toMatch(/depthMm too small/i);
    }
  });

  it("rejects invalid slug", () => {
    const result = LinearDeskFieldsSchema.safeParse({
      ...baseValid,
      slug: "Bad_Slug",
    });
    expect(result.success).toBe(false);
  });

  it("accepts metadata and custom geometry within range", () => {
    const fields = parseLinearDeskFields({
      ...baseValid,
      widthMm: 1800,
      depthMm: 750,
      name: "Fluid linear 1800",
      sku: "FLD-1800",
      seriesId: "fluid",
      slug: "fluid-linear-1800",
      modesty: true,
      pedestalCount: 2,
    });
    expect(fields.slug).toBe("fluid-linear-1800");
    expect(fields.modesty).toBe(true);
    expect(fields.sku).toBe("FLD-1800");
  });

  it("rejects out-of-range width", () => {
    expect(() =>
      parseLinearDeskFields({ type: "linear-desk", widthMm: 100, depthMm: 800 }),
    ).toThrow();
  });
});
