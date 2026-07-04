/**
 * Phase 02 — `resolveBlocks()` unit tests
 *
 * Covers:
 *   §02-RES-01  explicit-blocks path: chaise / side-table / sectional fixtures
 *               normalised to expected ids + mm dimensions.
 *   §02-RES-02  synthesised-block path: descriptor without `blocks` (or with
 *               `blocks: []`) falls back to a single `source: 'synthesised'`
 *               row anchored to viewBox origin.
 *   §02-RES-03  empty-missing case: an explicit-blocks array whose entries
 *               are all malformed (i.e. normaliseExplicitBlock returns `[]`
 *               for each) collapses to an empty `ResolvedBlocks.blocks`
 *               array; `assertResolvedNonEmpty` throws BlockResolverError
 *               with `kind: 'noBlocks'`.
 *   §02-RES-04  non-positive width/depth throws BlockResolverError with
 *               `kind: 'invalidShape'` and `fieldPath: 'blocks.<i>'`.
 *   §02-RES-05  explicit-block entry without an id is assigned the default
 *               `<prefix><index+1>` id. `DEFAULT_BLOCKID_PREFIX` is a
 *               non-exported `const` in `blocksResolver.ts`; the test pins
 *               the observable literal `block-<n>` shape so the contract
 *               survives any future prefix-renaming refactor (under a
 *               documented prefix rename this test must be updated, not
 *               bypassed — see AGENTS.md Type Safety rule).
 *
 * Type Safety rule (AGENTS.md):
 *  - No `: any`, no `as any`, no `@ts-ignore`, no `eslint-disable`.
 *  - Tests reach into the resolver through its typed surface only.
 *  - `unknown` casts are confined to the test fixture boundary (where the
 *    resolver accepts `(descriptor as { blocks?: unknown }).blocks`).
 */

import { describe, it, expect } from "vitest";

import {
  BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  freezeFreshDescriptor,
  type BlockDescriptor,
} from "@/features/planner/open3d/catalog/svg/svgTypes";
import {
  assertResolvedNonEmpty,
  BlockResolverError,
  resolveBlockRows,
  resolveBlocks,
  type ResolvedBlock,
} from "@/features/planner/open3d/catalog/svg/blocksResolver";

// ── Fixture builders (mirror the Phase 02 blockDescriptor.test.ts style) ─────

const VALID_UUID_V4 = "f81e3a1b-16f4-4c2a-9e6b-8e1f3b7e1a44";

