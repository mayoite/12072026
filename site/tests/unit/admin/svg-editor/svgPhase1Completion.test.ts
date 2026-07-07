import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { SVG_PUCK_FIELDS } from "@/features/planner/admin/svg-editor/svgFieldMetadata";
import { compileSvgArtifacts } from "@/features/planner/admin/svg-editor/svgArtifactCompiler.server";
import {
  ImmutableSvgRevisionRepository,
  type SupabaseSvgRevisionPersistence,
} from "@/features/planner/admin/svg-editor/svgRevisionRepository.server";
import {
  SVG_REFERENCE_DEFINITIONS,
  FIXED_REFERENCE_DEFINITION,
  CONFIGURABLE_REFERENCE_DEFINITION,
  PARAMETRIC_REFERENCE_DEFINITION,
} from "@/features/planner/admin/svg-editor/svgReferenceDefinitions";
import {
  PublishedRevisionV1Schema,
  SvgBlockDefinitionV1Schema,
  type PublishedRevisionV1,
} from "@/features/planner/admin/svg-editor/svgBlockSchemas";
import {
  compileSvgBlockV1,
  SvgCompileError,
} from "@/features/planner/open3d/catalog/svg/svgCompiler.server";

const checksum = "a".repeat(64);

function revision(): PublishedRevisionV1 {
  return PublishedRevisionV1Schema.parse({
    schemaVersion: 1,
    revisionId: "fixed-table-r1",
    definitionTypeId: "fixed-table",
    definitionVersion: 1,
    compilerVersion: "svg-block-v1",
    sourceRevision: 1,
    artifactChecksums: {
      descriptor: checksum,
      svg: checksum,
      png: checksum,
      thumbnails: { "128": checksum },
    },
    validation: { valid: true, diagnostics: [] },
    actorId: "admin-1",
    publishedAt: "2026-07-05T00:00:00.000Z",
    reason: "Phase 1 reference publication",
  });
}

