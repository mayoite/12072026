import { describe, expect, it } from "vitest";
import {
  parsePlannerDocumentImportText,
  validatePlannerDocumentImportText,
  parsePlannerDocumentImportValue,
  validatePlannerDocumentImportValue,
} from "@/features/planner/persistence/plannerImport";
import { createPlannerDocument } from "@/features/planner/model/plannerDocument";

describe("plannerImport", () => {
  it("parses and validates a planner document JSON string", () => {
    const doc = createPlannerDocument({ name: "Import Me" });
    const text = JSON.stringify(doc);
    const parsed = parsePlannerDocumentImportText(text);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.document.name).toBe("Import Me");
    }
    const validated = validatePlannerDocumentImportText(text);
    expect(validated.valid).toBe(true);
  });

  it("rejects invalid import values", () => {
    const bad = parsePlannerDocumentImportValue({ not: "a document" });
    expect(bad.ok).toBe(false);
    const badText = validatePlannerDocumentImportText("{");
    expect(badText.valid).toBe(false);
  });
});
