import { describe, expect, it } from "vitest";

import {
  buildLinearDeskPublishConfirmCopy,
  linearDeskDraftStatusLabel,
  linearDeskPublishedStatusLabel,
} from "@/features/admin/svg-editor/parametric/linearDeskPublishConfirm";

describe("linearDeskPublishConfirm", () => {
  it("builds confirm copy with name, SKU, slug, footprint, guest note", () => {
    const copy = buildLinearDeskPublishConfirmCopy({
      name: "Linear desk 1600",
      sku: "OANDO-LINEAR-DSK-1600",
      slug: "oando-linear-desk-1600",
      footprintMm: "1600×800 mm",
    });

    expect(copy.title).toMatch(/Publish for guests/i);
    expect(copy.confirmLabel).toBe("Publish for guests");
    expect(copy.cancelLabel).toBe("Cancel");
    expect(copy.name).toBe("Linear desk 1600");
    expect(copy.sku).toBe("OANDO-LINEAR-DSK-1600");
    expect(copy.slug).toBe("oando-linear-desk-1600");
    expect(copy.footprintMm).toBe("1600×800 mm");
    expect(copy.guestNote).toMatch(/guests can place/i);
  });

  it("uses dash for empty identity fields", () => {
    const copy = buildLinearDeskPublishConfirmCopy({
      name: "  ",
      sku: "",
      slug: "oando-linear-desk-1600",
      footprintMm: "1600×800 mm",
    });
    expect(copy.name).toBe("—");
    expect(copy.sku).toBe("—");
    expect(copy.slug).toBe("oando-linear-desk-1600");
  });

  it("status labels distinguish draft vs published", () => {
    expect(linearDeskDraftStatusLabel()).toBe("Draft");
    expect(linearDeskPublishedStatusLabel()).toMatch(/Published/i);
    expect(linearDeskPublishedStatusLabel()).toMatch(/live for guests/i);
    expect(linearDeskPublishedStatusLabel()).not.toBe(
      linearDeskDraftStatusLabel(),
    );
  });
});
