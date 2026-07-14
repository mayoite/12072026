// @vitest-environment node
/**
 * Name-mirror: scripts/sync_catalog_images.ts
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildCandidates,
  candidateNames,
  copyOrConvert,
  fileExists,
} from "../../../scripts/sync_catalog_images";

describe("sync_catalog_images (name-mirror)", () => {
  it("expands image-N names to zero-padded variants", () => {
    expect(candidateNames("image-3")).toEqual(["image-3", "image-03"]);
    expect(candidateNames("hero")).toEqual(["hero"]);
  });

  it("builds extension candidates for a catalog asset path", () => {
    const candidates = buildCandidates("/images/desk/image-1.jpg");
    expect(candidates).toContain("/images/desk/image-1.jpg");
    expect(candidates).toContain("/images/desk/image-01.jpg");
    expect(candidates).toContain("/images/desk/image-1.webp");
    expect(candidates).toContain("/images/desk/image-01.png");
  });

  it("detects and copies files under a temp public root", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "catalog-images-"));
    try {
      const srcRel = "/images/sample.png";
      const dstRel = "/images/sample-copy.png";
      const srcAbs = path.join(tmp, "images", "sample.png");
      fs.mkdirSync(path.dirname(srcAbs), { recursive: true });
      // minimal valid 1x1 PNG
      const png = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "base64",
      );
      fs.writeFileSync(srcAbs, png);
      expect(fileExists(srcRel, tmp)).toBe(true);
      expect(fileExists(dstRel, tmp)).toBe(false);
      await copyOrConvert(srcRel, dstRel, tmp);
      expect(fileExists(dstRel, tmp)).toBe(true);
      expect(fs.statSync(path.join(tmp, "images", "sample-copy.png")).size).toBeGreaterThan(0);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
