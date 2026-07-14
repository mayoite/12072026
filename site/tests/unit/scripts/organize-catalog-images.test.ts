// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  normalizeCategoryToken,
  parseCsvLine,
  parseFlags,
  parseManifest,
  resolveCategory,
} from "../../../scripts/organize-catalog-images.ts";

describe("organize-catalog-images (name-mirror)", () => {
  it("parses CLI flags", () => {
    expect(parseFlags(["--dry-run", "--sync-db"])).toEqual({
      dryRun: true,
      apply: false,
      syncDb: true,
      syncCatalog: false,
      allowMissingSlug: false,
    });
    expect(parseFlags(["--apply", "--sync-catalog", "--allow-missing-slug"]).apply).toBe(
      true,
    );
  });

  it("normalizes and resolves category aliases", () => {
    expect(normalizeCategoryToken("Revolving_Chairs (Mesh)")).toBe("revolving chairs mesh");
    expect(resolveCategory("executive chairs")).toBe("seating");
    expect(resolveCategory("sofa")).toBe("soft-seating");
    expect(resolveCategory("storage")).toBe("storage");
    expect(resolveCategory("unknown-category-xyz")).toBeNull();
  });

  it("parses CSV lines with quotes and builds manifest rows", () => {
    expect(parseCsvLine('a,"b,c",d')).toEqual(["a", "b,c", "d"]);
    const csv = [
      "product_slug,category,rank,source_relative_path",
      "desk-a,workstations,1,desk-a/1.jpg",
      "desk-a,workstations,2,desk-a/2.jpg",
    ].join("\n");
    const rows = parseManifest(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0]?.product_slug).toBe("desk-a");
    expect(rows[0]?.rank).toBe(1);
    expect(rows[1]?.source_relative_path).toBe("desk-a/2.jpg");
  });

  it("rejects empty or header-only manifests", () => {
    expect(() => parseManifest("")).toThrow(/empty/i);
    expect(() =>
      parseManifest("product_slug,category,rank,source_relative_path\n"),
    ).toThrow(/no data rows/i);
  });
});
