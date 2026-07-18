import { describe, expect, it } from "vitest";
import {
  defaultLinearDeskName,
  defaultLinearDeskSku,
  defaultLinearDeskSlug,
  ensureCommercialSku,
  ensureGuestVisibleSlug,
  isDefaultLinearDeskName,
  isDefaultLinearDeskSku,
  isDefaultLinearDeskSlug,
  isGuestVisibleSlug,
} from "@/features/admin/svg-editor/parametric/linearDeskGuestIdentity";

describe("linearDeskGuestIdentity", () => {
  it("prefixes oando- when missing", () => {
    expect(ensureGuestVisibleSlug("linear-desk", 1600)).toBe(
      "oando-linear-desk",
    );
  });

  it("keeps existing oando- slug", () => {
    expect(ensureGuestVisibleSlug("oando-fluid-desk-1600", 1600)).toBe(
      "oando-fluid-desk-1600",
    );
  });

  it("defaults empty slug with width", () => {
    expect(ensureGuestVisibleSlug("", 1400)).toBe("oando-linear-desk-1400");
    expect(ensureGuestVisibleSlug(undefined, 1800)).toBe(
      "oando-linear-desk-1800",
    );
  });

  it("defaults SKU from width when empty", () => {
    expect(ensureCommercialSku("", 1600)).toBe("OANDO-LINEAR-DSK-1600");
    expect(ensureCommercialSku("  CUSTOM-1  ", 1600)).toBe("CUSTOM-1");
  });

  it("detects guest-visible slugs", () => {
    expect(isGuestVisibleSlug("oando-linear-desk-1600")).toBe(true);
    expect(isGuestVisibleSlug("linear-desk")).toBe(false);
  });

  it("factory defaults and pattern detectors", () => {
    expect(defaultLinearDeskSlug(1400)).toBe("oando-linear-desk-1400");
    expect(defaultLinearDeskSku(1400)).toBe("OANDO-LINEAR-DSK-1400");
    expect(defaultLinearDeskName(1400)).toBe("Linear desk 1400");
    expect(isDefaultLinearDeskSlug("oando-linear-desk-1600")).toBe(true);
    expect(isDefaultLinearDeskSlug("oando-client-special")).toBe(false);
    expect(isDefaultLinearDeskSku("OANDO-LINEAR-DSK-1600")).toBe(true);
    expect(isDefaultLinearDeskSku("CUSTOM-1")).toBe(false);
    expect(isDefaultLinearDeskName("Linear desk 1600")).toBe(true);
    expect(isDefaultLinearDeskName("Acme Desk")).toBe(false);
  });
});
