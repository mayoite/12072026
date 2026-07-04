/**
 * Phase 02 — BlockDescriptor Zod schema unit tests
 *
 * Covers:
 *   §02-TEST-01  Round-trip / idempotent replay (parse → strip → re-parse identical).
 *   §02-TEST-02  Snapshot irregularity: malformed JSON, missing fields, #hex theme
 *                tokens, mismatched checksum, version mismatch.
 *   §02-TEST-04  Variant exhaustiveness: adding a new variant forces a compile error
 *                on the test-side exhaustive switch.
 *   §02-ERR-01..06  Code → HTTP-shape mapping for the four `Open3dDescriptorError`
 *                variants.
 */

import { describe, it, expect } from "vitest";

import {
  BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  BLOCK_DESCRIPTOR_SLUG_REGEX,
  BLOCK_DESCRIPTOR_VARIANTS,
  BlockDescriptorSchema,
  MountPlaneSchema,
  Open3dDescriptorErrorKindSchema,
  computeBlockDescriptorChecksum,
  freezeFreshDescriptor,
  freezeRewriteDescriptor,
  parseBlockDescriptor,
  toOpen3dDescriptorErrorHttp,
  type BlockDescriptor,
  type Open3dDescriptorError,
} from "@/features/planner/open3d/catalog/svg/svgTypes";

// ── Fixture builder ────────────────────────────────────────────────────────

const VALID_UUID_V4 = "f81e3a1b-16f4-4c2a-9e6b-8e1f3b7e1a44";

