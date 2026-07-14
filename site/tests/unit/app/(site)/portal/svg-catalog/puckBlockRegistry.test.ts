/**
 * Name-mirror: app/(site)/portal/svg-catalog/puckBlockRegistry.ts
 * Alias must re-export the canonical admin registry (no fork).
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import * as alias from "@/app/(site)/portal/svg-catalog/puckBlockRegistry";
import * as canonical from "@/features/admin/svg-editor/puckBlockRegistry";

describe("app/(site)/portal/svg-catalog/puckBlockRegistry.ts", () => {
  it("is a one-line re-export of the canonical registry", () => {
    const aliasPath = path.resolve(
      process.cwd(),
      "app/(site)/portal/svg-catalog/puckBlockRegistry.ts",
    );
    const source = readFileSync(aliasPath, "utf8").trim();
    expect(source).toBe(
      'export * from "@/features/admin/svg-editor/puckBlockRegistry";',
    );
  });

  it("re-exports the same core symbols as the canonical module", () => {
    expect(alias.puckConfig).toBe(canonical.puckConfig);
    expect(alias.getPuckData).toBe(canonical.getPuckData);
    expect(alias.PUCK_BLOCK_REGISTRY).toBe(canonical.PUCK_BLOCK_REGISTRY);
    expect(alias.getPuckEditorData).toBe(canonical.getPuckEditorData);
    expect(alias.SUPPORTED_PUCK_BLOCK_VARIANTS).toBe(
      canonical.SUPPORTED_PUCK_BLOCK_VARIANTS,
    );
  });

  it("exposes a non-empty frozen block registry", () => {
    expect(Array.isArray(alias.PUCK_BLOCK_REGISTRY)).toBe(true);
    expect(alias.PUCK_BLOCK_REGISTRY.length).toBeGreaterThan(0);
    expect(Object.isFrozen(alias.PUCK_BLOCK_REGISTRY)).toBe(true);
  });
});
