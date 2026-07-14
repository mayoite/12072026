import { describe, expect, it } from "vitest";
import {
  latestPointerPath,
  versionedDescriptorPath,
  legacyDescriptorPath,
  isVersionedDescriptorFilename,
  isLatestPointerFilename,
  slugFromLatestPointerFilename,
  isLegacyDescriptorFilename,
} from "@/features/planner/project/catalog/svg/descriptorPointer";
import path from "node:path";

describe("descriptorPointer paths and filename guards", () => {
  const dir = path.join("tmp", "desc");

  it("builds pointer and versioned paths", () => {
    expect(latestPointerPath("chair-a", dir)).toContain(`chair-a.latest.json`);
    expect(versionedDescriptorPath("chair-a", 3, dir)).toContain(`chair-a.3.json`);
    expect(legacyDescriptorPath("chair-a", dir)).toContain(`chair-a.json`);
  });

  it("classifies filenames and extracts slug", () => {
    expect(isVersionedDescriptorFilename("chair-a.2.json")).toBe(true);
    expect(isVersionedDescriptorFilename("chair-a.json")).toBe(false);
    expect(isLatestPointerFilename("chair-a.latest.json")).toBe(true);
    expect(slugFromLatestPointerFilename("chair-a.latest.json")).toBe("chair-a");
    expect(slugFromLatestPointerFilename("nope")).toBeNull();
    expect(isLegacyDescriptorFilename("chair-a.json")).toBe(true);
    expect(isLegacyDescriptorFilename("chair-a.latest.json")).toBe(false);
  });
});
