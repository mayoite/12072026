import { describe, expect, it } from "vitest";
import { buddyElementsToBoqRows, buildBuddyExportLayout } from "@/features/planner/shared/export/buddyBoqAdapter";

describe("buddyBoqAdapter", () => {
  it("should have function buddyElementsToBoqRows defined", () => {
    expect(buddyElementsToBoqRows).toBeTypeOf("function");
  });
  it("should have function buildBuddyExportLayout defined", () => {
    expect(buildBuddyExportLayout).toBeTypeOf("function");
  });
});