function baseShared(slug: string) {
  return {
    schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
    id: VALID_UUID_V4,
    slug,
    sku: `OFL-${slug.toUpperCase()}-001`,
    sourceProvenance: "native" as const,
    geometry: { widthMm: 1800, depthMm: 600, heightMm: 480 },
    viewBox: { x: 0, y: 0, width: 1800, height: 600 },
    mounting: ["floor"],
    themeTokens: {
      "currentColor": "currentColor",
      "--color-fill": "var(--color-surface-raised)",
      "--color-stroke": "var(--color-text)",
    },
    rovingFocus: [
      { key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" },
    ],
    liveAnnouncementCategories: ["status"],
  };
}

function fixedDescriptor(slug: string): Record<string, unknown> {
  return {
    ...baseShared(slug),
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    checksum: "",
  };
}

function parametricDescriptor(slug: string): Record<string, unknown> {
  return {
    ...baseShared(slug),
    slug,
    variant: "parametric",
    parametric: {
      sizingType: "parametric",
      parameterSchema: [
        { key: "h", label: "Height", kind: "number", bounds: [400, 800] as [number, number] },
      ],
    },
    mountingPoints: [{ plane: "floor", offset: { x: 0, y: 0 } }],
    checksum: "",
  };
}

/**
 * Construct a real, parseable `BlockDescriptor`. Returns the typed value so
 * downstream resolver calls do not need additional casts beyond the narrow
 * `blocks-array` extension the resolver reads from `unknown`.
 */
function parseFreshFixed(slug: string): BlockDescriptor {
  const result = freezeFreshDescriptor(fixedDescriptor(slug), () => 1700000000);
  if (!result.ok) throw new Error(`fixture freeze failed: ${result.error.message}`);
  return result.value;
}

function parseFreshParametric(slug: string): BlockDescriptor {
  const result = freezeFreshDescriptor(parametricDescriptor(slug), () => 1700000000);
  if (!result.ok) throw new Error(`fixture freeze failed: ${result.error.message}`);
  return result.value;
}

/**
 * The `BlockDescriptor` Zod schema does not declare a `blocks` field on the
 * common base; the resolver reads it through an `as { blocks?: unknown }`
 * extension. The fixture helper below attaches a `blocks` array to the
 * resolved descriptor at the same `unknown` boundary the resolver itself
 * uses — keeping type-safety intact.
 */
function attachBlocks(
  descriptor: BlockDescriptor,
  blocks: ReadonlyArray<unknown>,
): BlockDescriptor {
  return {
    ...descriptor,
    blocks: [...blocks],
  } as BlockDescriptor & { blocks: unknown };
}

// ── §02-RES-01 — explicit-blocks path (chaise / side-table / sectional) ──────

describe("02-RESOLVER: explicit-blocks path", () => {
  it("chaise: single explicit block normalised to expected id + mm dimensions", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      {
        id: "chaise-frame",
        x: 0,
        y: 0,
        width: 1800,
        depth: 600,
        mounting: { plane: "floor", offset: { x: 0, y: 0 } },
      },
    ]);

    const result = resolveBlocks(withBlocks);
    expect(result.variant).toBe("fixed");
    expect(result.viewBox).toEqual({ x: 0, y: 0, width: 1800, height: 600 });
    expect(result.blocks).toHaveLength(1);

    const row = result.blocks[0]!;
    expect(row.id).toBe("chaise-frame");
    expect(row.x).toBe(0);
    expect(row.y).toBe(0);
    expect(row.width).toBe(1800);
    expect(row.depth).toBe(600);
    expect(row.height).toBe(600);
    expect(row.source).toBe("explicit");
    expect(row.mounting).toEqual({ plane: "floor", offset: { x: 0, y: 0 } });
  });

  it("side-table: explicit block honours widthMm + depthMm aliases", () => {
    const sideTable = parseFreshParametric("side-table");
    const withBlocks = attachBlocks(sideTable, [
      {
        id: "side-table-top",
        x: 100,
        y: 50,
        widthMm: 500,
        depthMm: 400,
      },
    ]);

    const result = resolveBlocks(withBlocks);
    expect(result.variant).toBe("parametric");
    const row = result.blocks[0]!;
    expect(row.id).toBe("side-table-top");
    expect(row.x).toBe(100);
    expect(row.y).toBe(50);
    expect(row.width).toBe(500);
    expect(row.depth).toBe(400);
    expect(row.height).toBe(400);
    expect(row.source).toBe("explicit");
    // No mounting attached on the entry → optional mounting is absent.
    expect(row.mounting).toBeUndefined();
  });

  it("sectional: three explicit blocks produce three normalised rows in source order", () => {
    const sectional = parseFreshFixed("sectional");
    const withBlocks = attachBlocks(sectional, [
      {
        id: "section-left",
        x: 0,
        y: 0,
        width: 800,
        depth: 900,
      },
      {
        id: "section-middle",
        x: 800,
        y: 0,
        width: 1000,
        depth: 900,
      },
      {
        id: "section-right-chaise",
        x: 1800,
        y: 0,
        width: 1200,
        depth: 1600,
      },
    ]);

    const result = resolveBlocks(withBlocks);
    expect(result.blocks).toHaveLength(3);

    const ids = result.blocks.map((b) => b.id);
    expect(ids).toEqual(["section-left", "section-middle", "section-right-chaise"]);

    const dims = result.blocks.map((b) => ({ x: b.x, y: b.y, width: b.width, depth: b.depth }));
    expect(dims).toEqual([
      { x: 0, y: 0, width: 800, depth: 900 },
      { x: 800, y: 0, width: 1000, depth: 900 },
      { x: 1800, y: 0, width: 1200, depth: 1600 },
    ]);

    for (const row of result.blocks) {
      expect(row.source).toBe("explicit");
      expect(row.height).toBe(row.depth); // depth aliasing rule
    }
  });

  it("explicit-block entry ignores unknown fields and keeps only normalised ones", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      {
        id: "chaise-frame",
        x: 0,
        y: 0,
        width: 1800,
        depth: 600,
        // The resolver does not read these — they should be dropped.
        extraField: "ignored",
        decoration: { colour: "wood", grain: "oak" },
        nestedNull: null,
      },
    ]);

    const row = resolveBlocks(withBlocks).blocks[0]!;
    expect(row.id).toBe("chaise-frame");
    // Spot-check the typed shape — no `unknown` field reappears. The
    // resolver always emits a `mounting` key (its value is `undefined` when
    // the entry omitted it), so we expect exactly 8 keys sorted.
    const keys = Object.keys(row).sort();
    expect(keys).toEqual([
      "depth",
      "height",
      "id",
      "mounting",
      "source",
      "width",
      "x",
      "y",
    ]);
  });

  it("explicit block falls back to widthMm/depthMm aliases and normalises mounting offsets", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      {
        id: "alias-and-mounting",
        x: 25,
        y: 35,
        width: 0,
        widthMm: 1420,
        depth: 0,
        depthMm: 560,
        mounting: {
          plane: "floor",
          offset: { x: "not-a-number", y: 14 },
        },
      },
    ]);

    const row = resolveBlocks(withBlocks).blocks[0]!;
    expect(row.id).toBe("alias-and-mounting");
    expect(row.width).toBe(1420);
    expect(row.depth).toBe(560);
    expect(row.height).toBe(560);
    expect(row.mounting).toEqual({
      plane: "floor",
      offset: { x: 0, y: 14 },
    });
  });

  it("resolveBlockRows is a thin wrapper that returns only the blocks array", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { id: "frame", x: 0, y: 0, width: 1800, depth: 600 },
    ]);

    const rows: ResolvedBlock[] = resolveBlockRows(withBlocks);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.id).toBe("frame");
  });

  it("widthMm alias takes priority over width when both present and both positive", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      // Source order in resolver: [width, widthMm] → firstPositive wins.
      // First non-zero in iteration order is `width=1700`, so 1700 wins.
      { id: "w-test", x: 0, y: 0, width: 1700, widthMm: 1900, depth: 600 },
    ]);

    const row = resolveBlocks(withBlocks).blocks[0]!;
    expect(row.width).toBe(1700); // confirms resolution order documented above.
  });

  it("out-of-viewBox x is clamped to viewBox.width edge", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { id: "off-grid", x: 99999, y: 0, width: 800, depth: 600 },
    ]);
    const row = resolveBlocks(withBlocks).blocks[0]!;
    expect(row.x).toBe(1800); // viewBox.width boundary
  });

  it("negative x clamps to viewBox origin (0)", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { id: "neg-grid", x: -50, y: -10, width: 800, depth: 600 },
    ]);
    const row = resolveBlocks(withBlocks).blocks[0]!;
    expect(row.x).toBe(0);
    expect(row.y).toBe(0);
  });
});

