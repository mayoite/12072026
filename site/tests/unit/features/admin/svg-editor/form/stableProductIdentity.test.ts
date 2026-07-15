import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  descriptorToFormState,
  formStateToDescriptorInput,
} from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

/** Read-only fixture load — never writes catalog files. */
function loadSideTable(): BlockDescriptor {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "inventory/descriptors/side-table-001.json"),
    "utf8",
  );
  return JSON.parse(raw) as BlockDescriptor;
}

describe("stable product identity survives editing", () => {
  it("keeps descriptor id when form fields and slug change", () => {
    const original = loadSideTable();
    const form = descriptorToFormState(original);
    const edited = {
      ...form,
      slug: `${form.slug}-edited`,
      sku: `${form.sku}-X`,
      geometry: {
        ...form.geometry,
        widthMm: form.geometry.widthMm + 10,
      },
    };

    const next = formStateToDescriptorInput(original, edited) as {
      id: string;
      slug: string;
      sku?: string;
      geometry: { widthMm: number };
    };

    expect(next.id).toBe(original.id);
    expect(next.slug).toBe(edited.slug);
    expect(next.sku).toBe(edited.sku);
    expect(next.geometry.widthMm).toBe(edited.geometry.widthMm);
  });

  it("preserves parentProductId when present on the original", () => {
    const original = {
      ...loadSideTable(),
      parentProductId: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
    };
    const form = descriptorToFormState(original);
    const next = formStateToDescriptorInput(original, {
      ...form,
      sku: "CHANGED",
    }) as { id: string; parentProductId?: string };

    expect(next.id).toBe(original.id);
    expect(next.parentProductId).toBe(original.parentProductId);
  });
});
