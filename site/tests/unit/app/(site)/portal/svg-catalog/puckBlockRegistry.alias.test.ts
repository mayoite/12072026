/**
 * Phase 05 — portal puckBlockRegistry alias must re-export canonical registry (no fork).
 * Cites I-D module paths + BP-05 anti-drift gate.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import * as canonical from "@/features/admin/svg-editor/puckBlockRegistry";
import * as alias from "@/app/(site)/portal/svg-catalog/puckBlockRegistry";

describe("portal/svg-catalog/puckBlockRegistry.ts alias (Phase 05)", () => {
  it("is a one-line verbatim re-export of the canonical registry module", () => {
    const aliasPath = path.resolve(
      process.cwd(),
      "app/(site)/portal/svg-catalog/puckBlockRegistry.ts",
    );
    const source = readFileSync(aliasPath, "utf8").trim();
    expect(source).toBe(
      'export * from "@/features/admin/svg-editor/puckBlockRegistry";',
    );
  });

  it("re-exports the same puckConfig and getPuckData references as canonical", () => {
    expect(alias.puckConfig).toBe(canonical.puckConfig);
    expect(alias.getPuckData).toBe(canonical.getPuckData);
    expect(alias.PUCK_BLOCK_REGISTRY).toBe(canonical.PUCK_BLOCK_REGISTRY);
  });
});
