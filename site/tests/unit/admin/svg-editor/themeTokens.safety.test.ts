/**
 * TDD-1 — themeTokens safety for admin SVG edit / Puck registry.
 *
 * Regression: opening /admin/svg-editor/[id] crashed with
 *   TypeError: Cannot read properties of undefined (reading 'currentColor')
 *   TypeError: Cannot read properties of undefined (reading '--fill-primary')
 *
 * Root cause: Puck walkField treats type:"object" fields without objectFields
 * as nested maps and indexes `fields[key]` where fields is undefined — keys
 * on live descriptors are exactly `currentColor` and `--fill-primary`.
 *
 * Also: partial descriptors (stubs, round-trip) may omit themeTokens entirely;
 * adapters must supply defensive defaults, never throw on key access.
 */

import { describe, expect, it } from "vitest";

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

import {
  DEFAULT_THEME_TOKENS,
  safeThemeTokens,
} from "@/features/planner/admin/svg-editor/themeTokens";
import {
  PUCK_BLOCK_BY_VARIANT,
  PUCK_BLOCK_REGISTRY,
  getPuckEditorData,
  puckEditorDataToDescriptorInput,
  type PuckDataShape,
} from "@/features/planner/admin/svg-editor/puckBlockRegistry";

/** Minimal fixed descriptor; themeTokens intentionally omitted for crash repro. */
function partialDescriptorWithoutThemeTokens(): BlockDescriptor {
  return {
    schemaVersion: "2026-07-04.v2",
    id: "11111111-1114-4111-8111-111111111199",
    slug: "theme-safe-stub",
    sourceProvenance: "native",
    geometry: { widthMm: 600, depthMm: 600, heightMm: 480 },
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    mounting: ["floor"],
    // @ts-expect-error intentional — partial/corrupt input missing themeTokens
    themeTokens: undefined,
    rovingFocus: [],
    liveAnnouncementCategories: ["status"],
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    checksum: "0".repeat(64),
    generatedAt: 1,
  };
}

describe("TDD-1 themeTokens helper: safeThemeTokens", () => {
  it("safeThemeTokens(undefined) returns defaults with currentColor and --fill-primary", () => {
    const tokens = safeThemeTokens(undefined);
    expect(tokens).toBeDefined();
    expect(tokens.currentColor).toBe("currentColor");
    expect(tokens["--fill-primary"]).toBe(DEFAULT_THEME_TOKENS["--fill-primary"]);
  });

  it("safeThemeTokens(null) does not throw when reading currentColor or --fill-primary", () => {
    expect(() => {
      const tokens = safeThemeTokens(null);
      void tokens.currentColor;
      void tokens["--fill-primary"];
    }).not.toThrow();
  });

  it("safeThemeTokens preserves provided tokens and fills missing keys", () => {
    const tokens = safeThemeTokens({
      currentColor: "currentColor",
    } as BlockDescriptor["themeTokens"]);
    expect(tokens.currentColor).toBe("currentColor");
    expect(tokens["--fill-primary"]).toBe(DEFAULT_THEME_TOKENS["--fill-primary"]);
  });

  it("safeThemeTokens does not overwrite an explicit --fill-primary", () => {
    const tokens = safeThemeTokens({
      currentColor: "currentColor",
      "--fill-primary": "var(--color-primary)",
    } as BlockDescriptor["themeTokens"]);
    expect(tokens["--fill-primary"]).toBe("var(--color-primary)");
  });
});

describe("TDD-1 themeTokens: getPuckEditorData null-safety", () => {
  it("getPuckEditorData does not throw when descriptor.themeTokens is undefined", () => {
    const descriptor = partialDescriptorWithoutThemeTokens();
    expect(() => getPuckEditorData(descriptor)).not.toThrow();
  });

  it("getPuckEditorData props.themeTokens exposes currentColor and --fill-primary as strings", () => {
    const data = getPuckEditorData(partialDescriptorWithoutThemeTokens());
    const props = data.content[0]?.props as {
      themeTokens?: Record<string, string | undefined>;
    };
    expect(props.themeTokens).toBeDefined();
    // These reads must not throw (regression of the edit-page crash).
    expect(typeof props.themeTokens!.currentColor).toBe("string");
    expect(props.themeTokens!.currentColor!.length).toBeGreaterThan(0);
    expect(typeof props.themeTokens!["--fill-primary"]).toBe("string");
    expect(props.themeTokens!["--fill-primary"]!.length).toBeGreaterThan(0);
  });
});

describe("TDD-1 themeTokens: puckEditorDataToDescriptorInput null-safety", () => {
  it("falls back to defaults when both editor props and original omit themeTokens", () => {
    const original = partialDescriptorWithoutThemeTokens();
    const editorData = {
      root: { props: { title: original.slug } },
      content: [
        {
          type: "BlockFixed",
          props: { slug: original.slug },
        },
      ],
    } as PuckDataShape;

    const input = puckEditorDataToDescriptorInput(original, editorData) as {
      themeTokens?: Record<string, string | undefined>;
    };

    expect(input.themeTokens).toBeDefined();
    expect(input.themeTokens!.currentColor).toBe("currentColor");
    expect(typeof input.themeTokens!["--fill-primary"]).toBe("string");
  });
});

describe("TDD-1 themeTokens: Puck field shape (object without objectFields is forbidden)", () => {
  it("every registry variant exposes themeTokens field that is not bare type:object", () => {
    for (const block of PUCK_BLOCK_REGISTRY) {
      const field = block.fields.themeTokens as
        | { type?: string; objectFields?: unknown }
        | undefined;
      expect(field, `${block.name} missing themeTokens field`).toBeDefined();
      // Bare type:"object" without objectFields → Puck walkField throws on
      // currentColor / --fill-primary keys when mounting the editor.
      if (field?.type === "object") {
        expect(
          field.objectFields,
          `${block.name}: type:"object" requires objectFields`,
        ).toBeDefined();
      }
    }
  });

  it("PUCK_BLOCK_BY_VARIANT fixed field type is not bare object", () => {
    const field = PUCK_BLOCK_BY_VARIANT.fixed.fields.themeTokens as {
      type?: string;
      objectFields?: unknown;
    };
    if (field.type === "object") {
      expect(field.objectFields).toBeDefined();
    } else {
      // custom / text / etc. are safe — must not be type object without maps
      expect(field.type).not.toBe("object");
    }
  });
});
