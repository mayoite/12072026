import { describe, expect, it } from "vitest";
import {
  convertLinearDeskFormUnit,
  defaultLinearDeskForm,
  formToLinearDeskRaw,
  parseLinearDeskForm,
} from "@/features/admin/svg-editor/parametric/linearDeskFormModel";
import { compileLinearDeskSvg } from "@/features/admin/svg-editor/parametric/compileLinearDeskSvg";

describe("linearDeskFormModel", () => {
  it("defaults to valid dual-pedestal desk (cm UX, guest-visible slug)", () => {
    const form = defaultLinearDeskForm();
    expect(form.displayUnit).toBe("cm");
    expect(form.slug.startsWith("oando-")).toBe(true);
    expect(form.sku.length).toBeGreaterThan(0);
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

  it("maps pedestalTopGap and pedestalBackInset to mm schema fields (K3)", () => {
    const form = {
      ...defaultLinearDeskForm("cm"),
      pedestalTopGap: 5,
      pedestalBackInset: 10,
    };
    const parsed = parseLinearDeskForm(form);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.fields.pedestalTopGapMm).toBe(50);
      expect(parsed.fields.pedestalBackInsetMm).toBe(100);
    }
    const raw = formToLinearDeskRaw(form);
    expect(raw.pedestalTopGapMm).toBe(50);
    expect(raw.pedestalBackInsetMm).toBe(100);
  });
});

describe("compileLinearDeskSvg (Maker pen — K1/K2)", () => {
  it("returns sanitised multipath SVG with Maker part ids, no currentColor", () => {
    const result = compileLinearDeskSvg({
      type: "linear-desk",
      widthMm: 1600,
      depthMm: 800,
      slug: "linear-desk-test",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.svg).toMatch(/^<svg /);
      // Maker pen: desk-top + pedestals (no template-only frame path)
      expect(result.svg).toContain('id="desk-top"');
      expect(result.svg).toContain('id="pedestal-l"');
      expect(result.svg).toContain('id="pedestal-r"');
      expect(result.svg).not.toContain('id="frame"');
      expect(result.svg).not.toMatch(/currentColor|var\s*\(/i);
    }
  });

  it("fails template-authority claim: dual-pedestal compile never emits frame-only shell", () => {
    const result = compileLinearDeskSvg({
      type: "linear-desk",
      widthMm: 1600,
      depthMm: 800,
      pedestalCount: 2,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // Template dual-pedestal always emitted id="frame"; Maker path must not.
    expect(result.svg).not.toContain('id="frame"');
    expect(result.svg).toMatch(/id="desk-top"/);
  });

  it("maps form pedestalTopGap / pedestalBackInset into different compile paths", () => {
    const formA = {
      ...defaultLinearDeskForm("mm"),
      pedestalTopGap: 20,
      pedestalBackInset: 40,
    };
    const formB = {
      ...formA,
      pedestalTopGap: 100,
      pedestalBackInset: 160,
    };
    const a = compileLinearDeskSvg(formToLinearDeskRaw(formA));
    const b = compileLinearDeskSvg(formToLinearDeskRaw(formB));
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) {
      expect(a.svg).not.toBe(b.svg);
      expect(a.svg).toContain('id="pedestal-l"');
    }
  });
});
