import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePlannerDocument } from "@/features/planner/editor/usePlannerDocument";
import { buildPlannerDocumentFromEditor } from "@/features/planner/document/plannerDocumentBridge";

vi.mock("@/features/planner/document/plannerDocumentBridge", () => ({
  buildPlannerDocumentFromEditor: vi.fn().mockReturnValue({ id: "doc-1", title: "Clean Plan Name" }),
}));

vi.mock("@/features/planner/lib/sessionState", () => ({
  sanitizePlannerPlanName: vi.fn().mockReturnValue("Clean Plan Name"),
}));

describe("usePlannerDocument", () => {
  it("builds and memoizes document correctly", () => {
    const { result } = renderHook(() =>
      usePlannerDocument({
        planId: "doc-1",
        planName: "Dirty Plan Name!",
        fabricSerializedDraft: "{}",
      })
    );

    expect(result.current.currentPlannerDocument).toEqual({ id: "doc-1", title: "Clean Plan Name" });
    expect(buildPlannerDocumentFromEditor).toHaveBeenCalled();
  });
});