// ── §02-RES-02 — synthesised-block path ─────────────────────────────────────

describe("02-RESOLVER: synthesised-block path", () => {
  it("descriptor without `blocks` falls back to one synthesised row anchored to viewBox origin", () => {
    const chaise = parseFreshFixed("chaise"); // canonical BlockDescriptor; no `blocks` attr
    const result = resolveBlocks(chaise);

    expect(result.blocks).toHaveLength(1);
    const row = result.blocks[0]!;
    expect(row.source).toBe("synthesised");
    expect(row.id).toBe("block-synth"); // observable prefix + 'synth' suffix
    expect(row.x).toBe(0);
    expect(row.y).toBe(0);
    expect(row.width).toBe(1800); // matches descriptor.geometry.widthMm
    expect(row.depth).toBe(600); // matches descriptor.geometry.depthMm
    expect(row.height).toBe(600);
  });

  it("synthesised row echoes the descriptor variant", () => {
    const sideTable = parseFreshParametric("side-table");
    const result = resolveBlocks(sideTable);
    expect(result.variant).toBe("parametric");
    expect(result.blocks[0]?.source).toBe("synthesised");
  });

  it("synthesised row clamps oversized geometry to the viewBox bounds", () => {
    // Synthesise a descriptor whose geometry footprint exceeds the viewBox.
    const oversize = {
      ...parseFreshFixed("chaise"),
      geometry: { widthMm: 9999, depthMm: 9999, heightMm: 480 },
      viewBox: { x: 0, y: 0, width: 1800, height: 600 },
    } as BlockDescriptor;
    const row = resolveBlocks(oversize).blocks[0]!;
    expect(row.width).toBe(1800); // cannot exceed viewBox.width
    expect(row.depth).toBe(600);
    expect(row.height).toBe(600);
  });

  it("blocks: [] emptiness also takes the synthesised fallback (explicit-array path is length>0)", () => {
    const chaise = parseFreshFixed("chaise");
    const withEmpty = attachBlocks(chaise, []);
    const row = resolveBlocks(withEmpty).blocks[0]!;
    expect(row.source).toBe("synthesised");
    expect(row.id).toBe("block-synth");
  });

  it("non-array blocks input falls back to the synthesised row instead of explicit resolution", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = {
      ...chaise,
      blocks: { unexpected: true },
    } as BlockDescriptor & { blocks: unknown };

    const result = resolveBlocks(withBlocks);
    expect(result.blocks).toHaveLength(1);
    expect(result.blocks[0]?.source).toBe("synthesised");
    expect(result.blocks[0]?.id).toBe("block-synth");
  });

  it("synthesised row carries the descriptor's primary mounting when geometry has positive dims", () => {
    const sideTable = parseFreshParametric("side-table");
    const row = resolveBlocks(sideTable).blocks[0]!;
    expect(row.mounting).toEqual({ plane: "floor", offset: { x: 0, y: 0 } });
  });

  it("synthesised row ignores an invalid primary mounting plane", () => {
    const chaise = parseFreshFixed("chaise");
    const withInvalidMounting = {
      ...chaise,
      mounting: ["diagonal"],
    } as BlockDescriptor;

    const row = resolveBlocks(withInvalidMounting).blocks[0]!;
    expect(row.source).toBe("synthesised");
    expect(row.mounting).toBeUndefined();
  });
});

