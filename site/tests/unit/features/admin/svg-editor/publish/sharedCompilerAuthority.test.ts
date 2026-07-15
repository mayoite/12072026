import { describe, expect, it } from "vitest";
import {
  SHARED_COMPILE_ENTRY,
  SHARED_COMPILE_MODULE_PATH,
  previewUsesSharedCompiler,
  publishUsesSharedCompiler,
} from "@/features/admin/svg-editor/publish/sharedCompilerAuthority";

describe("sharedCompilerAuthority", () => {
  it("declares shared compile entry for preview and publish", () => {
    expect(SHARED_COMPILE_ENTRY).toBe("compileSvgForPublish");
    expect(SHARED_COMPILE_MODULE_PATH).toContain("compileSvgForPublish");
    expect(previewUsesSharedCompiler()).toBe(true);
    expect(publishUsesSharedCompiler()).toBe(true);
  });
});
