/**
 * Admin parametric linear desk — form model (display units → mm fields).
 * Pure. Preview/publish call the same draw* with mm.
 */

import {
  displayValueToMm,
  mmToDisplayValue,
} from "@/features/planner/model/units";
import {
  LinearDeskFieldsSchema,
  type LinearDeskFields,
  type LinearDeskDisplayUnit,
} from "@/features/planner/asset-engine/svg/parametric/linearDeskFields";

export type LinearDeskFormDisplay = {
  readonly displayUnit: LinearDeskDisplayUnit;
  readonly width: number;
  readonly depth: number;
  readonly height: number;
  readonly topThickness: number;
  readonly pedestalWidth: number;
  readonly pedestalInset: number;
  readonly pedestalTopGap: number;
  readonly pedestalBackInset: number;
  readonly pedestalCount: 0 | 2;
  readonly modesty: boolean;
  readonly name: string;
  readonly sku: string;
  readonly seriesId: string;
  readonly slug: string;
};

export type LinearDeskFormFieldError = {
  readonly path: string;
  readonly message: string;
};

const LINEAR_KEYS = [
  "width",
  "depth",
  "height",
  "topThickness",
  "pedestalWidth",
  "pedestalInset",
  "pedestalTopGap",
  "pedestalBackInset",
] as const;

type LinearKey = (typeof LINEAR_KEYS)[number];

const MM_FIELD: Record<LinearKey, keyof LinearDeskFields> = {
  width: "widthMm",
  depth: "depthMm",
  height: "heightMm",
  topThickness: "topThicknessMm",
  pedestalWidth: "pedestalWidthMm",
  pedestalInset: "pedestalInsetMm",
  pedestalTopGap: "pedestalTopGapMm",
  pedestalBackInset: "pedestalBackInsetMm",
};

export function defaultLinearDeskForm(
  unit: LinearDeskDisplayUnit = "mm",
): LinearDeskFormDisplay {
  const mm = {
    widthMm: 1600,
    depthMm: 800,
    heightMm: 750,
    topThicknessMm: 120,
    pedestalWidthMm: 200,
    pedestalInsetMm: 120,
    pedestalTopGapMm: 40,
    pedestalBackInsetMm: 80,
  };
  return {
    displayUnit: unit,
    width: mmToDisplayValue(mm.widthMm, unit),
    depth: mmToDisplayValue(mm.depthMm, unit),
    height: mmToDisplayValue(mm.heightMm, unit),
    topThickness: mmToDisplayValue(mm.topThicknessMm, unit),
    pedestalWidth: mmToDisplayValue(mm.pedestalWidthMm, unit),
    pedestalInset: mmToDisplayValue(mm.pedestalInsetMm, unit),
    pedestalTopGap: mmToDisplayValue(mm.pedestalTopGapMm, unit),
    pedestalBackInset: mmToDisplayValue(mm.pedestalBackInsetMm, unit),
    pedestalCount: 2,
    modesty: false,
    name: "Linear desk",
    sku: "",
    seriesId: "",
    slug: "linear-desk",
  };
}

/** Re-express linear fields when toggling mm ↔ cm (geometry unchanged in mm). */
export function convertLinearDeskFormUnit(
  form: LinearDeskFormDisplay,
  nextUnit: LinearDeskDisplayUnit,
): LinearDeskFormDisplay {
  if (form.displayUnit === nextUnit) return form;
  const asMm = formToMmPartial(form);
  return {
    ...form,
    displayUnit: nextUnit,
    width: mmToDisplayValue(asMm.widthMm, nextUnit),
    depth: mmToDisplayValue(asMm.depthMm, nextUnit),
    height: mmToDisplayValue(asMm.heightMm, nextUnit),
    topThickness: mmToDisplayValue(asMm.topThicknessMm, nextUnit),
    pedestalWidth: mmToDisplayValue(asMm.pedestalWidthMm, nextUnit),
    pedestalInset: mmToDisplayValue(asMm.pedestalInsetMm, nextUnit),
    pedestalTopGap: mmToDisplayValue(asMm.pedestalTopGapMm, nextUnit),
    pedestalBackInset: mmToDisplayValue(asMm.pedestalBackInsetMm, nextUnit),
  };
}

function formToMmPartial(form: LinearDeskFormDisplay): {
  widthMm: number;
  depthMm: number;
  heightMm: number;
  topThicknessMm: number;
  pedestalWidthMm: number;
  pedestalInsetMm: number;
  pedestalTopGapMm: number;
  pedestalBackInsetMm: number;
} {
  const u = form.displayUnit;
  return {
    widthMm: displayValueToMm(form.width, u),
    depthMm: displayValueToMm(form.depth, u),
    heightMm: displayValueToMm(form.height, u),
    topThicknessMm: displayValueToMm(form.topThickness, u),
    pedestalWidthMm: displayValueToMm(form.pedestalWidth, u),
    pedestalInsetMm: displayValueToMm(form.pedestalInset, u),
    pedestalTopGapMm: displayValueToMm(form.pedestalTopGap, u),
    pedestalBackInsetMm: displayValueToMm(form.pedestalBackInset, u),
  };
}

export function formToLinearDeskRaw(
  form: LinearDeskFormDisplay,
): Record<string, unknown> {
  const mm = formToMmPartial(form);
  return {
    type: "linear-desk",
    ...mm,
    pedestalCount: form.pedestalCount,
    modesty: form.modesty,
    name: form.name.trim() || undefined,
    sku: form.sku.trim() || undefined,
    seriesId: form.seriesId.trim() || undefined,
    slug: form.slug.trim() || undefined,
  };
}

export function parseLinearDeskForm(form: LinearDeskFormDisplay): {
  readonly ok: true;
  readonly fields: LinearDeskFields;
} | {
  readonly ok: false;
  readonly errors: readonly LinearDeskFormFieldError[];
} {
  const result = LinearDeskFieldsSchema.safeParse(formToLinearDeskRaw(form));
  if (result.success) {
    return { ok: true, fields: result.data };
  }
  const errors: LinearDeskFormFieldError[] = result.error.issues.map((issue) => {
    const zodPath = issue.path[0];
    let path = String(zodPath ?? "form");
    // Map widthMm → width for form binding
    for (const key of LINEAR_KEYS) {
      if (MM_FIELD[key] === zodPath) {
        path = key;
        break;
      }
    }
    return { path, message: issue.message };
  });
  return { ok: false, errors };
}