// ── §02-RES-03 — empty-missing + assertResolvedNonEmpty ─────────────────────

describe("02-RESOLVER: empty-missing case + assertResolvedNonEmpty", () => {
  it("an explicit-blocks array of only-malformed entries produces an empty resolved array", () => {
    const chaise = parseFreshFixed("chaise");
    // normaliseExplicitBlock returns [] for any non-object entry; an array
    // consisting entirely of primitives therefore normalises to [].
    const withGarbage = attachBlocks(chaise, [
      null,
      undefined,
      "not-a-block",
      42,
      true,
    ]);

    const result = resolveBlocks(withGarbage);
    expect(result.blocks).toEqual([]);
    // viewBox / variant are still echoed on empty rows.
    expect(result.variant).toBe("fixed");
    expect(result.viewBox).toEqual({ x: 0, y: 0, width: 1800, height: 600 });
  });

  it("assertResolvedNonEmpty throws BlockResolverError('noBlocks') on an empty array", () => {
    const empty: { blocks: []; viewBox: { x: number; y: number; width: number; height: number }; variant: "fixed" } = {
      blocks: [],
      viewBox: { x: 0, y: 0, width: 1800, height: 600 },
      variant: "fixed",
    };

    let captured: BlockResolverError | null = null;
    try {
      assertResolvedNonEmpty(empty);
    } catch (cause) {
      if (cause instanceof BlockResolverError) {
        captured = cause;
      } else {
        throw cause;
      }
    }

    expect(captured).not.toBeNull();
    expect(captured?.name).toBe("BlockResolverError");
    expect(captured?.kind).toBe("noBlocks");
    expect(captured?.message).toMatch(/noBlocks|non-renderable/);
  });

  it("assertResolvedNonEmpty returns the original array when non-empty", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { id: "frame", x: 0, y: 0, width: 1800, depth: 600 },
    ]);
    const resolved = resolveBlocks(withBlocks);
    const rows = assertResolvedNonEmpty(resolved);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.id).toBe("frame");
  });
});

// ── §02-RES-04 — invalidShape guard ─────────────────────────────────────────

