// @vitest-environment node
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildBasenameIndex,
  localAssetExists,
  resolveMissingAssetPath,
} from "@/scripts/lib/cdnAssetResolver";

describe("cdnAssetResolver (name-mirror)", () => {
  it("localAssetExists is true for real public files and false for missing paths", () => {
    expect(localAssetExists("/favicon.ico")).toBe(true);
    expect(localAssetExists("favicon.ico")).toBe(true);
    expect(localAssetExists("/images/__does-not-exist__/nope.png")).toBe(false);
  });

  it("buildBasenameIndex indexes basenames under public (or empty when root missing)", () => {
    const index = buildBasenameIndex("");
    expect(index.size).toBeGreaterThan(0);
    const faviconHits = index.get("favicon.ico") ?? [];
    expect(faviconHits.some((p) => p.endsWith("/favicon.ico") || p === "/favicon.ico")).toBe(
      true,
    );

    const missing = buildBasenameIndex("images/__no_such_root__");
    expect(missing.size).toBe(0);
  });

  it("resolveMissingAssetPath reports exists for local files and unresolved for unknowns", () => {
    const index = buildBasenameIndex("");
    expect(resolveMissingAssetPath("/favicon.ico", index)).toEqual({ kind: "exists" });
    expect(
      resolveMissingAssetPath("/images/catalog/__missing__/totally-unknown-xyz.png", index),
    ).toEqual({ kind: "unresolved" });
  });

  it("indexes basenames under public/images when that tree exists", () => {
    const publicImages = path.resolve(process.cwd(), "public", "images");
    expect(fs.existsSync(publicImages)).toBe(true);
    const index = buildBasenameIndex("images");
    expect(index.size).toBeGreaterThan(0);
    const firstKey = [...index.keys()][0];
    expect(typeof firstKey).toBe("string");
    expect((index.get(firstKey!) ?? []).length).toBeGreaterThan(0);
  });
});
