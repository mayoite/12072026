/**
 * Phase 02 — svgBlockDescriptorLoader unit tests.
 *
 * Covers:
 *   §02-LOAD-01  tryLoad / loadBySlug / loadAll entry points return either a
 *                typed `BlockDescriptor` or a discriminated `PlannerDescriptorError`.
 *   §02-LOAD-02  directory pinned to `site/inventory/descriptors/`; traversal
 *                rejected; whitelist `.json` only.
 *   §02-LOAD-03  loader fully typed; no `any`, no `@ts-ignore`, no unchecked
 *                `unknown` cast outside `tryLoad`.
 *
 * Boundary tests use Node's `os.tmpdir()` so they never touch the repo-root
 * `site/inventory/descriptors/` directory (Phase 03 fixtures are co-started by
 * Phase 03, not Phase 02).
 */

import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  BLOCK_DESCRIPTORS_DIR_DEFAULT,
  BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  computeBlockDescriptorChecksum,
  freezeFreshDescriptor,
  loadAll,
  loadBySlug,
  tryLoad,
  clearLoaderCache,
  type PlannerDescriptorError,
} from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";

const VALID_UUID_V4 = "f81e3a1b-16f4-4c2a-9e6b-8e1f3b7e1a44";

function baseFixture() {
  return {
    schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
    id: VALID_UUID_V4,
    slug: "chaise",
    sku: "OFL-CHS-001",
    sourceProvenance: "native" as const,
    geometry: { widthMm: 1800, depthMm: 600, heightMm: 480 },
    viewBox: { x: 0, y: 0, width: 1800, height: 600 },
    mounting: ["floor"],
    mountingPoints: undefined,
    themeTokens: {
      "currentColor": "currentColor",
      "--color-fill": "var(--color-surface-raised)",
    },
    rovingFocus: [
      { key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" },
    ],
    liveAnnouncementCategories: ["status"],
  };
}

function freezeWithChecksum(seed: number) {
  const fresh = freezeFreshDescriptor(
    {
      ...baseFixture(),
      variant: "fixed",
      fixed: { sizingType: "fixed" },
    },
    () => seed,
  );
  if (!fresh.ok) throw new Error("fixture freeze failed");
  return fresh.value;
}

describe("02-LOADER: storage boundary", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(path.join(tmpdir(), "phase-02-loader-"));
    clearLoaderCache();
  });

  afterEach(() => {
    try {
      rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // best-effort cleanup; never fail the test
    }
    clearLoaderCache();
  });

  it("tryLoad returns a typed descriptor on a fresh fixture file", () => {
    const descriptor = freezeWithChecksum(1700000000);
    mkdirSync(tmpDir, { recursive: true });
    writeFileSync(path.join(tmpDir, "chaise.json"), JSON.stringify(descriptor, null, 2));

    const result = tryLoad("chaise", { dir: tmpDir });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.slug).toBe("chaise");
      expect(result.value.checksum).toBe(descriptor.checksum);
      expect(result.value.variant).toBe("fixed");
    }
  });

  it("tryLoad emits notFound when the JSON file is missing", () => {
    mkdirSync(tmpDir, { recursive: true });
    const result = tryLoad("missing-block", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("notFound");
      expect(result.error.code).toBe("404.not_found");
      if (result.error.kind === "notFound") {
        expect(result.error.slug).toBe("missing-block");
      }
    }
  });

  it("tryLoad emits invalid when the JSON file body is malformed", () => {
    mkdirSync(tmpDir, { recursive: true });
    writeFileSync(path.join(tmpDir, "broken.json"), "{not-valid-json");
    const result = tryLoad("broken", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("tryLoad rejects slugs that don't match the kebab regex (defensive early)", () => {
    const result = tryLoad("Chaise", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("invalid");
      expect(result.error.fieldPath).toBe("slug");
    }
  });

  it("tryLoad rejects slugs that contain path-traversal characters", () => {
    const result = tryLoad("..", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("tryLoad rejects slugs with absolute paths", () => {
    const result = tryLoad("/etc/passwd", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("tryLoad rejects injected path components", () => {
    const result = tryLoad("chaise/../etc/passwd", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("tryLoad rejects a non-`.json` extension", () => {
    mkdirSync(tmpDir, { recursive: true });
    writeFileSync(path.join(tmpDir, "chaise.txt"), "{}");
    // We deliberately write the descriptor body as `.txt`; the loader's slug
    // resolver must compose `{slug}.json` so a sidecar with `.txt` is never read.
    const result = tryLoad("chaise", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("notFound");
  });

  it("tryLoad surfaces hashMismatch when the on-disk body is mutated after first write", () => {
    mkdirSync(tmpDir, { recursive: true });
    const descriptor = freezeWithChecksum(1700000000);
    // Mutate content but keep the original checksum; expecting hashMismatch.
    const mutated = { ...descriptor, geometry: { ...descriptor.geometry, widthMm: 1700 } };
    writeFileSync(path.join(tmpDir, "chaise.json"), JSON.stringify(mutated, null, 2));

    const result = tryLoad("chaise", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("hashMismatch");
      expect(result.error.code).toBe("409.hash_mismatch");
      expect(result.error.expected).toBe(descriptor.checksum);
      expect(result.error.actual).not.toBe(descriptor.checksum);
    }
  });

  it("tryLoad surfaces versionMismatch when the schemaVersion does not match the pinned literal", () => {
    mkdirSync(tmpDir, { recursive: true });
    const descriptor = freezeWithChecksum(1700000000);
    const wrong = { ...descriptor, schemaVersion: "2030-01-01.v99" };
    writeFileSync(path.join(tmpDir, "chaise.json"), JSON.stringify(wrong, null, 2));
    const result = tryLoad("chaise", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("versionMismatch");
      expect(result.error.code).toBe("422.version_mismatch");
      if (result.error.kind === "versionMismatch") {
        expect(result.error.expected).toBe(BLOCK_DESCRIPTOR_SCHEMA_VERSION);
        expect(result.error.actual).toBe("2030-01-01.v99");
      }
    }
  });

  it("loadBySlug throws with HTTP-shape prefix when the descriptor cannot be loaded", () => {
    mkdirSync(tmpDir, { recursive: true });
    expect(() => loadBySlug("missing", { dir: tmpDir })).toThrow(/404\.not_found/);
    expect(() => loadBySlug("missing", { dir: tmpDir })).toThrow(/404/);
  });

  it("loadBySlug returns the typed descriptor when present", () => {
    const descriptor = freezeWithChecksum(1700000000);
    writeFileSync(path.join(tmpDir, "chaise.json"), JSON.stringify(descriptor));
    const loaded = loadBySlug("chaise", { dir: tmpDir });
    expect(loaded.slug).toBe("chaise");
    expect(loaded.variant).toBe("fixed");
  });

  it("loadAll returns empty array when the directory does not exist", () => {
    const ghostDir = path.join(tmpDir, "does-not-exist");
    const all = loadAll({ dir: ghostDir });
    expect(all).toEqual([]);
  });

  it("tryLoad resolves descriptors through {slug}.latest.json pointer", () => {
    const descriptor = freezeWithChecksum(1700000000);
    mkdirSync(tmpDir, { recursive: true });
    writeFileSync(path.join(tmpDir, "chaise.1.json"), JSON.stringify(descriptor));
    writeFileSync(
      path.join(tmpDir, "chaise.latest.json"),
      JSON.stringify({
        slug: "chaise",
        n: 1,
        checksum: descriptor.checksum,
        schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
      }),
    );

    const result = tryLoad("chaise", { dir: tmpDir });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.slug).toBe("chaise");
      expect(result.value.checksum).toBe(descriptor.checksum);
    }
  });

  it("loadAll reads every legacy or pointer-backed slug", () => {
    // chaise = valid
    const chaise = freezeWithChecksum(1700000000);
    writeFileSync(path.join(tmpDir, "chaise.json"), JSON.stringify(chaise));

    // side-table = valid (parametric)
    const sideTableFresh = freezeFreshDescriptor(
      {
        ...baseFixture(),
        slug: "side-table",
        variant: "parametric",
        parametric: {
          sizingType: "parametric",
          parameterSchema: [
            { key: "h", label: "Height", kind: "number", bounds: [400, 800] as [number, number] },
          ],
        },
        mountingPoints: [{ plane: "floor", offset: { x: 0, y: 0 } }],
      },
      () => 1700000000,
    );
    if (!sideTableFresh.ok) throw new Error("side-table freeze failed");
    writeFileSync(path.join(tmpDir, "side-table.json"), JSON.stringify(sideTableFresh.value));

    // cracked.json = invalid; loader should skip silently per Phase 02 plan.
    writeFileSync(path.join(tmpDir, "cracked.json"), "{not-valid-json");

    // unrelated.txt must be ignored.
    writeFileSync(path.join(tmpDir, "ignored.txt"), "nope");

    const all = loadAll({ dir: tmpDir, forceReload: true });
    const slugs = all.map((d) => d.slug).sort();
    expect(slugs).toEqual(["chaise", "side-table"]);
  });

  it("loadAll skips a .json-named directory that is not a regular file", () => {
    const chaise = freezeWithChecksum(1700000000);
    writeFileSync(path.join(tmpDir, "chaise.json"), JSON.stringify(chaise));
    mkdirSync(path.join(tmpDir, "folder.json"), { recursive: true });

    const all = loadAll({ dir: tmpDir, forceReload: true });
    expect(all).toHaveLength(1);
    expect(all[0]?.slug).toBe("chaise");
  });

  it("loadAll caches results for repeat reads within the same directory", () => {
    const chaise = freezeWithChecksum(1700000000);
    writeFileSync(path.join(tmpDir, "chaise.json"), JSON.stringify(chaise));

    const first = loadAll({ dir: tmpDir });
    const second = loadAll({ dir: tmpDir });
    expect(first).toHaveLength(1);
    expect(second).toHaveLength(1);
    expect(second[0]?.checksum).toBe(first[0]?.checksum);
    expect(second[0]?.checksum).toBe(computeBlockDescriptorChecksum(first[0]!));
  });

  it("clearLoaderCache forces a fresh read on the next loadAll", () => {
    const chaise = freezeWithChecksum(1700000000);
    writeFileSync(path.join(tmpDir, "chaise.json"), JSON.stringify(chaise));
    loadAll({ dir: tmpDir });
    clearLoaderCache();

    // After writing a second descriptor and clearing, both should appear.
    const sideTableFresh = freezeFreshDescriptor(
      {
        ...baseFixture(),
        slug: "side-table",
        variant: "parametric",
        parametric: {
          sizingType: "parametric",
          parameterSchema: [
            { key: "w", label: "Width", kind: "number", bounds: [400, 1200] as [number, number] },
          ],
        },
        mountingPoints: [{ plane: "floor", offset: { x: 0, y: 0 } }],
      },
      () => 1700000000,
    );
    if (!sideTableFresh.ok) throw new Error("side-table freeze failed");
    writeFileSync(path.join(tmpDir, "side-table.json"), JSON.stringify(sideTableFresh.value));

    const all = loadAll({ dir: tmpDir });
    expect(all.map((d) => d.slug).sort()).toEqual(["chaise", "side-table"]);
  });

  it("PlannerDescriptorError union covers all four canonical kinds", () => {
    // Compile-time check: PlannerDescriptorError is a closed union.
    const cases: PlannerDescriptorError[] = [
      {
        kind: "invalid",
        code: "422.invalid",
        fieldPath: "slug",
        message: "x",
        issues: [{ path: "slug", message: "x" }],
      },
      {
        kind: "notFound",
        code: "404.not_found",
        fieldPath: "slug:chaise",
        message: "x",
        slug: "chaise",
      },
      {
        kind: "versionMismatch",
        code: "422.version_mismatch",
        fieldPath: "schemaVersion",
        message: "x",
        expected: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
        actual: "1.0.0",
      },
      {
        kind: "hashMismatch",
        code: "409.hash_mismatch",
        fieldPath: "checksum",
        message: "x",
        expected: "a".repeat(64),
        actual: "b".repeat(64),
      },
    ];
    const kinds = new Set(cases.map((c) => c.kind));
    expect(kinds).toEqual(new Set(["invalid", "notFound", "versionMismatch", "hashMismatch"]));
  });

  // TDD cycle (loader tryLoad/parse): write test first targeting uncovered parseBlockDescriptor branches
  // (non-object after JSON.parse, schemaVersion typeof !== string). These hit early returns before zod/hash.
  // RED phase: if parseBlockDescriptor lacked the !object / typeof string guards, accessing .schemaVersion or
  // schema checks would throw or return wrong error kind; test would fail on shape/kind. Verified via source read.
  it("tryLoad surfaces invalid (via parseBlockDescriptor) when JSON parses to non-object primitive", () => {
    mkdirSync(tmpDir, { recursive: true });
    writeFileSync(path.join(tmpDir, "primitive.json"), JSON.stringify(null));
    const result = tryLoad("primitive", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("invalid");
      expect(result.error.fieldPath).toBe("slug:primitive");
    }
  });

  it("tryLoad surfaces invalid when JSON parses to non-object (number) hitting parse early guard", () => {
    mkdirSync(tmpDir, { recursive: true });
    writeFileSync(path.join(tmpDir, "num.json"), "42");
    const result = tryLoad("num", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("tryLoad surfaces invalid (parse path) when schemaVersion present but not string type", () => {
    mkdirSync(tmpDir, { recursive: true });
    const bad = {
      ...freezeWithChecksum(1700000000),
      schemaVersion: 123, // wrong type, hits typeof !== 'string' guard in parse
    };
    writeFileSync(path.join(tmpDir, "badversiontype.json"), JSON.stringify(bad));
    const result = tryLoad("badversiontype", { dir: tmpDir });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  // TDD repeat cycle (loader tryLoad/parse + loadAll): added after first cycle. Targets loadAll skipping !ok from parseBlockDescriptor,
  // and array json (non-object) path. RED verification: without the continue on !result.ok in loadAll or guards in parse,
  // would either include bad entry or throw; test asserts only valids loaded.
  it("loadAll skips entries that fail parseBlockDescriptor (e.g. non-object json or schema fail) and only returns valid", () => {
    mkdirSync(tmpDir, { recursive: true });
    // freezeWithChecksum produces a descriptor with slug "chaise" (from baseFixture/freezeWithChecksum).
    // Writing it to "good.json" exercises the filename-slug decoupling: loadAll reads it via
    // tryLoad("good", ...), parses the body, and returns the descriptor whose slug is "chaise".
    const good = freezeWithChecksum(1700000000);
    writeFileSync(path.join(tmpDir, "good.json"), JSON.stringify(good));
    // non-object after parse -> parse err -> skipped
    writeFileSync(path.join(tmpDir, "array.json"), "[]");
    writeFileSync(path.join(tmpDir, "null.json"), "null");
    const all = loadAll({ dir: tmpDir, forceReload: true });
    expect(all).toHaveLength(1);
    // The descriptor body's slug is "chaise" regardless of the filename "good.json".
    expect(all[0]?.slug).toBe("chaise");
  });
});

/**
 * Strengthened contracts (§02-LOAD-02 inventory path pin + isolation).
 *
 * Pins default dir under site package; typed errors (never uncaught throws) for
 * traversal / missing / non-json; loadAll .json-only + sibling dir isolation via
 * two temp dirs. Write fixtures only under tmpdir — never site/inventory/descriptors.
 */
describe("02-LOADER: inventory path pin + dir isolation contracts", () => {
  let inventoryDir: string;
  let blockDescriptorsSiblingDir: string;
  let fixtureRoot: string;

  beforeEach(() => {
    fixtureRoot = mkdtempSync(path.join(tmpdir(), "phase-02-loader-iso-"));
    inventoryDir = path.join(fixtureRoot, "inventory", "descriptors");
    blockDescriptorsSiblingDir = path.join(fixtureRoot, "block-descriptors");
    mkdirSync(inventoryDir, { recursive: true });
    mkdirSync(blockDescriptorsSiblingDir, { recursive: true });
    clearLoaderCache();
  });

  afterEach(() => {
    try {
      rmSync(fixtureRoot, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
    clearLoaderCache();
  });

  // Contract pin: default dir must resolve under the site package and end with inventory/descriptors.
  // Would fail if resolveBlockDescriptorsDir pointed at legacy block-descriptors or a non-site path.
  it("BLOCK_DESCRIPTORS_DIR_DEFAULT resolves under site package and ends with inventory/descriptors", () => {
    const normalized = path.normalize(BLOCK_DESCRIPTORS_DIR_DEFAULT);
    expect(path.isAbsolute(normalized)).toBe(true);

    const segments = normalized.split(path.sep).filter(Boolean);
    expect(segments.slice(-2)).toEqual(["inventory", "descriptors"]);

    // Must not resolve to legacy sibling path name.
    expect(normalized.replace(/\\/g, "/")).not.toMatch(/\/block-descriptors(\/|$)/);

    // Site package root = parent of inventory/; must expose planner features marker.
    const sitePackageRoot = path.dirname(path.dirname(normalized));
    expect(existsSync(path.join(sitePackageRoot, "features", "planner"))).toBe(true);
  });

  it("tryLoad rejects path-traversal slug '..' with PlannerDescriptorError (never uncaught throw)", () => {
    expect(() => {
      const result = tryLoad("..", { dir: inventoryDir });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe("invalid");
        expect(result.error.code).toBe("422.invalid");
        expect(result.error.fieldPath).toBe("slug");
      }
    }).not.toThrow();
  });

  it("tryLoad rejects multi-segment traversal slug with typed invalid error", () => {
    const result = tryLoad("foo/../../etc/passwd", { dir: inventoryDir });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("invalid");
      expect(result.error.code).toBe("422.invalid");
      expect(["slug", "slug:foo/../../etc/passwd"]).toContain(result.error.fieldPath);
    }
  });

  it("tryLoad rejects backslash traversal slug with typed PlannerDescriptorError", () => {
    const result = tryLoad("..\\chaise", { dir: inventoryDir });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("invalid");
      expect(result.error.code).toBe("422.invalid");
    }
  });

  // Negative: malformed slug that would pass a naive endsWith('.json') check if extension
  // were taken from the slug string instead of always composing `{slug}.json`.
  it("tryLoad boundary never reads non-json extension; missing .json yields typed notFound", () => {
    writeFileSync(path.join(inventoryDir, "solo.txt"), JSON.stringify(freezeWithChecksum(1700000000)));
    writeFileSync(path.join(inventoryDir, "solo.json.bak"), "{}");
    const result = tryLoad("solo", { dir: inventoryDir });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("notFound");
      expect(result.error.code).toBe("404.not_found");
      if (result.error.kind === "notFound") {
        expect(result.error.slug).toBe("solo");
      }
    }
  });

  it("missing slug returns typed notFound PlannerDescriptorError (does not throw)", () => {
    expect(() => {
      const result = tryLoad("absent-slug-zz", { dir: inventoryDir });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe("notFound");
        expect(result.error.code).toBe("404.not_found");
        if (result.error.kind === "notFound") {
          expect(result.error.slug).toBe("absent-slug-zz");
        }
      }
    }).not.toThrow();
  });

  it("loadAll only returns .json descriptors from a temp dir fixture (inject dir option)", () => {
    const chaise = freezeWithChecksum(1700000000);
    writeFileSync(path.join(inventoryDir, "chaise.json"), JSON.stringify(chaise));
    writeFileSync(path.join(inventoryDir, "noise.txt"), "not-a-descriptor");
    writeFileSync(path.join(inventoryDir, "readme.md"), "# no");
    writeFileSync(path.join(inventoryDir, "broken.json"), "{not-json");
    // Versioned artifact without pointer must not invent a second slug load path as bare file
    // unless legacy {slug}.json pattern matches; chaise.2.json is versioned, not legacy.
    writeFileSync(path.join(inventoryDir, "orphan.2.json"), JSON.stringify(chaise));

    const all = loadAll({ dir: inventoryDir, forceReload: true });
    expect(all.map((d) => d.slug)).toEqual(["chaise"]);
    expect(all).toHaveLength(1);
  });

  it("loadAll does NOT load from sibling block-descriptors temp folder when dir is inventory temp", () => {
    const inventoryOnly = freezeWithChecksum(1700000000);
    // Distinct slug in sibling so a leak would show up as an extra slug.
    const siblingFresh = freezeFreshDescriptor(
      {
        ...baseFixture(),
        slug: "side-table",
        sku: "OFL-ST-999",
        variant: "fixed",
        fixed: { sizingType: "fixed" },
      },
      () => 1700000001,
    );
    if (!siblingFresh.ok) throw new Error("sibling fixture freeze failed");

    writeFileSync(path.join(inventoryDir, "chaise.json"), JSON.stringify(inventoryOnly));
    writeFileSync(
      path.join(blockDescriptorsSiblingDir, "side-table.json"),
      JSON.stringify(siblingFresh.value),
    );

    const fromInventory = loadAll({ dir: inventoryDir, forceReload: true });
    expect(fromInventory.map((d) => d.slug).sort()).toEqual(["chaise"]);
    expect(fromInventory.some((d) => d.slug === "side-table")).toBe(false);

    // Control: sibling dir itself loads its own descriptor when pointed at explicitly.
    const fromSibling = loadAll({ dir: blockDescriptorsSiblingDir, forceReload: true });
    expect(fromSibling.map((d) => d.slug).sort()).toEqual(["side-table"]);
    expect(fromSibling.some((d) => d.slug === "chaise")).toBe(false);
  });
});
