// @vitest-environment node
/**
 * Name-mirror: scripts/uploadCdnAssets.ts
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  hasFlag,
  readLimit,
  readOnlyRoot,
  resolveSourceDir,
  uploadFile,
  walkFiles,
} from "../../../scripts/uploadCdnAssets";

describe("uploadCdnAssets (name-mirror)", () => {
  it("parses CLI flags for dry-run, limit, and only root", () => {
    const argv = ["node", "uploadCdnAssets.ts", "--dry-run", "--limit=12", "--only=models"];
    expect(hasFlag("--dry-run", argv)).toBe(true);
    expect(hasFlag("--skip-existing", argv)).toBe(false);
    expect(readLimit(argv)).toBe(12);
    expect(readOnlyRoot(argv)).toBe("models");
    expect(readOnlyRoot(["--only=nope"])).toBeNull();
    expect(readLimit(["--limit=0"])).toBeNull();
  });

  it("walks non-empty files and prefers asset-cdn over public", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "upload-cdn-"));
    try {
      const asset = path.join(tmp, "asset-cdn", "images");
      fs.mkdirSync(asset, { recursive: true });
      fs.writeFileSync(path.join(asset, "a.jpg"), "img");
      fs.mkdirSync(path.join(asset, "nested"), { recursive: true });
      fs.writeFileSync(path.join(asset, "nested", "b.png"), "img2");
      fs.writeFileSync(path.join(asset, "empty.bin"), "");
      const keys = walkFiles(asset, "images");
      expect(keys).toEqual(["images/a.jpg", "images/nested/b.png"]);
      const source = resolveSourceDir("images", {
        assetCdnDir: path.join(tmp, "asset-cdn"),
        publicDir: path.join(tmp, "public"),
      });
      expect(source?.label).toBe("asset-cdn/images");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("uploadFile short-circuits in dry-run mode", async () => {
    const send = vi.fn();
    const result = await uploadFile(
      { send } as never,
      "bucket",
      "images/a.jpg",
      "/tmp/nope",
      true,
      false,
    );
    expect(result).toBe("dry-run");
    expect(send).not.toHaveBeenCalled();
  });
});
