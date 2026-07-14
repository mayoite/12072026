import { describe, expect, it } from "vitest";
import {
  createPlannerDocument,
  createEmptyPlannerDocument,
  isPlannerDocument,
  toPlannerJsonSafe,
  validatePlannerDocumentSafe,
  PLANNER_DOCUMENT_SCHEMA_VERSION,
} from "@/features/planner/model";

describe("model barrel", () => {
  it("creates and validates planner documents", () => {
    expect(PLANNER_DOCUMENT_SCHEMA_VERSION).toBeGreaterThan(0);
    const empty = createEmptyPlannerDocument();
    expect(isPlannerDocument(empty)).toBe(true);
    const doc = createPlannerDocument({ name: "Barrel" });
    expect(doc.name).toBe("Barrel");
    const safe = validatePlannerDocumentSafe(doc);
    expect(safe.success).toBe(true);
    expect(toPlannerJsonSafe({ a: 1, b: undefined })).toEqual({ a: 1 });
  });
});
