import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { getSyncQueueOperation, computeContentHash, createOfflinePlan, updateOfflinePlan, markPlanAsSynced, deleteOfflinePlan, CANONICAL_SCHEMA_VERSION } from "@/features/planner/store/offlineStorage";

describe("offlineStorage", () => {
  it("should render component CANONICAL_SCHEMA_VERSION", () => {
    // Basic test
    const { container } = render(React.createElement(CANONICAL_SCHEMA_VERSION, {} as any));
    expect(container).toBeDefined();
  });
  it("should have function getSyncQueueOperation defined", () => {
    expect(getSyncQueueOperation).toBeTypeOf("function");
  });
  it("should have function computeContentHash defined", () => {
    expect(computeContentHash).toBeTypeOf("function");
  });
  it("should have function createOfflinePlan defined", () => {
    expect(createOfflinePlan).toBeTypeOf("function");
  });
  it("should have function updateOfflinePlan defined", () => {
    expect(updateOfflinePlan).toBeTypeOf("function");
  });
  it("should have function markPlanAsSynced defined", () => {
    expect(markPlanAsSynced).toBeTypeOf("function");
  });
  it("should have function deleteOfflinePlan defined", () => {
    expect(deleteOfflinePlan).toBeTypeOf("function");
  });
});