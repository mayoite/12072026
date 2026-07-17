import { describe, expect, it } from "vitest";
import {
  ADMIN_CATALOG_PHONE_CELL_LABELS,
  ADMIN_PHONE_CARDS_MAX_WIDTH_REM,
  ADMIN_PHONE_MAX_WIDTH_REM,
  ADMIN_PHONE_MIN_TAP_PX,
  ADMIN_PHONE_MIN_TAP_REM,
  adminPhoneCapabilities,
  phoneAuthoringBlockedMessage,
  phoneListLayoutMode,
} from "@/features/admin/ui/adminMobileReview";

describe("adminMobileReview", () => {
  it("declares phone capabilities", () => {
    expect(ADMIN_PHONE_MAX_WIDTH_REM).toBe(60);
    expect(adminPhoneCapabilities().find((c) => c.capability === "list-review")?.supported).toBe(true);
    expect(adminPhoneCapabilities().find((c) => c.capability === "svg-authoring")?.supported).toBe(false);
    expect(phoneAuthoringBlockedMessage()).toMatch(/phone/i);
    expect(phoneListLayoutMode()).toBe("cards-priority");
  });

  it("AF-06: catalog phone layout + tap contracts match locked CSS", () => {
    expect(phoneListLayoutMode()).toBe("cards-priority");
    expect(ADMIN_PHONE_CARDS_MAX_WIDTH_REM).toBe(48);
    expect(ADMIN_PHONE_MIN_TAP_PX).toBe(44);
    expect(ADMIN_PHONE_MIN_TAP_REM).toBe(2.75);
    expect([...ADMIN_CATALOG_PHONE_CELL_LABELS]).toEqual([
      "Name",
      "Category",
      "Size",
      "Status",
      "Actions",
    ]);
  });
});
