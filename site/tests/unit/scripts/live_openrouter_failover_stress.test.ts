// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { resolveProviderChain } from "@/lib/ai/providerChain";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/live_openrouter_failover_stress.ts");

describe("live_openrouter_failover_stress (name-mirror)", () => {
  it("documents a two-step primary-fail then backup-succeed stress path", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("resolveProviderChain");
    expect(source).toContain("requestProviderText");
    expect(source).toContain("loadEnvLocal");
    expect(source).toContain("invalid-on-purpose-for-failover-stress");
    expect(source).toContain("OPENROUTER_API_KEY_PRIMARY");
    expect(source).toContain("OPENROUTER_API_KEY_BACKUP");
    expect(source).toContain("Reply with exactly the word OKAY");
    expect(source).toContain("chain.length < 2");
    expect(source).not.toMatch(/console\.(log|error)\([^)]*apiKey/i);
  });

  it("shares the same provider chain helper the live stress script imports", () => {
    const chain = resolveProviderChain();
    expect(Array.isArray(chain)).toBe(true);
    for (const entry of chain) {
      expect(typeof entry.model).toBe("string");
      expect(entry.model.length).toBeGreaterThan(0);
      expect(typeof entry.apiKey).toBe("string");
    }
    // Live network stress is intentional only via the script CLI, not unit tests.
    expect(fs.existsSync(scriptPath)).toBe(true);
  });
});
