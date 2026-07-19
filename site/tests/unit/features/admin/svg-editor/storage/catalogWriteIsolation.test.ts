/**
 * A0 — catalog write isolation guard unit tests.
 */

import { existsSync, mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  assertCatalogWriteAllowed,
  CatalogIsolationError,
  isCanonicalCatalogPath,
  isCatalogIsolationTestRuntime,
  isWithinDir,
  resolveCanonicalDescriptorDir,
  resolveCanonicalSvgCatalogDir,
} from "@/features/admin/svg-editor/storage/catalogWriteIsolation";
import {
  persistBlockDescriptor,
  unlinkBlockDescriptor,
} from "@/features/admin/svg-editor/storage/persistBlockDescriptor";
import { bulkImportBlockDescriptors } from "@/features/admin/svg-editor/storage/bulkImportBlockDescriptors";
import { runSvgPipeline } from "@/features/admin/svg-editor/publish/svgPipelineRunner";
import {
  BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  computeBlockDescriptorChecksum,
} from "@/features/planner/catalog/svg/svgTypes";
import {
  createIsolatedAdminInventoryRoot,
  snapshotCanonicalCatalog,
  assertCanonicalCatalogUnchanged,
} from "../../../../../helpers/adminCatalogIsolation";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  }
});

function fixedDescriptorFixture(): Record<string, unknown> {
  const base = {
    schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
    id: "11111111-1114-4111-8111-111111111111",
    slug: "iso-guard-001",
    sku: "OFL-ISO-001",
    sourceProvenance: "native" as const,
    geometry: { widthMm: 600, depthMm: 600, heightMm: 750 },
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    mounting: ["floor"],
    themeTokens: { currentColor: "currentColor" },
    rovingFocus: [],
    liveAnnouncementCategories: ["status"],
    generatedAt: 1700000000,
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    checksum: "0".repeat(64),
  };
  return {
    ...base,
    checksum: computeBlockDescriptorChecksum(base),
  };
}

describe("catalogWriteIsolation path helpers", () => {
  it("reports test runtime under Vitest", () => {
    expect(isCatalogIsolationTestRuntime()).toBe(true);
  });

  it("enforces isolation in a nonproduction parametric factory E2E runtime", () => {
    expect(
      isCatalogIsolationTestRuntime({
        NODE_ENV: "development",
        PARAMETRIC_FACTORY_E2E_RUN_ID: "factory-guard-01",
      }),
    ).toBe(true);
  });

  it("detects paths under canonical descriptor and svg-catalog dirs", () => {
    const desc = resolveCanonicalDescriptorDir();
    const svg = resolveCanonicalSvgCatalogDir();
    expect(isCanonicalCatalogPath(desc)).toBe(true);
    expect(isCanonicalCatalogPath(path.join(desc, "side-table-001.json"))).toBe(
      true,
    );
    expect(isCanonicalCatalogPath(svg)).toBe(true);
    expect(isCanonicalCatalogPath(path.join(svg, "side-table-001.svg"))).toBe(
      true,
    );
  });

  it("allows temp dirs outside committed catalog", () => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), "iso-ok-"));
    tempDirs.push(tmp);
    expect(isCanonicalCatalogPath(tmp)).toBe(false);
    expect(isCanonicalCatalogPath(path.join(tmp, "descriptors"))).toBe(false);
    expect(() => assertCatalogWriteAllowed(tmp)).not.toThrow();
  });

  it("isWithinDir is strict about parent boundaries", () => {
    const parent = path.join(os.tmpdir(), "iso-parent-a");
    expect(isWithinDir(parent, path.join(parent, "child"))).toBe(true);
    expect(isWithinDir(parent, `${parent}-sibling`)).toBe(false);
  });

  it("throws CatalogIsolationError on canonical paths when forced", () => {
    const desc = resolveCanonicalDescriptorDir();
    expect(() => assertCatalogWriteAllowed(desc, { force: true })).toThrow(
      CatalogIsolationError,
    );
    expect(() => assertCatalogWriteAllowed(desc, { force: true })).toThrow(
      /Catalog isolation violation/,
    );
  });
});

describe("catalogWriteIsolation wired write paths", () => {
  it("persistBlockDescriptor rejects default (canonical) dir under Vitest", () => {
    const before = snapshotCanonicalCatalog();
    const result = persistBlockDescriptor(fixedDescriptorFixture());
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected isolation failure");
    expect(result.error.reason).toBe("pathEscape");
    expect(result.error.code).toBe("500.catalog_isolation");
    expect(result.error.message).toMatch(/Catalog isolation violation/);
    assertCanonicalCatalogUnchanged(before);
  });

  it("persistBlockDescriptor accepts isolated temp dir and does not touch canonical", () => {
    const before = snapshotCanonicalCatalog();
    const workspace = createIsolatedAdminInventoryRoot();
    tempDirs.push(workspace.root);
    try {
      const result = persistBlockDescriptor(fixedDescriptorFixture(), {
        dir: workspace.descriptorDir,
        writeArchive: false,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected persist ok");
      expect(result.path.startsWith(workspace.descriptorDir)).toBe(true);
      assertCanonicalCatalogUnchanged(before);
    } finally {
      workspace.cleanup();
    }
  });

  it("unlinkBlockDescriptor throws when target is canonical under Vitest", () => {
    const before = snapshotCanonicalCatalog();
    expect(() => unlinkBlockDescriptor("side-table-001")).toThrow(
      /Catalog isolation violation/,
    );
    assertCanonicalCatalogUnchanged(before);
  });

  it("bulkImportBlockDescriptors rejects canonical default dir under Vitest", () => {
    const before = snapshotCanonicalCatalog();
    expect(() =>
      bulkImportBlockDescriptors(
        `slug,sku,variant,width_mm,depth_mm,height_mm
iso-bulk-001,OFL-B,fixed,600,600,750`,
      ),
    ).toThrow(/Catalog isolation violation/);
    assertCanonicalCatalogUnchanged(before);
  });

  it("runSvgPipeline fails closed when projectRoot maps svg-catalog to committed tree", async () => {
    const before = snapshotCanonicalCatalog();
    // monorepo root → defaultSvgPath writes site/public/svg-catalog (canonical)
    const projectRoot = path.resolve(resolveCanonicalDescriptorDir(), "..", "..", "..");
    const result = await runSvgPipeline(
      fixedDescriptorFixture() as never,
      {
        projectRoot,
        skipCompile: true,
        precompiledSvg:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>',
      },
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected isolation failure");
    expect(result.reason).toBe("writeFixtureError");
    expect(result.error).toMatch(/Catalog isolation violation/);
    assertCanonicalCatalogUnchanged(before);
  });

  it("runSvgPipeline allows isolated projectRoot svg-catalog", async () => {
    const before = snapshotCanonicalCatalog();
    const root = mkdtempSync(path.join(os.tmpdir(), "iso-pipeline-root-"));
    tempDirs.push(root);
    const svgDir = path.join(root, "site", "public", "svg-catalog");
    // pipeline also needs scripts tree for non-skipCompile; skipCompile only needs write path
    const result = await runSvgPipeline(
      {
        ...fixedDescriptorFixture(),
        slug: "iso-pipe-001",
      } as never,
      {
        projectRoot: root,
        skipCompile: true,
        precompiledSvg:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>',
      },
    );
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.svgPath.startsWith(svgDir) || result.svgPath.includes("svg-catalog")).toBe(
      true,
    );
    assertCanonicalCatalogUnchanged(before);
  });
});
