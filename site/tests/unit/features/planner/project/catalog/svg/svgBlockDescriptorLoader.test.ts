import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";

describe("project/catalog/svg/svgBlockDescriptorLoader.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["BLOCK_DESCRIPTORS_DIR_DEFAULT","tryLoad","loadBySlug","loadAll","clearLoaderCache","BLOCK_DESCRIPTOR_SCHEMA_VERSION","BLOCK_DESCRIPTOR_SLUG_REGEX","PlannerDescriptorErrorKindSchema","parseBlockDescriptor","toPlannerDescriptorErrorHttp","BlockDescriptorConfigurableSchema"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
