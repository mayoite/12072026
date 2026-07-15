import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  inspectSvgDraftV2,
  sanitizeSvgForPublishV2,
} from "@/features/admin/svg-editor-v2/security/svgSanitizerV2";

const FIXTURE_ROOT = path.resolve(__dirname, "../../../../fixtures/svg-editor-v2");

function fixture(name: string): string {
  return readFileSync(path.join(FIXTURE_ROOT, name), "utf8");
}

describe("SVG editor V2 sanitizer", () => {
  it("preserves supported authoring capabilities for publication", () => {
    const source = fixture("full-safe.svg");
    const result = inspectSvgDraftV2(source);

    expect(result.valid).toBe(true);
    expect(result.diagnostics).toEqual([]);
    expect(result.capabilities).toEqual(expect.arrayContaining([
      "geometry",
      "text",
      "transforms",
      "clipping",
      "masks",
      "gradients",
      "patterns",
      "managed-images",
    ]));
    expect(result.sanitizedSvg).toContain("linearGradient");
    expect(result.sanitizedSvg).toContain("clipPath");
    expect(result.sanitizedSvg).toContain("mask");
    expect(result.sanitizedSvg).toContain("pattern");
  });

  it.each([
    ["hostile/script.svg", "UNSAFE_TAG", "bad-script", undefined],
    ["hostile/event-handler.svg", "UNSAFE_ATTRIBUTE", "bad-event", "onclick"],
    ["hostile/css-url.svg", "UNSAFE_URL", "bad-css", "style"],
    ["hostile/data-url.svg", "UNSAFE_URL", "bad-image", "href"],
    ["hostile/entity.svg", "DOCTYPE_FORBIDDEN", null, undefined],
    ["hostile/duplicate-id.svg", "DUPLICATE_ID", "duplicate", "id"],
    ["hostile/unresolved-reference.svg", "UNRESOLVED_REFERENCE", "missing-ref", "fill"],
  ] as const)("rejects %s with an exact diagnostic", (name, code, elementId, attribute) => {
    const source = fixture(name);
    const result = inspectSvgDraftV2(source);

    expect(result.valid).toBe(false);
    expect(result.originalSvg).toBe(source);
    expect(result.sanitizedSvg).toBeNull();
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      code,
      elementId,
      attribute,
    }));
    expect(() => sanitizeSvgForPublishV2(source)).toThrow(/cannot be published/);
  });

  it("rejects oversized documents before parsing", () => {
    const source = `<svg xmlns="http://www.w3.org/2000/svg"><text>${"x".repeat(1_100_000)}</text></svg>`;
    const result = inspectSvgDraftV2(source);

    expect(result.diagnostics[0]).toMatchObject({ code: "DOCUMENT_TOO_LARGE" });
    expect(result.sanitizedSvg).toBeNull();
  });

  it("publishes only the sanitized output", () => {
    const published = sanitizeSvgForPublishV2(fixture("full-safe.svg"));
    expect(published).toMatch(/^<svg/);
    expect(published).not.toContain("<script");
  });
});