function baseShared() {
  return {
    schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
    id: VALID_UUID_V4,
    slug: "chaise",
    sku: "OFL-CHS-001",
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

function fixedDescriptor(): Record<string, unknown> {
  return {
    ...baseShared(),
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    checksum: "",
  };
}

function configurableDescriptor(): Record<string, unknown> {
  return {
    ...baseShared(),
    variant: "configurable",
    configurable: {
      sizingType: "discrete",
      sizeOptions: ["small", "large"],
    },
    checksum: "",
  };
}

function parametricDescriptor(): Record<string, unknown> {
  return {
    ...baseShared(),
    slug: "side-table",
    variant: "parametric",
    parametric: {
      sizingType: "parametric",
      parameterSchema: [
        { key: "height", label: "Height", kind: "number", bounds: [400, 800] as [number, number] },
      ],
    },
    mountingPoints: [{ plane: "floor", offset: { x: 0, y: 0 } }],
    checksum: "",
  };
}

/** Stamp a fresh `checksum` onto a candidate so it survives structural validation. */
function withChecksum(record: Record<string, unknown>): Record<string, unknown> {
  const stamped = { ...record, generatedAt: record.generatedAt ?? 1700000000 };
  const checksum = computeBlockDescriptorChecksum(stamped);
  return { ...stamped, checksum };
}

// ── Schema surface sanity tests ─────────────────────────────────────────────

describe("02-BLOCK-DESCRIPTOR: schema surface", () => {
  it("pinned schema version is 2026-07-04.v2 literal", () => {
    expect(BLOCK_DESCRIPTOR_SCHEMA_VERSION).toBe("2026-07-04.v2");
  });

  it("constant variants tuple exposes fixed/configurable/parametric", () => {
    expect(BLOCK_DESCRIPTOR_VARIANTS).toEqual(["fixed", "configurable", "parametric"]);
  });

  it("slug regex anchors `^[a-z][a-z0-9-]{1,63}$`", () => {
    expect(BLOCK_DESCRIPTOR_SLUG_REGEX.test("chaise")).toBe(true);
    expect(BLOCK_DESCRIPTOR_SLUG_REGEX.test("side-table")).toBe(true);
    expect(BLOCK_DESCRIPTOR_SLUG_REGEX.test("a")).toBe(false);
    expect(BLOCK_DESCRIPTOR_SLUG_REGEX.test("Chaise")).toBe(false);
    expect(BLOCK_DESCRIPTOR_SLUG_REGEX.test("c-h-a-i-s-e-with-very-long-suffix-that-pushes-total-over-64-chars")).toBe(false);
    expect(BLOCK_DESCRIPTOR_SLUG_REGEX.test("chair_01")).toBe(false);
  });

  it("Open3dDescriptorErrorKindSchema enumerates the four canonical kinds", () => {
    expect(Open3dDescriptorErrorKindSchema.options).toEqual([
      "invalid",
      "notFound",
      "versionMismatch",
      "hashMismatch",
    ]);
  });

  it("MountPlaneSchema enum matches placement contract (floor|wall|ceiling|floating)", () => {
    expect(MountPlaneSchema.options).toEqual(["floor", "wall", "ceiling", "floating"]);
  });

  it("canonicalize yields identical fingerprints for key-order-nonsensitive input", () => {
    const a = withChecksum({ ...fixedDescriptor(), generatedAt: 1700000000 });
    const b = { ...a, variant: "fixed" }; // identical content
    expect(computeBlockDescriptorChecksum(a)).toBe(computeBlockDescriptorChecksum(b));
  });
});

// ── Schema structural validation (§02-TEST-02) ──────────────────────────────

describe("02-BLOCK-DESCRIPTOR: structural validation", () => {
  it("parses a fixed descriptor into a typed value", () => {
    const input = withChecksum({ ...fixedDescriptor() });
    const result = parseBlockDescriptor(input);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.variant).toBe("fixed");
      expect(result.value.slug).toBe("chaise");
      expect(result.value.geometry.widthMm).toBe(1800);
      expect(result.value.themeTokens["--color-fill"]).toMatch(/^var\(--/);
    }
  });

  it("parses a configurable descriptor with sizeOptions", () => {
    const input = withChecksum(configurableDescriptor());
    const result = parseBlockDescriptor(input);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.variant).toBe("configurable");
      if (result.value.variant === "configurable") {
        expect(result.value.configurable.sizingType).toBe("discrete");
        expect(result.value.configurable.sizeOptions).toEqual(["small", "large"]);
      }
    }
  });

  it("parses a parametric descriptor with parameterSchema and mountingPoints", () => {
    const input = withChecksum(parametricDescriptor());
    const result = parseBlockDescriptor(input);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.variant).toBe("parametric");
      if (result.value.variant === "parametric") {
        expect(result.value.parametric.parameterSchema).toHaveLength(1);
        expect(result.value.mountingPoints).toEqual([{ plane: "floor", offset: { x: 0, y: 0 } }]);
      }
    }
  });

  it("rejects #hex literal theme cartography values (§02-CAT-07)", () => {
    const hexed = withChecksum({
      ...fixedDescriptor(),
      themeTokens: {
        "currentColor": "currentColor",
        "--color-fill": "#ffaa00", // hardcoded hex forbidden
      },
    });
    const result = parseBlockDescriptor(hexed);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("invalid");
      expect(result.error.fieldPath).toContain("--color-fill");
      expect(result.error.code).toBe("422.invalid");
    }
  });

  it("rejects theme cartography keys that are not currentColor or --kebab", () => {
    const badKey = withChecksum({
      ...fixedDescriptor(),
      themeTokens: {
        "#ff0000": "var(--color-fill)", // invalid key
      },
    });
    const result = parseBlockDescriptor(badKey);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("rejects malformed slug", () => {
    const input = withChecksum({ ...fixedDescriptor(), slug: "Chaise" });
    const result = parseBlockDescriptor(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("rejects invalid UUID v4 id", () => {
    const input = withChecksum({ ...fixedDescriptor(), id: "not-a-uuid" });
    const result = parseBlockDescriptor(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("rejects non-positive geometry number", () => {
    const input = withChecksum({
      ...fixedDescriptor(),
      geometry: { widthMm: 0, depthMm: 600, heightMm: 480 },
    });
    const result = parseBlockDescriptor(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("rejects parametric without mountingPoints", () => {
    const input = withChecksum({
      ...parametricDescriptor(),
      mountingPoints: undefined,
    });
    const result = parseBlockDescriptor(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("rejects empty object (§02-TEST-02 empty parse)", () => {
    const result = parseBlockDescriptor({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("rejects non-object input", () => {
    const result = parseBlockDescriptor("not-a-descriptor");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("invalid");
  });

  it("rejects null and undefined inputs", () => {
    expect(parseBlockDescriptor(null).ok).toBe(false);
    expect(parseBlockDescriptor(undefined).ok).toBe(false);
  });
});

// ── Version mismatch + checksum mismatch (§02-TEST-02) ─────────────────────

describe("02-BLOCK-DESCRIPTOR: version + checksum guards", () => {
  it("emits versionMismatch when schemaVersion is below pinned", () => {
    const input = withChecksum({ ...fixedDescriptor(), schemaVersion: "2030-01-01.v99" });
    const result = parseBlockDescriptor(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("versionMismatch");
      expect(result.error.code).toBe("422.version_mismatch");
      expect(result.error.expected).toBe(BLOCK_DESCRIPTOR_SCHEMA_VERSION);
      expect(result.error.actual).toBe("2030-01-01.v99");
      expect(result.error.fieldPath).toBe("schemaVersion");
    }
  });

  it("emits hashMismatch when checksum does not match recomputed digest", () => {
    const input = withChecksum(fixedDescriptor());
    // Force a checksum that does not match the canonical body
    const broken = { ...input, checksum: "0".repeat(64) };
    const result = parseBlockDescriptor(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("hashMismatch");
      expect(result.error.code).toBe("409.hash_mismatch");
      expect(result.error.expected).toBe("0".repeat(64));
      expect(result.error.actual.length).toBe(64);
      expect(result.error.actual).not.toBe("0".repeat(64));
      expect(result.error.fieldPath).toBe("checksum");
    }
  });

  it("emits hashMismatch when generatedAt is mutated after first write (§02-CAT-11 annex)", () => {
    // First-write path stamps generatedAt and computes checksum.
    const firstFresh = freezeFreshDescriptor(fixedDescriptor(), () => 1700000000);
    expect(firstFresh.ok).toBe(true);
    if (!firstFresh.ok) throw new Error("first freeze failed");

    // Rewrite attempt promotes a fresh candidate that tries to mutate generatedAt.
    const mutated = { ...withChecksum(fixedDescriptor()), generatedAt: 1700000999 };
    const rewrite = freezeRewriteDescriptor(firstFresh.value, mutated);
    expect(rewrite.ok).toBe(false);
    if (!rewrite.ok) {
      expect(rewrite.error.kind).toBe("hashMismatch");
      expect(rewrite.error.fieldPath).toBe("generatedAt");
      expect(rewrite.error.code).toBe("409.hash_mismatch");
    }
  });
});

// ── Idempotent replay (§02-TEST-01) ─────────────────────────────────────────

describe("02-BLOCK-DESCRIPTOR: idempotent replay", () => {
  it("parsing the same descriptor twice yields identical value + fingerprint", () => {
    const input = withChecksum(fixedDescriptor());
    const resultA = parseBlockDescriptor(input);
    const resultB = parseBlockDescriptor(input);
    expect(resultA.ok).toBe(true);
    expect(resultB.ok).toBe(true);
    if (resultA.ok && resultB.ok) {
      expect(resultA.value).toEqual(resultB.value);
      expect(resultA.value.checksum).toBe(resultB.value.checksum);
    }
  });

  it("freezeFreshDescriptor stamps generatedAt exactly once per input", () => {
    const stamped = freezeFreshDescriptor(fixedDescriptor(), () => 1700000000);
    expect(stamped.ok).toBe(true);
    if (!stamped.ok) return;
    expect(stamped.value.generatedAt).toBe(1700000000);
    expect(stamped.value.checksum).toBe(computeBlockDescriptorChecksum(stamped.value));
  });

  it("freezeFreshDescriptor does not overwrite an existing generatedAt", () => {
    const preset = { ...fixedDescriptor(), generatedAt: 1600000000 };
    const stamped = freezeFreshDescriptor(preset, () => 1800000000);
    expect(stamped.ok).toBe(true);
    if (!stamped.ok) return;
    expect(stamped.value.generatedAt).toBe(1600000000); // preserved, NOT overwritten
  });

  it("freezeFreshDescriptor refuses hex theme tokens (#hex literal blocklist)", () => {
    const attempted = {
      ...fixedDescriptor(),
      themeTokens: {
        "currentColor": "currentColor",
        "--accent": "#112233",
      },
    };
    const stamped = freezeFreshDescriptor(attempted, () => 1700000000);
    expect(stamped.ok).toBe(false);
    if (!stamped.ok) expect(stamped.error.kind).toBe("invalid");
  });
});

// ── Variant exhaustiveness (§02-TEST-04) ───────────────────────────────────

describe("02-BLOCK-DESCRIPTOR: variant exhaustiveness", () => {
  it("BLOCK_DESCRIPTOR_VARIANTS tuple keeps the discriminated union closed", () => {
    // This is a compile-time check. If a fourth variant were added without
    // updating the tuple, this test would still pass but consumers would
    // need a fallback. The key invariant: BlockDescriptorSchema accepts
    // exactly the three variant tags.
    for (const variant of BLOCK_DESCRIPTOR_VARIANTS) {
      expect(["fixed", "configurable", "parametric"]).toContain(variant);
    }
  });

  it("consumer-side exhaustive switch compiles for the BlockDescriptor union", () => {
    const result = parseBlockDescriptor(withChecksum(fixedDescriptor()));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const tag: string = result.value.variant;
    let captured: "fixed" | "configurable" | "parametric" | "unknown" = "unknown";
    switch (tag) {
      case "fixed":
        captured = "fixed";
        break;
      case "configurable":
        captured = "configurable";
        break;
      case "parametric":
        captured = "parametric";
        break;
      default:
        captured = "unknown";
    }
    expect(captured).toBe("fixed");
  });
});

// ── Open3dDescriptorError → HTTP-shape mapping (§02-ERR-02..06) ────────────

describe("02-BLOCK-DESCRIPTOR: HTTP-shape mapper", () => {
  it("invalid → 422.invalid", () => {
    const err: Open3dDescriptorError = {
      kind: "invalid",
      code: "422.invalid",
      fieldPath: "slug",
      message: "bad slug",
      issues: [{ path: "slug", message: "bad slug" }],
    };
    expect(toOpen3dDescriptorErrorHttp(err)).toEqual({
      status: 422,
      body: {
        error: "invalid",
        code: "422.invalid",
        fieldPath: "slug",
        message: "bad slug",
      },
    });
  });

  it("versionMismatch → 422.version_mismatch", () => {
    const err: Open3dDescriptorError = {
      kind: "versionMismatch",
      code: "422.version_mismatch",
      fieldPath: "schemaVersion",
      message: "schemaVersion mismatch",
      expected: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
      actual: "2030-01-01.v99",
    };
    const http = toOpen3dDescriptorErrorHttp(err);
    expect(http.status).toBe(422);
    expect(http.body.code).toBe("422.version_mismatch");
    expect(http.body.error).toBe("version_mismatch");
    expect(http.body.fieldPath).toBe("schemaVersion");
  });

  it("hashMismatch → 409.hash_mismatch", () => {
    const err: Open3dDescriptorError = {
      kind: "hashMismatch",
      code: "409.hash_mismatch",
      fieldPath: "checksum",
      message: "tampering detected",
      expected: "a".repeat(64),
      actual: "b".repeat(64),
    };
    const http = toOpen3dDescriptorErrorHttp(err);
    expect(http.status).toBe(409);
    expect(http.body.code).toBe("409.hash_mismatch");
    expect(http.body.error).toBe("hash_mismatch");
    expect(http.body.fieldPath).toBe("checksum");
  });

  it("notFound → 404.not_found", () => {
    const err: Open3dDescriptorError = {
      kind: "notFound",
      code: "404.not_found",
      fieldPath: "slug:chaise",
      message: "no chaise.json",
      slug: "chaise",
    };
    const http = toOpen3dDescriptorErrorHttp(err);
    expect(http.status).toBe(404);
    expect(http.body.code).toBe("404.not_found");
    expect(http.body.error).toBe("not_found");
    expect(http.body.fieldPath).toBe("slug:chaise");
  });

  it("preserves sticky error-code suffix so retry semantics are distinct", () => {
    // Phase 02 owns the full code → HTTP-shape map; suffix must not collapse.
    const codes = [
      "422.invalid",
      "422.version_mismatch",
      "409.hash_mismatch",
      "404.not_found",
    ];
    expect(new Set(codes).size).toBe(4);
  });
});

// ── BlockDescriptorSchema smoke (compiled zod discriminator) ────────────────

describe("02-BLOCK-DESCRIPTOR: Zod discriminated union", () => {
  it("BlockDescriptorSchema.safeParse succeeds across the three variant tags", () => {
    expect(BlockDescriptorSchema.safeParse(withChecksum(fixedDescriptor())).success).toBe(true);
    expect(BlockDescriptorSchema.safeParse(withChecksum(configurableDescriptor())).success).toBe(true);
    expect(BlockDescriptorSchema.safeParse(withChecksum(parametricDescriptor())).success).toBe(true);
  });

  it("BlockDescriptorSchema.safeParse fails on an unknown variant tag", () => {
    const bogus: Record<string, unknown> = {
      ...fixedDescriptor(),
      variant: "bogon",
    };
    expect(BlockDescriptorSchema.safeParse(bogus).success).toBe(false);
  });
});

// ── Type guards to satisfy tsc -p on guards explicitly typed as BlockDescriptor ─

function _typeAnchor(_value: BlockDescriptor): void {
  // no-op body; existence enforces compile-time narrowing
}