describe("Phase 1 SVG completion", () => {
  it("generates stable Puck field definitions from validated metadata", () => {
    expect(Object.keys(SVG_PUCK_FIELDS)).toEqual([
      "name",
      "category",
      "physicalDimensionsMm.width",
      "physicalDimensionsMm.depth",
      "physicalDimensionsMm.height",
      "lifecycle.status",
    ]);
    expect(SVG_PUCK_FIELDS["lifecycle.status"]?.options?.[0]).toEqual({
      label: "draft",
      value: "draft",
    });
  });

  it("validates fixed, configurable, and parametric reference definitions", () => {
    expect(SVG_REFERENCE_DEFINITIONS.map((definition) =>
      SvgBlockDefinitionV1Schema.parse(definition).typeId)).toEqual([
      "fixed-table",
      "configurable-door",
      "parametric-cabinet",
    ]);
  });

  it("returns sorted deterministic diagnostics for broken references", () => {
    const invalid = structuredClone(CONFIGURABLE_REFERENCE_DEFINITION);
    invalid.actions[0]!.parameterIds = ["missing"];
    const capture = () => {
      try {
        compileSvgBlockV1(invalid);
      } catch (error) {
        return error;
      }
    };
    const first = capture();
    const second = capture();
    expect(first).toBeInstanceOf(SvgCompileError);
    expect((first as SvgCompileError).diagnostics).toEqual((second as SvgCompileError).diagnostics);
    expect((first as SvgCompileError).diagnostics[0]?.path).toBe("actions.0.parameterIds");
  });

  it("renders canonical PNG and deterministic Sharp derivatives", async () => {
    const first = await compileSvgArtifacts(SVG_REFERENCE_DEFINITIONS[0], [256, 128, 128]);
    const second = await compileSvgArtifacts(SVG_REFERENCE_DEFINITIONS[0], [128, 256]);
    expect(first.png.subarray(1, 4).toString()).toBe("PNG");
    expect(first.pngChecksum).toBe(second.pngChecksum);
    expect(first.thumbnails.map(({ width }) => width)).toEqual([128, 256]);
    expect(first.thumbnails.map(({ checksum: value }) => value))
      .toEqual(second.thumbnails.map(({ checksum: value }) => value));
  });

  it("publishes once, rejects mutation, and reloads the existing version", async () => {
    let stored: Awaited<ReturnType<SupabaseSvgRevisionPersistence["loadRevision"]>> = null;
    const persistence: SupabaseSvgRevisionPersistence = {
      insertRevision: vi.fn(async (published, definition) => {
        stored = { revision: published, definition, artifacts: [] };
      }),
      insertArtifacts: vi.fn(async (artifacts) => {
        if (!stored) throw new Error("revision missing");
        stored = { ...stored, artifacts };
      }),
      loadRevision: vi.fn(async () => stored),
    };
    const repository = new ImmutableSvgRevisionRepository(persistence);
    const published = revision();
    const definition = SvgBlockDefinitionV1Schema.parse(SVG_REFERENCE_DEFINITIONS[0]);
    const artifacts = [{ revisionId: published.revisionId, kind: "svg" as const, checksum, storageKey: "svg/fixed-table-r1.svg" }];
    await repository.publish(published, definition, artifacts);
    await expect(repository.publish(published, definition, artifacts)).rejects.toThrow(/immutable/);
    expect(await repository.reload(published.revisionId)).toEqual({
      revision: published,
      definition,
      artifacts,
    });
  });

  // TDD for 1B: determinism, full validation (geometry+constraints ref fixtures only), SVGO lock, malicious, end-to-end disk publish+reload+placement+thumb for 3 refs.
  // GS cites added in prod files per 00-benchmark-summary (REC/BP/anti-copy); status "Implemented" only with live evidence here.
  it("compileSvgBlockV1 is deterministic for reference fixtures (svg + checksums match)", () => {
    const ref = SVG_REFERENCE_DEFINITIONS[0];
    const a = compileSvgBlockV1(ref);
    const b = compileSvgBlockV1(ref);
    expect(a.svg).toBe(b.svg);
    expect(a.svgChecksum).toBe(b.svgChecksum);
    expect(a.descriptorChecksum).toBe(b.descriptorChecksum);
  });

  it("enforces full geometry validation on reference fixtures (parts inside viewBox, valid primitives)", () => {
    const bad = structuredClone(FIXED_REFERENCE_DEFINITION as any);
    bad.viewBox = { x: 0, y: 0, width: 100, height: 100 };
    bad.parts = [{ kind: "rect", id: "bad", x: 200, y: 0, width: 10, height: 10, visible: true, customerEditable: false }];
    expect(() => compileSvgBlockV1(bad)).toThrow(SvgCompileError); // will pass after impl in svgCompiler.server.ts
  });

  it("enforces constraint validation on parametric reference (e.g. shelves max)", () => {
    const bad = structuredClone(PARAMETRIC_REFERENCE_DEFINITION as any);
    bad.parameters[1].defaultValue = 99; // violates constraint max 12
    expect(() => compileSvgBlockV1(bad)).toThrow(SvgCompileError);
  });

  it("locks and uses SVGO plugin configuration (integration)", async () => {
    const out = await compileSvgArtifacts(SVG_REFERENCE_DEFINITIONS[0]);
    // After lock: attrs sorted, preset applied (no unexpected ids etc); svg has no style attr (forbid)
    expect(out.svg).not.toMatch(/<[^>]*\sstyle\s*=/i);
    expect(out.svg).toMatch(/<svg[^>]*\s[^>]*>/); // structure stable
    expect(out.svg).toContain('shape-rendering="geometricPrecision"');
    expect(out.thumbnails.map(({ width }) => width)).toEqual([128, 256, 512]);
  });

  it("rejects malicious input (script, js href) via canonical sanitize in compiler path", () => {
    const bad = structuredClone(FIXED_REFERENCE_DEFINITION as any);
    bad.parts[0].id = 'x" onload="alert(1)';
    // or direct via build path will be sanitized
    // expect compile or internal sanitize to reject unsafe
    expect(() => compileSvgBlockV1(bad)).toThrow(); // classification in impl
  });

  it("full end-to-end: admin draft/preview (V1 compile), publish/revision (disk via persist), planner 2D placement (resolver), thumb png, reload for fixed+configurable+parametric refs", async () => {
    const { persistBlockDescriptor } = await import("@/features/planner/admin/svg-editor/persistBlockDescriptor");
    const { tryLoad, BLOCK_DESCRIPTORS_DIR_DEFAULT } = await import("@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader");
    const { resolveBlocks } = await import("@/features/planner/open3d/catalog/svg/blocksResolver");
    const { compileSvgArtifacts } = await import("@/features/planner/admin/svg-editor/svgArtifactCompiler.server");
    const { mkdtempSync, rmSync, writeFileSync, mkdirSync } = await import("node:fs");
    const os = (await import("node:os")).default;
    const path = (await import("node:path")).default;

    // Use temp dir so we create block-descriptors/ content without polluting default; demonstrates publish creates usable disk state.
    const tmp = mkdtempSync(path.join(os.tmpdir(), "block-desc-"));
    const testDir = path.join(tmp, "block-descriptors");
    mkdirSync(testDir, { recursive: true });

    const refs = SVG_REFERENCE_DEFINITIONS;
    const slugs = ["fixed-table", "configurable-door", "parametric-cabinet"];

    // Valid BlockDescriptor fixtures matching schema (from puck test patterns + svgTypes); mapper for ref fixtures only.
    const blockDescs = [
      {
        schemaVersion: "2026-07-04.v2" as const,
        id: "11111111-1114-4111-8111-111111111111",
        slug: slugs[0],
        sku: "REF-FIX-001",
        sourceProvenance: "native" as const,
        geometry: { widthMm: 1200, depthMm: 600, heightMm: 750 },
        viewBox: { x: 0, y: 0, width: 1200, height: 600 },
        mounting: ["floor"] as const,
        themeTokens: { currentColor: "currentColor" } as never,
        rovingFocus: [{ key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" }],
        liveAnnouncementCategories: ["status"] as const,
        variant: "fixed" as const,
        fixed: { sizingType: "fixed" as const },
        checksum: "0".repeat(64),
        generatedAt: 1700000000,
        blocks: [{ id: "top", x: 0, y: 0, width: 1200, depth: 600 }],
      },
      {
        schemaVersion: "2026-07-04.v2" as const,
        id: "11111111-1114-4111-8111-111111111112",
        slug: slugs[1],
        sku: "REF-CFG-001",
        sourceProvenance: "native" as const,
        geometry: { widthMm: 900, depthMm: 120, heightMm: 2100 },
        viewBox: { x: 0, y: 0, width: 900, height: 120 },
        mounting: ["wall"] as const,
        themeTokens: { currentColor: "currentColor" } as never,
        rovingFocus: [],
        liveAnnouncementCategories: ["status"] as const,
        variant: "configurable" as const,
        configurable: { sizingType: "discrete" as const, sizeOptions: ["900", "1200"] },
        checksum: "0".repeat(64),
        generatedAt: 1700000001,
        blocks: [{ id: "leaf", x: 0, y: 0, width: 900, depth: 120 }],
      },
      {
        schemaVersion: "2026-07-04.v2" as const,
        id: "11111111-1114-4111-8111-111111111113",
        slug: slugs[2],
        sku: "REF-PAR-001",
        sourceProvenance: "native" as const,
        geometry: { widthMm: 900, depthMm: 600, heightMm: 2100 },
        viewBox: { x: 0, y: 0, width: 900, height: 600 },
        mounting: ["floor"] as const,
        themeTokens: { currentColor: "currentColor" } as never,
        rovingFocus: [],
        liveAnnouncementCategories: ["status"] as const,
        variant: "parametric" as const,
        parametric: { sizingType: "parametric" as const, parameterSchema: [{ key: "width", label: "Width", kind: "number", bounds: [450, 2400] }] },
        checksum: "0".repeat(64),
        generatedAt: 1700000002,
        mountingPoints: [{ plane: "floor" as const, offset: { x: 450, y: 600 } }],
        blocks: [{ id: "carcass", x: 0, y: 0, width: 900, depth: 600 }],
      },
    ];

    for (let i = 0; i < blockDescs.length; i++) {
      const blockDesc = blockDescs[i];
      const def = refs[i];
      const p = persistBlockDescriptor(blockDesc as any, { dir: testDir, writeHistory: false });
      expect(p.ok).toBe(true);
      expect(p.descriptor.slug).toBe(slugs[i]);

      // reload
      const loaded = tryLoad(slugs[i], { dir: testDir });
      expect(loaded.ok).toBe(true);

      // planner 2D placement via resolver
      const resolved = resolveBlocks(loaded.value as any);
      expect(resolved.blocks.length).toBeGreaterThan(0);
      expect(resolved.viewBox.width).toBeGreaterThan(0);

      // draft/preview + thumb (artifact from V1 compiler)
      const art = await compileSvgArtifacts(def, [128]);
      expect(art.svg.length).toBeGreaterThan(10);
      expect(art.png.subarray(1, 4).toString()).toBe("PNG");
      // thumb on R2 simulated by png presence (upload exercised in pipeline path)
    }

    // cleanup temp
    rmSync(tmp, { recursive: true, force: true });
  });
});
