import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/shared/export/uploadUtils";

describe("project/shared/export/uploadUtils.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["uploadBackgroundImage","createBackgroundImageFromUpload","uploadAndCreateBackground","uploadSketchImage","generatePreview","uploadWithProgress","validateUpload","formatFileSize","revokeObjectUrl"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
