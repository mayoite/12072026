import { describe, expect, it } from "vitest";

import { deskAssemblyDrawer } from "@/features/planner/asset-engine/svg/parametric/deskAssemblyDrawer";
import { buildDeskAssemblyPublishDescriptor } from "@/features/admin/svg-editor/parametric/deskAssemblyPublishDescriptor";
import {
  deskAssemblyFieldsFromDescriptor,
  deskAssemblyFieldsToDisplay,
} from "@/features/admin/svg-editor/parametric/deskAssemblyHydration";

describe("deskAssemblyHydration", () => {
  it("round-trips publish maker fields into display", () => {
    const fields = deskAssemblyDrawer.schema.parse({
      ...deskAssemblyDrawer.defaults(),
      layout: "u",
      workstationCount: 12,
      name: "Desk assembly — 12 workstations",
      sku: "OANDO-DSK-ASM-12",
      slug: "oando-desk-assembly-12",
    });
    const preview = deskAssemblyDrawer.render(fields);
    const descriptor = buildDeskAssemblyPublishDescriptor(fields, preview);
    expect(descriptor.maker?.recipe).toBe("desk-assembly");

    const restored = deskAssemblyFieldsFromDescriptor(descriptor);
    expect(restored).not.toBeNull();
    expect(restored?.workstationCount).toBe(12);
    expect(restored?.layout).toBe("u");
    expect(restored?.slug).toBe("oando-desk-assembly-12");

    const display = deskAssemblyFieldsToDisplay(restored!, "cm");
    expect(display.workstationCount).toBe(12);
    expect(display.slug).toBe("oando-desk-assembly-12");
    expect(display.layout).toBe("u");
  });
});
