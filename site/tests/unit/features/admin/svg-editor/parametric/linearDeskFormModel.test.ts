import { describe, expect, it } from "vitest";
import {
  convertLinearDeskFormUnit,
  defaultLinearDeskForm,
  formToLinearDeskRaw,
  parseLinearDeskForm,
} from "@/features/admin/svg-editor/parametric/linearDeskFormModel";
import { compileLinearDeskSvg } from "@/features/admin/svg-editor/parametric/compileLinearDeskSvg";

describe("linearDeskFormModel", () => {
  it("defaults to valid dual-pedestal desk in mm", () => {
    const form = defaultLinearDeskForm("mm");
    const parsed = parseLinearDeskForm(form);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.fields.widthMm).toBe(1600);
      expect(parsed.fields.depthMm).toBe(800);
      expect(parsed.fields.pedestalCount).toBe(2);
    }
  });

  it("converts 160 cm width to 1600 mm for draw", () => {
    let form = defaultLinearDeskForm("cm");
    form = { ...form, width: 160, depth: 80 };
    const parsed = parseLinearDeskForm(form);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.fields.widthMm).toBe(1600);
      expect(parsed.fields.depthMm).toBe(800);
    }
  });

  it("round-trips mm → cm → mm for width", () => {
    const mm = defaultLinearDeskForm("mm");
    const cm = convertLinearDeskFormUnit(mm, "cm");
    expect(cm.width).toBe(160);
    const back = convertLinearDeskFormUnit(cm, "mm");
    expect(back.width).toBe(1600);
  });

  it("rejects dual pedestals when width too small", () => {
    const form = {
      ...defaultLinearDeskForm("mm"),
      width: 600,
      pedestalCount: 2 as const,
    };
    const parsed = parseLinearDeskForm(form);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.errors.some((e) => e.path === "width")).toBe(true);
    }
  });

  it("formToLinearDeskRaw is linear-desk type", () => {
    const raw = formToLinearDeskRaw(defaultLinearDeskForm("mm"));
    expect(raw.type).toBe("linear-desk");
  });
});

describe("compileLinearDeskSvg", () => {
  it("returns sanitised multipath SVG without currentColor", () => {
    const result = compileLinearDeskSvg({
      type: "linear-desk",
      widthMm: 1600,
      depthMm: 800,
      slug: "linear-desk-test",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.svg).toMatch(/^<svg /);
      expect(result.svg).toContain('id="frame"');
      expect(result.svg).not.toMatch(/currentColor/i);
    }
  });
});
