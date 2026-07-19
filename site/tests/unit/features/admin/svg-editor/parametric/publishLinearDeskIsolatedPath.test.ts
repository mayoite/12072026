/**
 * Isolated order-factory path: Maker multipath compile → pipeline write →
 * lifecycle live. Temp dirs only — never mutates canonical catalog.
 */

import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { compileLinearDeskSvg } from "@/features/admin/svg-editor/parametric/compileLinearDeskSvg";
import {
  defaultLinearDeskSku,
  defaultLinearDeskSlug,
  ensureCommercialSku,
  ensureGuestVisibleSlug,
} from "@/features/admin/svg-editor/parametric/linearDeskGuestIdentity";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { publishDescriptorWithPipeline } from "@/features/admin/svg-editor/publish/publishDescriptorWithPipeline";
import {
  readLifecycleManifest,
  setCatalogLifecycle,
} from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { normalizeDescriptorForPipeline } from "@/features/planner/asset-engine/svg/normalizeDescriptorForPipeline";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import {
  assertCanonicalCatalogUnchanged,
  snapshotCanonicalCatalog,
} from "../../../../../helpers/adminCatalogIsolation";

const isProductsDatabaseConfigured = vi.hoisted(() => vi.fn(() => false));

vi.mock("@/platform/drizzle/databaseUrls", () => ({
  isProductsDatabaseConfigured: () => isProductsDatabaseConfigured(),
}));

const tempDirs: string[] = [];

/** Isolate from ambient .env.local (SVG_RELEASE_AUTHORITY=db breaks disk-path unit). */
beforeEach(() => {
  process.env.SVG_RELEASE_AUTHORITY = "disk";
  process.env.SVG_DISK_WRITE = "1";
  isProductsDatabaseConfigured.mockReturnValue(false);
});

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
  delete process.env.SVG_RELEASE_AUTHORITY;
  delete process.env.SVG_DISK_WRITE;
  isProductsDatabaseConfigured.mockReturnValue(false);
});

function descriptorForWidth(widthMm: number): BlockDescriptor {
  const base = makeNewBlockDescriptorStub();
  const slug = ensureGuestVisibleSlug(undefined, widthMm);
  const sku = ensureCommercialSku(undefined, widthMm);
  return {
    ...base,
    id: "22222222-2222-4222-8222-222222222222",
    slug,
    sku,
    geometry: { widthMm, depthMm: 800, heightMm: 750 },
    viewBox: { x: 0, y: 0, width: widthMm, height: 800 },
    generatedAt: Math.floor(Date.now() / 1000),
  };
}

describe("publish linear desk isolated path (order factory)", () => {
  it("writes Maker multipath SVG + live lifecycle under temp roots only", async () => {
    const catalogSnap = snapshotCanonicalCatalog();
    const root = mkdtempSync(path.join(tmpdir(), "linear-desk-publish-"));
    tempDirs.push(root);
    const svgDir = path.join(root, "svg-catalog");
    const descDir = path.join(root, "descriptors");
    const lifecycleDir = path.join(root, "catalog-ops");
    mkdirSync(svgDir, { recursive: true });
    mkdirSync(descDir, { recursive: true });
    mkdirSync(lifecycleDir, { recursive: true });

    const widthMm = 1600;
    const compiled = compileLinearDeskSvg({
      type: "linear-desk",
      widthMm,
      depthMm: 800,
      pedestalCount: 2,
    });
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;

    expect(compiled.svg).toContain('id="desk-top"');
    expect(compiled.svg).toContain('id="pedestal-l"');
    expect(compiled.svg).toContain('id="pedestal-r"');
    expect(compiled.svg).not.toContain('id="frame"');
    expect(compiled.svg).not.toMatch(/currentColor|var\s*\(/i);

    const descriptor = descriptorForWidth(widthMm);
    expect(descriptor.slug).toBe(defaultLinearDeskSlug(widthMm));
    expect(descriptor.sku).toBe(defaultLinearDeskSku(widthMm));

    const result = await publishDescriptorWithPipeline(descriptor, {
      compileSvg: async (desc) => {
        const normalized = normalizeDescriptorForPipeline(desc);
        return {
          ok: true,
          stages: ["parametric-draw", "sanitise"],
          normalized,
          svg: compiled.svg,
        };
      },
      runPipeline: async (desc, options) => {
        const svgBody =
          typeof options?.precompiledSvg === "string"
            ? options.precompiledSvg
            : compiled.svg;
        const svgPath = path.join(svgDir, `${desc.slug}.svg`);
        writeFileSync(svgPath, svgBody, "utf8");
        return {
          ok: true,
          exitCode: 0,
          stdout: "ok",
          stderr: "",
          fixturePath: path.join(root, "fixture.json"),
          svgPath,
          durationMs: 1,
        };
      },
      persist: (input) => {
        const desc = input as BlockDescriptor;
        const filePath = path.join(descDir, `${desc.slug}.json`);
        writeFileSync(filePath, JSON.stringify(desc, null, 2), "utf8");
        return {
          ok: true,
          descriptor: desc,
          path: filePath,
          historyPath: path.join(descDir, `${desc.slug}.latest.json`),
          replaced: false,
          version: 1,
        };
      },
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    const svgPath = path.join(svgDir, `${result.descriptor.slug}.svg`);
    expect(existsSync(svgPath)).toBe(true);
    const written = readFileSync(svgPath, "utf8");
    expect(written).toContain('id="desk-top"');
    expect(written).toContain('id="pedestal-l"');
    expect(written).not.toContain('id="frame"');

    // Order factory: published product is guest-placeable (live).
    setCatalogLifecycle(result.descriptor.slug, "live", lifecycleDir);
    const manifest = readLifecycleManifest(lifecycleDir);
    expect(manifest[result.descriptor.slug]?.state).toBe("live");

    assertCanonicalCatalogUnchanged(catalogSnap);
  });
});