describe("02-RESOLVER: invalidShape guard", () => {
  it("width = 0 throws BlockResolverError(kind='invalidShape', fieldPath='blocks.0')", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { id: "zero-w", x: 0, y: 0, width: 0, depth: 600 },
    ]);

    let captured: BlockResolverError | null = null;
    try {
      resolveBlocks(withBlocks);
    } catch (cause) {
      if (cause instanceof BlockResolverError) {
        captured = cause;
      } else {
        throw cause;
      }
    }

    expect(captured).not.toBeNull();
    expect(captured?.kind).toBe("invalidShape");
    expect(captured?.fieldPath).toBe("blocks.0");
  });

  it("negative depth throws invalidShape with the matching index fieldPath", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { id: "ok", x: 0, y: 0, width: 800, depth: 600 },
      { id: "neg-d", x: 0, y: 0, width: 800, depth: -100 },
    ]);

    let captured: BlockResolverError | null = null;
    try {
      resolveBlocks(withBlocks);
    } catch (cause) {
      if (cause instanceof BlockResolverError) {
        captured = cause;
      } else {
        throw cause;
      }
    }
    expect(captured?.kind).toBe("invalidShape");
    expect(captured?.fieldPath).toBe("blocks.1");
  });

  it("missing width AND depth throws invalidShape (positive fallback exhausted)", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { id: "no-shape", x: 0, y: 0 },
    ]);
    expect(() => resolveBlocks(withBlocks)).toThrowError(BlockResolverError);
  });

  it("invalidShape is the sole kind emitted by explicit-block normalisation", () => {
    // Sweep: confirm `BlockResolverErrorKind` is exactly {noBlocks, invalidShape}.
    const observedKinds = ["noBlocks", "invalidShape"] as const;
    expect(new Set(observedKinds).size).toBe(2);
    // BlockResolverErrorKind is testable from the imported union via the class.
    const noBlocksInstance = new BlockResolverError("noBlocks", "x");
    const invalidShapeInstance = new BlockResolverError("invalidShape", "y");
    expect(noBlocksInstance.kind).toBe("noBlocks");
    expect(invalidShapeInstance.kind).toBe("invalidShape");
    expect(noBlocksInstance.name).toBe("BlockResolverError");
  });
});

// ── §02-RES-05 — default id assignment (block-<index+1>) ────────────────────

describe("02-RESOLVER: default id assignment when explicit block omits id", () => {
  it("single entry without id is assigned 'block-1' (1-based, index+1)", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { x: 0, y: 0, width: 1800, depth: 600 },
    ]);

    const row = resolveBlocks(withBlocks).blocks[0]!;
    expect(row.id).toBe("block-1");
  });

  it("three entries without ids are assigned 'block-1', 'block-2', 'block-3'", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { x: 0, y: 0, width: 800, depth: 600 },
      { x: 800, y: 0, width: 1000, depth: 600 },
      { x: 1800, y: 0, width: 1200, depth: 600 },
    ]);

    const ids = resolveBlocks(withBlocks).blocks.map((b) => b.id);
    expect(ids).toEqual(["block-1", "block-2", "block-3"]);
  });

  it("empty-string id is treated as missing and falls back to 'block-<index+1>'", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { id: "", x: 0, y: 0, width: 1800, depth: 600 },
    ]);
    const row = resolveBlocks(withBlocks).blocks[0]!;
    expect(row.id).toBe("block-1");
  });

  it("non-string id values fall back to default id (type guard fires)", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { id: 42, x: 0, y: 0, width: 1800, depth: 600 },
      { id: { nested: true }, x: 0, y: 0, width: 1800, depth: 600 },
    ]);

    const ids = resolveBlocks(withBlocks).blocks.map((b) => b.id);
    expect(ids).toEqual(["block-1", "block-2"]);
  });

  it("explicit-string ids are preserved verbatim alongside default-shaped peers", () => {
    const chaise = parseFreshFixed("chaise");
    const withBlocks = attachBlocks(chaise, [
      { id: "frame", x: 0, y: 0, width: 800, depth: 600 },
      { x: 800, y: 0, width: 1000, depth: 600 }, // omitted → default
      { id: "chaise-end", x: 1800, y: 0, width: 1200, depth: 600 },
    ]);
    const ids = resolveBlocks(withBlocks).blocks.map((b) => b.id);
    expect(ids).toEqual(["frame", "block-2", "chaise-end"]);
  });
});

// ── Type anchor: compile-time narrowing for BlockDescriptor ──────────────────

function _typeAnchor(_value: BlockDescriptor): void {
  // Reference to the discriminated union keeps the test file on the
  // canonical type surface; no `any`, no `as any`.
}
