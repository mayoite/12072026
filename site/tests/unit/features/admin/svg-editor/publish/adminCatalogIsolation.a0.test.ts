/**
 * A0 — Admin test isolation proof.
 *
 * 1. Publish/lifecycle/storage unit tests use temp roots (static convention).
 * 2. Isolated workspace writes leave canonical catalog hashes unchanged.
 * 3. Canonical path without isolation fails loudly.
 */

import { createHash } from "node:crypto";
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  assertCatalogWriteAllowed,
  CatalogIsolationError,
  resolveCanonicalDescriptorDir,
  resolveCanonicalSvgCatalogDir,
} from "@/features/admin/svg-editor/storage/catalogWriteIsolation";
import { persistBlockDescriptor } from "@/features/admin/svg-editor/storage/persistBlockDescriptor";
import {
  BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  computeBlockDescriptorChecksum,
} from "@/features/planner/catalog/svg/svgTypes";
import {
  assertCanonicalCatalogUnchanged,
  createIsolatedAdminInventoryRoot,
  snapshotCanonicalCatalog,
} from "../../../../../helpers/adminCatalogIsolation";
import { createIsolatedAdminSvgWorkspace } from "../../../../../e2e/helpers/isolatedAdminSvgPublish";
import { resolveSitePackageRoot } from "@/lib/paths/sitePackageRoot";

const SITE_ROOT = resolveSitePackageRoot();
const ADMIN_UNIT_ROOT = path.join(
  SITE_ROOT,
  "tests",
  "unit",
  "features",
  "admin",
  "svg-editor",
);

/** Slices that must isolate catalog writes (publish / lifecycle / storage). */
const ISOLATION_SLICES = ["publish", "lifecycle", "storage"] as const;

const WRITE_API_MARKERS = [
  "persistBlockDescriptor(",
  "bulkImportBlockDescriptors(",
  "unlinkBlockDescriptor(",
  "runSvgPipeline(",
  "setCatalogLifecycle(",
  "writeLifecycleManifest(",
  "createIsolatedAdminSvgWorkspace(",
] as const;

const TEMP_ROOT_MARKERS = [
  "mkdtempSync",
  "mkdtemp(",
  "tmpdir()",
  "os.tmpdir",
  "createIsolatedAdminInventoryRoot",
  "createIsolatedAdminSvgWorkspace",
  "withTempDir",
  "workDir",
  "descriptorDir",
  "projectRoot",
  // status tests mock public dir to temp
  "publicRoot",
] as const;

function listTestFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...listTestFiles(full));
      continue;
    }
    if (/\.(test|spec)\.(ts|tsx)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

function usesWriteApi(source: string): boolean {
  return WRITE_API_MARKERS.some((marker) => source.includes(marker));
}

function usesTempRootConvention(source: string): boolean {
  return TEMP_ROOT_MARKERS.some((marker) => source.includes(marker));
}

/** Tests that only assert isolation failure against canonical may omit temp root. */
function isIsolationGuardOnlyTest(source: string, filePath: string): boolean {
  if (filePath.includes("catalogWriteIsolation.test.ts")) return true;
  if (filePath.includes("adminCatalogIsolation.a0.test.ts")) return true;
  // pure message / schema tests that mention pipeline without invoking disk
  if (
    source.includes("Catalog isolation violation") &&
    !source.includes("persistBlockDescriptor(fixed")
  ) {
    return true;
  }
  return false;
}

function fixedDescriptor(slug: string): Record<string, unknown> {
  const base = {
    schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
    id: "11111111-1114-4111-8111-111111111111",
    slug,
    sku: "OFL-A0-001",
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
  return { ...base, checksum: computeBlockDescriptorChecksum(base) };
}

function sha256File(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

describe("A0 admin catalog isolation — static convention", () => {
  it("publish/lifecycle/storage unit tests that write use temp roots", () => {
    const offenders: string[] = [];
    for (const slice of ISOLATION_SLICES) {
      const sliceDir = path.join(ADMIN_UNIT_ROOT, slice);
      for (const file of listTestFiles(sliceDir)) {
        const source = readFileSync(file, "utf8");
        if (!usesWriteApi(source)) continue;
        if (isIsolationGuardOnlyTest(source, file)) continue;
        if (!usesTempRootConvention(source)) {
          offenders.push(path.relative(SITE_ROOT, file));
        }
      }
    }
    expect(offenders, `Write tests missing temp isolation:\n${offenders.join("\n")}`).toEqual(
      [],
    );
  });

  it("canonical path helpers resolve under site package", () => {
    const desc = resolveCanonicalDescriptorDir();
    const svg = resolveCanonicalSvgCatalogDir();
    expect(desc.replace(/\\/g, "/")).toMatch(/inventory\/descriptors$/);
    expect(svg.replace(/\\/g, "/")).toMatch(/public\/svg-catalog$/);
    expect(existsSync(desc)).toBe(true);
    expect(existsSync(svg)).toBe(true);
  });
});

describe("A0 admin catalog isolation — runtime fail-loud", () => {
  it("assertCatalogWriteAllowed fails on committed descriptor dir", () => {
    expect(() =>
      assertCatalogWriteAllowed(resolveCanonicalDescriptorDir(), { force: true }),
    ).toThrow(CatalogIsolationError);
  });

  it("assertCatalogWriteAllowed fails on committed svg-catalog dir", () => {
    expect(() =>
      assertCatalogWriteAllowed(resolveCanonicalSvgCatalogDir(), { force: true }),
    ).toThrow(CatalogIsolationError);
  });

  it("persist without dir fails isolation and leaves hashes unchanged", () => {
    const before = snapshotCanonicalCatalog();
    const result = persistBlockDescriptor(fixedDescriptor("a0-no-dir-001"));
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected fail");
    expect(result.error.code).toBe("500.catalog_isolation");
    assertCanonicalCatalogUnchanged(before);
  });
});

describe("A0 admin catalog isolation — temp root proof", () => {
  it("isolated inventory root persist does not mutate canonical catalog", () => {
    const before = snapshotCanonicalCatalog();
    const workspace = createIsolatedAdminInventoryRoot("oando-a0-");
    try {
      const result = persistBlockDescriptor(fixedDescriptor("a0-temp-001"), {
        dir: workspace.descriptorDir,
        writeArchive: false,
      });
      expect(result.ok).toBe(true);
      assertCanonicalCatalogUnchanged(before);
      // write only under temp
      expect(existsSync(path.join(workspace.descriptorDir, "a0-temp-001.1.json"))).toBe(
        true,
      );
    } finally {
      workspace.cleanup();
    }
  });

  it("createIsolatedAdminSvgWorkspace copies fixtures then cleans without canonical mutation", () => {
    const slug = "side-table-001";
    const descPath = path.join(resolveCanonicalDescriptorDir(), `${slug}.json`);
    const svgPath = path.join(resolveCanonicalSvgCatalogDir(), `${slug}.svg`);
    if (!existsSync(descPath) || !existsSync(svgPath)) {
      throw new Error(`Canonical fixture missing for ${slug}`);
    }
    const beforeDesc = sha256File(descPath);
    const beforeSvg = sha256File(svgPath);
    const before = snapshotCanonicalCatalog();

    const workspace = createIsolatedAdminSvgWorkspace(slug);
    try {
      expect(existsSync(path.join(workspace.descriptorDir, `${slug}.json`))).toBe(
        true,
      );
      expect(existsSync(workspace.svgPath)).toBe(true);
      // mutate only the isolated copy
      writeFileSync(
        path.join(workspace.descriptorDir, `${slug}.json`),
        `${JSON.stringify({ isolated: true })}\n`,
        "utf8",
      );
      writeFileSync(workspace.svgPath, "<svg data-isolated='1'/>\n", "utf8");
      expect(sha256File(descPath)).toBe(beforeDesc);
      expect(sha256File(svgPath)).toBe(beforeSvg);
      assertCanonicalCatalogUnchanged(before);
    } finally {
      workspace.cleanup();
    }

    expect(existsSync(workspace.root)).toBe(false);
    expect(sha256File(descPath)).toBe(beforeDesc);
    expect(sha256File(svgPath)).toBe(beforeSvg);
  });
});
