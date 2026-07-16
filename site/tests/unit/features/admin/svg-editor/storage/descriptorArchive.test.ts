import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  DESCRIPTOR_ARCHIVE_RETENTION,
  archiveDirFor,
  clearDescriptorArchive,
  listArchiveVersions,
  retainDescriptorArchive,
} from "@/features/admin/svg-editor/storage/descriptorArchive";

describe("descriptorArchive", () => {
  let dir = "";
  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  it("resolves archive dir and retains versions", () => {
    dir = mkdtempSync(path.join(os.tmpdir(), "desc-arch-"));
    expect(DESCRIPTOR_ARCHIVE_RETENTION).toBe(5);
    expect(archiveDirFor(dir)).toBe(path.resolve(dir, "_archive"));
    // liveN <= 1 is a no-op
    retainDescriptorArchive("slug", dir, 1);
    expect(listArchiveVersions("slug", dir)).toEqual([]);
    clearDescriptorArchive("slug", dir);
  });
});
