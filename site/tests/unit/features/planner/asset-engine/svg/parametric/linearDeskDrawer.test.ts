import { describe, expect, it } from "vitest";

import { linearDeskDrawer } from "@/features/planner/asset-engine/svg/parametric/linearDeskDrawer";

describe("linearDeskDrawer", () => {
  it("returns stable Maker parts and publish SVG from canonical fields", () => {
    const fields = linearDeskDrawer.defaults();
    const preview = linearDeskDrawer.render(fields);

    expect(preview.widthMm).toBe(fields.widthMm);
    expect(preview.depthMm).toBe(fields.depthMm);
    expect(preview.parts.map((part) => part.id)).toContain("desk-top");
    expect(preview.parts.every((part) => part.paths.length > 0)).toBe(true);
    expect(preview.svg).toContain('data-product-type="linear-desk"');
    expect(preview.svg).not.toContain("currentColor");
    expect(preview.svg).not.toContain("var(");
  });
});
