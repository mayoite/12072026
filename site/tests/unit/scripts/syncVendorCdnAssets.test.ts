// @vitest-environment node
/**
 * Name-mirror: scripts/syncVendorCdnAssets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { describe, expect, it } from "vitest";
import {
  REQUIRED_LOCAL_PATHS,
  VENDOR_DOWNLOADS,
  downloadFile,
  verifyRequiredPaths,
} from "../../../scripts/syncVendorCdnAssets.mjs";

describe("syncVendorCdnAssets (name-mirror)", () => {
  it("lists vendor downloads and required local paths with stable dests", () => {
    expect(VENDOR_DOWNLOADS.length).toBeGreaterThanOrEqual(6);
    expect(REQUIRED_LOCAL_PATHS).toContain("cdn/lebombo_1k.hdr");
    for (const item of VENDOR_DOWNLOADS) {
      expect(item.url.startsWith("https://")).toBe(true);
      expect(item.dest.startsWith("cdn/vendor/")).toBe(true);
    }
  });

  it("skips download when dest already exists with bytes", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vendor-cdn-"));
    try {
      const dest = "cdn/vendor/sample.js";
      const abs = path.join(tmp, dest);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, "already-here");
      let fetchCalls = 0;
      const ok = await downloadFile(
        "https://example.test/file.js",
        dest,
        tmp,
        async () => {
          fetchCalls += 1;
          return new Response("nope");
        },
      );
      expect(ok).toBe(true);
      expect(fetchCalls).toBe(0);
      expect(fs.readFileSync(abs, "utf8")).toBe("already-here");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("verifyRequiredPaths reports missing assets", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vendor-verify-"));
    try {
      const result = verifyRequiredPaths(tmp, ["cdn/a.bin", "cdn/b.bin"]);
      expect(result.ok).toBe(false);
      expect(result.missing).toEqual(["cdn/a.bin", "cdn/b.bin"]);
      fs.mkdirSync(path.join(tmp, "cdn"), { recursive: true });
      fs.writeFileSync(path.join(tmp, "cdn/a.bin"), "x");
      fs.writeFileSync(path.join(tmp, "cdn/b.bin"), "y");
      expect(verifyRequiredPaths(tmp, ["cdn/a.bin", "cdn/b.bin"]).ok).toBe(true);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
