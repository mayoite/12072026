import { describe, expect, it } from "vitest";
import { useSyncQueueProcessor } from "@/features/planner/store/syncQueueProcessor";

describe("syncQueueProcessor", () => {
  it("should have function useSyncQueueProcessor defined", () => {
    expect(useSyncQueueProcessor).toBeTypeOf("function");
  });
  it("should have hook useSyncQueueProcessor defined", () => {
    expect(useSyncQueueProcessor).toBeTypeOf("function");
  });
});
