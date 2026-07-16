/**
 * svgArtifactStatus.server — pure sanitize + status reads via mocked public dir.
 * Never writes into real site/public/svg-catalog product files.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";

const publicRoot = { current: "" };

vi.mock("@/lib/paths/sitePackageRoot", () => ({
  resolvePublicDir: () => publicRoot.current,
  resolveSitePackageRoot: () => publicRoot.current,
  resolveBlockDescriptorsDir: () => path.join(publicRoot.current, "inventory", "descriptors"),
}));

import {
  readSvgArtifactStatus,
  readSvgArtifactStatuses,
  sanitizeCatalogSvgMarkup,
} from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";

const VALID_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="currentColor"/></svg>';

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(path.join(os.tmpdir(), "svg-artifact-"));
  publicRoot.current = workDir;
  mkdirSync(path.join(workDir, "svg-catalog"), { recursive: true });
});

afterEach(() => {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
});

describe("sanitizeCatalogSvgMarkup", () => {
  it("accepts trimmed catalog SVG", () => {
    expect(sanitizeCatalogSvgMarkup(`  ${VALID_SVG}\n`)).toBe(VALID_SVG);
  });

  it("rejects missing svg close, script, handlers, and javascript: URLs", () => {
    expect(sanitizeCatalogSvgMarkup("<svg><g/></svg-not>")).toBeNull();
    expect(
      sanitizeCatalogSvgMarkup('<svg xmlns="http://www.w3.org/2000/svg"><script src="x"></script></svg>'),
    ).toBeNull();
    expect(
      sanitizeCatalogSvgMarkup('<svg xmlns="http://www.w3.org/2000/svg" onload="x"></svg>'),
    ).toBeNull();
    expect(
      sanitizeCatalogSvgMarkup(
        '<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)"></a></svg>',
      ),
    ).toBeNull();
  });
});

describe("readSvgArtifactStatus / readSvgArtifactStatuses", () => {
  it("reports missing when the catalog file is absent", () => {
    expect(readSvgArtifactStatus("nope")).toEqual({
      state: "missing",
      bytes: 0,
      updatedAt: null,
      hash: null,
      publicUrl: null,
      markup: null,
    });
  });

  it("reports published with sanitized markup and hash", () => {
    const filePath = path.join(workDir, "svg-catalog", "chaise.svg");
    writeFileSync(filePath, VALID_SVG, "utf8");

    const status = readSvgArtifactStatus("chaise");
    expect(status.state).toBe("published");
    expect(status.publicUrl).toBe("/svg-catalog/chaise.svg");
    expect(status.markup).toBe(VALID_SVG);
    expect(status.bytes).toBeGreaterThan(0);
    expect(status.updatedAt).toEqual(expect.any(Number));
    expect(status.hash).toBe(
      createHash("sha256").update(VALID_SVG, "utf8").digest("hex"),
    );
  });

  it("reports invalid when markup fails the sanitize gate", () => {
    const bad =
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    writeFileSync(path.join(workDir, "svg-catalog", "bad.svg"), bad, "utf8");

    const status = readSvgArtifactStatus("bad");
    expect(status.state).toBe("invalid");
    expect(status.publicUrl).toBe("/svg-catalog/bad.svg");
    expect(status.markup).toBeNull();
    expect(status.hash).toBe(
      createHash("sha256").update(bad, "utf8").digest("hex"),
    );
    expect(status.bytes).toBeGreaterThan(0);
  });

  it("maps multiple slugs in readSvgArtifactStatuses", () => {
    writeFileSync(path.join(workDir, "svg-catalog", "a.svg"), VALID_SVG, "utf8");
    const map = readSvgArtifactStatuses(["a", "missing"]);
    expect(map.a?.state).toBe("published");
    expect(map.missing?.state).toBe("missing");
  });

  it("reports invalid when the artifact path exists but is unreadable as a file", () => {
    // Directory at the expected file path → stat/read fails closed.
    mkdirSync(path.join(workDir, "svg-catalog", "dir-slug.svg"), {
      recursive: true,
    });
    const status = readSvgArtifactStatus("dir-slug");
    expect(status.state).toBe("invalid");
    expect(status.publicUrl).toBe("/svg-catalog/dir-slug.svg");
    expect(status.markup).toBeNull();
    expect(status.hash).toBeNull();
  });
});
