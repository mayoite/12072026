import { describe, expect, it } from "vitest";
import {
  ADMIN_PHONE_MAX_WIDTH_REM,
  adminPhoneCapabilities,
  phoneAuthoringBlockedMessage,
  phoneListLayoutMode,
} from "@/features/admin/adminMobileReview";

describe("adminMobileReview", () => {
  it("declares phone capabilities", () => {
    expect(ADMIN_PHONE_MAX_WIDTH_REM).toBe(60);
    expect(adminPhoneCapabilities().find((c) => c.capability === "list-review")?.supported).toBe(true);
    expect(adminPhoneCapabilities().find((c) => c.capability === "svg-authoring")?.supported).toBe(false);
    expect(phoneAuthoringBlockedMessage()).toMatch(/phone/i);
    expect(phoneListLayoutMode()).toBe("cards-priority");
  });
});
